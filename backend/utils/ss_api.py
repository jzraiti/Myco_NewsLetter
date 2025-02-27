import requests
from dotenv import load_dotenv
import os
import logging
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
load_dotenv()

SEARCH_QUERY = """
mycology|fungi|"fungal biology"|"fungal ecology"|"fungal taxonomy"|"fungal systematics"|
"fungal genetics"|"fungal evolution"|"fungal physiology"|"fungal metabolism"|"fungal biotechnology"|
"fungal diversity"|Ascomycota|Basidiomycota|Zygomycota|Chytridiomycota|Glomeromycota|Microsporidia|
Amanita|Aspergillus|Candida|Claviceps|Coprinus|Fusarium|Ganoderma|Lentinula|Morchella|
Penicillium|Pleurotus|Psilocybe|Rhizopus|Saccharomyces|Schizophyllum|Trichoderma|Ustilago|
"mycorrhizal fungi"|"decomposer fungi"|"endophytic fungi"|"lichenized fungi"|"parasitic fungi"|"saprotrophic fungi"|
"wood decay fungi"|"fungal mutualisms"|"symbiotic fungi"|"fungal pathogens"|"fungal interactions"|"fungal biodegradation"|
"medical mycology"|"industrial mycology"|"agricultural mycology"|mycoremediation|mycoforestry|mycotechnology|
"fungal bioinformatics"|"fungal genomics"|"fungal transcriptomics"|"fungal proteomics"|"fungal secondary metabolites"|
"fungal enzymes"|"fungal antibiotics"|"fungal fermentation"|"fungal synthetic biology"|"edible fungi"|"medicinal fungi"|
"fermented fungi"|mycotoxins|"fungal immunomodulators"|"fungal antivirals"|"fungal cancer therapy"|"fungal probiotics"|
"fungi and carbon cycling"|"fungal decomposition"|"fungal contributions to soil health"|"fungi and climate change"|
"fungal biocontrol"|"fungal endophytes in agriculture"|"fungi and nitrogen cycling"|"fungal ecology modeling"|"AI in mycology"|
"machine learning for fungal classification"|"fungal network analysis"|"fungal image processing"|"citizen science and fungi"|
"iNaturalist fungi studies"|"DNA barcoding fungi"|"fungal spore dispersal"
"""


def fetch_bulk_articles() -> list:
    """Fetches a bulk of mycology articles from the Semantic Scholar API from the last 4 weeks.

    Args:
        num_articles (int): The number of articles to fetch.
        search_term (str): The search term to use.
    """
    url = "http://api.semanticscholar.org/graph/v1/paper/search/bulk/"
    four_weeks_ago = (datetime.now() - timedelta(weeks=4)).strftime("%Y-%m-%d")
    search_term_count = SEARCH_QUERY.count("|") + 1
    logging.info(f"Fetching articles with {search_term_count} search terms...")

    query_params = {
        "query": SEARCH_QUERY,
        "sort": "citationCount:desc",
        "publicationDateOrYear": f"{four_weeks_ago}:{datetime.now().strftime("%Y-%m-%d")}",
        "fieldsOfStudy": "Environmental Science",
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

        # Exclude out papers without an absract summary
        papers = [paper for paper in papers if paper.get("abstract")]

        # Exclude out papers related to Medicine
        papers = [
            paper
            for paper in papers
            if not any(
                field.get("category") == "Medicine"
                for field in paper.get("s2FieldsOfStudy", [])
            )
        ]

        # Exclude out papers related to Education
        papers = [
            paper
            for paper in papers
            if not any(
                field.get("category") == "Education"
                for field in paper.get("s2FieldsOfStudy", [])
            )
        ]

        logging.info(f"Successfully fetched {len(papers)} articles.")
        return papers
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


def fetch_paper_details(paper_id: str) -> dict:
    """Fetches the details of a paper given its id.

    Args:
        paper_id (str): The id of the paper.
    """

    url = f"https://api.semanticscholar.org/graph/v1/paper/{paper_id}"
    headers = {
        "x-api-key": os.getenv("SEMANTIC_SCHOLAR_API_KEY"),
    }
    query_param_list = [
        "title",
        "url",
        "venue",
        "publicationVenue",
        "citationCount",
        "influentialCitationCount",
        "tldr",
    ]
    query_params = ",".join([param for param in query_param_list])
    response = requests.get(url=url, headers=headers, params={"fields": query_params})

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        logging.error(
            f"Error when fetching paper details: {response.status_code}\n{response.text}"
        )
        return {}
