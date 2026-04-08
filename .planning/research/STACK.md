# Stack Research

**Domain:** Existing Next.js + Supabase public content app with JUFO lookup, article/newsletter archives, and UI polish
**Researched:** 2026-04-08
**Confidence:** MEDIUM-HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js App Router | Keep existing 15.x (repo: 15.1.6) | Server-rendered public pages, URL-driven pagination/search, cache control | Already fits the milestone. Use server `searchParams`, `next/navigation`, and `next/cache` instead of adding a client data layer. |
| React | Keep existing 19.x (repo: ^19.0.0) | Interactive search/pagination controls and small client islands | React already provides the right performance tools (`memo`, `useDeferredValue`) for JUFO/list rendering without adding new state or query libraries. |
| Tailwind CSS | Keep existing 3.4.x (repo: 3.4.1) | UI polish with low runtime cost | Best fit for “broader frontend UI polish” when the goal is better visuals without shipping a heavy runtime styling system. |
| Supabase JS | Stay on v2; latest is 2.102.1 (repo: 2.48.1) | Server-backed pagination, ordered reads, exact counts | Already in use and sufficient for numbered pagination via `.select(..., { count: "exact" })`, `.order(...)`, and `.range(...)`. No new data client is needed. |
| Supabase Postgres | Existing managed Postgres | Source of truth for paginated article/newsletter/JUFO data | The right place to move JUFO query work out of the browser. Add indexes here, not more frontend libraries. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/navigation` | Bundled with Next.js 15.x | URL-based page/search state | Use for numbered pagination controls that update `?page=` / `?q=` while the actual data fetch stays server-side. |
| `next/cache` | Bundled with Next.js 15.x | Cache public Supabase reads | Use `unstable_cache` or route/page revalidation for public archive and JUFO reads so repeated visits do not hit Supabase unnecessarily. |
| `server-only` | 0.0.1 optional | Prevent server data modules from leaking into client bundles | Add only if you split paginated/JUFO data access into dedicated server-only modules. Useful, but not mandatory. |
| `react-markdown` | Keep existing; latest is 10.1.0 (repo: 9.0.3) | Article summary rendering | Keep using it for article summaries; pagination and JUFO work do not require a different renderer. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Supabase Query Performance / Index Advisor | Verify pagination and JUFO queries use indexes | Use before adding speculative indexes. This is the right tool for the JUFO performance part of the milestone. |
| Existing Vitest + Playwright | Protect pagination URL behavior and JUFO regressions | Extend current tests rather than adding new test frameworks. Cover `?page=` behavior, count display, and empty/error states. |

## Installation

```bash
# Required for this milestone
# No new core package is required.

# Recommended cleanup
npm uninstall @supabase/auth-helpers-nextjs

# Optional hardening for server-only data modules
npm install server-only
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js Server Components + URL search params | TanStack Query / SWR | Use only if this milestone becomes highly client-interactive with optimistic updates or complex client cache sync. That is not the current requirement. |
| Supabase `.order()` + `.range()` + exact count | Client-side fetch-all then slice in React | Only acceptable for tiny, effectively static datasets. It is the wrong direction for newsletters/articles pagination and is already a problem pattern for JUFO. |
| Tailwind + existing UI primitives | Full component suite (MUI, Chakra, Ant Design) | Use only if the product is shifting to a full design-system rebuild. For this milestone, they add bundle weight and migration cost without solving the core problems. |
| Targeted DB indexes | Search service (Algolia/Meilisearch/Elastic) | Use only if JUFO/article search becomes genuinely large-scale or fuzzy-search-heavy. Current scope does not justify another service. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@supabase/auth-helpers-nextjs` | Supabase officially directs users to migrate away from auth helpers to `@supabase/ssr`; the package is deprecated for new work | Remove it. Only add `@supabase/ssr` later if cookie-aware SSR auth is actually needed. |
| TanStack Query / SWR for public archive pagination | Duplicates Next.js server data flow and adds invalidation/state complexity for a mostly read-only public surface | Fetch in the page/server layer and let the paginator only mutate the URL. |
| Client-side CSV fetch + parse for JUFO | Forces large parsing/filtering work into the browser, delays first render, and makes pagination impossible without downloading everything | Move JUFO data behind Supabase/Postgres or a server-prepared dataset and page it on the server. |
| New heavy UI/animation libraries | UI polish is needed, not a second component system or more runtime JS | Use Tailwind, existing components, and CSS-first transitions; keep motion usage small. |
| List virtualization as the first fix | It treats the rendering symptom, not the current root problem of over-fetching and client-side parsing | First paginate/filter on the server. Only add virtualization later if a single page still renders hundreds of rows. |

## Stack Patterns by Variant

**If JUFO becomes server-backed in this milestone:**
- Store/query JUFO rows from Supabase instead of `/jfp-export2025.csv`
- Fetch only the current page on the server
- Add Postgres indexes for the chosen sort and search fields
- Use client code only for lightweight input/pagination controls

**If JUFO data remains mostly static but large:**
- Still remove browser CSV parsing
- Preprocess/import once, then cache aggressively with Next.js revalidation
- Prefer daily/hourly revalidation over per-request dynamic rendering

**If numbered pagination is added to articles/newsletters:**
- Put `page` (and optional `q`) in the URL
- Read it in the server page via `searchParams`
- Query Supabase with `order + range + count`
- Render the page of results on the server; use `<Link>` for paginator buttons/numbers

**If any client-side filtering remains on the visible page slice:**
- Use React `memo` for row/list components
- Use `useDeferredValue` for the search input only when typing causes visible jank
- Do not confuse `useDeferredValue` with network debouncing

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@15.x` | `react@19.x`, `react-dom@19.x` | Matches the current app structure and supports App Router server pages, `searchParams`, and cache APIs. |
| `@supabase/supabase-js@2.x` | Next.js 15 server/client code | Enough for paginated public reads; no extra query library required. |
| `tailwindcss@3.4.x` | Next.js 15 | Good fit for UI polish without runtime styling overhead. |
| `@supabase/auth-helpers-nextjs@0.10.0` | Deprecated path | Do not build new work on this package. If SSR auth is needed later, migrate to `@supabase/ssr`. |

## Sources

- Local codebase: `/home/acheney/Public/Myco_NewsLetter/.planning/PROJECT.md` and `nextjs-frontend/src/**` — verified current architecture and current JUFO/client-fetch pattern. HIGH confidence.
- Next.js official docs: `https://nextjs.org/docs/app/api-reference/functions/use-search-params` — confirmed URL search param behavior and server/client boundaries. HIGH confidence.
- Next.js official docs: `https://nextjs.org/docs/app/api-reference/components/link` — confirmed URL-driven navigation and pagination link behavior. HIGH confidence.
- Next.js official docs: `https://nextjs.org/docs/app/guides/caching-without-cache-components` and `https://nextjs.org/docs/app/getting-started/revalidating` — confirmed `unstable_cache`, revalidation, and caching guidance for non-`fetch` data sources. HIGH confidence.
- Supabase official docs: `https://supabase.com/docs/guides/auth/server-side/migrating-to-ssr-from-auth-helpers` and `https://supabase.com/docs/guides/auth/auth-helpers/nextjs` — confirmed auth helpers deprecation/migration path. HIGH confidence.
- Supabase official docs: `https://supabase.com/docs/reference/javascript/range` and `https://supabase.com/docs/reference/javascript/order` — confirmed built-in pagination/order primitives in `supabase-js` v2. MEDIUM-HIGH confidence (official URLs verified; full pages were too large for direct capture).
- Supabase official docs: `https://supabase.com/docs/guides/database/postgres/indexes` and `https://supabase.com/docs/guides/troubleshooting/how-postgres-chooses-which-index-to-use-_JHrf4` — confirmed index strategy should live in Postgres, especially for ordered and filtered reads. HIGH confidence.
- React official docs: `https://react.dev/reference/react/useDeferredValue` — confirmed deferred rendering is appropriate for slow client list rendering, not as a network request reduction tool. HIGH confidence.

---
*Stack research for: Myco Newsletter milestone focused on JUFO performance, Supabase pagination, and frontend UI polish*
