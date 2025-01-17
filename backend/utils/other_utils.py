import os
import dotenv
import pandas as pd
import logging
from openai import OpenAI
from jinja2 import Environment, FileSystemLoader

from backend.supabase_utils import supabase_articles_GET, supabase_articles_POST

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
dotenv.load_dotenv()

def generate_gpt_paper_summary(title: str, content: str) -> str:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=OPENAI_API_KEY)
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        store=True,
        messages=[
            {
                "role": "system",
                "content": "You are a ChatGPT, a helpful assistant that is knowledgable about Mycology and fungi and specializes in generating short sneak peeks of new mycology articles for a mycology newsletter.",
            },
            {
                "role": "user",
                "content": f"Write an informational little sneak peek for a paper titled {title} with this given abstracted summary: {content}. Limit your answer to 500 characters.",
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
    response = supabase_articles_POST(df.to_dict(orient="records"))
    if hasattr(response, "error") and response.error:
        return {
            "success": False,
            "error": response.error,
            "message": "Failed to upsert data",
        }

    # Fetching updated data from Supabase and filtering
    response = supabase_articles_GET()
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
        selected_articles.at[index, "llm_summary"] = generate_gpt_paper_summary(
            title=article_dict["title"], content=article_dict["abstract"]
        )

    # Update the df with summaries and update supabase table
    df.update(selected_articles)
    response = supabase_articles_POST(df.to_dict(orient="records"))
    if hasattr(response, "error") and response.error:
        return {
            "success": False,
            "error": response.error,
            "message": "Failed to upsert data",
        }

    # Return 1: all processed articles, 2: top 5 articles
    return df.to_dict(orient="records"), df.head(5).to_dict(orient="records")


def render_template(articles: list[dict], unsubscribe_link: str) -> str:
    env = Environment(loader=FileSystemLoader("templates"))
    template = env.get_template("email.html")
    return template.render(articles=articles, unsubscribe_link=unsubscribe_link)


def test_render_template():
    articles = [
        {
            "title": "Study on Fungal Growth",
            "summary": "An in-depth analysis of fungal development in various environments.",
            "paper_url": "https://example.com/paper1",
        },
        {
            "title": "Mycology Advances",
            "summary": "Recent advancements in mycological research and applications.",
            "paper_url": "https://example.com/paper2",
        },
    ]
    unsubscribe_url = "https://example.com/unsubscribe"

    html_content = render_template(articles, unsubscribe_url)
    with open("test_email.html", "w") as f:
        f.write(html_content)


if __name__ == "__main__":
    test_render_template()
