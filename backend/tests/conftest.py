import os
from types import SimpleNamespace


DEFAULT_ENV = {
    "OPENAI_API_KEY": "test-openai-key",
    "SUPABASE_KEY": "test-supabase-key",
    "SUPABASE_URL": "https://example.supabase.co",
    "RESEND_API_KEY": "test-resend-key",
    "SEMANTIC_SCHOLAR_API_KEY": "test-semantic-scholar-key",
    "SENDER_EMAIL": "sender@example.com",
    "SENDER_APP_PASSWORD": "test-app-password",
    "NEWSLETTER_BUCKET": "test-newsletters",
}


for key, value in DEFAULT_ENV.items():
    os.environ.setdefault(key, value)


def fake_response(status_code=200, json_data=None, text=""):
    payload = json_data if json_data is not None else {}

    return SimpleNamespace(
        status_code=status_code,
        text=text,
        json=lambda: payload,
    )
