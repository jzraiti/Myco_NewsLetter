from utils.aws_utils import upload_to_s3
from utils.other_utils import (
    article_selection,
    article_selection_JUFO,
    generate_gpt_paper_summary,
)
from utils.email_utils import render_template, resend_send_email
from utils.supabase_utils import supabase_newsletters_POST
from utils.ss_api import fetch_bulk_articles
import markdown


def test_summaries():
    """
    Tests the summary generation using gpt4o
    """
    writestring = ""
    for i in range(1, 6):
        title = "Clonal Candida auris and ESKAPE pathogens on the skin of residents of nursing homes."
        content = "Skin is a reservoir for colonization by C. auris and ESKAPE pathogens and their associated antimicrobial-resistance genes, as well as other high-priority pathogens and their associated antimicrobial-resistance genes shared in a nursing home."
        summary = generate_gpt_paper_summary(title, content)
        writestring += f"{i}. {summary}\n"

    with open("test_summary.txt", "w") as f:
        f.write(writestring)


def script(event, context):
    """Main script to run the newsletter generation and email sending process."""
    from datetime import datetime

    data = fetch_bulk_articles()
    result = article_selection_JUFO(data)
    if len(result) > 0:
        for article in result:
            article["authors"] = [author["name"] for author in article["authors"]]
            article["authors"] = ", ".join(article["authors"])
            article["llm_summary"] = markdown.markdown(article["llm_summary"])

        email_html_template = render_template(result)
        resend_send_email(email_html_template)
        upload_to_s3(email_html_template)
        data = {
            "name": f"{datetime.now().strftime('%m-%d-%Y')}.html",
            "link": f"https://myconews.s3-us-west-1.amazonaws.com/{datetime.now().strftime('%m-%d-%Y')}.html",
        }
        supabase_newsletters_POST(data)
    else:
        print(
            f"No articles selected for the newsletter for the week of {datetime.now().strftime('%m-%d-%Y')}."
        )


def test_email_template():
    data = [
        {
            "title": "Recent Advances in Mycology Research",
            "authors": "John Smith, Jane Doe, Robert Johnson",
            "journal": "Journal of Mycological Studies",
            "doi": "10.1234/myco.2023.001",
            "publication_date": "2023-12-01",
            "llm_summary": "<p>This study reveals significant advances in understanding fungal growth patterns in controlled environments. The researchers identified novel metabolic pathways that could have implications for biotechnology applications.</p>",
            "url": "https://doi.org/10.1234/myco.2023.001",
            "venue": "Nature",
            "Level": "2",
            "panels": "1",
        },
        {
            "title": "Novel Fungal Species Discovered in Amazon Rainforest",
            "authors": "Maria Garcia, David Chen",
            "journal": "Biodiversity Research",
            "doi": "10.1234/bio.2023.002",
            "publication_date": "2023-12-02",
            "llm_summary": "<p>Researchers documented three previously unknown fungal species in the Amazon rainforest. The specimens show unique enzymatic properties that could be valuable for pharmaceutical development.</p>",
            "url": "https://doi.org/10.1234/bio.2023.002",
            "venue": "Nature",
            "Level": "2",
        },
    ]

    email_html_template = render_template(data)
    with open("test_email.html", "w") as f:
        f.write(email_html_template)


if __name__ == "__main__":
    script("event", "context")
