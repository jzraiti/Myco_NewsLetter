import requests
from dotenv import load_dotenv
import os
import logging
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
load_dotenv()


def fetch_bulk_articles(num_articles: int, search_term: str) -> list:
    """Fetches a bulk of articles, sorted by recency, from the Semantic Scholar API.

    Args:
        num_articles (int): The number of articles to fetch.
        search_term (str): The search term to use.
    """
    logging.info(f"Fetching {num_articles} articles for '{search_term}'...")
    url = "http://api.semanticscholar.org/graph/v1/paper/search/bulk/"
    two_weeks_ago = (datetime.now() - timedelta(weeks=2)).strftime("%Y-%m-%d")

    query_params = {
        "query": search_term,
        "sort": "citationCount:desc",
        "publicationDateOrYear": f"{two_weeks_ago}:{datetime.now().strftime("%Y-%m-%d")}",
    }

    query_param_list = [
        "title",
        "url",
        "abstract",
        "publicationDate",
        "authors",
        "publicationTypes",
        "openAccessPdf",
        "venue",
        "paperId",
        "citationCount",
        "externalIds",
        "s2FieldsOfStudy",
    ]

    query_params["fields"] = ",".join([param for param in query_param_list])

    headers = {
        "x-api-key": os.getenv("SEMANTIC_SCHOLAR_API_KEY"),
    }

    # Send the API request
    response = requests.get(url=url, params=query_params, headers=headers)

    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        papers = data.get("data", [])
        logging.info(f"Successfully fetched {num_articles} articles.")
        return papers[:num_articles]
    else:
        logging.error(
            f"Error when fetching bulk articles: {response.status_code}\n{response.text}"
        )
        return []


def fetch_reference_count_by_paper(paper_id: str) -> dict:
    """Fetches the number of references for a given paper.

    Args:
        paper_id (str): The id of the paper.
    """

    url = f"https://api.semanticscholar.org/graph/v1/paper/{paper_id}/references"
    headers = {
        "x-api-key": os.getenv("SEMANTIC_SCHOLAR_API_KEY"),
    }
    response = requests.get(url=url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        references = data.get("data", [])
        return references
    else:
        logging.error(
            f"Error when fetching references: {response.status_code}\n{response.text}"
        )
        return {}


if __name__ == "__main__":
    articles = fetch_bulk_articles(20, "mycology")
    print(articles)
