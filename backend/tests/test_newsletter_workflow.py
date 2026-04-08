from datetime import datetime
from types import SimpleNamespace

from utils.workflow_results import DeliveryRecipientResult, DeliveryResult, UploadResult
from newsletter_workflow import run_newsletter_workflow


def test_run_newsletter_workflow_continues_after_partial_delivery():
    result = run_newsletter_workflow(
        fetch_articles=lambda: [{"paperId": "paper-1"}],
        select_articles=lambda articles: [
            {
                "paperId": "paper-1",
                "title": "Mycorrhiza",
                "authors": [{"name": "Ada"}, {"name": "Grace"}],
                "llm_summary": "Fungi connect roots.",
            }
        ],
        render_html=lambda articles: "<html>newsletter</html>",
        send_email=lambda html: DeliveryResult(
            status="partial",
            sent=[DeliveryRecipientResult(email="reader1@example.com", status="sent")],
            failed=[DeliveryRecipientResult(email="reader2@example.com", status="failed", error="bounce")],
        ),
        upload_html=lambda html, now=None: UploadResult(
            status="success",
            bucket="phase-three",
            key="04-08-2026.html",
            url="https://phase-three.s3.amazonaws.com/04-08-2026.html",
        ),
        persist_newsletter=lambda payload: SimpleNamespace(error=None),
        now_factory=lambda: datetime(2026, 4, 8),
    )

    assert result["overall_status"] == "success"
    assert result["steps"]["deliver"].status == "partial"
    assert result["steps"]["upload"].status == "success"
    assert result["steps"]["persist"].status == "success"


def test_run_newsletter_workflow_returns_named_step_results_on_happy_path():
    result = run_newsletter_workflow(
        fetch_articles=lambda: [{"paperId": "paper-1"}],
        select_articles=lambda articles: [{"paperId": "paper-1", "title": "Mycorrhiza", "authors": [], "llm_summary": "summary"}],
        render_html=lambda articles: "<html>newsletter</html>",
        send_email=lambda html: DeliveryResult(status="success", sent=[], failed=[]),
        upload_html=lambda html, now=None: UploadResult(status="success", bucket="bucket", key="04-08-2026.html", url="https://bucket.s3.amazonaws.com/04-08-2026.html"),
        persist_newsletter=lambda payload: SimpleNamespace(error=None),
        now_factory=lambda: datetime(2026, 4, 8),
    )

    assert list(result["steps"].keys()) == ["select", "render", "deliver", "upload", "persist"]
    assert result["overall_status"] == "success"


def test_run_newsletter_workflow_skips_after_empty_selection():
    result = run_newsletter_workflow(
        fetch_articles=lambda: [{"paperId": "paper-1"}],
        select_articles=lambda articles: [],
    )

    assert result["overall_status"] == "success"
    assert result["steps"]["select"].status == "success"
    assert result["steps"]["render"].status == "skipped"
    assert result["steps"]["deliver"].status == "skipped"
    assert result["steps"]["upload"].status == "skipped"
    assert result["steps"]["persist"].status == "skipped"


def test_run_newsletter_workflow_stops_after_render_failure():
    result = run_newsletter_workflow(
        fetch_articles=lambda: [{"paperId": "paper-1"}],
        select_articles=lambda articles: [{"paperId": "paper-1", "title": "Mycorrhiza", "authors": [], "llm_summary": "summary"}],
        render_html=lambda articles: (_ for _ in ()).throw(RuntimeError("render failed")),
    )

    assert result["overall_status"] == "failed"
    assert result["steps"]["render"].status == "failed"
    assert result["steps"]["deliver"].status == "skipped"
    assert result["steps"]["upload"].status == "skipped"
    assert result["steps"]["persist"].status == "skipped"


def test_run_newsletter_workflow_stops_before_persist_on_upload_failure():
    result = run_newsletter_workflow(
        fetch_articles=lambda: [{"paperId": "paper-1"}],
        select_articles=lambda articles: [{"paperId": "paper-1", "title": "Mycorrhiza", "authors": [], "llm_summary": "summary"}],
        render_html=lambda articles: "<html>newsletter</html>",
        send_email=lambda html: DeliveryResult(status="success", sent=[], failed=[]),
        upload_html=lambda html, now=None: UploadResult(status="failed", bucket="bucket", key="04-08-2026.html", error="upload failed"),
    )

    assert result["overall_status"] == "failed"
    assert result["steps"]["upload"].status == "failed"
    assert result["steps"]["upload"].error == "upload failed"
    assert result["steps"]["persist"].status == "skipped"


def test_run_newsletter_workflow_fails_on_persist_failure():
    result = run_newsletter_workflow(
        fetch_articles=lambda: [{"paperId": "paper-1"}],
        select_articles=lambda articles: [{"paperId": "paper-1", "title": "Mycorrhiza", "authors": [], "llm_summary": "summary"}],
        render_html=lambda articles: "<html>newsletter</html>",
        send_email=lambda html: DeliveryResult(status="success", sent=[], failed=[]),
        upload_html=lambda html, now=None: UploadResult(status="success", bucket="bucket", key="04-08-2026.html", url="https://bucket.s3.amazonaws.com/04-08-2026.html"),
        persist_newsletter=lambda payload: SimpleNamespace(error="persist failed"),
        now_factory=lambda: datetime(2026, 4, 8),
    )

    assert result["overall_status"] == "failed"
    assert result["steps"]["persist"].status == "failed"
    assert result["steps"]["persist"].error == "persist failed"
