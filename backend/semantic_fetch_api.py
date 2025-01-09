from typing import List
import requests
from ss_token_generation import get_aws_token
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")


def get_semantic_data(search_term: str, page_size: int, page_num: int) -> dict:
    logging.info(f"Searching articles under [{search_term}]...")
    headers = {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache,no-store,must-revalidate,max-age=-1",
        "content-type": "application/json",
        "origin": "https://www.semanticscholar.org",
        "priority": "u=1, i",
        "referer": "https://www.semanticscholar.org/search?year%5B0%5D=2024&year%5B1%5D=2024&q=mycology&sort=relevance",
        "sec-ch-ua": '"Chromium";v="130", "Brave";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "x-s2-client": "webapp-browser",
        "x-s2-ui-version": "8c3d74bcd9b3357febf74868a2a34ed576c6fd0b",
    }

    cookies = {
        "tid": "rBIABmc+cq4UWwAIBA+XAg==",
        "s2Exp": "new_ab_framework_aa%3D-control%26pdp_citation_and_reference_paper_cues%3D-enable_citation_and_reference_paper_cues%26venues%3D-enable_venues%26reader_link_styling%3D-control%26topics_beta3%3D-topics_beta3%26alerts_aa_test%3D-control%26personalized_author_card_cues%3D-control%26term_understanding%3D-control%26aa_user_based_test%3D-control%26paper_cues%3D-all_paper_cues%26new_ab_framework_mock_ab%3D-control%26aa_stable_hash_session_test%3Dcontrol",
        "sid": "030875d1-7ac6-462c-9fcd-5261edceb30c",
        "aws-waf-token": get_aws_token(),
    }

    json_data = {
        "queryString": "mycology",
        "page": 1,
        "pageSize": 5,
        "sort": "pub-date",
        "authors": [],
        "coAuthors": [],
        "venues": [],
        "yearFilter": {
            "min": int(datetime.now().year - 1),
            "max": int(datetime.now().year),
        },
        "requireViewablePdf": False,
        "fieldsOfStudy": [],
        "hydrateWithDdb": True,
        "includeTldrs": True,
        "performTitleMatch": True,
        "includeBadges": True,
        "getQuerySuggestions": False,
        "cues": [
            "CitedByLibraryPaperCue",
            "CitesYourPaperCue",
            "CitesLibraryPaperCue",
        ],
        "includePdfVisibility": True,
    }

    response = requests.post(
        "https://www.semanticscholar.org/api/1/search",
        cookies=cookies,
        headers=headers,
        json=json_data,
    )

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch page!")
        return {}


def extract_relevant_data(article):
    relevant_data = {
        "title": article.get("title").get("text").strip(),
        "authors": [
            author[0].get("name").strip() for author in article.get("authors", [])
        ],
        "journal": article.get("journal", {}).get("name"),
        "link": article.get("primaryPaperLink").get("url").strip(),
        "summary": article.get("tldr", {}).get("text"),
        "references": int(article.get("citationStats").get("numReferences")),
        "key_references": int(article.get("citationStats").get("numKeyReferences")),
        "publication_date": article.get("pubDate"),
        "last_updated": article.get("pubUpdateDate"),
    }

    return relevant_data


def fetch_and_extract_articles(
    search_term: str, page_size: int, page_num: int
) -> List[dict]:
    response = get_semantic_data(
        search_term=search_term, page_num=page_num, page_size=page_size
    )
    extracted_data = [
        extract_relevant_data(article) for article in response.get("results", [])
    ]
    return extracted_data
