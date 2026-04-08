# Phase 5: JUFO Server-Backed Browsing - Research

**Researched:** 2026-04-08
**Domain:** Next.js App Router server-backed JUFO browsing over a repo-owned ranking dataset
**Confidence:** MEDIUM

## Summary

Phase 5 should replace the current browser-heavy JUFO page with a server page that reads URL state, queries a normalized JUFO dataset on the server, and renders only the current result slice. The current route is a client component that fetches `/jfp-export2025.csv`, parses ~37,731 lines (~4.58 MB) in the browser, stores the full dataset in client state, and filters it on every search change. That directly violates `JUFO-01` and `JUFO-02`.

The lowest-risk approach for this phase is to keep JUFO data repo-owned and mostly static, normalize it once with a generation step, and load the normalized artifact from a server-only module. Do not introduce a new JUFO Supabase table in this phase unless you confirm that JUFO data must be operationally editable or queried across multiple backend surfaces. A normalized artifact fits the current scope better, avoids infrastructure churn, and removes the browser-memory spike immediately.

**Primary recommendation:** Use a server `app/jufo/page.tsx` backed by `src/lib/public-data/jufo.ts` and a generated normalized JUFO artifact; never fetch or parse the raw CSV in the browser again.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| JUFO-01 | Visitor can open the JUFO page without loading the full ranking dataset into browser memory | Server page + server-only JUFO adapter + non-browser dataset normalization remove client CSV fetch/parse and full in-memory storage |
| JUFO-02 | Visitor can browse JUFO results through a fast server-backed flow instead of client-side CSV parsing | URL-driven server search/page flow returns only current rows, with optional 50-row paging and server-side filtering |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | **15.1.6 in repo** (latest npm `16.2.3`, published 2026-04-08; repo version published 2025-01-22) | Server page, route-level `searchParams`, cache/revalidation | Already powers the app and officially supports promise-based `searchParams` on `page.tsx` |
| React | **19.0.0 in repo** (latest npm `19.2.5`, published 2026-04-08; repo version published 2024-12-05) | Small client search/pagination controls only | Keep existing React 19 boundaries; this phase should reduce client work, not add more |
| Tailwind CSS | **3.4.1 in repo** (latest npm `4.2.2`, published 2026-03-18; repo version published 2024-01-05) | Existing styling system | No styling-system migration is justified for a performance phase |
| JUFO normalized artifact | **Repo-generated JSON/TS artifact** | Server-loaded publication dataset | Best fit for a large-but-mostly-static source that currently lives as CSV in-repo |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `csv-parse` | **6.2.1** (npm latest, published 2026-03-20) | One-time normalization of raw JUFO CSV | Use in a generation script; do not use it in browser runtime code |
| `next/navigation` | Bundled with Next.js | Client-side URL updates for search/page controls | Use in a small client island if you want live URL-updating search controls |
| Vitest | **4.1.2** (published 2026-03-26) | Unit tests for JUFO adapter and pagination helpers | Required for server filtering/paging logic |
| Playwright | **1.59.1** (published 2026-04-01) | Acceptance test for `/jufo` browsing | Required to prove the route works through the real public page |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Repo-generated normalized artifact | Supabase/Postgres JUFO table | Better for operational querying and admin updates, but adds schema/import/index work that this phase does not require |
| Small client search/page controls | Full client JUFO explorer | Reintroduces hydration and client-state cost around the exact path this phase must slim down |
| Build/update-time CSV parsing | Browser runtime CSV parsing | Faster to prototype, but directly recreates the current memory and responsiveness failure |

**Installation:**
```bash
npm install csv-parse
```

**Version verification:**
- `next`: repo `15.1.6` published 2025-01-22; latest npm `16.2.3` published 2026-04-08
- `react`: repo `19.0.0` published 2024-12-05; latest npm `19.2.5` published 2026-04-08
- `@supabase/supabase-js`: repo `2.48.1` published 2025-01-24; latest npm `2.102.1` published 2026-04-07
- `tailwindcss`: repo `3.4.1` published 2024-01-05; latest npm `4.2.2` published 2026-03-18
- `csv-parse`: latest npm `6.2.1` published 2026-03-20

## Architecture Patterns

### Recommended Project Structure
```text
nextjs-frontend/
├── src/app/
│   └── jufo/page.tsx                    # server page reads ?q and ?page
├── src/components/
│   └── jufo/
│       ├── JufoExplorer.tsx            # presentational renderer
│       └── JufoSearchControls.tsx      # small client URL-control island if needed
├── src/lib/public-data/
│   ├── jufo.ts                         # server-only JUFO adapter
│   ├── pagination.ts                   # shared page math
│   └── types.ts                        # JufoRow and PaginatedResult types
├── src/lib/public-data/generated/
│   └── jufo-publications.json          # normalized artifact checked into repo
└── scripts/
    └── normalize-jufo-data.mjs         # csv -> normalized artifact generation
```

### Pattern 1: Server page owns JUFO query state
**What:** Keep `q` and `page` in URL state, await `searchParams` in `page.tsx`, and fetch the current JUFO slice on the server.
**When to use:** Immediately in Phase 5.
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/page
export default async function Page(props: PageProps<'/jufo'>) {
  const { q = '', page = '1' } = await props.searchParams;

  const result = await fetchJufoPage({
    query: Array.isArray(q) ? q[0] ?? '' : q,
    page: Number(page) || 1,
  });

  return <JufoExplorer pageResult={result} />;
}
```

### Pattern 2: Normalize once, query many times
**What:** Convert the raw CSV into rows with trimmed fields plus a precomputed lowercase `searchText` field.
**When to use:** Before wiring the new JUFO page.
**Example:**
```typescript
// Source: project pattern derived from current public-data layer + verified Next server-page pattern
type JufoRow = {
  key: string;
  name: string;
  publisher: string;
  level: string;
  website: string;
  country: string;
  language: string;
  yearStart: number | null;
  panels: string;
  searchText: string;
};

export function filterJufoRows(rows: JufoRow[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return rows;
  return rows.filter((row) => row.searchText.includes(normalized));
}
```

### Pattern 3: Render a fixed page slice
**What:** Return a fixed page size from the server; recommend 50 rows per page.
**When to use:** Default JUFO browsing and search results.
**Example:**
```typescript
// Source: https://nextjs.org/learn/dashboard-app/adding-search-and-pagination
const PAGE_SIZE = 50;

export function paginate<T>(items: T[], page: number) {
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;

  return {
    items: items.slice(start, start + PAGE_SIZE),
    page: safePage,
    totalCount,
    totalPages,
    pageSize: PAGE_SIZE,
  };
}
```

### Anti-Patterns to Avoid
- **Browser CSV parsing in `page.tsx`:** This is the current failure mode and must be removed entirely.
- **Full-dataset client filtering after SSR:** A server wrapper alone does not help if the client still receives all rows.
- **Index-based row keys:** Use a stable derived key such as `name + publisher + yearStart` so page/filter changes do not reshuffle identity.
- **Putting JUFO query state in shared layout:** `searchParams` belong at the page boundary, not in a shared layout.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSV correctness | Custom browser CSV parser | `csv-parse` in a generation script | CSV edge cases include quoted commas, escaping, blank fields, and malformed rows |
| URL query-state plumbing | Ad hoc local state as source of truth | Next `searchParams` + `useSearchParams`/`useRouter` | Official pattern is shareable, reload-safe, and server-friendly |
| Page math | Page slicing scattered across components | Shared `paginate()` helper | Keeps clamping, total-page math, and empty-state behavior consistent |
| Server/client boundary | Big client JUFO page | Server `page.tsx` + thin client controls | The phase goal is to remove avoidable client work, not hide it |

**Key insight:** In this domain, the dangerous “small custom solution” is the runtime CSV parser. It looks simple until quoting, search normalization, and performance all fail together.

## Common Pitfalls

### Pitfall 1: Keeping the raw CSV on the browser hot path
**What goes wrong:** The route still downloads the full JUFO file and parses it client-side.
**Why it happens:** Replacing the UI without changing the data path feels faster.
**How to avoid:** Remove `"use client"` from `src/app/jufo/page.tsx`, move parsing to a generation step, and load only normalized rows on the server.
**Warning signs:** Long first load, typing lag, visible spinner before first table render, or large browser memory growth.

### Pitfall 2: Returning the full filtered result set from the server
**What goes wrong:** The page becomes “server-backed” in name only, but still serializes thousands of rows to the client.
**Why it happens:** Teams move filtering server-side but forget to page the response.
**How to avoid:** Server adapter must return `{ items, page, totalPages, totalCount }`, not raw arrays.
**Warning signs:** Huge HTML/RSC payloads, slow navigations on broad queries, or table rendering cost proportional to full dataset size.

### Pitfall 3: Search/page drift
**What goes wrong:** A query change lands users on empty or invalid pages.
**Why it happens:** `q` and `page` are updated independently.
**How to avoid:** Reset to `page=1` whenever `q` changes, and clamp invalid page values on the server.
**Warning signs:** Empty-state flashes after searching, broken back/forward navigation, or different results after refresh.

### Pitfall 4: Treating JUFO terminology as frozen
**What goes wrong:** App copy keeps older level language even if the official JUFO site has moved toward “levels 1 and 2” plus “other identified publication channels.”
**Why it happens:** The dataset and explanatory copy evolve at different times.
**How to avoid:** Treat explanatory copy as a content decision to review during planning; do not silently preserve outdated terminology.
**Warning signs:** App copy conflicts with official JUFO classification text updated 2025-12-05.

## Code Examples

Verified patterns from official sources:

### Read `searchParams` in a server page
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/page
export default async function Page(props: PageProps<'/jufo'>) {
  const { q = '', page = '1' } = await props.searchParams;
  return <div>{q} / {page}</div>;
}
```

### Update query params from a client control
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/use-search-params
'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

export function PageLink({ page }: { page: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  params.set('page', page.toString())

  return <Link href={`${pathname}?${params.toString()}`}>{page}</Link>
}
```

### Supabase server pagination pattern
```typescript
// Source: https://supabase.com/docs/reference/javascript/select
// and https://supabase.com/docs/reference/javascript/range
const from = (page - 1) * pageSize
const to = from + pageSize - 1

const { data, count, error } = await supabase
  .from('jufo_publications')
  .select('name,publisher,level', { count: 'exact' })
  .order('name', { ascending: true })
  .range(from, to)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Synchronous `searchParams` in pages | Promise-based `searchParams` in `page.tsx` | Next.js `v15.0.0-RC` | New page code should `await props.searchParams` |
| Client-side CSV parse and filter | Server page + normalized dataset adapter | Current best fit for this repo and phase | Removes browser memory spike and repeated client parsing |
| “Fetch everything, then browse” | URL-driven server state | Reinforced by current Next.js Learn guidance | Keeps views reload-safe and shareable |

**Deprecated/outdated:**
- Building new work on browser CSV parsing for JUFO
- Treating client state as the canonical source for page/search state on App Router browse pages

## Open Questions

1. **Which JUFO CSV is canonical?**
   - What we know: `jfp-export2025.csv`, `jfp-export-cleaned-twice.csv`, and `jfp-export-Aug-7-2025-full.csv` all exist.
   - What's unclear: Which file should feed the normalized artifact and how refreshes are performed.
   - Recommendation: Make “select canonical JUFO source file and refresh process” the first planning task.

2. **Should Phase 5 update explanatory copy to match current JUFO terminology?**
   - What we know: Official criteria updated 2025-12-05 emphasize levels 1 and 2 plus “other identified publication channels”; current app copy still mentions levels 3/2/1/0.
   - What's unclear: Whether current copy is intentionally historical/product-specific.
   - Recommendation: Treat this as an explicit product/content decision during planning, not an incidental code cleanup.

3. **Is static-artifact search sufficient, or is operational server querying required soon?**
   - What we know: Current phase only requires fast server-backed browsing.
   - What's unclear: Whether maintainers expect frequent JUFO updates or richer filters soon after Phase 5.
   - Recommendation: Default to the static normalized artifact now; escalate to Supabase only if update cadence or future filter complexity makes that necessary.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js app, normalization script, tests | ✓ | 25.8.1 | — |
| npm | Package install and test commands | ✓ | 11.11.1 | — |
| Python | Not required for recommended path | ✓ | 3.14.3 | — |

**Missing dependencies with no fallback:**
- None for the recommended normalized-artifact path.

**Missing dependencies with fallback:**
- None.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest `4.1.2` + Playwright `1.59.1` |
| Config file | `nextjs-frontend/vitest.config.ts`, `nextjs-frontend/playwright.config.ts` |
| Quick run command | `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/jufo.test.ts src/components/jufo/JufoExplorer.test.tsx` |
| Full suite command | `npm --prefix nextjs-frontend run test:unit && npm --prefix nextjs-frontend run test:e2e -- tests/e2e/jufo.spec.ts` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| JUFO-01 | `/jufo` loads without browser-side full-dataset path | e2e | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/jufo.spec.ts` | ❌ Wave 0 |
| JUFO-01 | JUFO adapter returns only current page slice | unit | `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/jufo.test.ts` | ❌ Wave 0 |
| JUFO-02 | Search + page state returns correct server-backed rows | unit | `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/jufo.test.ts` | ❌ Wave 0 |
| JUFO-02 | Visitor can browse filtered JUFO results through the public route | e2e | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/jufo.spec.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/jufo.test.ts src/components/jufo/JufoExplorer.test.tsx`
- **Per wave merge:** `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/jufo.spec.ts`
- **Phase gate:** `npm --prefix nextjs-frontend run test:unit && npm --prefix nextjs-frontend run test:e2e -- tests/e2e/jufo.spec.ts`

### Wave 0 Gaps
- [ ] `nextjs-frontend/src/lib/public-data/jufo.test.ts` — covers filtering, clamping, and page-slice behavior for `JUFO-01` and `JUFO-02`
- [ ] `nextjs-frontend/src/components/jufo/JufoExplorer.test.tsx` — covers empty-state and current-slice rendering
- [ ] `nextjs-frontend/tests/e2e/jufo.spec.ts` — covers public browse/search behavior on `/jufo`
- [ ] Fixture-backed JUFO static data path for Playwright mode — keeps `/jufo` deterministic under `NEXT_PUBLIC_E2E_STATIC_DATA=true`

## Sources

### Primary (HIGH confidence)
- Local codebase: `nextjs-frontend/src/app/jufo/page.tsx` — verified current browser CSV fetch/parse path
- Local codebase: `nextjs-frontend/src/lib/public-data/content.ts`, `types.ts`, `src/app/articles/page.tsx`, `src/app/newsletters/page.tsx` — verified existing public-data and server-page patterns
- Local codebase: `nextjs-frontend/package.json`, `playwright.config.ts`, `vitest.config.ts`, `src/lib/public-data/test-fixtures.ts` — verified test infrastructure and current package baselines
- Next.js docs: https://nextjs.org/docs/app/api-reference/file-conventions/page — verified promise-based `searchParams` and request-time behavior
- Next.js docs: https://nextjs.org/docs/app/api-reference/functions/use-search-params — verified client-side query-param access and layout limitation
- Next.js Learn: https://nextjs.org/learn/dashboard-app/adding-search-and-pagination — verified URL-driven search/page pattern and reset-to-page-1 guidance
- Supabase docs: https://supabase.com/docs/reference/javascript/select, https://supabase.com/docs/reference/javascript/range, https://supabase.com/docs/reference/javascript/order, https://supabase.com/docs/reference/javascript/ilike — verified server pagination and case-insensitive filtering primitives
- JUFO official docs: https://julkaisufoorumi.fi/en/evaluations/classification-criteria — verified current classification terminology and last-updated date 2025-12-05
- npm registry metadata for `next`, `react`, `@supabase/supabase-js`, `tailwindcss`, `csv-parse`, `vitest`, `@playwright/test` — verified package versions and publish dates

### Secondary (MEDIUM confidence)
- `.planning/research/STACK.md`, `.planning/research/ARCHITECTURE.md`, `.planning/research/PITFALLS.md` — useful in-repo synthesis, but treated as supporting material behind code and official docs

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** - based on current repo state, npm registry verification, and official Next/Supabase docs
- Architecture: **MEDIUM** - server-page pattern is clear, but the canonical JUFO source file and long-term source-of-truth choice are still unresolved
- Pitfalls: **HIGH** - the primary failure mode is directly visible in current code and reinforced by official App Router guidance

**Research date:** 2026-04-08
**Valid until:** 2026-05-08
