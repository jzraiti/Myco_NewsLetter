import boto3
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
load_dotenv()

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")


def upload_to_s3(html_content):
    from datetime import datetime

    try:
        # Initialize S3 client
        s3 = boto3.client(
            "s3", aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY
        )

        # Generate base key from date
        base_key = datetime.now().strftime("%m-%d-%Y")
        html_key = f"{base_key}.html"

        # Upload HTML
        s3.put_object(
            Bucket="myconews",
            Key=html_key,
            Body=html_content.encode("utf-8"),
            ContentType="text/html",
        )
        logging.info(f"Successfully uploaded html file {html_key} to S3!")

    except Exception as e:
        logging.error(f"Error uploading to S3: {e}")
        raise e


def aws_ses_send_email():
    import boto3
    from botocore.exceptions import ClientError

    SENDER = os.getenv("EMAIL_SENDER")
    RECIPIENT = "andrewkkchen@gmail.com"
    AWS_REGION = "us-west-1"
    SUBJECT = "Amazon SES Test (SDK for Python)"

    # The email body for recipients with non-HTML email clients.
    BODY_TEXT = (
        "Amazon SES Test (Python)\r\n"
        "This email was sent with Amazon SES using the "
        "AWS SDK for Python (Boto)."
    )

    BODY_HTML = """<html>
    <head></head>
    <body>
    <h1>Amazon SES Test (SDK for Python)</h1>
    <p>This email was sent with
        <a href='https://aws.amazon.com/ses/'>Amazon SES</a> using the
        <a href='https://aws.amazon.com/sdk-for-python/'>
        AWS SDK for Python (Boto)</a>.</p>
    </body>
    </html>
                """

    CHARSET = "UTF-8"

    session = boto3.Session(
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY,
    )
    client = session.client(service_name="ses", region_name=AWS_REGION)

    try:
        response = client.send_email(
            Destination={
                "ToAddresses": [
                    RECIPIENT,
                ],
            },
            Message={
                "Body": {
                    "Html": {
                        "Charset": CHARSET,
                        "Data": BODY_HTML,
                    },
                    "Text": {
                        "Charset": CHARSET,
                        "Data": BODY_TEXT,
                    },
                },
                "Subject": {
                    "Charset": CHARSET,
                    "Data": SUBJECT,
                },
            },
            Source=SENDER,
        )
    except ClientError as e:
        logging.error(e.response["Error"]["Message"])
    else:
        logging.info("Email sent! Message ID:"),
        print(response["MessageId"])
