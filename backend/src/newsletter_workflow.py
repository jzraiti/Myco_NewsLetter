from dataclasses import asdict
from datetime import datetime

import markdown

from utils.article_selection_service import article_selection_JUFO
from utils.aws_utils import upload_newsletter_html
from utils.email_utils import render_template, send_newsletter_email
from utils.ss_api import fetch_bulk_articles
from utils.supabase_utils import supabase_newsletters_POST
from utils.workflow_results import UploadResult, WorkflowStepResult


def _normalize_articles(articles: list[dict]) -> list[dict]:
    normalized = []
    for article in articles:
        article_copy = dict(article)
        authors = [author.get("name") for author in article_copy.get("authors", [])]
        authors = [author for author in authors if author]
        article_copy["authors"] = ", ".join(authors) if authors else "Unknown"
        if article_copy.get("llm_summary"):
            article_copy["llm_summary"] = markdown.markdown(article_copy["llm_summary"])
        normalized.append(article_copy)
    return normalized


def _make_persist_payload(now: datetime, upload_result: UploadResult) -> dict:
    return {
        "name": upload_result.key,
        "link": upload_result.url,
    }


def run_newsletter_workflow(
    fetch_articles=fetch_bulk_articles,
    select_articles=article_selection_JUFO,
    render_html=render_template,
    send_email=send_newsletter_email,
    upload_html=upload_newsletter_html,
    persist_newsletter=supabase_newsletters_POST,
    now_factory=datetime.now,
):
    steps = {}

    try:
        fetched_articles = fetch_articles()
        selected_articles = select_articles(fetched_articles)
        steps["select"] = WorkflowStepResult(step="select", status="success", payload=selected_articles)
    except Exception as e:
        steps["select"] = WorkflowStepResult(step="select", status="failed", error=str(e))
        for step in ["render", "deliver", "upload", "persist"]:
            steps[step] = WorkflowStepResult(step=step, status="skipped")
        return {"steps": steps, "overall_status": "failed"}

    if not selected_articles:
        for step in ["render", "deliver", "upload", "persist"]:
            steps[step] = WorkflowStepResult(step=step, status="skipped")
        return {"steps": steps, "overall_status": "success"}

    normalized_articles = _normalize_articles(selected_articles)

    try:
        email_html = render_html(normalized_articles)
        steps["render"] = WorkflowStepResult(step="render", status="success", payload=email_html)
    except Exception as e:
        steps["render"] = WorkflowStepResult(step="render", status="failed", error=str(e))
        for step in ["deliver", "upload", "persist"]:
            steps[step] = WorkflowStepResult(step=step, status="skipped")
        return {"steps": steps, "overall_status": "failed"}

    delivery_result = send_email(email_html)
    steps["deliver"] = WorkflowStepResult(
        step="deliver",
        status=delivery_result.status,
        payload=delivery_result,
        details={
            "sent": [asdict(item) for item in delivery_result.sent],
            "failed": [asdict(item) for item in delivery_result.failed],
        },
    )

    now_value = now_factory()
    upload_result = upload_html(email_html, now=now_value)
    steps["upload"] = WorkflowStepResult(
        step="upload",
        status=upload_result.status,
        payload=upload_result,
        error=upload_result.error,
        details={"bucket": upload_result.bucket, "key": upload_result.key, "url": upload_result.url},
    )
    if upload_result.status == "failed":
        steps["persist"] = WorkflowStepResult(step="persist", status="skipped")
        return {"steps": steps, "overall_status": "failed"}

    persist_payload = _make_persist_payload(now_value, upload_result)
    try:
        persist_result = persist_newsletter(persist_payload)
        persist_error = getattr(persist_result, "error", None)
        if persist_error:
            raise Exception(str(persist_error))
        steps["persist"] = WorkflowStepResult(step="persist", status="success", payload=persist_payload)
    except Exception as e:
        steps["persist"] = WorkflowStepResult(step="persist", status="failed", error=str(e), payload=persist_payload)
        return {"steps": steps, "overall_status": "failed"}

    return {"steps": steps, "overall_status": "success"}
