# Phase 6: URL-Driven Archive Pagination - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Add stable, shareable, server-backed numbered pagination to the public `articles` and `newsletters` archive routes. This phase should keep article search aligned with URL state and pagination, and should improve archive empty/invalid-state handling; it does not include infinite scroll, advanced filtering, or the broader UI polish work reserved for Phase 7.

</domain>

<decisions>
## Implementation Decisions

### Pagination UI
- **D-01:** Both archive routes should use numbered pagination with `Previous` and `Next` controls.
- **D-02:** The current page should be visually highlighted, and first/last page links should appear when they are useful for orientation and navigation.

### Article search behavior
- **D-03:** Article search state and pagination state should both live in the URL so results remain refreshable and shareable.
- **D-04:** When the article search query changes, pagination should reset back to page `1`.

### Page size
- **D-05:** Phase 6 should use a fixed page size rather than introducing a user-controlled page-size selector.
- **D-06:** The same fixed page size should be used for both `articles` and `newsletters` unless implementation constraints discovered during planning require a scoped exception.

### Empty and invalid states
- **D-07:** Invalid archive page parameters should resolve back to a valid page instead of leaving the route in a broken or ambiguous state.
- **D-08:** Empty article-search results should show a clear empty state with an obvious way to reset back to browsable results.
- **D-09:** Paged archive views should preserve stable ordering while showing clear current-page feedback and no-results feedback where applicable.

### the agent's Discretion
- The exact page-size value, as long as it is fixed for this phase and applied consistently unless a justified archive-specific exception is needed.
- The exact pagination component structure and condensation rules, as long as numbered navigation, current-page feedback, and useful first/last access are preserved.
- Whether invalid page handling redirects, clamps in server logic, or resolves through rendered valid-state output, as long as users land on a clear valid archive state.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone and requirement docs
- `.planning/ROADMAP.md` — Phase 6 goal, dependencies, and success criteria for URL-Driven Archive Pagination.
- `.planning/REQUIREMENTS.md` — `ARTP-01` through `ARTP-03` and `NEWS-01` through `NEWS-03`, which define the required archive pagination, URL-state, ordering, and empty-state behavior.
- `.planning/PROJECT.md` — Milestone constraints, archive scope guardrails, and the decision to keep pagination server-backed while preserving the existing visual identity for later polish.
- `.planning/STATE.md` — Current milestone position and the expectation that Phase 6 is the active next phase after Phase 5 completion.

### Prior verification and implementation context
- `.planning/phases/04-public-journey-acceptance-coverage/04-VERIFICATION.md` — Confirms current article and newsletter archive behavior is covered by acceptance tests that Phase 6 should evolve rather than replace.
- `.planning/phases/05-jufo-server-backed-browsing/05-VERIFICATION.md` — Confirms the new server-backed URL-state pattern already works on `/jufo`, which is the closest current frontend reference for this phase.
- `.planning/phases/04-public-journey-acceptance-coverage/04-CONTEXT.md` — Prior public-journey testing structure and route coverage relevant to archive acceptance updates.

### Archive implementation hotspots
- `nextjs-frontend/src/app/articles/page.tsx` — Current article archive route that still loads the full published article set and should become server-paginated.
- `nextjs-frontend/src/components/articles/ArticlesExplorer.tsx` — Current client article explorer that performs local filtering and needs to stay aligned with URL-driven search and pagination.
- `nextjs-frontend/src/components/articles/ArticlesExplorer.test.tsx` — Current article explorer unit coverage that will need to evolve with the new URL-driven archive behavior.
- `nextjs-frontend/src/app/newsletters/page.tsx` — Current newsletter archive route that still loads the full newsletter set and should become server-paginated.
- `nextjs-frontend/src/components/newsletters/NewsletterArchive.tsx` — Current newsletter archive renderer that will need pagination controls and current-page feedback.
- `nextjs-frontend/src/lib/public-data/content.ts` — Current Supabase-backed content access layer and the most likely seam for paginated article/newsletter queries.
- `nextjs-frontend/src/components/jufo/JufoSearchControls.tsx` and `nextjs-frontend/src/app/jufo/page.tsx` — Existing server-backed URL-state pattern to reuse where appropriate.
- `nextjs-frontend/tests/e2e/articles.spec.ts` and `nextjs-frontend/tests/e2e/newsletters.spec.ts` — Acceptance specs that currently cover browsing/search and should be extended for pagination and URL-state expectations.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `nextjs-frontend/src/lib/public-data/content.ts`: Existing content-access module already centralizes published article and newsletter queries, making it the natural place to add paginated query helpers.
- `nextjs-frontend/src/lib/public-data/pagination.ts`: Existing pagination helper introduced in Phase 5 may provide reusable paging math or contracts for archive routes.
- `nextjs-frontend/src/components/jufo/JufoSearchControls.tsx`: Existing URL-driven search/pagination controls pattern that demonstrates the preferred server-page plus small client-controls split.
- `nextjs-frontend/tests/e2e/support/publicJourneyTest.ts`: Existing public-route test helpers that can likely support richer pagination assertions without introducing live-data dependencies.

### Established Patterns
- Public archive routes already use server page wrappers with smaller interactive client components, so Phase 6 should extend that structure rather than moving logic back into a large client-side fetch-all flow.
- Acceptance coverage runs in deterministic fixture-backed mode, so pagination behavior should remain testable without live Supabase dependencies.
- The current frontend direction favors URL-driven public-state behavior for shareability, as established by the rebuilt `/jufo` route in Phase 5.

### Integration Points
- Article pagination must coordinate server-side Supabase queries, URL `page` state, and URL `q` search state without breaking existing article browse/search expectations.
- Newsletter pagination must coordinate server-side Supabase queries and URL `page` state while preserving stable ordering and clear archive navigation feedback.
- Updated unit and acceptance coverage should verify that archive browsing, search, refresh, and shared-link flows continue to work through the existing project test commands.

</code_context>

<specifics>
## Specific Ideas

- Reuse the `/jufo` pattern as the baseline architecture: parse URL state in the server page, query only the needed slice of data, and keep client controls focused on navigation/search interactions.
- Prefer one shared pagination primitive or helper shape for `articles` and `newsletters` if it does not force awkward coupling between the two archive UIs.
- Keep article ordering stable when search is absent and when search is present, so paging feels predictable and testable.

</specifics>

<deferred>
## Deferred Ideas

- Infinite scroll for either archive route.
- Advanced article filtering beyond the existing search behavior.
- Broader archive visual redesign and public-page polish beyond what is required to support usable pagination controls.

</deferred>

---

*Phase: 06-url-driven-archive-pagination*
*Context gathered: 2026-04-08*
