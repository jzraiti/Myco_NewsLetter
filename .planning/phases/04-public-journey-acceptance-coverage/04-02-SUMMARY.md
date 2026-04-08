---
phase: 04-public-journey-acceptance-coverage
plan: 02
subsystem: acceptance-coverage
tags: [playwright, subscribe, unsubscribe, e2e]
requires: [04-01]
provides:
  - Focused subscribe journey spec
  - Focused unsubscribe journey spec
  - Independent coverage of subscription success and branch cases
affects: [acceptance-coverage]
tech-stack:
  added: []
  patterns: [journey-specific e2e specs, shared public fixture]
key-files:
  created: [nextjs-frontend/tests/e2e/subscribe.spec.ts, nextjs-frontend/tests/e2e/unsubscribe.spec.ts]
  modified: []
key-decisions:
  - "Subscription flows now fail in dedicated specs instead of inside the umbrella smoke file"
requirements-completed: [ACCP-01, ACCP-02]
duration: 0 min
completed: 2026-04-08T04:31:45Z
---

# Phase 4 Plan 2: Subscription journey specs Summary

**Subscribe and unsubscribe now have dedicated Playwright journey specs that prove the existing visible success and error messages independently.**

## Accomplishments
- Added `nextjs-frontend/tests/e2e/subscribe.spec.ts` for the happy path and already-subscribed branch on `/`.
- Added `nextjs-frontend/tests/e2e/unsubscribe.spec.ts` for the success and missing-email branches on `/unsubscribe`.
- Reused the shared public journey fixture so route-mock setup stays centralized.

## Task Commits
1. `98c2fbb` — `test(04-02): split subscription journey specs`

## Verification
- `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/subscribe.spec.ts`
- `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/unsubscribe.spec.ts`

## Self-Check: PASSED

---
*Phase: 04-public-journey-acceptance-coverage*
*Completed: 2026-04-08*
