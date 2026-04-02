# Phase 2: Frontend Quality & Efficiency Research

**Date:** 2026-04-02
**Status:** Complete

## Objective

Determine the lowest-risk way to remove repeated frontend Supabase and page-helper logic from the public Next.js app while reducing unnecessary client-side work on the most visible public pages.

## Current Codebase Findings

## Frontend structure

- The frontend lives in `nextjs-frontend/` and already has isolated Vitest and Playwright coverage from Phase 1.
- `src/app/page.tsx` simply re-exports `src/app/home/page.tsx`, so the home route can be refactored without changing route structure.
- `src/components/Layout.tsx`, `TopBar.tsx`, and `Footer.tsx` already provide shared page chrome; duplication is concentrated inside page modules, not shell layout.

## Repeated data-access patterns

- `src/app/home/page.tsx`, `src/app/unsubscribe/page.tsx`, `src/app/newsletters/page.tsx`, and `src/app/articles/page.tsx` each instantiate Supabase directly with `createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)`.
- `home/page.tsx` fetches subscriber count on the client even though it is read-only page data.
- `newsletters/page.tsx` fetches and sorts newsletters on the client.
- `articles/page.tsx` fetches and sorts articles on the client, stores them as `any[]`, and performs filtering in-page.
- `unsubscribe/page.tsx` duplicates the same Supabase mutation pattern as the subscribe flow in `home/page.tsx`.

## Repeated presentation / runtime work

- `home/page.tsx`, `newsletters/page.tsx`, and `articles/page.tsx` duplicate large static background-image arrays and preload markup.
- `newsletters/page.tsx` and `articles/page.tsx` assign random card imagery inside render paths, which creates nondeterministic output and unnecessary runtime work.
- `articles/page.tsx` mixes data loading, filtering, markdown rendering, image selection, and card layout in a single client component.
- `newsletters/page.tsx` mixes data loading, sorting, random image selection, and archive rendering in one client component.

## Testing baseline

- `src/app/home/page.test.tsx` and `src/app/unsubscribe/page.test.tsx` already prove the Phase 1 test harness can cover extracted client components with mocked Supabase clients.
- `tests/e2e/public-smoke.spec.ts` already covers home subscribe, unsubscribe, newsletters, and articles from the user perspective, so Phase 2 can reuse it as a regression gate after refactors.

## External Guidance

- Next.js App Router guidance recommends fetching data on the server whenever possible so pages avoid unnecessary client-side fetches and hydration work.
- Supabase SSR guidance notes that creating a per-request server client is lightweight; for anonymous public reads, this phase does not need to introduce auth-cookie middleware or `@supabase/ssr` if the app only needs public queries with existing env vars.

## Recommended Approach

## 1. Keep mutations in small client components, move initial reads to the server

- Convert `home`, `newsletters`, and `articles` page entrypoints into server components (or async server wrappers) for initial data loading.
- Keep only interactive form/search islands as client components:
  - subscribe form
  - unsubscribe form
  - article search/filter UI
- This directly addresses FEQ-03 by removing avoidable page-level client fetching for public reads.

## 2. Introduce shared frontend data-access helpers instead of page-level Supabase setup

- Add a shared public Supabase factory in `src/lib/supabase/public.ts`.
- Add typed query/helper modules in `src/lib/public-data/` for:
  - subscription count + subscribe/unsubscribe mutations
  - newsletter fetching + sort normalization
  - article fetching + sort/filter normalization
- Keep helper APIs explicit and typed so pages stop using `any[]` and repeated inline sort/filter code.

## 3. Extract repeated presentation helpers

- Move background-image catalogs and deterministic image selection into shared helpers.
- Prefer deterministic selection by item id/index over `Math.random()` during render so output is stable and testable.
- Extract archive/article rendering into reusable components with props-based inputs from shared helper types.

## 4. Expand unit coverage around extracted logic

- Use Vitest for pure helpers and extracted client components.
- Reuse Playwright `public-smoke.spec.ts` as the end-to-end verification contract after each page slice changes.
- Do not add new test frameworks or feature-level acceptance flows in this phase; Phase 4 will deepen acceptance coverage.

## Do Not Hand-Roll / Avoid

- Do not keep page-level module-scope Supabase clients in each route.
- Do not keep read-heavy public pages as fully client-side components when initial data can be loaded on the server.
- Do not add a major UI redesign; this phase is about maintainability and efficiency, not new product surface area.
- Do not introduce `@supabase/ssr` middleware/auth plumbing unless authentication requirements emerge; current pages are anonymous public flows.

## Validation Architecture

## Commands to Target

- Foundation + component unit tests: `npm --prefix nextjs-frontend run test:unit`
- Public smoke regression: `npm --prefix nextjs-frontend run test:e2e -- --project=chromium tests/e2e/public-smoke.spec.ts`
- Phase full check: `npm --prefix nextjs-frontend run test:unit && npm --prefix nextjs-frontend run test:e2e -- --project=chromium tests/e2e/public-smoke.spec.ts`

## Sampling Strategy

- After shared helper changes: run targeted Vitest for the new helper test files.
- After home/unsubscribe refactors: run targeted Vitest for extracted client components, then the Playwright public smoke spec.
- After newsletters or articles refactors: run the component/unit tests for that slice, then the Playwright public smoke spec.
- Before phase handoff: run the full unit command plus the public smoke spec once.

## Key Risks and Mitigations

1. **Refactors could break public behavior while improving structure**
   - Mitigation: preserve exact visible copy already asserted by existing unit and Playwright tests.

2. **Moving data fetching server-side could complicate existing mocked tests**
   - Mitigation: keep interactive behavior in extracted client components with prop-based inputs so tests stay simple.

3. **Random image selection makes snapshots and assertions unstable**
   - Mitigation: switch to deterministic helper functions keyed by newsletter/article identity.

4. **A shared helper module can become a grab bag**
   - Mitigation: separate concerns into `supabase`, `public-data`, and `presentation/backgrounds` modules with typed exports.

## Plan-Shaping Implications

- Start with a foundation plan that creates shared typed data-access and deterministic page helpers.
- Then refactor page slices in parallel because `home/unsubscribe`, `newsletters`, and `articles` can each consume the shared foundation without touching the same files.
- Reuse the Phase 1 testing and smoke patterns rather than inventing a new verification strategy.
