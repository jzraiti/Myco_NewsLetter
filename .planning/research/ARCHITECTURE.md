# Architecture Research

**Domain:** Existing Next.js App Router public content site with Supabase-backed archives and JUFO reference data
**Researched:** 2026-04-08
**Confidence:** HIGH for Next.js/Supabase integration patterns, MEDIUM for JUFO scale-specific performance because dataset size/update cadence was not documented

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Public Next.js Routes                       │
├──────────────────────────────────────────────────────────────────────┤
│  /articles          /newsletters           /jufo                    │
│  server page        server page            server page              │
│  reads ?page/?q     reads ?page            reads ?page/?q           │
└──────────────┬──────────────────────┬───────────────────────┬───────┘
               │                      │                       │
┌──────────────▼──────────────────────▼───────────────────────▼───────┐
│                    Public data + presentation layer                 │
├──────────────────────────────────────────────────────────────────────┤
│  paginated content services   JUFO dataset adapter   page-shell UI  │
│  pagination nav               search form            archive cards   │
└──────────────┬───────────────────────────────┬───────────────────────┘
               │                               │
┌──────────────▼───────────────┐   ┌───────────▼──────────────────────┐
│ Supabase public content      │   │ Versioned static JUFO dataset    │
│ newsletters / ss_articles    │   │ normalized once, not per-visit   │
└──────────────────────────────┘   └──────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Route pages (`app/articles`, `app/newsletters`, `app/jufo`) | Parse URL state, call data services, compose page sections | Async Server Components using `searchParams` |
| Public data services | Hide Supabase query details and dataset normalization | `src/lib/public-data/*.ts` |
| Pagination/search controls | Update URL state without owning data-fetching | Small Client Components or GET forms + `Link` |
| Archive/list renderers | Render already-shaped page data | Presentational components in `src/components/**` |
| Public page shell primitives | Standardize hero/header/intro/card-surface styling | Shared reusable UI wrappers |

## Recommended Project Structure

```
nextjs-frontend/
├── src/app/
│   ├── articles/page.tsx              # server page reads ?page and optional query
│   ├── newsletters/page.tsx           # server page reads ?page
│   └── jufo/page.tsx                  # server page replaces current client CSV loader
├── src/components/
│   ├── public/
│   │   ├── PublicPageShell.tsx        # shared title/intro/background/surface wrapper
│   │   ├── PublicSearchForm.tsx       # URL-driven search form
│   │   └── PaginationNav.tsx          # numbered pagination UI
│   ├── articles/
│   │   └── ArticlesExplorer.tsx       # modified to render current page items only
│   ├── newsletters/
│   │   └── NewsletterArchive.tsx      # modified to render current page items only
│   └── jufo/
│       └── JufoTable.tsx              # table/list renderer for normalized JUFO rows
├── src/lib/public-data/
│   ├── content.ts                     # modified with paginated Supabase fetchers
│   ├── jufo.ts                        # new JUFO normalization/query adapter
│   ├── pagination.ts                  # new shared page/count helpers
│   └── types.ts                       # expanded with page-result types
└── data/ or src/lib/public-data/
    └── jufo-publications.json         # generated normalized dataset checked into repo
```

### Structure Rationale

- **`src/app/`:** keep routing, query-param parsing, and data composition at the route boundary.
- **`src/lib/public-data/`:** extend the existing shared public-data layer instead of scattering new Supabase and JUFO logic across pages.
- **`src/components/public/`:** centralize the UI refresh so articles, newsletters, and JUFO converge on one public-site design language.
- **Generated JUFO dataset artifact:** parse once at build/update time, not on every browser visit.

## New vs Modified Areas

### New

| Area | Why it should be new |
|------|----------------------|
| `src/lib/public-data/jufo.ts` | JUFO is currently page-local and tightly coupled to client CSV parsing; it needs its own adapter boundary |
| `src/lib/public-data/pagination.ts` | Articles, newsletters, and JUFO will all need the same page normalization and metadata shaping |
| `src/components/public/PaginationNav.tsx` | Numbered pagination is cross-cutting UI, not page-specific logic |
| `src/components/public/PublicPageShell.tsx` | The UI refresh should reduce repeated page chrome/background/intro structure |
| `src/components/jufo/JufoTable.tsx` | Keeps JUFO rendering separate from routing and data loading |

### Modified

| Area | What changes |
|------|---------------|
| `src/app/jufo/page.tsx` | Remove client-side CSV fetch/parse path; switch to server-backed query-param driven page |
| `src/lib/public-data/content.ts` | Replace “fetch everything” helpers with paginated fetchers returning `{ items, page, totalPages, totalCount }` |
| `src/lib/public-data/types.ts` | Add shared pagination result types and JUFO row types |
| `src/app/articles/page.tsx` | Read `searchParams`, request one page from Supabase, pass metadata to UI |
| `src/app/newsletters/page.tsx` | Same as articles, minus text search |
| `ArticlesExplorer` / `NewsletterArchive` | Stop owning full-dataset behavior; render provided slice and pagination controls |
| Shared top-level public pages | Adopt shared page-shell primitives for broader polish without changing app-wide layout responsibilities |

## Architectural Patterns

### Pattern 1: URL-driven server pagination

**What:** Keep page state in the URL and let the route page fetch only the current slice.
**When to use:** Articles and newsletters immediately; JUFO too if search results should be shareable/bookmarkable.
**Trade-offs:** Uses request-time rendering for pages that depend on `searchParams`, but keeps pagination crawlable, testable, and reload-safe.

**Example:**
```typescript
export default async function ArticlesPage(props: PageProps<'/articles'>) {
  const { page = '1', q = '' } = await props.searchParams;
  const result = await fetchPaginatedArticles({
    page: Number(page),
    query: Array.isArray(q) ? q[0] ?? '' : q,
  });

  return <ArticlesExplorer pageResult={result} />;
}
```

### Pattern 2: Normalize JUFO data once, query it many times

**What:** Convert raw CSV into a normalized JSON/TS dataset with pre-trimmed fields and optional lowercased search text.
**When to use:** Immediately for `/jufo`; the current route parses the CSV in the browser on every visit.
**Trade-offs:** Adds a generated artifact or update script, but removes repeated parsing cost and simplifies rendering.

**Example:**
```typescript
export async function fetchJufoPage(input: { page: number; query: string }) {
  const filtered = filterJufoRows(JUFO_PUBLICATIONS, input.query);
  return paginate(filtered, input.page, 50);
}
```

### Pattern 3: Shared public-page primitives, page-specific content blocks

**What:** Extract common hero/background/intro/surface/pagination framing while leaving article cards, newsletter cards, and JUFO tables page-specific.
**When to use:** During UI refresh across public browse pages.
**Trade-offs:** Small refactor cost up front, large reduction in duplicated styling later.

## Data Flow

### Request Flow

```
[User visits /articles?page=3&q=fungi]
    ↓
[app/articles/page.tsx]
    ↓ parses searchParams
[fetchPaginatedArticles]
    ↓
[Supabase query with filters + order + range + count]
    ↓
[page result metadata]
    ↓
[ArticlesExplorer + PaginationNav]
```

### State Management

```
[URL search params]
    ↓
[Server page reads params]
    ↓
[Data service returns page result]
    ↓
[Presentational components render]
    ↓
[Pagination/Search controls update URL]
```

No new global client store is needed. For these features, URL state is the correct state container.

### Key Data Flows

1. **Articles/newsletters pagination:** page number lives in `searchParams` → route page calls Supabase with `order(...).range(...)` and `count` → UI renders current page plus numbered nav.
2. **JUFO performance path:** route page reads query/page → server-side JUFO adapter filters normalized dataset → table renders current slice only.
3. **UI refresh path:** routes keep existing `Layout`/`TopBar`/`Footer`, but page internals move onto shared public-page primitives for consistent polish.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Current app-router + Supabase + static JUFO dataset is sufficient |
| 1k-100k users | Validate indexes for archive sort columns, keep server pagination, cache JUFO normalized data in-process/build artifact |
| 100k+ users | Revisit exact counts and deep offset pagination; keep numbered UX if needed, but consider cached counts or a hybrid seek-pagination backend |

### Scaling Priorities

1. **First bottleneck:** current JUFO page downloads and parses the dataset in the browser; fix this before broader polish.
2. **Second bottleneck:** current content helpers fetch full newsletter/article datasets; replace with paginated Supabase reads before adding richer archive UI.

## Anti-Patterns

### Anti-Pattern 1: Browser-side JUFO CSV parsing in the route component

**What people do:** Keep `"use client"`, fetch the CSV from `/public`, parse every row in `useEffect`, then filter in React state.
**Why it's wrong:** It turns a mostly static reference page into a heavy client page and couples dataset loading, parsing, filtering, and rendering.
**Do this instead:** Move JUFO into a dedicated server-side adapter with a normalized dataset artifact and URL-driven search/pagination.

### Anti-Pattern 2: Fetch-all-then-paginate in React

**What people do:** Reuse the current `fetchPublishedArticles()` / `fetchPublishedNewsletters()` pattern and paginate only after all rows are loaded.
**Why it's wrong:** It wastes Supabase bandwidth, makes page-count metadata awkward, and grows linearly with content volume.
**Do this instead:** Fetch the current page slice in the server page via shared paginated helpers.

### Anti-Pattern 3: Put query-param logic into shared layout

**What people do:** Try to make `Layout`, `TopBar`, or other shared layout components own pagination/search state.
**Why it's wrong:** Next.js layouts do not receive `searchParams`, and shared layout state will become stale or over-coupled.
**Do this instead:** Keep URL parsing at `page.tsx`; pass plain props down.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Supabase public tables | `supabase-js` query in server-side public-data helpers | Use ordered selects plus `.range()`; request `count` for numbered pagination metadata |
| JUFO source dataset | Repo-owned normalized data artifact generated from CSV source | Keep raw source versioned, but never parse it in the browser |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `app/*/page.tsx` ↔ `src/lib/public-data/*` | Direct function call | Route pages own URL parsing; data layer owns query logic |
| `src/lib/public-data/*` ↔ presentational components | Plain typed props | Components should receive already-shaped page results |
| `Layout` ↔ refreshed page shells | Composition | Keep site chrome stable; refresh page internals without turning layout into a state owner |

## Suggested Build Order

1. **Add the new data boundaries first**
   - Create `pagination.ts`
   - Add paginated article/newsletter fetchers in `content.ts`
   - Add `jufo.ts` with normalized dataset loading
   - Reason: UI work should sit on stable data contracts.

2. **Wire route-level URL state next**
   - Update `/articles` and `/newsletters` to consume `searchParams`
   - Replace `/jufo` client page with a server-backed page
   - Reason: this is the main integration seam and unlocks testing.

3. **Introduce shared public UI primitives**
   - `PublicPageShell`, `PublicSearchForm`, `PaginationNav`
   - Reason: once routes expose consistent page metadata, shared UI becomes straightforward.

4. **Refactor page-specific renderers**
   - Modify `ArticlesExplorer`, `NewsletterArchive`, and add `JufoTable`
   - Reason: these components should become thin renderers of already-fetched page slices.

5. **Apply the broader public-site polish sweep**
   - Align articles, newsletters, and JUFO with one visual system
   - Optionally extend the same primitives to home/team later
   - Reason: polish is safest after the data flow is settled.

6. **Finish with regression coverage**
   - Unit tests for pagination helpers and JUFO filtering
   - E2E updates for numbered pagination and JUFO search/page behavior
   - Reason: new URL-driven behavior should be locked down before more UI iteration.

## Sources

- Local codebase: `nextjs-frontend/src/app/jufo/page.tsx`
- Local codebase: `nextjs-frontend/src/lib/public-data/content.ts`
- Local codebase: `nextjs-frontend/src/app/articles/page.tsx`
- Local codebase: `nextjs-frontend/src/app/newsletters/page.tsx`
- Local codebase: `nextjs-frontend/src/components/articles/ArticlesExplorer.tsx`
- Local codebase: `nextjs-frontend/src/components/newsletters/NewsletterArchive.tsx`
- Next.js `page.js` docs: https://nextjs.org/docs/app/api-reference/file-conventions/page
- Next.js `useSearchParams` docs: https://nextjs.org/docs/app/api-reference/functions/use-search-params
- Supabase JavaScript `select()` docs: https://supabase.com/docs/reference/javascript/select
- Supabase JavaScript `range()` docs: https://supabase.com/docs/reference/javascript/range

---
*Architecture research for: Myco Newsletter public browse improvements*
*Researched: 2026-04-08*
