# Phase 3: Backend Quality & Safety - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Refactor the existing backend newsletter and utility paths so they are safer to change, easier to test in isolation, and more predictable when integrations fail. This phase improves the current Lambda-driven backend flow; it does not add new end-user capabilities or replace the current Python/AWS stack.

</domain>

<decisions>
## Implementation Decisions

### Service boundaries
- **D-01:** Phase 3 should introduce per-service adapters for Supabase, email, S3, and LLM access rather than a full service-layer rewrite.
- **D-02:** The cleanest seam should be created in Supabase access first, removing import-time client setup and making data access callable through explicit helpers or factories.

### Failure handling
- **D-03:** Newsletter generation should use explicit step outcomes so failures are visible to callers instead of being hidden inside helper modules.
- **D-04:** Email delivery should allow partial-success results instead of failing the entire send step on the first unsuccessful recipient.
- **D-05:** Even when email delivery is only partially successful, the workflow should still continue through upload and persistence as a successful completed run.

### Refactor depth
- **D-06:** Phase 3 should split the core workflow helpers inside `backend/src/utils/other_utils.py`, specifically the article-selection, summary-generation, venue-enrichment, and persistence-touchpoint responsibilities.
- **D-07:** The refactored newsletter workflow should expose named step results for stages such as select, render, deliver, upload, and persist so tests can assert behavior at each boundary.

### the agent's Discretion
- Exact adapter class/function shapes, as long as they preserve the current backend stack and create cleaner test seams.
- The exact result-object structure for workflow steps, as long as partial email outcomes and step-by-step orchestration remain observable in tests.
- Whether shared utility extraction happens through new modules, slimmer existing modules, or both, as long as the selected responsibilities are decoupled.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone and requirement docs
- `.planning/ROADMAP.md` — Phase 3 goal, dependency order, and success criteria for Backend Quality & Safety.
- `.planning/REQUIREMENTS.md` — `BEQ-01` through `BEQ-04`, which define the backend testing, separation-of-concerns, failure-handling, and coverage targets.
- `.planning/PROJECT.md` — Milestone constraints, scope guardrails, and the decision to improve the existing backend rather than replace it.
- `.planning/STATE.md` — Current milestone position and the expectation that Phase 3 is the next active phase after Phase 2 completion.

### Prior verification context
- `.planning/phases/01-test-foundation/01-VERIFICATION.md` — Existing backend testing baseline and the current repo-owned backend runner/test isolation guarantees that Phase 3 must preserve.
- `.planning/phases/02-frontend-quality-efficiency/02-VERIFICATION.md` — Prior phase evidence that frontend work is complete, so downstream planning should focus on backend safety without reopening Phase 2 scope.

### Backend implementation hotspots
- `backend/src/lambda_function.py` — Current end-to-end orchestration entrypoint that fetches, selects, renders, delivers, uploads, and persists in one flow.
- `backend/src/utils/supabase_utils.py` — Current import-time Supabase client creation and shared persistence/query helpers; the first refactor seam for Phase 3.
- `backend/src/utils/email_utils.py` — Current template rendering and recipient-send behavior, including per-recipient failure handling.
- `backend/src/utils/aws_utils.py` — Current S3 upload side effect and error behavior.
- `backend/src/utils/other_utils.py` — Current article-selection, summary-generation, venue-enrichment, and persistence-heavy logic to be split at core workflow seams.
- `backend/tests/test_lambda_function.py` — Existing orchestration coverage and current test seam expectations.
- `backend/tests/test_ss_api.py` — Existing external-service mocking pattern for backend helpers.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `backend/scripts/run_backend_tests.py`: Existing repo-owned test runner that downstream work should continue to use for backend verification.
- `backend/tests/test_lambda_function.py`: Established monkeypatch-based orchestration test style that can be expanded around new step boundaries.
- `backend/tests/test_ss_api.py`: Existing external-call isolation pattern for service/helper tests.
- `backend/src/utils/email_utils.py::render_template`: Existing rendering helper that can remain a focused template concern while delivery logic is separated more cleanly.

### Established Patterns
- Backend utilities are currently function-based modules rather than classes, so adapter boundaries should fit that style unless a clear improvement is needed.
- Integration dependencies are currently imported directly inside shared utility modules, which creates tight coupling and makes import-time setup significant.
- The current backend test strategy prefers monkeypatching/fakes over live integrations, and Phase 3 should preserve that isolation model.

### Integration Points
- `backend/src/lambda_function.py` is the main orchestration boundary where step-result contracts should be made explicit.
- `backend/src/utils/supabase_utils.py` connects article, newsletter, recipient, journal, and JUFO persistence paths used throughout the backend flow.
- `backend/src/utils/email_utils.py` and `backend/src/utils/aws_utils.py` are the outward delivery side effects that need clearer contracts.
- `backend/src/utils/other_utils.py` is the main internal workflow dependency feeding the Lambda newsletter generation path.

</code_context>

<specifics>
## Specific Ideas

- The preferred direction is a moderate refactor: create per-service adapters and clearer workflow seams without turning this phase into a full backend rewrite.
- Supabase cleanup is the first priority because import-time client creation currently affects most backend flows and testability.
- Partial email delivery should stay visible to callers, but should not block upload and persistence in the current workflow.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-backend-quality-safety*
*Context gathered: 2026-04-06*
