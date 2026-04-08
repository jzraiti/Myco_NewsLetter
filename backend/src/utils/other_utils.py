import dotenv
import logging

from utils.article_selection_service import article_selection, article_selection_JUFO
from utils.summary_service import generate_gpt_paper_summary
from utils.venue_service import extract_favicon, fetch_venue_info

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
dotenv.load_dotenv()



def generate_summary(article: dict) -> str:
    """HELPER METHOD - Generates a summary of the given article using GPT-4o-mini."""
    logging.info(f"Generating summary for article: {article['paperId']}")
    article = article.to_dict()
    generated_content: str = generate_gpt_paper_summary(
        title=article["title"], content=article["abstract"]
    )
    return generated_content
