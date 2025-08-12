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
import os


def test_summaries():
    """
    Tests the summary generation using gpt4o
    """
    writestring = ""
    for i in range(1, 6):
        title = "STUDIES ON INDUSTRIAL APPLICATIONS OF EXTREMOPHILIC HALOPHILIC FUNGI"
        content = "Marine ecosystems, covering 71% of Earth’s surface, harbor diverse life forms, including extremophilic halophilic fungi that thrive in hypersaline environments. Despite their ecological significance and biotechnological potential, halophilic fungi remain understudied. These organisms inhabit high-salt habitats like salt deserts, salterns, and certain foods, exhibiting unique adaptations to survive extreme salt, pH, and temperature conditions. Halophilic fungi produce stable enzymes, including xylanases, cellulases, amylases, and proteases, which maintain activity under stress. These enzymes hold immense potential for industries like bioremediation, wastewater treatment, and biofuel production. Their stability stems from distinct molecular features, such as acidic amino acids and hydrophobic side chains, which facilitate protective solvation and hydration shells, preventing enzyme aggregation at high salt concentrations. Elucidating these mechanisms can inform the development of sustainable industrial processes and environmental applications. By isolating and optimizing halophilic fungal enzymes, researchers can unlock cost-effective solutions to environmental and industrial challenges. Halophilic fungi thus represent a valuable resource for future biotechnology. This review provides enzymes production and applications of halophilic extremozymes and impact of halophilic extremophiles on the industrial biotechnology."
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
            article["authors"] = [author.get("name") for author in article.get("authors", [])]
            article["authors"] = ", ".join(article["authors"]) if article["authors"] else "Unknown"
            if article.get("llm_summary"):
                article["llm_summary"] = markdown.markdown(article["llm_summary"])

        email_html_template = render_template(result)
        resend_send_email(email_html_template)
        upload_to_s3(email_html_template)
        bucket = os.getenv("NEWSLETTER_BUCKET", "myconews")
        date_str = datetime.now().strftime('%m-%d-%Y')
        data = {
            "name": f"{date_str}.html",
            "link": f"https://{bucket}.s3.amazonaws.com/{date_str}.html",
        }
        supabase_newsletters_POST(data)
    else:
        from datetime import datetime as dt
        print(
            f"No articles selected for the newsletter for the week of {dt.now().strftime('%m-%d-%Y')}."
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
