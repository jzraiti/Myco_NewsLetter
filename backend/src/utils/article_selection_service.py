import logging

import pandas as pd

from utils.ss_api import fetch_paper_details as default_fetch_paper_details
from utils.summary_service import generate_gpt_paper_summary as default_generate_summary
from utils.supabase_utils import (
    supabase_articles_GET as default_supabase_articles_get,
    supabase_articles_POST as default_supabase_articles_post,
    supabase_journals_GET as default_supabase_journals_get,
    supabase_query_all as default_supabase_query_all,
)
from utils.venue_service import fetch_venue_info as default_fetch_venue_info


NUMBER_OF_ARTICLES = 4


def generate_summary(article: dict, summary_generator=default_generate_summary) -> str:
    logging.info(f"Generating summary for article: {article['paperId']}")
    article_dict = article.to_dict() if hasattr(article, "to_dict") else article
    return summary_generator(title=article_dict["title"], content=article_dict["abstract"])


def article_selection(
    data: list,
    supabase_articles_post=default_supabase_articles_post,
    supabase_articles_get=default_supabase_articles_get,
    supabase_journals_get=default_supabase_journals_get,
    fetch_venue_info=default_fetch_venue_info,
    summary_generator=default_generate_summary,
) -> dict:
    """Selects top articles from the given data and generates summaries for them."""
    df = pd.DataFrame(data)
    df = df.map(lambda x: tuple(x) if isinstance(x, list) else x)
    df = df.drop_duplicates(subset=["paperId"])
    df = df.sort_values(by="citationCount", ascending=False)

    response = supabase_articles_post(df.to_dict(orient="records"))
    if hasattr(response, "error") and response.error:
        return {"success": False, "error": response.error, "message": "Failed to upsert data"}

    response = supabase_articles_get()
    if hasattr(response, "error") and response.error:
        return {"success": False, "error": response.error, "message": "Failed to fetch data"}

    df = pd.DataFrame(response.data)
    df = df.sort_values(by="citationCount", ascending=False)
    df = df[df["abstract"].notnull()]
    df = df[df["llm_summary"].isnull()]

    selected_articles = df[df["citationCount"] > 0].head(5).copy()
    cited_papers = len(selected_articles)

    if cited_papers < NUMBER_OF_ARTICLES:
        journals = supabase_journals_get()
        journal_h5_index = {j["title"]: j["h5-index"] for j in journals.data}
        remaining_df = df[df["citationCount"] == 0].copy()
        remaining_df["h5-index"] = remaining_df["venue"].map(journal_h5_index)
        remaining_articles = (
            remaining_df.sort_values(by="h5-index", ascending=False)
            .head(NUMBER_OF_ARTICLES - cited_papers)
            .copy()
        )
        selected_articles = pd.concat([selected_articles, remaining_articles])

    if not selected_articles.empty:
        for index, article in selected_articles.iterrows():
            journal_url, favicon_url = fetch_venue_info(article)
            llm_summary = generate_summary(article, summary_generator=summary_generator)
            if journal_url:
                selected_articles.at[index, "url"] = journal_url
            if favicon_url:
                selected_articles.at[index, "favicon"] = favicon_url
            if llm_summary:
                selected_articles.at[index, "llm_summary"] = llm_summary

        df.update(selected_articles)
        supabase_articles_post(df.to_dict(orient="records"))

    return df.to_dict(orient="records"), selected_articles.to_dict(orient="records")


def article_selection_JUFO(
    data: list,
    supabase_articles_post=default_supabase_articles_post,
    supabase_query_all=default_supabase_query_all,
    fetch_paper_details=default_fetch_paper_details,
    summary_generator=default_generate_summary,
):
    """Algorithm for article selection with JUFO criteria."""
    df = pd.DataFrame(data)
    df = df.map(lambda x: tuple(x) if isinstance(x, list) else x)
    df = df.drop_duplicates(subset=["paperId"])
    response = supabase_articles_post(df.to_dict(orient="records"))
    if hasattr(response, "error") and response.error:
        raise Exception(f"Failed to upsert data: {response.error}")

    articles = pd.DataFrame(supabase_query_all("ss_articles"))
    articles = articles[articles["llm_summary"].isnull()]
    journals = supabase_query_all("jufo_journals")

    def parse_panel(panel_str):
        try:
            return int(str(panel_str).split("|")[0])
        except (ValueError, TypeError, IndexError):
            return 0

    journal_levels = {j["Name"]: [j["Level"], parse_panel(j["panels"])] for j in journals}
    matching_df = articles[articles["venue"].isin(journal_levels.keys())].copy()
    matching_df["Level"] = matching_df["venue"].map(lambda x: journal_levels[x][0])
    matching_df["panels"] = matching_df["venue"].map(lambda x: journal_levels[x][1])
    matching_df.sort_values(by=["Level", "panels"], ascending=[False, True], inplace=True)

    count = 0
    selected_articles = []
    for _, row in matching_df.iterrows():
        if count == NUMBER_OF_ARTICLES:
            break
        if row["Level"] < 1:
            break
        try:
            if row["abstract"]:
                row["llm_summary"] = summary_generator(title=row["title"], content=row["abstract"])
                selected_articles.append(row.to_dict())
                count += 1
                continue

            article_detail = fetch_paper_details(row["paperId"])
            if not article_detail:
                continue
            tldr = article_detail.get("tldr", {}) or {}
            if not tldr.get("text"):
                continue
            row["llm_summary"] = summary_generator(title=row["title"], content=tldr.get("text"))
            selected_articles.append(row.to_dict())
            count += 1
        except Exception as e:
            logging.error(f"Error generating summary: {e}", exc_info=True)

    response = supabase_articles_post(selected_articles)
    if hasattr(response, "error") and response.error:
        raise Exception(f"Failed to upsert data: {response.error}")

    return selected_articles
