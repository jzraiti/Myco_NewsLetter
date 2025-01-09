import os
from supabase import create_client, Client
import dotenv
from ss_api import fetch_bulk_articles, fetch_reference_count_by_paper
import pandas as pd
import logging
import time

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
dotenv.load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

data = fetch_bulk_articles(2, "mycology")

df = pd.DataFrame(data)
df = df.map(lambda x: tuple(x) if isinstance(x, list) else x)
df = df.drop_duplicates(subset=["paperId"])
df = df.drop(columns=["citationCount"])

for i, row in df.iterrows():
    df.at[i, "referenceCount"] = (
        len(fetch_reference_count_by_paper(row["paperId"])) or 0
    )
    logging.info(f"Fetching reference count for {row['paperId']}...")
    time.sleep(2)

data = df.to_dict(orient="records")

response = supabase.table("ss_articles").upsert(data, on_conflict="paperId").execute()
