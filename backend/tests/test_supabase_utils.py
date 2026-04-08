import importlib
import sys


def reload_supabase_utils(monkeypatch, create_client_impl):
    monkeypatch.setattr("supabase.create_client", create_client_impl)
    sys.modules.pop("utils.supabase_utils", None)
    return importlib.import_module("utils.supabase_utils")


def test_get_supabase_client_creates_client_lazily(monkeypatch):
    calls = []
    fake_client = object()

    def fake_create_client(*, supabase_url, supabase_key):
        calls.append((supabase_url, supabase_key))
        return fake_client

    module = reload_supabase_utils(monkeypatch, fake_create_client)

    assert calls == []

    created = module.get_supabase_client()
    cached = module.get_supabase_client()

    assert created is fake_client
    assert cached is fake_client
    assert calls == [("https://example.supabase.co", "test-supabase-key")]


def test_workflow_results_exports_shared_dataclasses():
    from utils.workflow_results import DeliveryResult, UploadResult, WorkflowStepResult

    step_result = WorkflowStepResult(step="deliver", status="success")
    delivery_result = DeliveryResult(status="success", sent=[], failed=[])
    upload_result = UploadResult(status="success", bucket="bucket", key="file.html")

    assert step_result.step == "deliver"
    assert delivery_result.status == "success"
    assert upload_result.bucket == "bucket"
