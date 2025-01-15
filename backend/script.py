from backend.utils.aws_utils import upload_to_s3
from backend.utils.other_utils import article_selection, render_template
from backend.utils.ss_api import fetch_bulk_articles


def generate_and_send_newsletter():
    data = fetch_bulk_articles(30, "mycology|fungi|mushrooms|fungus|mycologist")
    selection = article_selection(data)
    html_content = render_template(selection)  # Implement template rendering
    upload_to_s3(html_content)

    recipients = get_recipients()  # Fetch from Supabase
    send_email(html_content, recipients)
