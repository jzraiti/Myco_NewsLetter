import os
import dotenv
from extract_favicon import from_url
import pandas as pd
import logging
from openai import OpenAI
from jinja2 import Environment, FileSystemLoader
import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup

from utils.supabase_utils import (
    supabase_articles_GET,
    supabase_articles_POST,
    supabase_journals_GET,
    supabase_recipients_GET,
)

from utils.ss_api import fetch_bulk_articles

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
dotenv.load_dotenv()

NUMBER_OF_ARTICLES = 4

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
                "content": "You are a ChatGPT, a helpful assistant and expert in Mycology and fungi. Your specialty is crafting professional and concise sneak peeks for mycology articles written by researchers from all around the world, tailored for a newsletter. Highlight the most intriguing or unexpected aspects of the research while maintaining scientific accuracy and a tone that sparks curiosity.",
            },
            {
                "role": "user",
                "content": f'As an informed observer, write a compelling and informational sneak peek for this research paper titled "{title}" based on this abstracted summary: {content}. Focus on making it unique and engaging for a research mycology audience, do not write the article in the first person point of view, and keep the length under 300 characters.',
            },
        ],
    )

    return completion.choices[0].message.content


def generate_summary(article: dict) -> str:
    """Generates a summary of the given article using GPT-4o-mini."""
    logging.info(f"Generating summary for article: {article['paperId']}")
    article = article.to_dict()
    generated_content: str = generate_gpt_paper_summary(
        title=article["title"], content=article["abstract"]
    )
    return generated_content


def extract_favicon(url: str) -> str:
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
        }

        # Fetch the webpage
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        # Parse HTML
        soup = BeautifulSoup(response.text, "html.parser")

        # Look for favicon in different possible locations
        favicon_link = soup.find("link", rel=["icon", "shortcut icon"])
        if favicon_link and favicon_link.get("href"):
            # Construct the full favicon URL
            favicon_url = urljoin(url, favicon_link["href"])
            return favicon_url
        else:
            logging.info(f"No favicon found for: {url}")
            return None

    except Exception as e:
        logging.error(f"Error extracting favicon: {e}")
        return None


def fetch_venue_info(article: dict) -> str:
    """Parses through the Semantic Scholar webpage and fetches the journal link and favicon."""

    try:
        # Fetch the webpage
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        doi_url = f"https://doi.org/{article["externalIds"]["DOI"]}"

        # Follow DOI redirect to get actual journal URL
        doi_response = requests.get(doi_url, headers=headers, allow_redirects=True)
        journal_url = doi_response.url

        # Extract base domain from journal URL
        parsed_url = urlparse(journal_url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"

        favicon_url = extract_favicon(base_url)
        logging.info(
            f"Successfully fetched venue info for article: {article['paperId']}"
        )
        return journal_url, favicon_url

    except Exception as e:
        logging.error(f"Error fetching venue info for article: {str(e)}")
        return None, None


def article_selection(data: list) -> dict:
    """Selects top articles from the given data and generates summaries for them.

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

    if cited_papers < NUMBER_OF_ARTICLES:
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
            .head(NUMBER_OF_ARTICLES - cited_papers)
            .copy()
        )

        # Combine cited and h5-index based articles
        selected_articles = pd.concat([selected_articles, remaining_articles])

    # Generate summaries and fetch venue info
    if not selected_articles.empty:
        for index, article in selected_articles.iterrows():
            journal_url, favicon_url = fetch_venue_info(article)
            llm_summary = generate_summary(article)
            if journal_url:
                selected_articles.at[index, "url"] = journal_url
            if favicon_url:
                selected_articles.at[index, "favicon"] = favicon_url
            if llm_summary:
                selected_articles.at[index, "llm_summary"] = llm_summary

        # Update the df with summaries and update supabase table
        df.update(selected_articles)
        response = supabase_articles_POST(df.to_dict(orient="records"))

    # Return 1: all processed articles, 2: top articles
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


def smtp_send_email(html_content: str):
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    from email.utils import formataddr
    from datetime import datetime

    # Email configuration

    receiver_email_list = supabase_recipients_GET()
    receiver_email_list = [receiver["email"] for receiver in receiver_email_list.data]
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
            except Exception as e:
                logging.error(f"Error sending email to {receiver_email}: {str(e)}")
