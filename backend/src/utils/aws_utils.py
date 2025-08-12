import boto3
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
load_dotenv()

NEWSLETTER_BUCKET = os.getenv("NEWSLETTER_BUCKET")


def upload_to_s3(html_content):
    from datetime import datetime

    try:
        s3 = boto3.client("s3")
        base_key = datetime.now().strftime("%m-%d-%Y")
        html_key = f"{base_key}.html"
        s3.put_object(
            Bucket=NEWSLETTER_BUCKET,
            Key=html_key,
            Body=html_content.encode("utf-8"),
            ContentType="text/html",
        )
        logging.info(
            f"Successfully uploaded html file {html_key} to S3 bucket {NEWSLETTER_BUCKET}!"
        )
    except Exception as e:
        logging.error(f"Error uploading to S3: {e}")
        raise e
