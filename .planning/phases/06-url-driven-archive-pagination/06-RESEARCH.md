---
phase: 06-url-driven-archive-pagination
created: 2026-04-08
status: complete
---

# Phase 6 Research: URL-Driven Archive Pagination

## Question

What do we need to know to plan Phase 6 well?

## Inputs Read

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/PROJECT.md`
- `.planning/STATE.md`
- `.planning/phases/06-url-driven-archive-pagination/06-CONTEXT.md`
- `.planning/phases/05-jufo-server-backed-browsing/05-01-SUMMARY.md`
- `.planning/phases/05-jufo-server-backed-browsing/05-02-SUMMARY.md`
- `.planning/phases/05-jufo-server-backed-browsing/05-VERIFICATION.md`
- `.planning/phases/04-public-journey-acceptance-coverage/04-03-SUMMARY.md`
- `nextjs-frontend/src/app/articles/page.tsx`
- `nextjs-frontend/src/components/articles/ArticlesExplorer.tsx`
- `nextjs-frontend/src/components/articles/ArticlesExplorer.test.tsx`
- `nextjs-frontend/src/app/newsletters/page.tsx`
- `nextjs-frontend/src/components/newsletters/NewsletterArchive.tsx`
- `nextjs-frontend/src/components/newsletters/NewsletterArchive.test.tsx`
- `nextjs-frontend/src/lib/public-data/content.ts`
- `nextjs-frontend/src/lib/public-data/types.ts`
- `nextjs-frontend/src/lib/public-data/test-fixtures.ts`
- `nextjs-frontend/src/app/jufo/page.tsx`
- `nextjs-frontend/src/components/jufo/JufoSearchControls.tsx`
- `nextjs-frontend/tests/e2e/articles.spec.ts`
- `nextjs-frontend/tests/e2e/newsletters.spec.ts`
- `nextjs-frontend/tests/e2e/support/publicJourneyTest.ts`
- `nextjs-frontend/playwright.config.ts`

## User-Locked Decisions To Honor

- Use numbered pagination with `Previous` and `Next` on both archive routes (D-01).
- Highlight the current page and show first/last links when useful for orientation (D-02).
- Keep article search and pagination in the URL (D-03).
- Reset article pagination to page `1` when search changes (D-04).
- Use a fixed page size for Phase 6, shared across articles and newsletters unless a justified exception appears (D-05, D-06).
- Resolve invalid page params to a valid archive state instead of leaving broken state (D-07).
- Show a clear empty article-search state with a reset path (D-08).
- Preserve stable ordering and clear current-page / no-results feedback (D-09).

## Existing Patterns Worth Reusing

## 1. Next.js 15 server-page plus thin client control island

Phase 5 already established the right route shape on `/jufo`:

- `searchParams` is awaited in the server page.
- The server page normalizes `q` and `page`.
- The server page fetches only the current slice.
- A small client component owns URL updates.

This is the best direct reference for Phase 6. It matches the current Next.js 15 async `searchParams` pattern and avoids drifting back to browser-owned full datasets.

## 2. Shared public-data seam already exists

`src/lib/public-data/content.ts` already owns published article and newsletter access.

That means pagination should be added there rather than embedding Supabase query logic inside route files. Phase 2 established this as the repo pattern, and Phase 6 should extend it rather than bypass it.

## 3. Fixture-backed acceptance tests still work for server-rendered pages

`playwright.config.ts` sets `NEXT_PUBLIC_E2E_STATIC_DATA=true`, and `content.ts` already branches to deterministic fixtures in that mode.

This is important: archive pagination can remain server-backed in production while still being deterministic in Playwright, as long as the fixture arrays are expanded beyond one page.

## Recommended Technical Approach

## Data layer

Add two new server-facing helpers in `src/lib/public-data/content.ts`:

- `fetchPaginatedArticles({ query, page })`
- `fetchPaginatedNewsletters({ page })`

Each should return a single paginated result object, not raw arrays.

Recommended contract:

```ts
export interface ArchiveQuery {
  page: number;
  query: string;
}

export interface PaginatedArchiveResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  query: string;
}
```

## Live Supabase query shape

Recommended live-query pattern:

- Use `select(..., { count: "exact" })`
- Apply stable descending ordering before slicing
- Use `range(from, to)` for the current page window
- For article search, apply one server-side text filter before `range`

Recommended ordering:

- Articles: `publicationDate desc`, then `id desc` as a tie-breaker
- Newsletters: `created_at desc`, then `id desc` as a tie-breaker

This directly addresses `ARTP-03` and `NEWS-03`: stable ordering while paging.

## Article search strategy

Keep `q` in the URL and search server-side against:

- `title`
- `venue`
- `llm_summary`

Recommended Supabase filter form:

```ts
.or(`title.ilike.%${query}%,venue.ilike.%${query}%,llm_summary.ilike.%${query}%`)
```

The route should still trim whitespace before querying. The current client-only `filterArticlesByQuery()` helper should stay for fixture-mode and unit-test reuse, but production page results should come from paginated server queries, not a full in-memory list.

## URL and invalid-page handling

Recommended canonical rules:

- Invalid or missing page values resolve to page `1`.
- Out-of-range page values resolve to the last valid page.
- Blank `q` should be removed from the URL, not preserved as `q=`.
- When article search changes, the URL should immediately become `page=1` with the new `q` (D-04).

Use the server page to normalize incoming URL state and the client component to update the URL for interactive changes.

## Fixed page size recommendation

Use `12` items per page for both articles and newsletters.

Why `12`:

- Small enough to noticeably reduce server payload and page clutter.
- Large enough to avoid making the archive feel overly fragmented.
- Works well with card-based archive layouts already present on both routes.
- Satisfies D-05 and D-06 with one shared milestone-level constant.

## Pagination UI behavior

Use the same interaction model on both routes:

- `Previous`
- numbered pages
- `Next`
- current page visibly highlighted
- first/last page links when total pages are large enough that intermediate pages are condensed

Recommended condensation rule:

- If `totalPages <= 7`, show every page.
- Otherwise show: `1`, `current-1`, `current`, `current+1`, `totalPages`, with ellipses where gaps exist.

This satisfies D-01 and D-02 without turning Phase 6 into a broader redesign.

## Empty-state behavior

Articles:

- No search results should show a message that includes the active query.
- Include a visible `Clear search` action that returns to `/articles`.

Newsletters:

- Keep a simple archive empty state if the dataset is empty.
- Paging controls should not render when `totalCount === 0`.

## Test impact and required fixture change

Current fixtures are too small for real pagination assertions:

- `TEST_ARTICLES` has 2 rows
- `TEST_NEWSLETTERS` has 1 row

Phase 6 needs fixture expansion to at least 15 items for each archive so page 2 exists when `pageSize = 12`.

Keep the current named fixture rows at the front of the dataset so existing route expectations remain recognizable, then append deterministic older rows.

## Common Pitfalls To Avoid

- Do not fetch the full article or newsletter dataset and paginate in the browser. That would violate `ARTP-01`, `NEWS-01`, and the milestone goal.
- Do not keep article search only in component state. D-03 explicitly locks URL state.
- Do not forget page reset on article search changes. D-04 is mandatory.
- Do not allow `?page=999` or `?page=abc` to remain unresolved in the final rendered state. D-07 requires valid resolution.
- Do not reorder archive rows differently between filtered and unfiltered states. Stable ordering matters to D-09.
- Do not depend on live Supabase data in tests. Reuse the fixture-backed server data path already established.

## Planning Implications

The phase should be split into three plans:

1. Shared archive data and fixture foundation
2. Article route/UI rewiring plus coverage
3. Newsletter route/UI rewiring plus coverage

Reason:

- The shared data layer is a real dependency because both archives touch `content.ts` and shared fixtures.
- After that foundation lands, article and newsletter UI work can run in parallel because they touch separate route/component/spec files.

## Validation Architecture

## Framework

- Unit/component: Vitest via `npm --prefix nextjs-frontend run test:unit -- ...`
- Acceptance: Playwright via `npm --prefix nextjs-frontend run test:e2e -- ...`

## Fast feedback loop

- Shared data task: `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/content.test.ts`
- Article UI task: `npm --prefix nextjs-frontend run test:unit -- src/components/articles/ArticlesExplorer.test.tsx`
- Newsletter UI task: `npm --prefix nextjs-frontend run test:unit -- src/components/newsletters/NewsletterArchive.test.tsx`
- E2E route checks: `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/articles.spec.ts tests/e2e/newsletters.spec.ts`

## Phase-level suite

```bash
npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/content.test.ts src/components/articles/ArticlesExplorer.test.tsx src/components/newsletters/NewsletterArchive.test.tsx
npm --prefix nextjs-frontend run test:e2e -- tests/e2e/articles.spec.ts tests/e2e/newsletters.spec.ts
```

## Research Conclusion

Phase 6 does not need a new library or a new architectural layer. It should reuse the Phase 5 URL-driven server-page pattern, add shared paginated Supabase helpers in `content.ts`, expand deterministic fixtures so page 2 exists in tests, and then rewire `articles` and `newsletters` into server-backed paginated routes with stable URL state.
