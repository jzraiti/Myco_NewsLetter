import importlib
import sys


class FakeExecuteResult:
    def __init__(self, data):
        self.data = data


class FakeQuery:
    def __init__(self, table, operation, data_store):
        self.table = table
        self.operation = operation
        self.data_store = data_store
        self.range_args = None

    def execute(self):
        result = self.data_store[(self.table, self.operation)]
        if callable(result):
            return result(self)
        return result

    def range(self, start, end):
        self.range_args = (start, end)
        self.operation = "range"
        self.data_store.setdefault("calls", []).append((self.table, "range", start, end))
        return self


class FakeTable:
    def __init__(self, name, data_store, calls):
        self.name = name
        self.data_store = data_store
        self.calls = calls

    def select(self, columns):
        self.calls.append((self.name, "select", columns))
        return FakeQuery(self.name, "select", self.data_store)

    def insert(self, payload):
        self.calls.append((self.name, "insert", payload))
        return FakeQuery(self.name, "insert", self.data_store)

    def upsert(self, payload, on_conflict=None):
        self.calls.append((self.name, "upsert", payload, on_conflict))
        return FakeQuery(self.name, "upsert", self.data_store)

    def range(self, start, end):
        self.calls.append((self.name, "range", start, end))
        query = FakeQuery(self.name, "range", self.data_store)
        query.range_args = (start, end)
        return query


class FakeClient:
    def __init__(self, data_store, calls):
        self.data_store = data_store
        self.calls = calls

    def table(self, name):
        self.calls.append(("table", name))
        return FakeTable(name, self.data_store, self.calls)


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


def test_supabase_articles_post_uses_injected_client(monkeypatch):
    module = reload_supabase_utils(monkeypatch, lambda **kwargs: object())
    calls = []
    fake_client = FakeClient(
        {
            ("scholar_journals", "select"): FakeExecuteResult([{"title": "Known Journal"}]),
            ("scholar_journals", "insert"): FakeExecuteResult([]),
            ("ss_articles", "upsert"): FakeExecuteResult([{"paperId": "paper-1"}]),
        },
        calls,
    )

    result = module.supabase_articles_POST(
        [
            {"paperId": "paper-1", "venue": "Known Journal", "authors": ["Ada"]},
            {"paperId": "paper-1", "venue": "Known Journal", "authors": ["Ada"]},
            {"paperId": "paper-2", "venue": "New Journal", "authors": ["Grace"]},
        ],
        client=fake_client,
    )

    assert result.data == [{"paperId": "paper-1"}]
    assert ("scholar_journals", "insert", [{"title": "New Journal"}]) in calls

    upsert_call = next(call for call in calls if call[0] == "ss_articles" and call[1] == "upsert")
    upsert_payload = upsert_call[2]
    assert len(upsert_payload) == 2
    assert {item["paperId"] for item in upsert_payload} == {"paper-1", "paper-2"}
    assert upsert_call[3] == "paperId"


def test_supabase_newsletters_and_recipients_use_injected_client(monkeypatch):
    module = reload_supabase_utils(monkeypatch, lambda **kwargs: object())
    calls = []
    fake_client = FakeClient(
        {
            ("newsletters", "upsert"): FakeExecuteResult([{"name": "04-06-2026.html"}]),
            ("recipients", "select"): FakeExecuteResult([{"email": "reader@example.com", "is_subscribed": True}]),
        },
        calls,
    )

    persisted = module.supabase_newsletters_POST({"name": "04-06-2026.html"}, client=fake_client)
    recipients = module.supabase_recipients_GET(client=fake_client)

    assert persisted.data == [{"name": "04-06-2026.html"}]
    assert recipients.data == [{"email": "reader@example.com", "is_subscribed": True}]
    assert ("newsletters", "upsert", {"name": "04-06-2026.html"}, None) in calls
    assert ("recipients", "select", "*") in calls


def test_supabase_query_all_paginates_until_short_page(monkeypatch):
    module = reload_supabase_utils(monkeypatch, lambda **kwargs: object())
    calls = []

    def paginate(query):
        start, end = query.range_args
        if start == 0 and end == 9999:
            return FakeExecuteResult([{"paperId": "paper-1"}] * 10000)
        return FakeExecuteResult([{"paperId": "paper-2"}])

    fake_client = FakeClient({("ss_articles", "range"): paginate, "calls": calls}, calls)

    result = module.supabase_query_all("ss_articles", client=fake_client)

    assert len(result) == 10001
    assert calls.count(("table", "ss_articles")) == 2
    assert ("ss_articles", "range", 0, 9999) in calls
    assert ("ss_articles", "range", 10000, 19999) in calls
