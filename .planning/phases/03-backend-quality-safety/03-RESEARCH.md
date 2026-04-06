# Phase 3: Backend Quality & Safety Research

**Date:** 2026-04-06
**Status:** Complete

## Objective

Determine the lowest-risk way to refactor the existing Python/AWS newsletter backend so Supabase, email, S3, and LLM-heavy paths are easier to test in isolation, responsibilities are split more clearly, and integration failures become observable step outcomes instead of implicit side effects.

## Current Codebase Findings

## Backend orchestration

- `backend/src/lambda_function.py` currently fetches articles, selects candidates, mutates article fields, renders HTML, sends emails, uploads to S3, and persists the newsletter record inside one `script()` function.
- The current orchestration path has only one visible branch: "articles selected" vs "no articles selected." Delivery, upload, and persistence failures are not modeled as named workflow outcomes.
- Existing tests in `backend/tests/test_lambda_function.py` only verify the happy path and the empty-selection path.

## Supabase coupling

- `backend/src/utils/supabase_utils.py` creates the Supabase client at import time with `create_client(...)`, which means import itself can fail before tests inject fakes.
- Supabase helpers are function-based already, which fits the user decision to add per-service adapters without a full service-layer rewrite.
- `supabase_articles_POST()` mixes deduping, journal upserts, and article upserts in one function, but the immediate risk to Phase 3 is the import-time client seam rather than re-architecting all persistence logic at once.

## Newsletter helper sprawl

- `backend/src/utils/other_utils.py` currently mixes LLM summary generation, Semantic Scholar detail fallback, favicon scraping, venue enrichment, article ranking, and Supabase persistence touchpoints in a single module.
- `article_selection_JUFO()` already contains the core newsletter-selection algorithm, but it is hard to test as an isolated unit because it reaches directly into Supabase, OpenAI, Semantic Scholar, and requests-based helpers.
- `generate_gpt_paper_summary()` and `fetch_venue_info()` are useful seams for extraction because they each have a single external dependency family (OpenAI vs HTTP scraping).

## Delivery and upload behavior

- `backend/src/utils/email_utils.py` pulls recipients from Supabase and sends one email at a time, printing failures and continuing, but it does not return a structured outcome that callers can inspect.
- `backend/src/utils/aws_utils.py` uploads the HTML file and raises raw exceptions, which makes upload failure observable only through exception handling rather than a named step result.
- Current behavior already implies the desired product rule: email failures should be isolated per recipient. Phase 3 should formalize that behavior instead of changing it.

## Testing baseline

- Phase 1 established `python backend/scripts/run_backend_tests.py` as the canonical repo-owned backend test command.
- `backend/tests/conftest.py` already provides deterministic environment defaults for Supabase, Resend, OpenAI, Semantic Scholar, and S3.
- The existing backend test style is monkeypatch-first, not fixture-heavy integration testing. Phase 3 should preserve that pattern.

## External Guidance

- Supabase Python initialization guidance shows `create_client(url, key)` as a regular runtime call, not something that must happen at import time. That makes a lazy factory + optional injected client the lowest-risk seam for testability.
- General Python dependency-injection guidance favors manual function-parameter injection for small codebases when a full DI container would be overkill. That matches the user decision to add per-service adapters rather than a rewrite.
- Resend's permissive batch-validation model formalizes the same idea Phase 3 needs for email delivery: valid sends can succeed while invalid recipients are reported separately. Even if the current code keeps one-recipient-at-a-time sending, the returned result object should separate sent vs failed recipients.
- Python orchestration patterns favor explicit step result objects (dataclasses or typed dicts) so downstream tests can assert `success`, `partial`, `failed`, and `skipped` outcomes per stage.

## Recommended Approach

## 1. Introduce a lazy Supabase adapter seam first

- Per D-01 and D-02, keep the current function-based utility style but remove import-time client creation.
- Add `get_supabase_client()` plus optional `client: Client | None = None` parameters on the exported helpers so tests can pass fakes directly.
- Add a small shared result-contract module now so later plans reuse the same step-result vocabulary instead of inventing overlapping shapes.

Why first:
- Supabase is the most cross-cutting backend dependency.
- Removing eager client setup immediately improves every downstream test seam.
- It satisfies the context requirement that Supabase cleanup is the first priority without forcing a broader rewrite.

## 2. Split `other_utils.py` by responsibility, not by framework

- Per D-06, extract focused modules for:
  - article selection / ranking
  - summary generation
  - venue enrichment / favicon scraping
- Keep `backend/src/utils/other_utils.py` as a thin compatibility wrapper or re-export layer during this phase so the codebase does not need a massive import churn.
- Use function injection for Supabase detail fetches, OpenAI calls, and Semantic Scholar detail lookups so unit tests can target the algorithm itself.

Why this shape:
- Matches the existing function-oriented backend style.
- Creates test seams without introducing abstract base classes or a service container.
- Keeps the refactor bounded to the exact responsibilities named in the user decisions.

## 3. Refactor email and S3 helpers to return explicit outcomes

- Keep `render_template()` focused on HTML rendering only.
- Add an email delivery function that returns a structured `DeliveryResult` with explicit `success`, `partial`, or `failed` status plus sent/failed recipient lists.
- Add an S3 upload helper that returns `bucket`, `key`, `url`, and `status` instead of only logging and raising.
- Preserve the current sender string and newsletter subject shape so Phase 3 changes backend quality, not outward product behavior.

Why this is safer:
- It converts implicit prints/exceptions into contracts tests can assert.
- It directly implements D-03, D-04, and D-05.
- It allows lambda orchestration to continue after partial delivery but still stop on true upload/persistence failures.

## 4. Move orchestration into a named workflow with step results

- Keep `backend/src/lambda_function.py` as the Lambda entrypoint, but delegate the work to a dedicated workflow function or module.
- Expose named step results for `select`, `render`, `deliver`, `upload`, and `persist` per D-07.
- Treat the outcomes like this:
  - `select` success + empty payload -> downstream steps `skipped`
  - `deliver` partial -> workflow still proceeds to `upload` and `persist`
  - `render`, `upload`, or `persist` failed -> workflow returns a failed overall status with the failing step recorded

Why this shape:
- Tests can assert the workflow boundary directly.
- Lambda entrypoint stays thin.
- Failure handling becomes predictable instead of being inferred from logs or missing side effects.

## Do Not Hand-Roll / Avoid

- Do not introduce a full repository-wide service layer, container framework, or base adapter hierarchy; D-01 explicitly prefers per-service adapters over a rewrite.
- Do not replace the Python/AWS backend stack, the Resend provider, or Supabase.
- Do not turn Phase 3 into a product-feature phase; no new newsletter behavior is required beyond clearer outcomes.
- Do not hide partial email failure behind a blanket exception or boolean success value.
- Do not keep `other_utils.py` as the only home for selection, summary, venue, and persistence-touchpoint logic.

## Validation Architecture

## Commands to Target

- Backend unit command: `python backend/scripts/run_backend_tests.py`
- Focused pytest command after new targeted suites exist: `backend/.venv/bin/python -m pytest -c backend/pytest.ini backend/tests/test_supabase_utils.py backend/tests/test_article_selection_service.py backend/tests/test_summary_service.py backend/tests/test_email_utils.py backend/tests/test_aws_utils.py backend/tests/test_lambda_function.py -x`
- Phase full check: `python backend/scripts/run_backend_tests.py`

## Sampling Strategy

- After Supabase adapter changes: run the backend unit command so the new lazy-client seam proves it works from the repo-owned runner.
- After helper extraction changes in `other_utils` and new service modules: run the backend unit command again because these changes affect multiple existing imports.
- After delivery/upload changes: run the backend unit command so partial-success and failure paths stay green together.
- After orchestration rewiring: run the backend unit command one more time as the full phase gate.

## Key Risks and Mitigations

1. **Import-path churn could break existing modules while responsibilities are being split**
   - Mitigation: keep `other_utils.py` as a compatibility wrapper during the refactor instead of removing it outright.

2. **Supabase behavior could drift while making the client injectable**
   - Mitigation: preserve current table names and helper names, and add tests for `supabase_articles_POST`, `supabase_newsletters_POST`, and `supabase_query_all` with fake clients.

3. **Partial email delivery could accidentally be treated as total failure**
   - Mitigation: codify `success` / `partial` / `failed` statuses and require tests for mixed-success recipient batches.

4. **Lambda orchestration could become more complex than the current entrypoint**
   - Mitigation: move complexity into a workflow module with typed step results, leaving `lambda_function.py` thin.

## Plan-Shaping Implications

- Start with a foundation plan for result contracts and the lazy Supabase seam because D-02 makes that the first refactor priority.
- Then split into two parallelizable concerns that depend on the same foundation:
  - helper extraction from `other_utils.py`
  - delivery/upload adapters with explicit outcomes
- Finish with a workflow-wiring plan that consumes both preceding slices and updates orchestration tests.

## Recommended Plan Breakdown

1. Create workflow result contracts and lazy Supabase adapter helpers.
2. Extract article selection, summary generation, and venue enrichment into focused modules.
3. Refactor email and S3 helpers around explicit success/partial/failure outcomes.
4. Rewire Lambda orchestration to named step results and continuation after partial delivery.
