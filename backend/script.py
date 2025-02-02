from utils.aws_utils import upload_to_s3
from utils.other_utils import (
    article_selection,
    generate_gpt_paper_summary,
    fetch_venue_info,
)
from utils.email_utils import render_template, smtp_send_email
from utils.supabase_utils import supabase_articles_GET, supabase_newsletters_POST
from utils.ss_api import fetch_bulk_articles, fetch_paper_details
import json
import boto3
import favicon
import markdown


def test_send_email():
    smtp_send_email()


def test():
    writestring = ""
    for i in range(1, 6):
        title = "A Comparative study of BO-SVM plus different Residual Networks for pneumonia disease detection"
        content = 'The term "pneumonia" is an ancient Greek word that means "lung," so, it is "lung disease". An inflammation of lung is not caused by infections only but there are many causes of pneumonia such as viruses, fungi, and internal parasites [6]. Deep learning advancements in recent years have aided in the identification and classification of lung diseases in medical images. For clinical treatment and teaching tasks, medical image classification is essential'
        summary = generate_gpt_paper_summary(title, content)
        writestring += f"{i}. {summary}\n"

    with open("test_summary.txt", "w") as f:
        f.write(writestring)


def test_article_selection():
    data = fetch_bulk_articles()
    # data = supabase_articles_GET().data
    _, result = article_selection(data)
    for article in result:
        article["authors"] = [author["name"] for author in article["authors"]]
        article["authors"] = ", ".join(article["authors"])

    email_html_template = render_template(result, "https://google.com")
    smtp_send_email(email_html_template)


def test_article_detail():
    paperID = "4a99756c2b5237219828b0f7e63f9c417430f1cc"
    result = fetch_paper_details(paperID)
    print(result)


def test_venue_info():
    url = "https://www.semanticscholar.org/paper/The-importance-of-antimicrobial-resistance-in-Gow-Johnson/0d2f56b0cab7d659bb76797e5c6d79237d8c8fdb"
    result = fetch_venue_info(url)
    print(result)


def test_favicon():
    icons = favicon.get(url="mycokeys.pensoft.net")


def test_jan_31():
    from datetime import datetime

    data = supabase_articles_GET().data
    data = [article for article in data if article["llm_summary"] is not None]
    data = data[:3]
    for article in data:
        article["authors"] = [author["name"] for author in article["authors"]]
        article["authors"] = ", ".join(article["authors"])
        article["llm_summary"] = markdown.markdown(article["llm_summary"])

    email_html_template = render_template(data)
    # smtp_send_email(email_html_template)
    upload_to_s3(email_html_template)
    data = {
        "name": f"{datetime.now().strftime('%m-%d-%Y')}.html",
        "link": f"https://myconews.s3-us-west-1.amazonaws.com/{datetime.now().strftime('%m-%d-%Y')}.html",
    }
    supabase_newsletters_POST(data)


if __name__ == "__main__":
    # test()
    # test_send_email()
    # test_article_selection()
    # test_article_detail()
    # test_venue_info()
    test_jan_31()
