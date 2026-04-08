import boto3
from dotenv import load_dotenv
import os
import logging

from utils.workflow_results import UploadResult

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
load_dotenv()

NEWSLETTER_BUCKET = os.getenv("NEWSLETTER_BUCKET")


def upload_newsletter_html(
    html_content: str,
    bucket_name: str | None = None,
    now=None,
    s3_client=None,
) -> UploadResult:
    from datetime import datetime

    bucket = bucket_name or NEWSLETTER_BUCKET
    current_time = now or datetime.now()
    key = f"{current_time.strftime('%m-%d-%Y')}.html"
    active_client = s3_client or boto3.client("s3")

    try:
        active_client.put_object(
            Bucket=bucket,
            Key=key,
            Body=html_content.encode("utf-8"),
            ContentType="text/html",
        )
        logging.info(
            f"Successfully uploaded html file {key} to S3 bucket {bucket}!"
        )
        return UploadResult(
            status="success",
            bucket=bucket,
            key=key,
            url=f"https://{bucket}.s3.amazonaws.com/{key}",
        )
    except Exception as e:
        logging.error(f"Error uploading to S3: {e}")
        return UploadResult(status="failed", bucket=bucket, key=key, error=str(e))


def upload_to_s3(html_content):
    return upload_newsletter_html(html_content)
