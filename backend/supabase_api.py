import os
from supabase import create_client, Client
import dotenv
from semantic_fetch_api import fetch_and_extract_articles

dotenv.load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

data = fetch_and_extract_articles()

response = (
    supabase.table("ss_articles").upsert(data, on_conflict="title,authors").execute()
)
