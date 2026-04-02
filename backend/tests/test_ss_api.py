from utils import ss_api


def test_fetch_bulk_articles_returns_data_on_success(monkeypatch):
    payload = {
        "data": [
            {"paperId": "paper-1", "title": "Mycorrhiza networks"},
            {"paperId": "paper-2", "title": "Fungal decomposition"},
        ]
    }

    def fake_get(url, params=None, headers=None):
        return type(
            "Response",
            (),
            {"status_code": 200, "text": "ok", "json": lambda self: payload},
        )()

    monkeypatch.setattr(ss_api.requests, "get", fake_get)

    result = ss_api.fetch_bulk_articles()

    assert result == payload["data"]


def test_fetch_bulk_articles_returns_empty_list_on_non_200(monkeypatch):
    def fake_get(url, params=None, headers=None):
        return type(
            "Response",
            (),
            {"status_code": 503, "text": "service unavailable", "json": lambda self: {}},
        )()

    monkeypatch.setattr(ss_api.requests, "get", fake_get)

    result = ss_api.fetch_bulk_articles()

    assert result == []


def test_fetch_paper_details_returns_payload(monkeypatch):
    payload = {"paperId": "paper-1", "title": "Mycorrhiza in forest soils"}

    def fake_get(url, headers=None, params=None):
        return type(
            "Response",
            (),
            {"status_code": 200, "text": "ok", "json": lambda self: payload},
        )()

    monkeypatch.setattr(ss_api.requests, "get", fake_get)

    result = ss_api.fetch_paper_details("paper-1")

    assert result == payload


def test_fetch_reference_count_by_paper_returns_reference_list(monkeypatch):
    payload = {"data": [{"citedPaper": {"paperId": "ref-1"}}]}

    def fake_get(url, headers=None):
        return type(
            "Response",
            (),
            {"status_code": 200, "text": "ok", "json": lambda self: payload},
        )()

    monkeypatch.setattr(ss_api.requests, "get", fake_get)

    result = ss_api.fetch_reference_count_by_paper("paper-1")

    assert result == payload["data"]
