import lambda_function


def test_script_runs_delivery_pipeline_when_articles_are_selected(monkeypatch):
    selected_articles = [
        {
            "title": "Mycorrhiza in prairie soils",
            "authors": [{"name": "Ada Lovelace"}, {"name": "Grace Hopper"}],
            "llm_summary": "Fungi connect root systems.",
        }
    ]
    calls = {
        "render": [],
        "send": [],
        "upload": [],
        "persist": [],
    }

    monkeypatch.setenv("NEWSLETTER_BUCKET", "phase-one-bucket")
    monkeypatch.setattr(lambda_function, "fetch_bulk_articles", lambda: [{"paperId": "paper-1"}])
    monkeypatch.setattr(lambda_function, "article_selection_JUFO", lambda data: selected_articles)
    monkeypatch.setattr(lambda_function.markdown, "markdown", lambda text: f"<p>{text}</p>")
    monkeypatch.setattr(
        lambda_function,
        "render_template",
        lambda articles: calls["render"].append(articles) or "<html>newsletter</html>",
    )
    monkeypatch.setattr(
        lambda_function,
        "resend_send_email",
        lambda html: calls["send"].append(html),
    )
    monkeypatch.setattr(
        lambda_function,
        "upload_to_s3",
        lambda html: calls["upload"].append(html),
    )
    monkeypatch.setattr(
        lambda_function,
        "supabase_newsletters_POST",
        lambda payload: calls["persist"].append(payload),
    )

    lambda_function.script({}, {})

    assert len(calls["render"]) == 1
    assert calls["render"][0][0]["authors"] == "Ada Lovelace, Grace Hopper"
    assert calls["render"][0][0]["llm_summary"] == "<p>Fungi connect root systems.</p>"
    assert calls["send"] == ["<html>newsletter</html>"]
    assert calls["upload"] == ["<html>newsletter</html>"]
    assert len(calls["persist"]) == 1
    assert calls["persist"][0]["name"].endswith(".html")
    assert calls["persist"][0]["link"].startswith("https://phase-one-bucket.s3.amazonaws.com/")


def test_script_skips_delivery_pipeline_when_no_articles_are_selected(monkeypatch):
    calls = {
        "render": 0,
        "send": 0,
        "upload": 0,
        "persist": 0,
    }

    monkeypatch.setattr(lambda_function, "fetch_bulk_articles", lambda: [{"paperId": "paper-1"}])
    monkeypatch.setattr(lambda_function, "article_selection_JUFO", lambda data: [])
    monkeypatch.setattr(lambda_function, "render_template", lambda articles: calls.__setitem__("render", calls["render"] + 1))
    monkeypatch.setattr(lambda_function, "resend_send_email", lambda html: calls.__setitem__("send", calls["send"] + 1))
    monkeypatch.setattr(lambda_function, "upload_to_s3", lambda html: calls.__setitem__("upload", calls["upload"] + 1))
    monkeypatch.setattr(lambda_function, "supabase_newsletters_POST", lambda payload: calls.__setitem__("persist", calls["persist"] + 1))

    lambda_function.script({}, {})

    assert calls == {"render": 0, "send": 0, "upload": 0, "persist": 0}
