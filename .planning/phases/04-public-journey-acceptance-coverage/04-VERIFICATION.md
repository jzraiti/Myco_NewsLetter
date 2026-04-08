---
phase: 04-public-journey-acceptance-coverage
verified: 2026-04-08T04:36:14Z
status: passed
score: 9/9 must-haves verified
---

# Phase 4: Public Journey Acceptance Coverage Verification Report

**Phase Goal:** Automated acceptance coverage protects the core public user journeys for subscribe, unsubscribe, newsletter archive browsing, and article browsing/search.
**Verified:** 2026-04-08T04:36:14Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Acceptance tests start each public journey from deterministic mocked public data. | ✓ VERIFIED | `tests/e2e/support/mockSupabase.ts` seeds `existing@example.com`, `archived@example.com`, fixture newsletter/article data; `publicJourneyTest.ts` calls `await mockSupabase(page)` before each test. |
| 2 | The smoke suite remains a lightweight umbrella canary instead of the only deep acceptance script. | ✓ VERIFIED | `tests/e2e/public-smoke.spec.ts` only boots `/`, `/unsubscribe`, `/newsletters`, `/articles` and checks one route-health assertion per route. |
| 3 | Focused journey specs can share one Playwright setup path without repeating route-mock wiring in every file. | ✓ VERIFIED | All five specs import `./support/publicJourneyTest`; shared fixture centralizes the mock wiring. |
| 4 | Team can run an automated acceptance test that verifies a visitor can subscribe from the public site. | ✓ VERIFIED | `tests/e2e/subscribe.spec.ts` covers new subscriber success and existing subscriber branch; Playwright run passed. |
| 5 | Team can run an automated acceptance test that verifies a visitor can unsubscribe from the public site. | ✓ VERIFIED | `tests/e2e/unsubscribe.spec.ts` covers success and missing-email branch; Playwright run passed. |
| 6 | Subscription-flow failures point directly to the affected public journey instead of a broad mixed smoke test. | ✓ VERIFIED | Subscribe and unsubscribe each live in dedicated spec files and run independently. |
| 7 | Team can run an automated acceptance test that verifies visitors can browse the newsletter archive. | ✓ VERIFIED | `tests/e2e/newsletters.spec.ts` asserts archive heading, CTA visibility, and exact newsletter href; Playwright run passed. |
| 8 | Team can run an automated acceptance test that verifies visitors can browse and search article summaries. | ✓ VERIFIED | `tests/e2e/articles.spec.ts` asserts both fixture titles, search filtering, and empty-state copy; Playwright run passed. |
| 9 | Content-surface failures point directly to archive or article coverage instead of a mixed smoke test. | ✓ VERIFIED | Newsletter archive and article browse/search each live in dedicated spec files and run independently. |

**Score:** 9/9 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `nextjs-frontend/tests/e2e/support/mockSupabase.ts` | Resettable deterministic public-data mocks | ✓ VERIFIED | Exists, substantive (127 lines), seeds exact fixture values, and resets subscribers/newsletters/articles inside `mockSupabase(page)`. |
| `nextjs-frontend/tests/e2e/support/publicJourneyTest.ts` | Shared Playwright fixture | ✓ VERIFIED | Exists, substantive, imports `mockSupabase`, extends base `test`, and re-exports `expect`. |
| `nextjs-frontend/tests/e2e/public-smoke.spec.ts` | Lightweight route canary | ✓ VERIFIED | Exists, substantive, and only covers route-health checks for the four public surfaces. |
| `nextjs-frontend/tests/e2e/subscribe.spec.ts` | Focused subscribe journey coverage | ✓ VERIFIED | Exists, substantive, and verifies success plus already-subscribed feedback. |
| `nextjs-frontend/tests/e2e/unsubscribe.spec.ts` | Focused unsubscribe journey coverage | ✓ VERIFIED | Exists, substantive, and verifies success plus missing-email feedback. |
| `nextjs-frontend/tests/e2e/newsletters.spec.ts` | Focused newsletter archive browsing coverage | ✓ VERIFIED | Exists, substantive, and verifies heading, CTA, and exact app-owned href. |
| `nextjs-frontend/tests/e2e/articles.spec.ts` | Focused article browse/search coverage | ✓ VERIFIED | Exists, substantive, and verifies initial browse state, filtering, and empty state. |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| `support/publicJourneyTest.ts` | `support/mockSupabase.ts` | shared before-each fixture setup | ✓ WIRED | `import { mockSupabase } from "./mockSupabase"` and `await mockSupabase(page)` in extended fixture. |
| `public-smoke.spec.ts` | `support/publicJourneyTest.ts` | shared custom test import | ✓ WIRED | Imports `{ expect, test }` from `./support/publicJourneyTest`. |
| `subscribe.spec.ts` | `support/publicJourneyTest.ts` | shared public-route fixture import | ✓ WIRED | Imports `{ expect, test }` from `./support/publicJourneyTest`. |
| `unsubscribe.spec.ts` | `support/publicJourneyTest.ts` | shared public-route fixture import | ✓ WIRED | Imports `{ expect, test }` from `./support/publicJourneyTest`. |
| `newsletters.spec.ts` | `support/publicJourneyTest.ts` | shared public-route fixture import | ✓ WIRED | Imports `{ expect, test }` from `./support/publicJourneyTest`. |
| `articles.spec.ts` | `support/publicJourneyTest.ts` | shared public-route fixture import | ✓ WIRED | Imports `{ expect, test }` from `./support/publicJourneyTest`. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| --- | --- | --- | --- | --- |
| `SubscribePanel.tsx` | `result.message` / subscribe feedback | `subscribeRecipient()` → mocked `recipients` route in `tests/e2e/support/mockSupabase.ts` | Yes — POST/GET/PATCH handlers mutate and read a per-test subscriber map seeded with deterministic records. | ✓ FLOWING |
| `UnsubscribePanel.tsx` | `result.message` / unsubscribe feedback | `unsubscribeRecipient()` → mocked `recipients` route in `tests/e2e/support/mockSupabase.ts` | Yes — PATCH handler returns updated row or empty array for not-found branch. | ✓ FLOWING |
| `NewsletterArchive.tsx` | `newsletters` prop rendered into CTA href | `fetchPublishedNewsletters()` in `src/lib/public-data/content.ts` | Yes — E2E mode returns `TEST_NEWSLETTERS`; archive page passes data into `NewsletterArchive`. | ✓ FLOWING |
| `ArticlesExplorer.tsx` | `articles` prop + `searchQuery` filtered output | `fetchPublishedArticles()` + `filterArticlesByQuery()` in `src/lib/public-data/content.ts` | Yes — E2E mode returns `TEST_ARTICLES`; component filters visible cards from real fixture data. | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| --- | --- | --- | --- |
| Subscribe journey spec passes | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/subscribe.spec.ts` | `2 passed` | ✓ PASS |
| Unsubscribe journey spec passes | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/unsubscribe.spec.ts` | `2 passed` | ✓ PASS |
| Newsletter archive spec passes | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/newsletters.spec.ts` | `1 passed` | ✓ PASS |
| Articles browse/search spec passes | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/articles.spec.ts` | `1 passed` | ✓ PASS |
| Smoke canary still passes | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/public-smoke.spec.ts` | `1 passed` | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| ACCP-01 | `04-01`, `04-02` | Team can verify the newsletter subscribe flow with an automated acceptance test | ✓ SATISFIED | `tests/e2e/subscribe.spec.ts` covers subscribe success and already-subscribed feedback; command passed. |
| ACCP-02 | `04-01`, `04-02` | Team can verify the unsubscribe flow with an automated acceptance test | ✓ SATISFIED | `tests/e2e/unsubscribe.spec.ts` covers unsubscribe success and missing-email feedback; command passed. |
| ACCP-03 | `04-01`, `04-03` | Team can verify newsletter archive browsing with an automated acceptance test | ✓ SATISFIED | `tests/e2e/newsletters.spec.ts` covers archive heading, CTA, and exact href; command passed. |
| ACCP-04 | `04-01`, `04-03` | Team can verify article browsing and search with an automated acceptance test | ✓ SATISFIED | `tests/e2e/articles.spec.ts` covers initial titles, filtering, and empty state; command passed. |

All requirement IDs declared in Phase 4 plan frontmatter are present in `.planning/REQUIREMENTS.md`, and no additional Phase 4 acceptance requirements are orphaned.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| — | — | No blocker anti-patterns detected in Phase 4 E2E files | — | No placeholder/stub patterns found in the acceptance coverage added for this phase. |

### Human Verification Required

None for phase-goal verification. The goal is automated acceptance protection, and the relevant Playwright specs exist and pass.

### Gaps Summary

No gaps found. Phase 4 delivers shared deterministic Playwright setup, keeps the smoke suite lightweight, and provides dedicated passing acceptance specs for subscribe, unsubscribe, newsletter archive browsing, and article browsing/search. Plan frontmatter requirement IDs ACCP-01 through ACCP-04 are all accounted for in `REQUIREMENTS.md` and are backed by executable tests.

---

_Verified: 2026-04-08T04:36:14Z_
_Verifier: the agent (gsd-verifier)_
