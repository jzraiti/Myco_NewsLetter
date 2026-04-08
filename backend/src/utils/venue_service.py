import logging
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup


def extract_favicon(url: str, request_get=requests.get) -> str | None:
    try:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
            )
        }
        response = request_get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        favicon_link = soup.find("link", rel=["icon", "shortcut icon"])
        if favicon_link and favicon_link.get("href"):
            return urljoin(url, favicon_link["href"])
        logging.info(f"No favicon found for: {url}")
        return None
    except Exception as e:
        logging.error(f"Error extracting favicon: {e}")
        return None


def fetch_venue_info(article: dict, request_get=requests.get) -> tuple[str | None, str | None]:
    """Parses through the Semantic Scholar webpage and fetches the journal link and favicon."""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        external_ids = article.get("externalIds", {}) or {}
        doi = external_ids.get("DOI")
        if not doi:
            logging.info("No DOI present for article; skipping venue info fetch.")
            return None, None
        doi_url = f"https://doi.org/{doi}"
        doi_response = request_get(doi_url, headers=headers, allow_redirects=True, timeout=15)
        journal_url = doi_response.url
        parsed_url = urlparse(journal_url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        favicon_url = extract_favicon(base_url, request_get=request_get)
        logging.info(f"Successfully fetched venue info for article: {article.get('paperId')}")
        return journal_url, favicon_url
    except Exception as e:
        logging.error(f"Error fetching venue info for article: {str(e)}")
        return None, None
