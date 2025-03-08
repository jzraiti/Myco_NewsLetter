from utils.aws_utils import upload_to_s3
from utils.other_utils import (
    article_selection,
    generate_gpt_paper_summary,
    fetch_venue_info,
)
from utils.email_utils import render_template, smtp_send_email, resend_send_email
from utils.supabase_utils import supabase_newsletters_POST, supabase_articles_GET
from utils.ss_api import fetch_bulk_articles, fetch_paper_details
import markdown
import json


def test_summaries():
    """
    Tests the summary generation using gpt4o
    """
    writestring = ""
    for i in range(1, 6):
        title = "A Comparative study of BO-SVM plus different Residual Networks for pneumonia disease detection"
        content = 'The term "pneumonia" is an ancient Greek word that means "lung," so, it is "lung disease". An inflammation of lung is not caused by infections only but there are many causes of pneumonia such as viruses, fungi, and internal parasites [6]. Deep learning advancements in recent years have aided in the identification and classification of lung diseases in medical images. For clinical treatment and teaching tasks, medical image classification is essential'
        summary = generate_gpt_paper_summary(title, content)
        writestring += f"{i}. {summary}\n"

    with open("test_summary.txt", "w") as f:
        f.write(writestring)


def tmp_test():
    """TEMPORARY test for article fetching"""
    articles = fetch_bulk_articles()
    with open("test_articles.json", "w") as f:
        json.dump(articles, f)


def script(event, context):
    """Main script to run the newsletter generation and email sending process."""
    from datetime import datetime

    data = fetch_bulk_articles()
    _, result = article_selection(data)
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
    try:
        supabase_newsletters_POST(data)
    except Exception as e:
        return


def tmp_cleaning_JUFO():
    """TEMPORARY function for cleaning JUFO data"""
    import pandas as pd

    df = None
    with open("jfp-export.csv", "r") as f:
        df = pd.read_csv(f)

    print(len(df))
    df = df.drop_duplicates(subset=["Name"])
    print(len(df))

    with open("jfp-export-cleaned.csv", "w") as f:
        df.to_csv(f, index=False)


def tmp_test_paper_detail():
    """TEMPORARY function for testing paper details"""
    paper_id = "51121bfb8d93362607e71e795aa3e71945156b4f"
    data = fetch_paper_details(paper_id)
    print(json.dumps(data,indent=2))

if __name__ == "__main__":
    from utils.other_utils import article_selection_JUFO
    # script("event", "context")
    # tmp_test()
    article_selection_JUFO([])
    # test_summaries()
    # tmp_cleaning_JUFO()
    # tmp_test_paper_detail()