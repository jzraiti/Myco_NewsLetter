# Phase 4: Public Journey Acceptance Coverage Research

**Date:** 2026-04-08
**Status:** Complete

## Objective

Determine the lowest-risk way to extend the existing Playwright acceptance harness from one broad smoke spec into maintainable, focused public-journey coverage for subscribe, unsubscribe, newsletter archive browsing, and article browsing/search.

## Current Codebase Findings

## Existing acceptance harness

- `nextjs-frontend/playwright.config.ts` already boots the local Next.js app through Playwright `webServer` and injects `NEXT_PUBLIC_E2E_STATIC_DATA=true`, so acceptance runs stay off live services.
- `nextjs-frontend/tests/e2e/public-smoke.spec.ts` currently covers all four public surfaces in one broad test file.
- `nextjs-frontend/tests/e2e/support/mockSupabase.ts` already mocks `recipients`, `newsletters`, and `ss_articles` REST routes with deterministic fixture data.

## Public routes under test

- `/` is an async server wrapper around `SubscribePanel`, which keeps the user-visible subscription interaction in a client island and returns toast messages from `subscribeRecipient()`.
- `/unsubscribe` renders `UnsubscribePanel`, which returns toast messages from `unsubscribeRecipient()`.
- `/newsletters` server-loads `NewsletterArchive` and exposes a visible `View Newsletter →` CTA per newsletter card.
- `/articles` server-loads `ArticlesExplorer`, which keeps only search interaction on the client and filters on title, summary, and venue through `filterArticlesByQuery()`.

## Constraints carried forward

- Phase 1 already established that acceptance runs must stay fixture-backed, not live-service backed.
- Phase 2 moved public pages to server-backed wrappers, so browser-only route interception is no longer enough for initial server reads by itself; the suite must preserve the existing E2E fixture mode.
- The user locked the suite split in CONTEXT.md: one focused spec per journey, while `public-smoke.spec.ts` remains as a lightweight canary.

## External Guidance

- Playwright best-practices guidance recommends testing user-visible behavior, keeping tests isolated, and avoiding assertions on implementation details or third-party destinations.
- Playwright fixtures guidance recommends using custom fixtures to group tests by meaning instead of repeating common setup in every spec file.
- Playwright page object model guidance is useful for large suites, but this phase only needs five small public-route specs; a lightweight shared fixture is lower-risk than adding a full page-object layer.

## Recommended Approach

## 1. Keep one focused spec per public journey and demote smoke to route-canary status

- Create separate specs for:
  - `subscribe`
  - `unsubscribe`
  - `newsletters`
  - `articles`
- Keep `public-smoke.spec.ts`, but reduce it to route boot plus one user-visible signal per route so it stays fast and points to broad system breakage instead of detailed journey logic.

Why:
- This directly implements D-01 through D-04.
- Failures will point to the affected user surface instead of one long mixed-flow script.

## 2. Extract shared Playwright setup into a lightweight custom fixture, not a full framework

- Keep `mockSupabase(page)` as the source of truth for mocked REST traffic.
- Add a small `tests/e2e/support/publicJourneyTest.ts` fixture wrapper that applies the mocked public data before each journey test.
- Reset fixture state before each test so subscribe/unsubscribe mutations cannot leak across specs.

Why:
- Playwright fixtures are the recommended way to reuse setup while preserving test isolation.
- This stays small and compatible with the existing repo pattern instead of introducing unnecessary abstraction.

## 3. Assert only user-visible behavior and app-owned contracts

- Prefer role, text, and placeholder locators already present in the UI.
- For the newsletter archive, verify the visible link text and the generated `href` value, but do not navigate to the external newsletter URL.
- For article search, assert visible filtering and the existing empty-state copy instead of internal search implementation details.

Why:
- This matches Playwright guidance to test what users see and what the app owns.
- It avoids brittle assertions against DOM structure or third-party content.

## 4. Keep fixture data centralized and explicit

- Preserve the current default subscribers (`existing@example.com`, `archived@example.com`), one newsletter archive item, and two article summaries as the deterministic E2E baseline.
- Make any shared helper reset back to those exact seed values before each test.

Why:
- The current fixture data already aligns with the visible copy and public flows.
- Resettable default data keeps the suite isolated even when specs perform subscribe/unsubscribe mutations.

## Do Not Hand-Roll / Avoid

- Do not replace the existing fixture-backed server-data mode with live Supabase calls.
- Do not delete `public-smoke.spec.ts`; keep it as the umbrella canary per D-03.
- Do not keep all deeper journey assertions inside one large smoke file.
- Do not add a large page-object hierarchy unless the suite grows beyond the current small public-route surface.
- Do not assert on CSS selectors, DOM shape, or external-site behavior when visible text/role assertions cover the requirement.

## Validation Architecture

## Commands to Target

- Foundation canary: `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/public-smoke.spec.ts`
- Subscribe journey: `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/subscribe.spec.ts`
- Unsubscribe journey: `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/unsubscribe.spec.ts`
- Newsletter archive journey: `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/newsletters.spec.ts`
- Articles journey: `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/articles.spec.ts`
- Phase full check: `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/public-smoke.spec.ts tests/e2e/subscribe.spec.ts tests/e2e/unsubscribe.spec.ts tests/e2e/newsletters.spec.ts tests/e2e/articles.spec.ts`

## Sampling Strategy

- After shared mock/fixture changes: run the smoke canary first.
- After each focused journey spec lands: run that spec alone.
- After Wave 2 completes: run the full five-spec acceptance command.

## Key Risks and Mitigations

1. **State leakage between subscribe/unsubscribe tests could make failures flaky**
   - Mitigation: reset mocked public data before each test through one shared fixture layer.

2. **Server-rendered public pages could lose deterministic data if helpers drift away from fixture mode**
   - Mitigation: preserve `NEXT_PUBLIC_E2E_STATIC_DATA=true` behavior and keep tests routed through the existing public-data fixture path.

3. **Smoke coverage could stay too broad and duplicate the new focused specs**
   - Mitigation: explicitly narrow smoke assertions to route boot plus one happy-path signal per route.

4. **The suite could become over-abstracted for a small number of specs**
   - Mitigation: use a lightweight shared fixture file rather than page objects or a larger custom framework.

## Plan-Shaping Implications

- Start with a foundation plan that makes the shared Playwright setup deterministic and slims the smoke canary.
- Then split the focused journey specs into two parallel plans:
  - subscription journeys (`subscribe`, `unsubscribe`)
  - content journeys (`newsletters`, `articles`)
- Keep every verification command under the existing repo-owned `test:e2e` path so Phase 1's command contract stays intact.
