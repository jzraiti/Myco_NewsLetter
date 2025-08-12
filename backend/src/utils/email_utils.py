from email.mime.text import MIMEText
import os
import logging
from jinja2 import Environment, FileSystemLoader

from utils.supabase_utils import supabase_recipients_GET


def render_template(articles: list[dict]) -> str:
    env = Environment(loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), "..", "templates")))
    template = env.get_template("email.html")
    return template.render(articles=articles)


def resend_send_email(html_content: str):
    import resend
    from datetime import datetime
    import time

    resend.api_key = os.getenv("RESEND_API_KEY")

    receiver_email_list = supabase_recipients_GET()
    receiver_email_list = [
        receiver["email"]
        for receiver in receiver_email_list.data
        if receiver["is_subscribed"]
    ]

    for receiver in receiver_email_list:
        try:
            r = resend.Emails.send(
                {
                    "from": "MycoWeekly Newsletter <myconewsletter@mycoweekly.org>",
                    "to": receiver,
                    "subject": f"Weekly Digest {datetime.now().strftime('%m/%d')}",
                    "html": html_content,
                }
            )
            print(f"Email sent successfully to {receiver}")
        except Exception as e:
            print(f"Failed to send email to {receiver}: {e}")
        time.sleep(0.5)