import os
import dotenv
import pandas as pd
import logging
from openai import OpenAI
from jinja2 import Environment, FileSystemLoader

from utils.supabase_utils import (
    supabase_articles_GET,
    supabase_articles_POST,
    supabase_journals_GET,
)

from utils.ss_api import fetch_bulk_articles

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
dotenv.load_dotenv()


def generate_gpt_paper_summary(title: str, content: str) -> str:
    """Generates a summary of a research paper using GPT-4o-mini.

    Args:
        title (str): The title of the research paper.
        content (str): The abstract of the research paper.
        other_summaries (str): Other summaries generated for redundancy check.
    """

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=OPENAI_API_KEY)
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=1,
        messages=[
            {
                "role": "system",
                "content": "You are a ChatGPT, a helpful assistant and expert in Mycology and fungi. Your specialty is crafting professional, concise, and engaging sneak peeks for mycology articles written by researchers from all around the world, tailored for a newsletter. Highlight the most intriguing or unexpected aspects of the research while maintaining scientific accuracy and a tone that sparks curiosity.",
            },
            {
                "role": "user",
                "content": f'As an informed observer, write a compelling sneak peek for this research paper titled "{title}" based on this abstracted summary: {content}. Focus on making it unique and engaging for a research mycology audience, and keep the length under 300 characters.',
            },
        ],
    )

    return completion.choices[0].message.content


def generate_summaries(selected_articles: pd.DataFrame):
    for index, article in selected_articles.iterrows():
        article_dict = article.to_dict()
        generated_content: str = generate_gpt_paper_summary(
            title=article_dict["title"], content=article_dict["abstract"]
        )
        selected_articles.at[index, "llm_summary"] = generated_content

    return selected_articles


def article_selection(data: list) -> dict:
    """Selects the top 5 articles from the given data and generates summaries for them.

    Args:
        data (list): The list of articles to process.
    """

    df = pd.DataFrame(data)

    # Data cleaning
    df = df.map(lambda x: tuple(x) if isinstance(x, list) else x)
    df = df.drop_duplicates(subset=["paperId"])

    # Sorting by citation count (redundancy check)
    df = df.sort_values(by="citationCount", ascending=False)

    # Post to Supabase to update duplicates
    response = supabase_articles_POST(df.to_dict(orient="records"))
    if hasattr(response, "error") and response.error:
        return {
            "success": False,
            "error": response.error,
            "message": "Failed to upsert data",
        }

    # Fetching updated data from Supabase and filtering
    response = supabase_articles_GET()
    if hasattr(response, "error") and response.error:
        return {
            "success": False,
            "error": response.error,
            "message": "Failed to fetch data",
        }

    df = pd.DataFrame(response.data)
    df = df.sort_values(by="citationCount", ascending=False)
    df = df[df["abstract"].notnull()]
    df = df[df["llm_summary"].isnull()]

    # Selecting articles with citations first
    selected_articles = df[df["citationCount"] > 0].head(5).copy()
    cited_papers = len(selected_articles)

    if cited_papers < 5:
        # Fetch journal h5-index data
        journals = supabase_journals_GET()

        # Create a mapping of journal titles to h5-index
        journal_h5_index = {j["title"]: j["h5-index"] for j in journals.data}

        # Add h5-index to remaining articles
        remaining_df = df[df["citationCount"] == 0].copy()
        remaining_df["h5-index"] = remaining_df["venue"].map(journal_h5_index)

        # Sort by h5-index and select remaining needed articles
        remaining_articles = (
            remaining_df.sort_values(by="h5-index", ascending=False)
            .head(5 - cited_papers)
            .copy()
        )

        # Combine cited and h5-index based articles
        selected_articles = pd.concat([selected_articles, remaining_articles])

    # Generate summaries for selected articles
    # selected_articles = generate_summaries(selected_articles)

    # Update the df with summaries and update supabase table
    df.update(selected_articles)
    response = supabase_articles_POST(df.to_dict(orient="records"))

    # Return 1: all processed articles, 2: top 5 articles
    return df.to_dict(orient="records"), selected_articles.to_dict(orient="records")


def render_template(articles: list[dict], unsubscribe_link: str) -> str:
    env = Environment(loader=FileSystemLoader("templates"))
    template = env.get_template("email.html")
    return template.render(articles=articles, unsubscribe_link=unsubscribe_link)


def resend_send_email():
    import resend

    resend.api_key = os.getenv("RESEND_API_KEY")

    try:
        r = resend.Emails.send(
            {
                "from": "myconewsletter@mycoweekly.click",
                "to": "achen266@wisc.edu",
                "subject": "Hello World",
                "html": "<p>Congrats on sending your <strong>first email</strong>!</p>",
            }
        )
        print("Email sent successfully!")
    except Exception as e:
        print(e)
        return


def smtp_send_email():
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    from email.utils import formataddr

    # Email configuration
    sender_email = os.getenv("SENDER_EMAIL")
    receiver_email = "andrewkkchen@gmail.com"
    password = os.getenv("SENDER_APP_PASSWORD")
    smtp_server = "smtp.gmail.com"
    port = 587

    # Create message
    message = MIMEMultipart("alternative")
    message["Subject"] = "Weekly Digest"
    message["From"] = formataddr(("MycoWeekly", sender_email))
    message["To"] = receiver_email

    # HTML content
    html = ""
    with open("test_email.html") as f:
        html = f.read()

    # Attach HTML content
    message.attach(MIMEText(html, "html"))

    # Send email
    with smtplib.SMTP(smtp_server, port) as server:
        server.starttls()
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())

    print("Email sent successfully")
