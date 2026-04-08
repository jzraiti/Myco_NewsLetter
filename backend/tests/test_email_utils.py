from datetime import datetime
from types import SimpleNamespace

from utils.email_utils import send_newsletter_email


def make_resend_client(failing=None):
    failing = failing or set()
    sent_payloads = []

    class FakeEmails:
        def send(self, payload):
            sent_payloads.append(payload)
            if payload["to"] in failing:
                raise RuntimeError(f"failed:{payload['to']}")
            return {"id": f"msg-{payload['to']}"}

    return SimpleNamespace(Emails=FakeEmails()), sent_payloads


def test_send_newsletter_email_returns_success_when_all_recipients_send():
    resend_client, payloads = make_resend_client()

    result = send_newsletter_email(
        "<html>newsletter</html>",
        recipients=["reader1@example.com", "reader2@example.com"],
        resend_client=resend_client,
        now=datetime(2026, 4, 8),
    )

    assert result.status == "success"
    assert [item.email for item in result.sent] == ["reader1@example.com", "reader2@example.com"]
    assert result.failed == []
    assert payloads[0]["subject"] == "Weekly Digest 04/08"


def test_send_newsletter_email_returns_partial_result():
    resend_client, payloads = make_resend_client({"reader2@example.com"})

    result = send_newsletter_email(
        "<html>newsletter</html>",
        recipients=["reader1@example.com", "reader2@example.com"],
        resend_client=resend_client,
        now=datetime(2026, 4, 8),
    )

    assert result.status == "partial"
    assert [item.email for item in result.sent] == ["reader1@example.com"]
    assert [item.email for item in result.failed] == ["reader2@example.com"]
    assert payloads[0]["from"] == "MycoWeekly Newsletter <myconewsletter@mycoweekly.org>"


def test_send_newsletter_email_returns_failed_when_all_recipients_fail():
    resend_client, _ = make_resend_client({"reader1@example.com", "reader2@example.com"})

    result = send_newsletter_email(
        "<html>newsletter</html>",
        recipients=["reader1@example.com", "reader2@example.com"],
        resend_client=resend_client,
        now=datetime(2026, 4, 8),
    )

    assert result.status == "failed"
    assert result.sent == []
    assert [item.email for item in result.failed] == ["reader1@example.com", "reader2@example.com"]


def test_send_newsletter_email_uses_recipient_loader_when_recipients_missing():
    resend_client, _ = make_resend_client()

    def recipient_loader():
        return SimpleNamespace(
            data=[
                {"email": "reader1@example.com", "is_subscribed": True},
                {"email": "reader2@example.com", "is_subscribed": False},
            ]
        )

    result = send_newsletter_email(
        "<html>newsletter</html>",
        recipient_loader=recipient_loader,
        resend_client=resend_client,
        now=datetime(2026, 4, 8),
    )

    assert result.status == "success"
    assert [item.email for item in result.sent] == ["reader1@example.com"]
