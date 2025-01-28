import os
import logging
import pandas as pd
from supabase import Client, create_client
from postgrest import APIError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def supabase_articles_POST(data: list):
    """POSTs the given article data to the Supabase database."""
    try:
        url: str = os.getenv("SUPABASE_URL")
        key: str = os.getenv("SUPABASE_KEY")
        if not url or not key:
            raise ValueError("Missing Supabase credentials")
        
        supabase: Client = create_client(url, key)
        
        df = pd.DataFrame(data)
        df = df.map(lambda x: tuple(x) if isinstance(x, list) else x)
        df = df.drop_duplicates(subset=["paperId"])

        try:
            journals = supabase.table("scholar_journals").select("title").execute()
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
                supabase.table("scholar_journals").insert(new_journals).execute()
                logger.info(f"Added {len(new_journals)} new journals")
            except APIError as e:
                logger.error(f"Failed to insert new journals: {str(e)}")
                raise

        data = df.to_dict(orient="records")
        result = supabase.table("ss_articles").upsert(data, on_conflict="paperId").execute()
        logger.info(f"Successfully updated {len(data)} articles")
        return result

    except Exception as e:
        logger.error(f"Error in supabase_articles_POST: {str(e)}")
        raise

def supabase_articles_GET():
    """GETs the article data from the Supabase database."""
    try:
        url: str = os.getenv("SUPABASE_URL")
        key: str = os.getenv("SUPABASE_KEY")
        if not url or not key:
            raise ValueError("Missing Supabase credentials")

        supabase: Client = create_client(url, key)
        result = supabase.table("ss_articles").select("*").execute()
        logger.info("Successfully fetched articles")
        return result

    except Exception as e:
        logger.error(f"Error in supabase_articles_GET: {str(e)}")
        raise

def supabase_recipients_GET():
    """GETs the data from the Supabase database."""
    try:
        url: str = os.getenv("SUPABASE_URL")
        key: str = os.getenv("SUPABASE_KEY")
        if not url or not key:
            raise ValueError("Missing Supabase credentials")

        supabase: Client = create_client(url, key)
        result = supabase.table("ss_recipients").select("*").execute()
        logger.info("Successfully fetched recipients")
        return result

    except Exception as e:
        logger.error(f"Error in supabase_recipients_GET: {str(e)}")
        raise

def supabase_journals_GET():
    """GETs the journal data from the Supabase database."""
    try:
        url: str = os.getenv("SUPABASE_URL")
        key: str = os.getenv("SUPABASE_KEY")
        if not url or not key:
            raise ValueError("Missing Supabase credentials")

        supabase: Client = create_client(url, key)
        result = supabase.table("scholar_journals").select("*").execute()
        logger.info("Successfully fetched journals")
        return result

    except Exception as e:
        logger.error(f"Error in supabase_journals_GET: {str(e)}")
        raise
