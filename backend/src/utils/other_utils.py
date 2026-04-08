import os
import dotenv
import pandas as pd
import logging

from utils.supabase_utils import (
    supabase_articles_GET,
    supabase_articles_POST,
    supabase_journals_GET,
    supabase_recipients_GET,
    supabase_JUFO_GET,
    supabase_query_all,
)

from utils.ss_api import fetch_bulk_articles, fetch_paper_details
from utils.summary_service import generate_gpt_paper_summary
from utils.venue_service import extract_favicon, fetch_venue_info

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
dotenv.load_dotenv()

NUMBER_OF_ARTICLES = 4
def generate_summary(article: dict) -> str:
    """HELPER METHOD - Generates a summary of the given article using GPT-4o-mini."""
    logging.info(f"Generating summary for article: {article['paperId']}")
    article = article.to_dict()
    generated_content: str = generate_gpt_paper_summary(
        title=article["title"], content=article["abstract"]
    )
    return generated_content


def article_selection(data: list) -> dict:
    """Selects top articles from the given data and generates summaries for them.

    Args:
        data (list): The list of articles to process.
    """

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
    df = df.sort_values(by="citationCount", ascending=False)
    df = df[df["abstract"].notnull()]
    df = df[df["llm_summary"].isnull()]

    # Selecting articles with citations first
    selected_articles = df[df["citationCount"] > 0].head(5).copy()
    cited_papers = len(selected_articles)

    if cited_papers < NUMBER_OF_ARTICLES:
        # Fetch journal h5-index data
        journals = supabase_journals_GET()

        # Create a mapping of journal titles to h5-index
        journal_h5_index = {j["title"]: j["h5-index"] for j in journals.data}

        # Add h5-index to remaining articles
        remaining_df = df[df["citationCount"] == 0].copy()
        remaining_df["h5-index"] = remaining_df["venue"].map(journal_h5_index)

        # Sort by h5-index and select remaining needed articles
        remaining_articles = (
            remaining_df.sort_values(by="h5-index", ascending=False)
            .head(NUMBER_OF_ARTICLES - cited_papers)
            .copy()
        )

        # Combine cited and h5-index based articles
        selected_articles = pd.concat([selected_articles, remaining_articles])

    # Generate summaries and fetch venue info
    if not selected_articles.empty:
        for index, article in selected_articles.iterrows():
            journal_url, favicon_url = fetch_venue_info(article)
            llm_summary = generate_summary(article)
            if journal_url:
                selected_articles.at[index, "url"] = journal_url
            if favicon_url:
                selected_articles.at[index, "favicon"] = favicon_url
            if llm_summary:
                selected_articles.at[index, "llm_summary"] = llm_summary

        # Update the df with summaries and update supabase table
        df.update(selected_articles)
        response = supabase_articles_POST(df.to_dict(orient="records"))

    # Return 1: all processed articles, 2: top articles
    return df.to_dict(orient="records"), selected_articles.to_dict(orient="records")


def article_selection_JUFO(data: list):
    """Algorithm for article selection with JUFO criteria"""
    df = pd.DataFrame(data)

    # Data cleaning - all this logic is still the same from the original algorithm
    df = df.map(lambda x: tuple(x) if isinstance(x, list) else x)
    df = df.drop_duplicates(subset=["paperId"])
    response = supabase_articles_POST(df.to_dict(orient="records"))
    if hasattr(response, "error") and response.error:
        raise Exception(f"Failed to upsert data: {response.error}")

    # Fetching updated data from Supabase and filtering to articles without summaries
    articles = pd.DataFrame(supabase_query_all("ss_articles"))
    articles = articles[articles["llm_summary"].isnull()]

    # Querying journals and reconstructing foreign key relationship
    journals = supabase_query_all("jufo_journals")

    def parse_panel(panel_str):
        try:
            # Take the first number if there are multiple levels
            return int(str(panel_str).split("|")[0])
        except (ValueError, TypeError, IndexError):
            return 0

    journal_levels = {
        j["Name"]: [j["Level"], parse_panel(j["panels"])] for j in journals
    }
    matching_df = articles[articles["venue"].isin(journal_levels.keys())].copy()
    matching_df["Level"] = matching_df["venue"].map(lambda x: journal_levels[x][0])
    matching_df["panels"] = matching_df["venue"].map(lambda x: journal_levels[x][1])
    matching_df.sort_values(
        by=["Level", "panels"], ascending=[False, True], inplace=True
    )

    # For each article in matching df, fetch the abstract property for summary generation.
    # 1. If the article doesn't have an abstract summary, extract the tldr or abstract from article detail fetch
    # 2. If there is a tldr summary, use that for the summary generation
    # 3. Else skip and go to next article
    count = 0
    selected_articles = []
    for index, row in matching_df.iterrows():
        if count == 4:
            break
        # In the case that we get really low level publishers, there shouldn't be any articles for the week.
        if row["Level"] < 1:
            break
        if row["abstract"]:
            try:
                row["llm_summary"] = generate_gpt_paper_summary(
                    title=row["title"], content=row["abstract"]
                )
                selected_articles.append(row)
                count += 1
            except Exception as e:
                logging.error(f"Error generating summary: {e}", exc_info=True)
        else:
            article_detail = fetch_paper_details(row["paperId"])
            if not article_detail:
                continue
            if not article_detail.get("tldr"):
                continue
            if article_detail.get("tldr", {}).get("text"):
                row["llm_summary"] = generate_gpt_paper_summary(
                    title=row["title"], content=article_detail.get("tldr").get("text")
                )
                selected_articles.append(row)
                count += 1
            else:
                continue

    response = supabase_articles_POST(selected_articles)
    if hasattr(response, "error") and response.error:
        raise Exception(f"Failed to upsert data: {response.error}")

    return selected_articles
