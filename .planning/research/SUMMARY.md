# Project Research Summary

**Project:** Myco Newsletter
**Domain:** Public research-discovery archive and reference site for mycology content
**Researched:** 2026-04-08
**Confidence:** MEDIUM-HIGH

## Executive Summary

Myco Newsletter is not a greenfield app; it is an existing Next.js App Router + Supabase public content product that now needs to behave like a mature archive. The research is consistent: experts would not solve this milestone with more client state, a heavier UI kit, or browser-side JUFO parsing. They would keep the current stack, move pagination and JUFO filtering to the server/data layer, make URL search params the source of truth, and then polish the public UI on top of those stable contracts.

The recommended approach is opinionated: first fix the data path, then add archive UX, then do visual polish. For articles and newsletters, that means Supabase `order + range + count` queries with deterministic sorting and shareable `?page=` / `?q=` URLs. For JUFO, that means replacing client CSV parsing with a normalized server-backed or pre-indexed dataset before adding richer UI. The biggest risks are fake pagination over full datasets, unstable sort order, URL/search drift, and accidentally regressing server rendering during UI polish. Mitigation is straightforward: define data boundaries first, clamp URL params on the server, test adjacent page boundaries, and keep client components small and presentation-only.

## Key Findings

### Recommended Stack

Research strongly favors staying on the current core stack and using it correctly rather than expanding it. Next.js 15 App Router, React 19, Tailwind 3.4, Supabase JS v2, and Supabase Postgres already support the required pagination, caching, and UI work. The main stack change is subtractive: do not build new work on deprecated `@supabase/auth-helpers-nextjs`, and do not add TanStack Query/SWR or a heavy component suite for a mostly read-only public surface.

**Core technologies:**
- **Next.js App Router 15.x:** server-rendered public pages with `searchParams` and caching — best fit for URL-driven pagination and public archive routes.
- **React 19.x:** small client islands for search/pagination controls — enough for targeted responsiveness work without adding global client state.
- **Tailwind CSS 3.4.x:** UI polish with low runtime cost — supports a coherent design pass without a redesign or bundle bloat.
- **Supabase JS v2 + Postgres:** ordered paginated reads and exact counts — the right place to implement archive pagination and move JUFO querying off the client.

Critical version guidance:
- Keep **Next 15.x / React 19.x** together.
- Stay on **Supabase JS v2**.
- Treat **`@supabase/auth-helpers-nextjs`** as deprecated; only adopt `@supabase/ssr` later if cookie-aware SSR auth becomes necessary.

### Expected Features

This milestone’s table stakes are mature archive behavior and JUFO performance, not net-new product breadth. The must-haves are numbered newsletter pagination, article pagination that cooperates with search, stable ordering and counts, a server-backed/pre-indexed JUFO experience, a focused editorial polish pass, and a terminology refresh so JUFO language reflects the current classification model.

**Must have (table stakes):**
- **Newsletter numbered pagination** — users expect archives to be browsable in pages, not endless lists.
- **Article pagination with URL-backed search state** — search and pagination must work together and be shareable.
- **Stable sort order, totals, and empty states** — archive UX is incomplete without predictable ordering and clear feedback.
- **Server-side or pre-indexed JUFO search/pagination** — required performance fix before any more JUFO UI complexity.
- **Editorial polish pass across archive surfaces** — needed so the milestone feels coherent instead of piecemeal.
- **JUFO terminology refresh** — avoids shipping visibly stale classification language.

**Should have (competitive):**
- **Shareable URL state for page/query/filters** — immediate professionalism and low implementation risk.
- **Year jump navigation** — high-value archive scanning enhancement once core pagination is stable.
- **JUFO context/trust panel** — adds meaning beyond a raw lookup table.
- **Detail-on-demand JUFO rows** — better than shipping a wider default table.
- **Featured newest content treatment** — useful once the baseline archive layouts are settled.

**Defer (v2+):**
- **Rich advanced JUFO filters** — defer until real query patterns are validated.
- **Saved views / saved searches** — no evidence yet that repeat behavior justifies them.
- **Comparison/export/admin-grid features** — wrong fit for a public editorial product.
- **Infinite scroll** — explicitly rejected because it weakens orientation and shareability.

### Architecture Approach

The architecture recommendation is clear: keep routing and URL parsing in `app/*/page.tsx`, keep data logic in a shared public-data layer, and keep page components mostly presentational. Articles, newsletters, and JUFO should all follow one pattern: route reads URL params, data service returns `{ items, page, totalPages, totalCount }`, and thin UI components render that slice plus shared pagination/search primitives.

**Major components:**
1. **Route pages (`app/articles`, `app/newsletters`, `app/jufo`)** — parse canonical URL state and compose server-fetched page data.
2. **Public data services (`src/lib/public-data/*`)** — own Supabase queries, JUFO normalization, pagination helpers, and typed page-result shaping.
3. **Shared public UI primitives** — `PublicPageShell`, `PublicSearchForm`, and `PaginationNav` create one consistent archive shell.
4. **Page-specific renderers** — `ArticlesExplorer`, `NewsletterArchive`, and `JufoTable` render already-shaped slices instead of fetching whole datasets.

Key patterns to follow:
- URL-driven server pagination.
- Normalize JUFO data once; query it many times.
- Shared page-shell primitives with page-specific content blocks.
- No new global client store for this milestone.

### Critical Pitfalls

1. **Keeping JUFO CSV parsing on the client** — move parsing/preprocessing off the browser hot path and benchmark with the real dataset.
2. **Adding pagination UI while still fetching full tables** — query only the current slice from Supabase and test for overlap across adjacent pages.
3. **Using `range()` without deterministic ordering** — define explicit primary and secondary sorts so pages do not duplicate or skip rows.
4. **Letting search, page, and rendered state drift out of sync** — make URL params canonical, clamp invalid values, and reset page to 1 when query changes.
5. **Regressing SSR boundaries during polish** — keep page-level fetching on the server and push interactivity into small client components only.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Data Foundations and JUFO Refactor
**Rationale:** This is the highest-risk bottleneck and the main dependency for everything else. JUFO cannot be meaningfully improved while it still parses the full CSV in the browser, and archive pagination should not be built on top of fetch-all helpers.
**Delivers:** Shared pagination helpers, paginated content fetchers, deterministic sort contracts, and a new JUFO adapter backed by normalized server-loaded data.
**Addresses:** JUFO server-backed/pre-indexed search and pagination, stable ordering, result metadata.
**Avoids:** Client-side JUFO parsing, fake pagination, unstable `range()` ordering.

### Phase 2: URL-Driven Archive Pagination
**Rationale:** Once data contracts are stable, articles and newsletters can safely adopt server-driven page/query behavior with shareable URLs.
**Delivers:** `/articles` and `/newsletters` reading canonical `searchParams`, Supabase `order + range + count` queries, numbered pagination UI, query-reset behavior, and valid empty/error states.
**Uses:** Next.js App Router server pages, `next/navigation`, Supabase JS v2.
**Implements:** Route-level URL parsing, paginated data services, shared `PaginationNav`.
**Avoids:** Search/page drift, overlapping page windows, brittle client-owned pagination state.

### Phase 3: Shared Public UI Polish and Accessibility
**Rationale:** Visual refinement should sit on top of settled data flow, not drive it. This is where the milestone becomes cohesive without turning into a redesign.
**Delivers:** Shared `PublicPageShell`, tighter typography/spacing/state consistency, responsive JUFO presentation, accessible pagination semantics, focus/contrast hardening, and refreshed JUFO terminology.
**Addresses:** Editorial polish pass, responsive JUFO result presentation, terminology refresh.
**Avoids:** Regressing SSR boundaries, accessible-looking but inaccessible controls, one-off page styling.

### Phase 4: Validation, Regression Hardening, and v1.x Enhancements
**Rationale:** The research repeatedly warns that pagination features look done before mocks, fixtures, and boundary cases are covered. Close the loop before optional enhancements.
**Delivers:** Updated Playwright/Supabase mocks, unit coverage for pagination helpers and JUFO filtering, tests for invalid URLs and adjacent pages, plus optional year-jump or JUFO detail-on-demand work if capacity remains.
**Addresses:** Regression protection and the first safe differentiators.
**Avoids:** False confidence from page-1-only tests and production-only pagination bugs.

### Phase Ordering Rationale

- **Data before UI:** both architecture and pitfalls research agree that stable data contracts must precede pagination controls and polish.
- **JUFO first among data tasks:** it is the most acute current performance issue and the least compatible with the current client-heavy implementation.
- **Archive pagination before polish:** pagination/search behavior is core product value; visual refinement should improve proven flows, not mask broken ones.
- **Testing closes each seam:** paginated queries, URL state, and accessibility all introduce subtle regressions that need explicit fixture and E2E support.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** confirm JUFO dataset size, refresh cadence, source-of-truth format, and whether repo-checked normalized artifacts are acceptable operationally.
- **Phase 1:** validate exact indexing needs for article/newsletter sort and search columns against real Supabase query plans.
- **Phase 4:** if year-jump navigation or JUFO detail-on-demand is pulled into scope, validate content grouping and mobile interaction patterns against real usage.

Phases with standard patterns (skip research-phase):
- **Phase 2:** URL-driven pagination and search in Next.js App Router with Supabase are well-documented and low novelty.
- **Phase 3:** shared page-shell extraction, pagination semantics, and accessibility hardening follow standard established patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Based mostly on official Next.js, React, and Supabase docs plus direct codebase verification. |
| Features | MEDIUM | Core table-stakes are solid, but some differentiation guidance relies on lower-confidence competitor examples and inferred user expectations. |
| Architecture | HIGH | Strong alignment between official framework patterns and the current codebase structure. |
| Pitfalls | MEDIUM | Well-supported by code review and official docs, but some severity depends on real JUFO dataset size and production query behavior. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **JUFO operational model:** decide whether JUFO should live as a normalized repo artifact, a Supabase-backed table, or another server-loaded asset; validate against update cadence and maintenance workflow.
- **Real query performance:** verify archive counts, ordering, and index strategy with actual data volume before locking in page sizes or exact-count frequency.
- **Current JUFO taxonomy mapping:** confirm how legacy levels and 2026 terminology should appear in UI copy so historical data is accurate without confusing users.
- **Optional enhancement demand:** do not commit roadmap space to advanced filters, saved views, or exports without evidence from real usage.

## Sources

### Primary (HIGH confidence)
- Local codebase review (`.planning/PROJECT.md`, `nextjs-frontend/src/app/**`, `nextjs-frontend/src/lib/public-data/**`, Playwright mocks) — current architecture, bottlenecks, and integration constraints.
- Next.js official docs — App Router `page.tsx`, `searchParams`, `<Link>`, caching, and revalidation patterns.
- Supabase official docs — `select`, `order`, `range`, index guidance, auth-helper deprecation/migration guidance.
- React official docs — `useDeferredValue` behavior and caveats.
- W3C/MDN accessibility guidance — navigation landmarks and `aria-current` semantics for pagination.
- Publication Forum official site — current JUFO terminology and classification changes.

### Secondary (MEDIUM confidence)
- DailyStory newsletter archive documentation — mature archive behavior and public archive expectations.
- Repository-informed architectural inference — recommended project structure and build order based on current file layout.

### Tertiary (LOW confidence)
- Monterey History and Art Association archive example — useful browse-pattern inspiration, but not authoritative for product decisions.

---
*Research completed: 2026-04-08*
*Ready for roadmap: yes*
