import os
import logging
import pandas as pd
from supabase import Client, create_client
from postgrest import APIError
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
load_dotenv()

_supabase_client: Client | None = None


def get_supabase_client() -> Client:
    global _supabase_client

    if _supabase_client is None:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")

        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set")

        try:
            _supabase_client = create_client(
                supabase_key=supabase_key,
                supabase_url=supabase_url,
            )
        except Exception as e:
            logger.error(f"Error creating Supabase client: {str(e)}")
            raise

    return _supabase_client


def supabase_articles_POST(data: list, client: Client | None = None):
    """POSTs the given article data to the Supabase database."""
    active_client = client or get_supabase_client()
    df = pd.DataFrame(data)
    df = df.map(lambda x: tuple(x) if isinstance(x, list) else x)
    df = df.drop_duplicates(subset=["paperId"])

    try:
        journals = active_client.table("scholar_journals").select("title").execute()
        existing_journals = set(journal["title"] for journal in journals.data)
    except APIError as e:
        logger.error(f"Failed to fetch existing journals: {str(e)}")
        raise

    unique_venues = df["venue"].unique()
    new_journals = [
        {"title": venue} for venue in unique_venues if venue not in existing_journals
    ]

    if new_journals:
        try:
            active_client.table("scholar_journals").insert(new_journals).execute()
            logger.info(f"Added {len(new_journals)} new journals")
        except APIError as e:
            logger.error(f"Failed to insert new journals: {str(e)}")
            raise

    data = df.to_dict(orient="records")
    result = active_client.table("ss_articles").upsert(data, on_conflict="paperId").execute()
    return result


def supabase_articles_GET(client: Client | None = None):
    """GETs the article data from the Supabase database."""
    active_client = client or get_supabase_client()
    result = active_client.table("ss_articles").select("*").execute()
    return result


def supabase_recipients_GET(client: Client | None = None):
    """GETs the data from the Supabase database."""
    active_client = client or get_supabase_client()
    result = active_client.table("recipients").select("*").execute()
    return result


def supabase_journals_GET(client: Client | None = None):
    """GETs the journal data from the Supabase database."""
    active_client = client or get_supabase_client()
    result = active_client.table("scholar_journals").select("*").execute()
    return result


def supabase_newsletters_GET(client: Client | None = None):
    """GETs the newsletter data from the Supabase database."""
    active_client = client or get_supabase_client()
    result = active_client.table("newsletters").select("*").execute()
    return result


def supabase_newsletters_POST(data: dict, client: Client | None = None):
    """POSTs the given newsletter data to the Supabase database."""
    active_client = client or get_supabase_client()
    result = active_client.table("newsletters").upsert(data).execute()
    return result


def supabase_JUFO_GET(client: Client | None = None):
    """GETs the JUFO data from the Supabase database."""
    active_client = client or get_supabase_client()
    result = active_client.table("jufo_journals").select("*").execute()
    return result


def supabase_query_all(table_name: str, client: Client | None = None):
    active_client = client or get_supabase_client()
    all_data = []
    more = True
    offset = 0
    limit = 10000
    while more:
        list = (
            active_client.table(table_name)
            .select("*")
            .range(offset, offset + limit - 1)
            .execute()
            .data
        )
        all_data.extend(list)
        offset += limit
        if len(list) < limit:
            more = False
    return all_data
