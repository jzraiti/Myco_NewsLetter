---
phase: 04-public-journey-acceptance-coverage
plan: 03
subsystem: acceptance-coverage
tags: [playwright, newsletters, articles, search, e2e]
requires: [04-01]
provides:
  - Focused newsletter archive browsing spec
  - Focused articles browse-and-search spec
  - Independent coverage of content journey behavior
affects: [acceptance-coverage]
tech-stack:
  added: []
  patterns: [journey-specific e2e specs, app-owned contract assertions]
key-files:
  created: [nextjs-frontend/tests/e2e/newsletters.spec.ts, nextjs-frontend/tests/e2e/articles.spec.ts]
  modified: []
key-decisions:
  - "Content browsing and article search now live in dedicated specs instead of sharing the smoke canary"
  - "Archive coverage verifies app-owned link output but does not test the external newsletter destination itself"
requirements-completed: [ACCP-03, ACCP-04]
duration: 0 min
completed: 2026-04-08T04:31:45Z
---

# Phase 4 Plan 3: Content journey specs Summary

**Newsletter archive browsing and article browse/search now have focused Playwright coverage with assertions centered on app-owned visible behavior.**

## Accomplishments
- Added `nextjs-frontend/tests/e2e/newsletters.spec.ts` to verify the archive heading, visible CTA, and exact fixture newsletter href.
- Added `nextjs-frontend/tests/e2e/articles.spec.ts` to verify initial article visibility, filtered search behavior, and the empty-state message.
- Kept all assertions at the user-visible layer, without testing third-party destinations or internal filter implementation details.

## Task Commits
1. `0dd4dff` — `test(04-03): split content journey specs`

## Verification
- `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/newsletters.spec.ts`
- `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/articles.spec.ts`

## Self-Check: PASSED

---
*Phase: 04-public-journey-acceptance-coverage*
*Completed: 2026-04-08*
