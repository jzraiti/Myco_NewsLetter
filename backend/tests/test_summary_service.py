from types import SimpleNamespace

from utils.summary_service import generate_gpt_paper_summary
from utils.venue_service import extract_favicon, fetch_venue_info


def test_generate_gpt_paper_summary_uses_injected_client():
    calls = []

    class FakeCompletions:
        def create(self, **kwargs):
            calls.append(kwargs)
            return SimpleNamespace(
                choices=[SimpleNamespace(message=SimpleNamespace(content="Short summary"))]
            )

    fake_client = SimpleNamespace(chat=SimpleNamespace(completions=FakeCompletions()))

    result = generate_gpt_paper_summary("Fungal Ecology", "Abstract text", client=fake_client)

    assert result == "Short summary"
    assert calls[0]["model"] == "gpt-4o"
    assert calls[0]["messages"][0]["role"] == "system"


def test_fetch_venue_info_returns_none_when_doi_missing():
    assert fetch_venue_info({"paperId": "paper-1", "externalIds": {}}) == (None, None)


def test_fetch_venue_info_returns_redirected_journal_and_favicon():
    def fake_get(url, headers=None, allow_redirects=True, timeout=None):
        if url.startswith("https://doi.org/"):
            return SimpleNamespace(url="https://journal.example.com/article", text="", raise_for_status=lambda: None)
        return SimpleNamespace(
            text='<html><head><link rel="icon" href="/favicon.ico"></head></html>',
            raise_for_status=lambda: None,
        )

    result = fetch_venue_info({"paperId": "paper-1", "externalIds": {"DOI": "10.1000/test"}}, request_get=fake_get)

    assert result == ("https://journal.example.com/article", "https://journal.example.com/favicon.ico")


def test_extract_favicon_returns_none_when_request_fails():
    def fake_get(url, headers=None):
        raise RuntimeError("network down")

    assert extract_favicon("https://journal.example.com", request_get=fake_get) is None
