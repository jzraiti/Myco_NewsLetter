import lambda_function


def test_script_delegates_to_run_newsletter_workflow(monkeypatch):
    workflow_result = {"overall_status": "success", "steps": {}}
    calls = []

    monkeypatch.setattr(
        lambda_function,
        "run_newsletter_workflow",
        lambda: calls.append("called") or workflow_result,
    )

    result = lambda_function.script({}, {})

    assert calls == ["called"]
    assert result == workflow_result
