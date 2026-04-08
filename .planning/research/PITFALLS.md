# Pitfalls Research

**Domain:** Existing Next.js + Supabase public content site adding JUFO performance fixes, numbered pagination, and UI polish
**Researched:** 2026-04-08
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Keeping JUFO CSV parsing on the client hot path

**What goes wrong:**
The JUFO page stays a client component, fetches the raw CSV in the browser, parses every row on first load, and filters the full dataset on every keystroke. The page feels slow, blocks input, and gets worse as the dataset grows.

**Why it happens:**
The current implementation in `src/app/jufo/page.tsx` does all parsing and filtering in the browser because it was simple to ship initially.

**How to avoid:**
- Move CSV parsing/preprocessing off the client hot path.
- Convert JUFO data to a normalized JSON or server-loaded structure at build time or on the server.
- Precompute normalized search fields once.
- If client-side search remains, debounce network/URL updates and use `memo`/`useDeferredValue` only after reducing the underlying work.
- Add a dataset-size guardrail: measure first paint and input latency against the real JUFO file before shipping.

**Warning signs:**
- `/jufo` shows a long spinner before any rows render.
- Typing in search lags or drops keystrokes.
- CPU spikes in browser profiling while parsing/filtering.
- The page regresses noticeably when the CSV grows.

**Phase to address:**
Phase 1 — JUFO data loading and performance refactor.

---

### Pitfall 2: Adding pagination in the UI while still fetching entire Supabase tables

**What goes wrong:**
The site displays numbered pagination controls, but `articles` or `newsletters` still fetch all rows and slice in memory. This preserves the UX illusion of pagination while keeping bandwidth, query cost, and server render time unnecessarily high.

**Why it happens:**
The current data layer in `src/lib/public-data/content.ts` selects all newsletters and articles, sorts in application code, and returns full arrays. It is easy to add a pager component without changing the query model.

**How to avoid:**
- Move pagination into the Supabase query using ordered queries plus `range()`.
- Return only the current page payload and the minimum metadata needed for page count.
- Keep page state in URL search params so server-rendered pages can fetch the correct slice.
- Add tests that fail if page 1 and page 2 return overlapping records.

**Warning signs:**
- Network responses still contain the full article/newsletter list.
- Page navigation feels identical in cost to the unpaginated version.
- Memory usage rises with content volume.
- Large archives become slow even though pagination exists.

**Phase to address:**
Phase 2 — Supabase-backed pagination and URL state.

---

### Pitfall 3: Using `range()` without a stable, deterministic sort

**What goes wrong:**
Pagination skips rows, duplicates rows across pages, or changes order between requests. This is especially easy to trigger when multiple rows share the same date.

**Why it happens:**
Range pagination is only reliable when the query order is deterministic. The current code sorts in application code after fetching everything; once pagination moves to the database, the ordering contract must become explicit.

**How to avoid:**
- Always apply `order(...)` before `range(...)`.
- Use a deterministic secondary sort key, e.g. `created_at desc, id desc` for newsletters and `publicationDate desc, id desc` for articles.
- Mirror that order in tests and fixture data.
- Treat sort order as part of the public contract, not a cosmetic detail.

**Warning signs:**
- Records appear on two pages.
- Refreshing the same page changes item order.
- Newly inserted records push users into confusing gaps.
- Tests only assert that “some results” render, not which results render.

**Phase to address:**
Phase 2 — query design before UI pagination is built.

---

### Pitfall 4: Letting search, page, and server rendering drift out of sync

**What goes wrong:**
The visible input, URL, and rendered results disagree. Users share a link and see different results, or search changes keep them on an invalid page number that renders empty states.

**Why it happens:**
In Next.js App Router, pagination/search state often spans server `searchParams` and client hooks. It is common to wire one side and forget the other.

**How to avoid:**
- Make URL search params the source of truth for search and page.
- Reset `page=1` whenever the query changes.
- Sanitize invalid page params on the server (`<1`, non-numeric, overflow beyond total pages).
- Keep input default value synced from search params.
- Add tests for direct links like `/articles?page=3&query=mycorrhiza`.

**Warning signs:**
- Empty pages appear only after searching.
- Browser back/forward produces surprising results.
- Shared links do not recreate the same filtered page.
- The input shows one query while the page renders another set.

**Phase to address:**
Phase 2 — URL-state and pagination integration.

---

### Pitfall 5: Regressing the current server-backed public-page model during UI polish

**What goes wrong:**
To add spinners, transitions, or visual tweaks, pages get pushed back to `"use client"`, or data fetching migrates into large client components. This reintroduces avoidable client work and undermines the milestone’s earlier server-backed refactor.

**Why it happens:**
UI polish often tempts teams to colocate visuals, state, and fetching in one component. This codebase already split public pages into server-backed routes for performance; polish work can accidentally collapse those boundaries.

**How to avoid:**
- Keep page-level data fetching on the server.
- Isolate interactivity into small client components below server boundaries.
- Treat `"use client"` as a narrowly-scoped escape hatch.
- Review any UI-polish PR for bundle-size and hydration impact.
- Verify page behavior still works with the existing E2E fixture approach for server-rendered routes.

**Warning signs:**
- Page files suddenly become client components.
- Supabase browser calls reappear in page-level components.
- Lighthouse/hydration cost worsens after “just UI” changes.
- Existing E2E tests need brittle client-only workarounds.

**Phase to address:**
Phase 3 — UI polish with SSR boundary protection.

---

### Pitfall 6: Shipping accessible-looking pagination and polished cards that are not actually accessible

**What goes wrong:**
The UI looks better visually but becomes harder to use with keyboard and screen readers. Pagination lacks `nav` labeling and `aria-current`, focus states disappear on dark/glassmorphism surfaces, and “loading” or “no results” states are unclear.

**Why it happens:**
Public-content sites often optimize for visual polish first. The current UI already relies heavily on translucent backgrounds and custom cards, which raises contrast and focus-visibility risk.

**How to avoid:**
- Implement pagination inside a labeled `nav` landmark.
- Mark exactly one current page control with `aria-current="page"`.
- Preserve visible keyboard focus on all links/buttons.
- Check contrast on background-image overlays, not just in isolation.
- Add empty/loading/result-count messaging that works without visual inference.

**Warning signs:**
- Tab order is hard to follow.
- Current page is indicated only by color.
- Pagination is announced as generic links with no context.
- Dark overlays make text/buttons readable on some images but not others.

**Phase to address:**
Phase 3 — accessibility pass as part of UI polish.

---

### Pitfall 7: Forgetting the test and fixture changes required by paginated server data

**What goes wrong:**
Production pagination works, but acceptance tests either fail or give false confidence because mocked Supabase responses do not model `range`, ordering, or counts.

**Why it happens:**
This codebase’s Playwright setup currently fulfills whole-table JSON for `newsletters` and `ss_articles`. Pagination needs additional behavior, especially if total pages depend on counts or `content-range` headers.

**How to avoid:**
- Update fixture-backed server data and Playwright route mocks before or alongside implementation.
- Add test cases for first/last/middle page, invalid page params, and query + page combinations.
- If counts are used, mock the exact headers/response shape your code depends on.
- Keep unit tests around page URL builders and query normalization logic.

**Warning signs:**
- Tests pass only for page 1.
- Pagination controls render in production but are absent in tests.
- Mocks ignore query params and always return the same payload.
- A refactor “works locally” but breaks CI on route-level assertions.

**Phase to address:**
Phase 2 for pagination fixtures, then Phase 3 for regression hardening.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keep JUFO CSV parsing inside `src/app/jufo/page.tsx` | No new data pipeline work | Slow initial load and repeated client CPU cost | Only as a temporary spike, not for shipped milestone work |
| Paginate by `array.slice()` after fetching all rows | Fastest UI demo | Fake pagination, wasted bandwidth, harder future scaling | Never for public archive pages |
| Sort only by date column | Simple query | Duplicate/missing rows across pages when dates collide | Never once numbered pagination ships |
| Use list index as fallback key for paginated content | Easy render fix | Unstable card identity and subtle UI bugs across page/filter changes | Only for static, never-reordered lists |
| Push visual polish into page-level client components | Fewer files | Reintroduces hydration work and weakens server/data boundaries | Rarely; only for truly interactive routes |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Supabase public queries | Add page controls but leave `select(...)` unbounded | Use ordered queries plus `range()` so Supabase returns only one page |
| Supabase counts | Request exact counts on every tiny interaction without measuring impact | Use count only where required for pagination metadata and verify response shape in tests |
| Next.js App Router | Store page/query only in local client state | Make URL search params canonical and let the server consume them |
| Playwright Supabase mocks | Mock only raw arrays and ignore query params/headers | Mock paginated behavior, count metadata, and search/page combinations explicitly |
| React rendering optimization | Assume `useDeferredValue` reduces network requests | Use it only for render responsiveness; combine with debouncing or server-side filtering when requests must be reduced |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Full JUFO dataset parse in browser | Long spinner, typing lag, mobile slowdowns | Preprocess once, load structured data, reduce per-render work | Already visible with medium CSV sizes |
| Full article/newsletter fetch for every page view | Slow server render and large payloads | Query only current page plus count metadata | Breaks as archive size grows beyond the current small dataset |
| Exact-count query on every keystroke | Extra DB load during search/pagination | Debounce search changes and avoid recomputing total pages more often than needed | Noticeable once search traffic or content size increases |
| Rendering heavy markdown/image cards for large filtered lists | Input jank and long paint times | Paginate aggressively, memoize expensive subtrees, keep cards simple | Breaks earlier on lower-end devices |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Broadening public Supabase selects during refactor (`select(*)`) | Exposing fields the public site never needed | Keep explicit column lists for public queries |
| Trusting page/query params without clamping | Expensive or pathological queries from malformed URLs | Normalize page bounds and accepted query formats server-side |
| Treating all external content links as inherently safe | Broken UX or unsafe redirects if data becomes editable later | Validate/sanitize stored external URLs and preserve `rel="noopener noreferrer"` |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Search does not reset page number | Users land on empty pages and think content is missing | Reset to page 1 whenever filters change |
| Pagination is not shareable | Users cannot bookmark the exact archive view they found | Encode page and query in the URL |
| JUFO improvements optimize data but not perceived responsiveness | Page is technically faster but still feels laggy | Pair data fixes with clear loading, stale-state, and empty-state feedback |
| UI polish changes visuals without consistency | Site feels uneven and harder to navigate | Apply one small system of spacing, focus, contrast, and button/link treatments |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **JUFO performance:** Often missing real profiling on the production-sized file — verify browser parse and typing latency on the actual dataset.
- [ ] **Numbered pagination:** Often missing deterministic ordering — verify no duplicates or gaps across adjacent pages.
- [ ] **Search + pagination:** Often missing page reset and URL sync — verify refresh, share-link, and back/forward behavior.
- [ ] **Supabase pagination:** Often missing test coverage for counts/ranges — verify Playwright mocks reflect real paginated responses.
- [ ] **UI polish:** Often missing keyboard/focus/contrast checks — verify with keyboard-only navigation and dark-image backgrounds.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Client-side JUFO parse remains slow | MEDIUM | Move parsing to build/server step, cache normalized data, add benchmark to prevent regression |
| Fake pagination over full datasets | MEDIUM | Refactor the data layer first, add page-aware fetch functions, then reconnect UI controls |
| Unstable paginated ordering | HIGH | Introduce explicit multi-column ordering, rebaseline tests, validate all page boundaries |
| URL/search/page state drift | MEDIUM | Centralize param parsing, clamp invalid values, add route-level tests for shared URLs |
| Accessibility regressions from UI polish | MEDIUM | Audit controls, restore focus styles, add labels/`aria-current`, and rerun keyboard checks |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Keeping JUFO CSV parsing on the client hot path | Phase 1 — JUFO performance refactor | Profile `/jufo` with production-sized data and confirm input stays responsive |
| UI pagination over full-table fetches | Phase 2 — server-backed pagination | Inspect network/query behavior and confirm one-page payloads |
| Unstable ordering with `range()` | Phase 2 — query contract definition | Test adjacent pages for no overlap and stable refresh order |
| Search/page/server state drift | Phase 2 — URL state integration | Verify direct-link, refresh, and back/forward behavior |
| Regressing SSR boundaries during UI polish | Phase 3 — UI polish with boundary review | Confirm page-level fetching stays server-backed and bundle/hydration cost does not jump |
| Accessible-looking but inaccessible pagination/UI | Phase 3 — accessibility hardening | Verify keyboard navigation, labeled nav, and `aria-current="page"` |
| Missing paginated mock/test updates | Phase 2 then Phase 3 | CI covers multi-page, invalid-page, and query+page cases |

## Sources

- Repository context: `/home/acheney/Public/Myco_NewsLetter/.planning/PROJECT.md` — HIGH confidence
- Current implementation review: `nextjs-frontend/src/app/jufo/page.tsx` — HIGH confidence
- Current implementation review: `nextjs-frontend/src/lib/public-data/content.ts` — HIGH confidence
- Current implementation review: `nextjs-frontend/tests/e2e/support/mockSupabase.ts` and public route specs — HIGH confidence
- Next.js Learn: Adding Search and Pagination — official guidance for URL search params, page reset, and server/client split — https://nextjs.org/learn/dashboard-app/adding-search-and-pagination — HIGH confidence
- React docs: `useDeferredValue` caveats and behavior — https://react.dev/reference/react/useDeferredValue — HIGH confidence
- W3C ARIA APG navigation landmark guidance — https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html — HIGH confidence
- MDN `aria-current` reference for pagination semantics — https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current — MEDIUM confidence
- Supabase JS docs for ordered/ranged queries: `order()` and `range()` — https://supabase.com/docs/reference/javascript/order and https://supabase.com/docs/reference/javascript/range — MEDIUM confidence (official docs located via current search results; content not fully fetched due tool size limits)

---
*Pitfalls research for: Myco Newsletter subsequent milestone*
*Researched: 2026-04-08*
