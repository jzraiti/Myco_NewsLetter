---
phase: 07-public-ui-clarity-responsiveness-accessibility
plan: 02
subsystem: ui
tags: [nextjs, react, forms, accessibility, playwright]
requires:
  - phase: 07-01
    provides: shared shell focus styling, nav framing, and public-page accessibility baseline
provides:
  - editorial subscribe hero with labeled Subscribe Free CTA
  - explicit unsubscribe confirmation flow with safer destructive handling
  - mobile-safe subscription and unsubscribe regression coverage
affects: [public-home, unsubscribe, accessibility]
tech-stack:
  added: []
  patterns: [labeled public form controls, two-step destructive confirmation, mobile-width e2e form checks]
key-files:
  created: []
  modified: [nextjs-frontend/src/components/subscription/SubscribePanel.tsx, nextjs-frontend/src/components/subscription/SubscribePanel.test.tsx, nextjs-frontend/tests/e2e/subscribe.spec.ts, nextjs-frontend/src/components/subscription/UnsubscribePanel.tsx, nextjs-frontend/src/components/subscription/UnsubscribePanel.test.tsx, nextjs-frontend/tests/e2e/unsubscribe.spec.ts]
key-decisions:
  - "Reframe the home panel as an editorial hero while keeping the existing background imagery and subscription API untouched."
  - "Gate unsubscribe behind a review step so destructive intent is explicit before any network call fires."
patterns-established:
  - "Public forms use explicit Email address labels with 48px-height primary controls."
  - "Destructive public actions require a reversible review state before confirmation."
requirements-completed: [UIP-01, UIP-02, UIP-03, UIP-04]
duration: 6min
completed: 2026-04-12
---

# Phase 7 Plan 02: Home and Unsubscribe Summary

**Editorial subscribe hero with a labeled Subscribe Free CTA and a two-step unsubscribe confirmation flow**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-12T18:37:50Z
- **Completed:** 2026-04-12T18:50:21Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Reframed the home page subscribe surface around stronger editorial hierarchy, trust copy, and a clearly labeled `Subscribe Free` CTA.
- Added an accessible unsubscribe review state with exact confirmation copy and reversible intent handling.
- Extended unit and Playwright coverage to protect mobile-width form usability and the new destructive confirmation behavior.

## Task Commits

Each task was committed atomically:

1. **Task 1: Reframe the home subscribe surface with stronger hierarchy and an accessible primary CTA** - `4aafa55`, `625563b` (test, feat)
2. **Task 2: Add an explicit unsubscribe confirmation state and preserve destructive-flow feedback** - `0cf6ede`, `274486f` (test, feat)

**Plan metadata:** pending

## Files Created/Modified
- `nextjs-frontend/src/components/subscription/SubscribePanel.tsx` - reshapes the home hero around a labeled form, helper copy, and stronger editorial framing.
- `nextjs-frontend/src/components/subscription/SubscribePanel.test.tsx` - protects CTA copy, label semantics, and success/duplicate behavior.
- `nextjs-frontend/tests/e2e/subscribe.spec.ts` - verifies subscribe success, already-subscribed feedback, and mobile visibility with `Subscribe Free`.
- `nextjs-frontend/src/components/subscription/UnsubscribePanel.tsx` - adds the review/confirm destructive flow while preserving unsubscribe outcomes.
- `nextjs-frontend/src/components/subscription/UnsubscribePanel.test.tsx` - locks the confirmation gate, keep-subscription rollback, and success/not-found flows.
- `nextjs-frontend/tests/e2e/unsubscribe.spec.ts` - verifies the confirmation sequence and 390px mobile visibility.

## Decisions Made
- Used labeled controls instead of placeholder-only fields so both public forms meet the phase accessibility contract.
- Preserved toast-driven outcome messaging from earlier phases so behavior stayed familiar while the layout and copy improved.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The initial RED tests failed because both forms still relied on placeholder-only inputs and the previous one-click destructive flow; implementation work resolved both gaps directly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The home and unsubscribe routes now match the shared shell quality bar and preserve their API contracts.
- Archive and JUFO plans can reuse the same focus, spacing, and mobile-control patterns introduced here.

## Self-Check: PASSED
