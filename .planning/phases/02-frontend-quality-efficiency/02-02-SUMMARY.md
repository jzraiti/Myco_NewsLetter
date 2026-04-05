---
phase: 02-frontend-quality-efficiency
plan: 02
subsystem: frontend
tags: [server-components, subscriptions, shared-helpers, playwright]
requires:
  - phase: 02-frontend-quality-efficiency
    provides: shared public-data and deterministic background helpers
provides:
  - Reusable subscribe and unsubscribe client panels
  - Server-backed home route wrapper with stable background and subscriber-count inputs
  - Regression coverage for the public subscription flows after the refactor
affects: [frontend-quality-and-efficiency]
tech-stack:
  added: [client subscription interaction components]
  patterns: [server-backed page wrapper plus client interaction island, helper-only mutation wiring]
key-files:
  created: [nextjs-frontend/src/components/subscription/SubscribePanel.tsx, nextjs-frontend/src/components/subscription/SubscribePanel.test.tsx, nextjs-frontend/src/components/subscription/UnsubscribePanel.tsx, nextjs-frontend/src/components/subscription/UnsubscribePanel.test.tsx]
  modified: [nextjs-frontend/src/app/home/page.tsx, nextjs-frontend/src/app/unsubscribe/page.tsx]
key-decisions:
  - "Keep the visual home and unsubscribe layouts intact while moving mutation logic into small client components"
  - "Load the home subscriber count on the server and pass it into the subscribe panel as a stable prop"
patterns-established:
  - "Public read data loads in the server route wrapper while form interactivity stays in a client island"
  - "Subscription component tests mock shared helper exports instead of mocking Supabase directly"
requirements-completed: [FEQ-01, FEQ-02, FEQ-03, FEQ-04]
duration: 0min
completed: 2026-04-05
---

# Phase 2 Plan 2: Subscription flow refactor Summary

**Server-backed home route plus extracted subscription client panels that preserve existing public behavior while removing page-level Supabase wiring and client-side count loading**

## Performance

- **Duration:** 0 min
- **Started:** 2026-04-05T00:00:00Z
- **Completed:** 2026-04-05T00:00:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Extracted reusable subscribe and unsubscribe panels that depend only on shared helper functions
- Converted the home page into a server-backed wrapper with stable subscriber-count and background props
- Reproved the public smoke journey for home and unsubscribe after the refactor

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract subscribe and unsubscribe interaction components** - `2fbc821` (feat)
2. **Task 2: Convert the home page into a server-backed wrapper with stable inputs** - `eb32628` (perf)

**Plan metadata:** `pending` (docs: complete plan)

## Files Created/Modified
- `nextjs-frontend/src/components/subscription/SubscribePanel.tsx` - Client subscribe interaction island
- `nextjs-frontend/src/components/subscription/SubscribePanel.test.tsx` - Unit coverage for preserved subscribe behavior
- `nextjs-frontend/src/components/subscription/UnsubscribePanel.tsx` - Client unsubscribe interaction island
- `nextjs-frontend/src/components/subscription/UnsubscribePanel.test.tsx` - Unit coverage for preserved unsubscribe behavior
- `nextjs-frontend/src/app/home/page.tsx` - Server-backed home wrapper using shared helpers
- `nextjs-frontend/src/app/unsubscribe/page.tsx` - Presentation wrapper around the extracted unsubscribe panel

## Decisions Made
- Kept the route shell and user-visible copy stable while isolating only the interactive state into client components
- Reused deterministic background and subscriber-count inputs from the shared helper layer instead of keeping route-local effects

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Switched the new component tests to hoisted helper mocks**
- **Found during:** Task 1 (Extract subscribe and unsubscribe interaction components)
- **Issue:** Vitest hoisted the shared-helper mocks before the local test variables initialized, causing module-mock failures for both new subscription panel tests
- **Fix:** Replaced the local mocks with `vi.hoisted` state so the panels can import their shared helpers safely during test setup
- **Files modified:** `nextjs-frontend/src/components/subscription/SubscribePanel.test.tsx`, `nextjs-frontend/src/components/subscription/UnsubscribePanel.test.tsx`
- **Verification:** `npm --prefix nextjs-frontend run test:unit -- --run src/components/subscription/SubscribePanel.test.tsx src/components/subscription/UnsubscribePanel.test.tsx`
- **Committed in:** `2fbc821`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The deviation kept the extracted client-component tests stable without changing the refactor scope.

## Issues Encountered
- The plan verify command still prints a duplicate Playwright `--project=chromium` flag through the existing script wrapper, but the smoke suite remains green

## User Setup Required

None.

## Next Phase Readiness
- Later public page refactors can follow the same server-wrapper plus client-island pattern
- The public smoke suite continues to protect the critical subscribe and unsubscribe journeys while the rest of Wave 2 lands

---
*Phase: 02-frontend-quality-efficiency*
*Completed: 2026-04-05*
