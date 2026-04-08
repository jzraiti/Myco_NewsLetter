# Feature Research

**Domain:** Public research-discovery archive UI for JUFO rankings, article archives, and newsletter archives
**Researched:** 2026-04-08
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist once archives and ranking datasets grow beyond a single screen. Missing these will make the milestone feel unfinished.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Numbered newsletter pagination with previous/next | Mature newsletter archives stop dumping every issue into one long list; users expect to jump to a specific page and keep orientation | MEDIUM | Depends on existing `newsletters` route and shared public-data layer. Use server-backed page params and total-count queries, not client-only slicing. |
| Numbered article pagination that cooperates with search | Article archives typically combine search + page navigation, with page state visible in the URL | HIGH | Depends on existing article browse/search flow. Search changes should reset page to 1; page/query must be shareable via URL. |
| Stable sort order, totals, and clear empty states | Users expect newest-first archives, visible result counts, and predictable “no results” handling | LOW | Builds directly on existing newsletter/article listing behavior. This is part of pagination UX, not a separate later enhancement. |
| Server-side JUFO search/filter/pagination instead of loading the whole dataset into the browser | Large ranking datasets in mature products are queried in windows; full client CSV parsing becomes slow, memory-heavy, and harder to evolve | HIGH | Current JUFO page fetches and parses a CSV client-side. Refactor to a server-backed or pre-indexed dataset path before adding more UI chrome. |
| Responsive JUFO result presentation | Public ranking tools usually show a focused default column set, then reveal extra metadata on demand instead of forcing one giant wide table everywhere | MEDIUM | Depends on JUFO data normalization. On small screens, use row expansion/detail view rather than horizontal-table-first design. |
| Editorial polish across archive/list surfaces | For a content product, mature polish means stronger type hierarchy, cleaner spacing, consistent card/table states, focus states, and loading/skeleton treatment | MEDIUM | Depends on existing shared layout/components. This should be a system pass across articles, newsletters, and JUFO rather than one-off page tweaks. |
| JUFO terminology that matches the current classification | Users expect the product to reflect the current JUFO ecosystem, not a stale snapshot | MEDIUM | Official JUFO changed Level 0 naming to “other identified publication channels” and removed Level 3 from active classification starting 2026; existing UI still reflects the older 0–3 framing. |

### Differentiators (Competitive Advantage)

These are the highest-value additions for this milestone after the table stakes are covered.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Shareable URL state for page, query, and JUFO filters | Makes archives and lookup results easy to bookmark, send, and revisit; this feels professional immediately | MEDIUM | Extends the pagination work. Best implemented with Next.js `searchParams` on server pages. |
| Year jump navigation or year grouping on newsletter/article archives | Editorial archives become much easier to scan when users can jump by year instead of paging blindly | MEDIUM | Depends on stable newest-first ordering and paginated archives. Good v1.x enhancement if core pagination lands first. |
| JUFO context/trust panel | Adds value beyond a raw table by explaining ranking meaning, update cadence, and legacy/current level mapping | LOW | Existing page already contains explanatory copy; upgrade it with “last updated”, current taxonomy, and legacy-history language. |
| Editorial-style featured treatment for newest content | A featured newest newsletter or newest article cluster makes the archive feel curated rather than dump-like | MEDIUM | Depends on existing content data and shared UI components. Keep it lightweight and content-led. |
| Detail-on-demand for JUFO rows | Lets users inspect publisher/country/panel/history without overwhelming the default list | MEDIUM | Better fit than more columns. Depends on normalized JUFO records and responsive row/card design. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Infinite scroll for newsletters/articles/JUFO | Feels modern and “fast” on first impression | Bad for archives: weak orientation, hard footer access, poor shareability, poor place memory, and awkward search-result recovery | Use numbered pagination with previous/next and optional year jumps |
| Keep loading/parsing the full JUFO CSV in the client | Seems simplest because it avoids backend work | Performance degrades as data grows, blocks richer filtering, and bakes stale taxonomy assumptions into the browser bundle | Move JUFO lookup to server-backed pagination/filtering or a preprocessed indexed dataset |
| Admin-style mega grid features (column chooser, pinning, exports, inline edit) | Large datasets make teams think “data grid” first | This is a public editorial product, not an operations console; these features add weight and clutter without helping core reading/discovery jobs | Keep the default view focused and add detail-on-demand |
| Heavy visual redesign during the same milestone | Polish work often tempts teams into broad restyling | Turns a scoped milestone into a redesign, increases regression risk, and delays the genuinely valuable performance/archive work | Do a constrained polish pass on typography, spacing, states, and hierarchy |
| Complex multi-filter JUFO UI on day one | Rich filters feel powerful | Filter explosion hurts discoverability and increases query/state complexity before the basics are solid | Start with high-value search + pagination + a small number of trustworthy filters |

## Feature Dependencies

```text
[Existing server-backed article/newsletter routes]
    └──enables──> [URL-based pagination]
                       └──requires──> [Supabase range + total count queries]
                                              └──enables──> [Numbered pagination UI]

[Existing article browse/search]
    └──must coordinate with──> [Search query in URL]
                                   └──requires──> [Reset page to 1 on query change]
                                   └──enables──> [Paginated article search results]

[Existing JUFO lookup page]
    └──requires refactor to──> [Server-backed or pre-indexed JUFO dataset]
                                   └──enables──> [Fast search/filter/pagination]
                                   └──enables──> [Responsive detail-on-demand UI]
                                   └──supports──> [Current JUFO taxonomy handling]

[Shared layout + reusable UI components]
    └──enables──> [Editorial polish pass]
                       └──enhances──> [Articles]
                       └──enhances──> [Newsletters]
                       └──enhances──> [JUFO]
```

### Dependency Notes

- **Numbered pagination requires total counts:** Supabase pagination patterns rely on windowed queries plus a total count so the UI can render page numbers confidently.
- **Article pagination must coordinate with search:** page state without query state creates broken or confusing URLs; query changes should always reset pagination.
- **JUFO performance work comes before JUFO UI expansion:** adding more columns, filters, or fancy interactions on top of full client-side CSV loading will worsen the existing bottleneck.
- **Editorial polish depends on reuse, not page-by-page custom styling:** this milestone should strengthen the shared visual system rather than produce isolated one-off pages.
- **Current JUFO taxonomy matters:** the official ecosystem changed in 2025–2026, so the milestone should not harden outdated level labels into the public UI.

## MVP Definition

### Launch With (v1)

- [ ] Numbered newsletter pagination with previous/next, total pages, and newest-first ordering — essential archive usability improvement
- [ ] Numbered article pagination integrated with search query state — essential for archive scale and shareable browsing
- [ ] JUFO server-backed/pre-indexed search and pagination refactor — essential performance fix before additional JUFO UX work
- [ ] Focused editorial polish pass across article/newsletter/JUFO listing surfaces — essential so the milestone feels coherent rather than piecemeal
- [ ] JUFO terminology refresh for current classification language — essential to avoid shipping visibly stale framing

### Add After Validation (v1.x)

- [ ] Year jump navigation for archives — add when archive depth makes blind pagination annoying
- [ ] JUFO detail drawer / expandable row — add after the fast base list is stable
- [ ] Featured latest content treatment — add once the baseline archive layouts are stable and tested

### Future Consideration (v2+)

- [ ] Rich JUFO filters for panel, OA signals, and history slices — defer until query patterns are validated
- [ ] Personalized saved views or saved searches — defer until repeat-use behavior proves demand
- [ ] Advanced comparison/export tools — defer unless the product starts serving researcher workflows beyond reading/discovery

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Newsletter numbered pagination | HIGH | MEDIUM | P1 |
| Article numbered pagination with search state | HIGH | HIGH | P1 |
| JUFO server-backed/pre-indexed search and pagination | HIGH | HIGH | P1 |
| Editorial polish system pass | HIGH | MEDIUM | P1 |
| JUFO terminology refresh | MEDIUM | MEDIUM | P1 |
| Year jump navigation | MEDIUM | MEDIUM | P2 |
| JUFO detail-on-demand | MEDIUM | MEDIUM | P2 |
| Featured latest content treatment | MEDIUM | MEDIUM | P2 |
| Rich advanced JUFO filtering | LOW | HIGH | P3 |
| Saved views / exports | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for this milestone
- P2: Should have after core delivery is stable
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Competitor A | Competitor B | Our Approach |
|---------|--------------|--------------|--------------|
| Public newsletter archive | DailyStory documents a public archive list and JSON-backed custom archive rendering | Monterey History uses a highly browseable visual archive organized by issue/date | Build an internal paginated archive with editorial cards, stable URLs, and room to add year jumps |
| Large ranking dataset discovery | JUFO portal hides lesser-used filters behind an additional-filters model and exposes focused list views | Many public ranking/directory tools default to search + a small column set, then reveal more on demand | Keep default JUFO browsing fast and focused; prioritize search, pagination, and details-on-demand over huge default tables |
| Archive polish | Visual archive examples lead with hierarchy, dates, and covers rather than spreadsheet density | Content products emphasize scanning and clear state changes more than dense controls | Use stronger typography, spacing, metadata hierarchy, and interaction states without turning the app into a redesign project |

## Sources

- Supabase JavaScript docs, `select` / `range`: count returned with `.range()` or `.limit()` is the total rows matching filters, which supports numbered pagination UI. Official docs extracted from `https://supabase.com/docs/reference/javascript/select` and `https://supabase.com/docs/reference/javascript/range`. Confidence: HIGH.
- Next.js App Router docs, `page.js` and layouts/pages guidance: use `searchParams` when pagination/filtering needs to load data for the page. Official docs pages updated April 2026. Confidence: HIGH.
- Publication Forum official site: `Publication Forum` (updated 2026-01-13), `Evaluations` (updated 2025-12-08), and `Publication Forum Steering Group has approved major changes to the JUFO classification` (2025-12-02). These confirm current taxonomy changes, evaluation cadence, and portal direction. Confidence: HIGH.
- DailyStory documentation, `How to build a newsletter archive` (updated 2026-03-13). Useful for mature newsletter-archive patterns: public archive pages, JSON-backed custom rendering, and hosted issue pages. Confidence: MEDIUM.
- Monterey History and Art Association newsletter archive page (live public example, accessed 2026-04-08). Useful for visual archive grouping and browse-first archive behavior. Confidence: LOW.

---
*Feature research for: archive pagination, JUFO performance, and frontend polish milestone*
*Researched: 2026-04-08*
