from email.mime.text import MIMEText
import os
import logging
from jinja2 import Environment, FileSystemLoader

from utils.supabase_utils import supabase_recipients_GET


def render_template(articles: list[dict]) -> str:
    env = Environment(loader=FileSystemLoader("templates"))
    template = env.get_template("email.html")
    return template.render(articles=articles)


def resend_send_email(html_content: str):
    import resend
    from datetime import datetime

    resend.api_key = os.getenv("RESEND_API_KEY")

    receiver_email_list = supabase_recipients_GET()
    receiver_email_list = [
        receiver["email"]
        for receiver in receiver_email_list.data
        if receiver["is_subscribed"]
    ]

    try:
        for receiver in receiver_email_list:
            r = resend.Emails.send(
                {
                    "from": "MycoWeekly Newsletter <myconewsletter@mycoweekly.click>",
                    "to": receiver,
                    "subject": f"Weekly Digest {datetime.now().strftime('%m/%d')}",
                    "html": html_content,
                }
            )
            print(f"Email sent successfully to {receiver}")
    except Exception as e:
        print(e)
        return


def smtp_send_email(html_content: str):
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    from email.utils import formataddr
    from datetime import datetime

    # Email configuration

    receiver_email_list = supabase_recipients_GET()
    receiver_email_list = [
        receiver["email"]
        for receiver in receiver_email_list.data
        if receiver["is_subscribed"]
    ]
    sender_email = os.getenv("SENDER_EMAIL")
    password = os.getenv("SENDER_APP_PASSWORD")
    smtp_server = "smtp.gmail.com"
    port = 587

    # Add preview text before the main HTML
    preview_text = "🍄 Your weekly mycology research highlights: Latest discoveries in fungal research and development "
    full_html = f"""
    <div style="display: none; max-height: 0px; overflow: hidden;">
        {preview_text}
    </div>
    <div style="background-color: #f9fafb; width: 100%; padding: 20px 0;">
        {html_content}
    </div>
    """

    # Connect to SMTP server once
    with smtplib.SMTP(smtp_server, port) as server:
        server.starttls()
        server.login(sender_email, password)

        # Send emails
        for receiver_email in receiver_email_list:
            try:
                # Create fresh message for each recipient
                message = MIMEMultipart("related")
                message["Subject"] = f"Weekly Digest {datetime.now().strftime('%m/%d')}"
                message["From"] = formataddr(("MycoWeekly Newsletter", sender_email))
                message["To"] = receiver_email

                # Create the body with alternative parts
                msgAlternative = MIMEMultipart("alternative")
                message.attach(msgAlternative)

                # Attach the HTML
                msgAlternative.attach(MIMEText(full_html, "html"))

                # Send the email
                server.sendmail(sender_email, receiver_email, message.as_string())
                print(f"email sent successfully to {receiver_email}")
            except smtplib.SMTPServerDisconnected:
                print("Session expired. Reconnecting...")
                smtp_send_email(html_content=html_content)
            except Exception as e:
                logging.error(f"Error sending email to {receiver_email}: {str(e)}")
