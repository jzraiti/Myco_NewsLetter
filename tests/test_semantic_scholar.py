import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.utils.ss_api import fetch_bulk_articles, fetch_paper_details, fetch_reference_count_by_paper
from datetime import datetime

def test_fetch_bulk_articles():
    articles = fetch_bulk_articles()
    assert isinstance(articles, list), "Articles should be a list"
    assert len(articles) > 0, "No articles were fetched"

    # Create output directory if it doesn't exist
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'query_results')
    os.makedirs(output_dir, exist_ok=True)

    # Create a timestamped output file
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    output_file = os.path.join(output_dir, f"article_titles_{timestamp}.txt")

    # Write titles to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"Total Articles: {len(articles)}\n\n")
        for i, article in enumerate(articles, 1):
            title = article.get("title", "No Title")
            url = article.get("url", "No URL")
            f.write(f"{i}. {title}\n   {url}\n\n")

    print(f"Wrote {len(articles)} article titles to {output_file}")

def test_fetch_paper_details():
    sample_id = "ARXIV:1706.03762"  # Replace with valid paper ID from your own fetch
    paper = fetch_paper_details(sample_id)
    assert "title" in paper
    print(f"Fetched paper title: {paper['title']}")

def test_fetch_reference_count_by_paper():
    sample_id = "ARXIV:1706.03762"  # Replace with valid paper ID
    references = fetch_reference_count_by_paper(sample_id)
    assert isinstance(references, list)
    print(f"Found {len(references)} references")
