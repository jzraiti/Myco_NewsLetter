from types import SimpleNamespace

from utils.article_selection_service import article_selection_JUFO


def test_article_selection_jufo_uses_tldr_fallback():
    articles = [
        {"paperId": "paper-1", "title": "No Abstract", "abstract": None, "venue": "Journal A", "llm_summary": None},
    ]
    journals = [{"Name": "Journal A", "Level": 3, "panels": "1"}]

    selected = article_selection_JUFO(
        [{"paperId": "paper-1", "title": "No Abstract", "venue": "Journal A"}],
        supabase_articles_post=lambda payload: SimpleNamespace(error=None, data=payload),
        supabase_query_all=lambda table: articles if table == "ss_articles" else journals,
        fetch_paper_details=lambda paper_id: {"tldr": {"text": "Fallback summary source"}},
        summary_generator=lambda title, content: f"summary:{content}",
    )

    assert len(selected) == 1
    assert selected[0]["llm_summary"] == "summary:Fallback summary source"


def test_article_selection_jufo_skips_summary_failures():
    articles = [
        {"paperId": "paper-1", "title": "Bad Article", "abstract": "bad", "venue": "Journal A", "llm_summary": None},
        {"paperId": "paper-2", "title": "Good Article", "abstract": "good", "venue": "Journal A", "llm_summary": None},
    ]
    journals = [{"Name": "Journal A", "Level": 3, "panels": "1"}]

    def fake_summary(title, content):
        if title == "Bad Article":
            raise RuntimeError("summary failed")
        return f"summary:{content}"

    selected = article_selection_JUFO(
        [
            {"paperId": "paper-1", "title": "Bad Article", "venue": "Journal A"},
            {"paperId": "paper-2", "title": "Good Article", "venue": "Journal A"},
        ],
        supabase_articles_post=lambda payload: SimpleNamespace(error=None, data=payload),
        supabase_query_all=lambda table: articles if table == "ss_articles" else journals,
        fetch_paper_details=lambda paper_id: {},
        summary_generator=fake_summary,
    )

    assert len(selected) == 1
    assert selected[0]["paperId"] == "paper-2"


def test_article_selection_jufo_orders_by_level_then_panels_and_caps_at_four():
    seeded_articles = [
        {"paperId": "paper-a", "title": "A", "abstract": "A", "venue": "Journal A", "llm_summary": None},
        {"paperId": "paper-b", "title": "B", "abstract": "B", "venue": "Journal B", "llm_summary": None},
        {"paperId": "paper-c", "title": "C", "abstract": "C", "venue": "Journal C", "llm_summary": None},
        {"paperId": "paper-d", "title": "D", "abstract": "D", "venue": "Journal D", "llm_summary": None},
        {"paperId": "paper-e", "title": "E", "abstract": "E", "venue": "Journal E", "llm_summary": None},
    ]
    journals = [
        {"Name": "Journal A", "Level": 3, "panels": "2"},
        {"Name": "Journal B", "Level": 3, "panels": "1"},
        {"Name": "Journal C", "Level": 2, "panels": "3"},
        {"Name": "Journal D", "Level": 1, "panels": "1"},
        {"Name": "Journal E", "Level": 0, "panels": "1"},
    ]

    selected = article_selection_JUFO(
        [{"paperId": item["paperId"], "title": item["title"], "venue": item["venue"]} for item in seeded_articles],
        supabase_articles_post=lambda payload: SimpleNamespace(error=None, data=payload),
        supabase_query_all=lambda table: seeded_articles if table == "ss_articles" else journals,
        fetch_paper_details=lambda paper_id: {},
        summary_generator=lambda title, content: f"summary:{title}",
    )

    assert [article["paperId"] for article in selected] == ["paper-b", "paper-a", "paper-c", "paper-d"]
