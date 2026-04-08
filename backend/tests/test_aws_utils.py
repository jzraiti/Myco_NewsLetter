from datetime import datetime

from utils.aws_utils import upload_newsletter_html


class FakeS3Client:
    def __init__(self, should_raise=False):
        self.should_raise = should_raise
        self.calls = []

    def put_object(self, **kwargs):
        self.calls.append(kwargs)
        if self.should_raise:
            raise RuntimeError("s3 unavailable")


def test_upload_newsletter_html_returns_bucket_key_and_url():
    client = FakeS3Client()

    result = upload_newsletter_html(
        "<html>newsletter</html>",
        bucket_name="phase-three-bucket",
        now=datetime(2026, 4, 8),
        s3_client=client,
    )

    assert result.status == "success"
    assert result.bucket == "phase-three-bucket"
    assert result.key == "04-08-2026.html"
    assert result.url == "https://phase-three-bucket.s3.amazonaws.com/04-08-2026.html"
    assert client.calls[0]["ContentType"] == "text/html"


def test_upload_newsletter_html_returns_failed_result_on_exception():
    client = FakeS3Client(should_raise=True)

    result = upload_newsletter_html(
        "<html>newsletter</html>",
        bucket_name="phase-three-bucket",
        now=datetime(2026, 4, 8),
        s3_client=client,
    )

    assert result.status == "failed"
    assert result.bucket == "phase-three-bucket"
    assert result.key == "04-08-2026.html"
    assert result.error == "s3 unavailable"
