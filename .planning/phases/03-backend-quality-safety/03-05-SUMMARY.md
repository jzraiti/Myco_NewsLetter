---
phase: 03-backend-quality-safety
plan: 05
subsystem: backend-quality-and-safety
tags: [gap-closure, workflow, failure-handling, verification]
requires: [03-04]
provides:
  - Failed `select` step normalization for fetch/select exceptions
  - Regression tests for fetch and select error handling
affects: [backend-quality-and-safety]
tech-stack:
  added: []
  patterns: [normalized select-stage failure handling, skipped downstream workflow steps]
key-files:
  created: []
  modified: [backend/src/newsletter_workflow.py, backend/tests/test_newsletter_workflow.py]
key-decisions:
  - "Normalize both fetch and select exceptions into a failed `select` step result instead of letting them escape as uncaught workflow errors"
requirements-completed: [BEQ-03, BEQ-04]
duration: 0 min
completed: 2026-04-08T04:12:01Z
---

# Phase 3 Plan 5: Select-stage failure normalization Summary

**Gap closure for Phase 3 that makes fetch and selection errors return a failed `select` step plus predictably skipped downstream workflow steps instead of uncaught exceptions**

## Performance

- **Duration:** 0 min
- **Started:** 2026-04-08T04:09:00Z
- **Completed:** 2026-04-08T04:12:01Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- Wrapped fetch/select execution inside `backend/src/newsletter_workflow.py` so upstream integration failures now produce `WorkflowStepResult(step="select", status="failed", error=...)`
- Preserved existing empty-selection behavior while ensuring `render`, `deliver`, `upload`, and `persist` are all marked `skipped` after a select-stage failure
- Added regression tests covering both `fetch boom` and `select boom` failure paths

## Task Commits

Each task was committed atomically:

1. **Task 1: Normalize fetch/select exceptions into a failed `select` workflow result** - `a92af91` (fix)

**Plan metadata:** `pending` (docs: complete plan)

## Files Created/Modified
- `backend/src/newsletter_workflow.py` - Failed-select normalization and downstream skip handling
- `backend/tests/test_newsletter_workflow.py` - Regression tests for fetch/select exception normalization

## Decisions Made
- Kept the select-stage normalization at the workflow boundary rather than pushing the responsibility down into fetch or selection helpers

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- None

## User Setup Required

None.

## Next Phase Readiness
- Phase 3 verification can now check the previously missing BEQ-03 workflow-boundary failure path

## Self-Check: PASSED

---
*Phase: 03-backend-quality-safety*
*Completed: 2026-04-08*
