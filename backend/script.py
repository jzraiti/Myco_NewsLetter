from utils.aws_utils import upload_to_s3
from utils.other_utils import (
    article_selection,
    render_template,
    generate_gpt_paper_summary,
)
from utils.ss_api import fetch_bulk_articles
import json
from utils.supabase_utils import supabase_articles_POST


def generate_and_send_newsletter():
    data = fetch_bulk_articles()
    _, selection = article_selection(data)

    for article in selection:
        authors = ", ".join(author["name"] for author in article["authors"])
        article["authors"] = authors

    html_content = render_template(selection, "https://example.com")

    with open("newsletter.html", "w") as f:
        f.write(html_content)


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
    _, result = article_selection(data)
    return result


if __name__ == "__main__":
    # test()
    generate_and_send_newsletter()
