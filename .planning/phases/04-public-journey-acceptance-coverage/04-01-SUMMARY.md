---
phase: 04-public-journey-acceptance-coverage
plan: 01
subsystem: acceptance-coverage
tags: [playwright, e2e, fixtures, smoke]
requires: []
provides:
  - Shared public-journey Playwright fixture
  - Resettable deterministic public route mocks
  - Lightweight umbrella smoke canary
affects: [acceptance-coverage]
tech-stack:
  added: []
  patterns: [shared Playwright fixture, resettable mock state, lightweight smoke spec]
key-files:
  created: [nextjs-frontend/tests/e2e/support/publicJourneyTest.ts]
  modified: [nextjs-frontend/tests/e2e/support/mockSupabase.ts, nextjs-frontend/tests/e2e/public-smoke.spec.ts]
key-decisions:
  - "Keep the smoke suite as a fast route canary while moving deeper assertions into focused journey specs"
  - "Reset mock data per test run so future subscribe and unsubscribe specs cannot leak state across files"
requirements-completed: [ACCP-01, ACCP-02, ACCP-03, ACCP-04]
duration: 0 min
completed: 2026-04-08T04:29:10Z
---

# Phase 4 Plan 1: Shared public journey fixture Summary

**A reusable Playwright fixture and resettable mocked public data now back the acceptance suite, while the old smoke script has been slimmed into a fast route-level canary.**

## Performance

- **Duration:** 0 min
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Added `nextjs-frontend/tests/e2e/support/publicJourneyTest.ts` so public route specs can share one `mockSupabase(page)` setup path.
- Reworked `nextjs-frontend/tests/e2e/support/mockSupabase.ts` to rebuild recipients, newsletters, and articles from deterministic defaults on every test invocation.
- Reduced `nextjs-frontend/tests/e2e/public-smoke.spec.ts` to a lightweight canary that boots `/`, `/unsubscribe`, `/newsletters`, and `/articles` without re-testing deep journey behavior.

## Task Commits
1. `147b4ee` — `test(04-01): add shared public journey fixture`

## Verification
- `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/public-smoke.spec.ts`

## Self-Check: PASSED

---
*Phase: 04-public-journey-acceptance-coverage*
*Completed: 2026-04-08*
