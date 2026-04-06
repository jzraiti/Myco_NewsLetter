# Phase 3: Backend Quality & Safety - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-06T00:54:51Z
**Phase:** 03-backend-quality-safety
**Areas discussed:** Service boundaries, Failure handling, Refactor depth

---

## Service boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| Per-service adapters | Create small helpers/factories for Supabase, email, S3, and LLM access while keeping the Lambda flow recognizable. | ✓ |
| Thin cleanup only | Remove only the sharpest edges without introducing strong service boundaries. | |
| Full workflow services | Introduce a deeper service/repository layer across most backend logic. | |

**User's choice:** Per-service adapters
**Notes:** User chose a moderate refactor rather than a full architecture rewrite.

| Option | Description | Selected |
|--------|-------------|----------|
| Supabase first | Prioritize client creation and query helpers in `backend/src/utils/supabase_utils.py`. | ✓ |
| Lambda orchestration first | Focus first on narrowing `lambda_function.py` step orchestration. | |
| Email/LLM first | Isolate outbound delivery and summary generation before persistence cleanup. | |

**User's choice:** Supabase first
**Notes:** The first clean seam should remove import-time client setup and improve testability across the rest of the backend.

---

## Failure handling

| Option | Description | Selected |
|--------|-------------|----------|
| Fail fast with explicit result | Stop the pipeline at the failing step and surface a structured outcome. | |
| Best effort continue | Log errors and continue where possible. | |
| Mixed policy by step | Make some steps fatal and others soft failures. | |

**User's choice:** Mixed response during discussion
**Notes:** User first asked for clarification on fail-fast behavior, especially whether failed emails should stop later email sends. That led to a more specific email-policy decision below.

| Option | Description | Selected |
|--------|-------------|----------|
| Send all, then fail overall | Attempt all recipients, then return a failed email-step result if any fail. | |
| Stop on first failed recipient | Abort the send loop on first recipient failure. | |
| Allow partial success result | Attempt all recipients and return a structured partial-success outcome. | ✓ |

**User's choice:** Allow partial success result
**Notes:** User preferred visibility into partial delivery rather than treating any failed recipient as a hard failure.

| Option | Description | Selected |
|--------|-------------|----------|
| Upload, but do not persist complete success | Keep artifact capture but avoid recording a full success in persistence. | |
| Continue everything as success | Upload and persist the newsletter normally even if some recipients failed. | ✓ |
| Stop after email step | Do not upload or persist when delivery is partial. | |

**User's choice:** Continue everything as success
**Notes:** User explicitly chose to preserve the current downstream flow even when email delivery is only partially successful.

---

## Refactor depth

| Option | Description | Selected |
|--------|-------------|----------|
| Split core workflow helpers | Extract the most coupled responsibilities affecting newsletter safety and testing. | ✓ |
| Only orchestration-facing pieces | Touch only the parts directly invoked by `lambda_function.py`. | |
| Broader utility decomposition | Substantially break up `other_utils.py` into several focused modules. | |

**User's choice:** Split core workflow helpers
**Notes:** The selected responsibilities are article selection, summary generation, venue enrichment, and persistence touchpoints.

| Option | Description | Selected |
|--------|-------------|----------|
| Named step results | Model select, render, deliver, upload, and persist with explicit result values. | ✓ |
| Clear helper functions only | Split into smaller helpers but rely mostly on exceptions and side effects. | |
| Keep current flow, just reorder | Improve readability with minimal structure change. | |

**User's choice:** Named step results
**Notes:** User wants the workflow seams explicit enough that tests can assert what succeeded and failed at each stage.

---

## the agent's Discretion

- Exact adapter and result-object shapes
- Exact module/file layout for split helpers

## Deferred Ideas

None.
