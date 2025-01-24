import boto3
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

def send_email(html_content, recipients):
    ses = boto3.client('ses', region_name='us-east-1')
    for recipient in recipients:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Weekly Digest {datetime.now().strftime('%m/%d/%Y')}"
        msg['From'] = "your-email@example.com"
        msg['To'] = recipient

        part = MIMEText(html_content, 'html')
        msg.attach(part)

        ses.send_raw_email(
            Source=msg['From'],
            Destinations=[msg['To']],
            RawMessage={'Data': msg.as_string()}
        )

def upload_to_s3(html_content):
    s3 = boto3.client('s3')
    s3.put_object(Bucket='your-s3-bucket', Key='newsletter.html', Body=html_content, ContentType='text/html')