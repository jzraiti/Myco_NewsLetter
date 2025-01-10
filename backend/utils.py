import os
from supabase import create_client, Client
import dotenv
import pandas as pd
import logging
from ss_api import fetch_bulk_articles
from openai import OpenAI

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
dotenv.load_dotenv()


def supabase_POST(data: list):
    """POSTs the given data to the Supabase database.

    Args:
        data (list): The data to POST.
    """
    url: str = os.getenv("SUPABASE_URL")
    key: str = os.getenv("SUPABASE_KEY")
    supabase: Client = create_client(url, key)

    df = pd.DataFrame(data)
    df = df.map(lambda x: tuple(x) if isinstance(x, list) else x)   
    df = df.drop_duplicates(subset=["paperId"])

    data = df.to_dict(orient="records")

    return supabase.table("ss_articles").upsert(data, on_conflict="paperId").execute()


def supabase_GET():
    """GETs the data from the Supabase database."""
    url: str = os.getenv("SUPABASE_URL")
    key: str = os.getenv("SUPABASE_KEY")
    supabase: Client = create_client(url, key)

    return supabase.table("ss_articles").select("*").execute()


def generate_gpt_paper_summary(title: str, content: str) -> str:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=OPENAI_API_KEY)
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        store=True,
        messages=[
            {
                "role": "system",
                "content": "You are a ChatGPT, a helpful assistant that is knowledgable about Mycology and funguses and specializes in generating short sneak peeks of new mycology articles for a mycology newsletter.",
            },
            {
                "role": "user",
                "content": f"Write an informational little sneak peek for this paper titled {title} with this given abstracted summary: {content}. Limit your answer to 500 characters.",
            },
        ],
    )

    return completion.choices[0].message.content


def article_selection(data: list) -> dict:
    df = pd.DataFrame(data)

    # Data cleaning
    df = df.map(lambda x: tuple(x) if isinstance(x, list) else x)
    df = df.drop_duplicates(subset=["paperId"])

    # Sorting by citation count (redundancy check)
    df = df.sort_values(by="citationCount", ascending=False)

    # Post to Supabase to update duplicates
    response = supabase_POST(df.to_dict(orient="records"))
    if hasattr(response, "error") and response.error:
        return {
            "success": False,
            "error": response.error,
            "message": "Failed to upsert data",
        }

    # Fetching updated data from Supabase and filtering
    # df = pd.DataFrame(supabase_GET())
    response = supabase_GET()
    if hasattr(response, "error") and response.error:
        return {
            "success": False,
            "error": response.error,
            "message": "Failed to fetch data",
        }

    df = pd.DataFrame(response.data)
    df = df.sort_values(by="citationCount", ascending=False)  # redundancy check
    df = df[df["abstract"].notnull()]

    # Selecting the top 5 articles and generating summaries
    selected_articles = df.head(5).copy()
    for index, article in selected_articles.iterrows():
        article_dict = article.to_dict()
        selected_articles.at[index, 'llm_summary'] = generate_gpt_paper_summary(
            title=article_dict["title"], content=article_dict["abstract"]
        )

    # Update the df with summaries, update supabase table, and return the data
    df.update(selected_articles)
    response = supabase_POST(df.to_dict(orient="records"))
    if hasattr(response, "error") and response.error:
        return {
            "success": False,
            "error": response.error,
            "message": "Failed to upsert data",
        }

    return df.to_dict(orient="records")


if __name__ == "__main__":
    data = fetch_bulk_articles(
        num_articles=30,
        search_term="mycology|fungus|fungi|mushroom|mushrooms|mycologist",
    )
    selection_op = article_selection(data=data)
    if not selection_op:
        logging.error("Error when selecting articles.")
    else:
        logging.info("Successfully updated articles.")
