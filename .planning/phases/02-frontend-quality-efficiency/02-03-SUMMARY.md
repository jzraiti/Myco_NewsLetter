---
phase: 02-frontend-quality-efficiency
plan: 03
subsystem: frontend
tags: [newsletters, server-components, deterministic-backgrounds, playwright]
requires:
  - phase: 02-frontend-quality-efficiency
    provides: shared public-data and deterministic background helpers
provides:
  - Reusable newsletter archive renderer
  - Server-backed newsletter archive route wrapper
  - Test-mode server fixtures for smoke coverage of server-rendered public data
affects: [frontend-quality-and-efficiency]
tech-stack:
  added: [archive presentation component, server fixture data path for public pages]
  patterns: [server-rendered archive wrapper, deterministic card backgrounds, fixture-backed server smoke data]
key-files:
  created: [nextjs-frontend/src/components/newsletters/NewsletterArchive.tsx, nextjs-frontend/src/components/newsletters/NewsletterArchive.test.tsx, nextjs-frontend/src/lib/public-data/test-fixtures.ts]
  modified: [nextjs-frontend/src/app/newsletters/page.tsx, nextjs-frontend/src/lib/public-data/content.ts, nextjs-frontend/src/lib/public-data/subscriptions.ts, nextjs-frontend/playwright.config.ts, nextjs-frontend/src/test/setup.ts]
key-decisions:
  - "Use a reusable prop-driven archive renderer and keep the page wrapper responsible only for shared data loading"
  - "Introduce a Playwright-only server-fixture mode so server-rendered public routes stay isolated from live services during smoke verification"
patterns-established:
  - "Server-rendered public pages can use fixture-backed data in E2E mode while production continues to call shared helpers normally"
  - "Newsletter cards use deterministic background selection keyed by newsletter identity"
requirements-completed: [FEQ-01, FEQ-02, FEQ-03, FEQ-04]
duration: 0min
completed: 2026-04-05
---

# Phase 2 Plan 3: Newsletter archive refactor Summary

**Reusable archive renderer and server-backed newsletter route that remove page-local Supabase logic and per-render random backgrounds while keeping smoke coverage green**

## Performance

- **Duration:** 0 min
- **Started:** 2026-04-05T00:00:00Z
- **Completed:** 2026-04-05T00:00:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Extracted a prop-driven archive renderer with deterministic card backgrounds
- Converted the newsletters route to server-backed shared data loading
- Added a Playwright-only fixture mode so server-rendered public routes stay isolated from live services

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract a reusable newsletter archive component** - `ea4cce4` (perf)
2. **Task 2: Convert the newsletters page to server-loaded archive data** - `ea4cce4` (perf)

**Plan metadata:** `pending` (docs: complete plan)

## Files Created/Modified
- `nextjs-frontend/src/components/newsletters/NewsletterArchive.tsx` - Reusable archive renderer
- `nextjs-frontend/src/components/newsletters/NewsletterArchive.test.tsx` - Archive rendering and deterministic background tests
- `nextjs-frontend/src/app/newsletters/page.tsx` - Server-backed route wrapper using shared archive data
- `nextjs-frontend/src/lib/public-data/test-fixtures.ts` - Playwright-only server fixture data for newsletters and articles
- `nextjs-frontend/src/lib/public-data/content.ts` - Shared fixture-aware server data access
- `nextjs-frontend/src/lib/public-data/subscriptions.ts` - Shared fixture-aware subscriber-count access
- `nextjs-frontend/playwright.config.ts` - Enables server fixture mode during smoke runs
- `nextjs-frontend/src/test/setup.ts` - Improves the shared `next/image` mock for `fill` props

## Decisions Made
- Used a small fixture-backed server data path in E2E mode rather than regressing the newsletters page back to client fetching
- Kept the archive CTA as the accessible link surface so the smoke test continues to find it through role-based selectors

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Stabilized archive tests against test-environment date and image-mock quirks**
- **Found during:** Task 1 (Extract a reusable newsletter archive component)
- **Issue:** The new archive unit test failed because localized date output varies by timezone and the shared `next/image` mock leaked the boolean `fill` prop onto a DOM `img`
- **Fix:** Updated the shared image mock to strip `fill` and relaxed the archive date assertion to avoid timezone-sensitive exact text matching
- **Files modified:** `nextjs-frontend/src/test/setup.ts`, `nextjs-frontend/src/components/newsletters/NewsletterArchive.test.tsx`
- **Verification:** `npm --prefix nextjs-frontend run test:unit -- --run src/components/newsletters/NewsletterArchive.test.tsx`
- **Committed in:** `ea4cce4`

**2. [Rule 3 - Blocking] Added fixture-backed server data for smoke coverage after moving newsletters server-side**
- **Found during:** Task 2 (Convert the newsletters page to server-loaded archive data)
- **Issue:** Browser-level Playwright route mocks no longer reached the initial server render, so the newsletters page showed an empty state and the smoke test lost the archive CTA
- **Fix:** Added shared test fixtures plus a Playwright-only environment flag so server-rendered public data uses deterministic fixture values during smoke verification
- **Files modified:** `nextjs-frontend/src/lib/public-data/test-fixtures.ts`, `nextjs-frontend/src/lib/public-data/content.ts`, `nextjs-frontend/src/lib/public-data/subscriptions.ts`, `nextjs-frontend/playwright.config.ts`
- **Verification:** `npm --prefix nextjs-frontend run test:e2e -- --project=chromium tests/e2e/public-smoke.spec.ts`
- **Committed in:** `ea4cce4`

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both deviations were necessary to keep the route server-rendered and still satisfy the no-live-services verification contract.

## Issues Encountered
- The smoke test initially exposed that server-rendered data is outside browser-only route interception, which required a small shared fixture mode for E2E

## User Setup Required

None.

## Next Phase Readiness
- The articles refactor can reuse the same fixture-backed server data path for server-rendered public content
- The archive route now serves as the reference pattern for moving read-heavy public pages off the client

---
*Phase: 02-frontend-quality-efficiency*
*Completed: 2026-04-05*
