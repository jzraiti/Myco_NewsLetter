import os
import pandas as pd
from supabase import Client, create_client


def supabase_articles_POST(data: list):
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

    # Get all existing journals
    journals = supabase.table("scholar_journals").select("title").execute()
    existing_journals = set(journal["title"] for journal in journals.data)

    # Get unique venues from the new articles
    unique_venues = df["venue"].unique()
    
    # Find venues that don't exist in journals table
    new_journals = [
        {"title": venue}
        for venue in unique_venues
        if venue not in existing_journals
    ]

    # Insert new journals if any
    if new_journals:
        supabase.table("scholar_journals").insert(new_journals).execute()

    data = df.to_dict(orient="records")

    return supabase.table("ss_articles").upsert(data, on_conflict="paperId").execute()


def supabase_articles_GET():
    """GETs the data from the Supabase database."""
    url: str = os.getenv("SUPABASE_URL")
    key: str = os.getenv("SUPABASE_KEY")
    supabase: Client = create_client(url, key)

    return supabase.table("ss_articles").select("*").execute()


def supabase_recipients_GET():
    """GETs the data from the Supabase database."""
    url: str = os.getenv("SUPABASE_URL")
    key: str = os.getenv("SUPABASE_KEY")
    supabase: Client = create_client(url, key)

    return supabase.table("ss_recipients").select("*").execute()
