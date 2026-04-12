# Myco Newsletter

## What This Is

Myco Newsletter is a web application for discovering and distributing mycology-focused research content. It gives readers a public site where they can subscribe, browse past newsletters, search article summaries, and review publication rankings while the backend assembles and sends newsletter content.

## Core Value

Readers can reliably discover and receive curated, high-quality mycology research with minimal friction.

## Current Milestone: Planning Next Milestone

**Goal:** Define the next shipped increment on top of the server-backed public browse and UI foundations completed in `v1.1`.

**Candidate features:**
- Add richer archive discovery such as year-based groupings or jump points
- Explore richer JUFO discovery controls and on-demand detail expansion
- Keep future work anchored to public research discovery and newsletter delivery rather than unrelated platform changes

## Requirements

### Validated

- ✓ Visitors can subscribe to the newsletter from the home page — inferred from existing codebase
- ✓ Visitors can unsubscribe from the newsletter from a public page — inferred from existing codebase
- ✓ Visitors can browse previously published newsletters — inferred from existing codebase
- ✓ Visitors can browse and search article summaries — inferred from existing codebase
- ✓ Visitors can review JUFO publication rankings and supporting context — inferred from existing codebase
- ✓ Backend can generate newsletter HTML, send emails, and persist newsletter records — inferred from existing codebase
- ✓ Maintainers can run isolated frontend unit tests from a single project command — validated in Phase 1
- ✓ Maintainers can run isolated backend unit tests from a single repo-owned command — validated in Phase 1
- ✓ Maintainers can run isolated acceptance smoke tests from a single project command — validated in Phase 1
- ✓ Automated test runs complete without live Supabase, email, S3, OpenAI, or Semantic Scholar dependencies — validated in Phase 1
- ✓ Maintainers can use shared frontend data-access patterns instead of repeating page-level Supabase or fetch logic — validated in Phase 2
- ✓ Maintainers can reuse shared frontend helpers and components across public screens instead of duplicating presentation logic — validated in Phase 2
- ✓ Visitors can load core public pages through server-backed routes with less avoidable client-side work — validated in Phase 2
- ✓ Frontend refactors in this milestone are protected by unit tests around extracted UI and shared logic — validated in Phase 2
- ✓ Maintainers can test backend newsletter and utility logic through isolated unit tests with injected service seams — validated in Phase 3
- ✓ Maintainers can work with backend utilities that separate formatting, persistence, delivery, and orchestration responsibilities more clearly — validated in Phase 3
- ✓ Maintainers can handle backend integration failures through predictable workflow result paths instead of uncaught fetch/select/render/upload behavior — validated in Phase 3
- ✓ Backend refactors in Supabase, email, upload, and workflow helper logic are protected by dedicated unit tests — validated in Phase 3
- ✓ Team can verify the newsletter subscribe flow with an automated acceptance test — validated in Phase 4
- ✓ Team can verify the unsubscribe flow with an automated acceptance test — validated in Phase 4
- ✓ Team can verify newsletter archive browsing with an automated acceptance test — validated in Phase 4
- ✓ Team can verify article browsing and search with an automated acceptance test — validated in Phase 4
- ✓ Visitors can open the JUFO page without loading the full ranking dataset into browser memory — validated in Phase 5
- ✓ Visitors can browse JUFO results through a fast server-backed flow instead of client-side CSV parsing — validated in Phase 5
- ✓ Visitors can browse articles through numbered pages backed by paginated queries — validated in Phase 6
- ✓ Visitors can share or refresh an article results URL without losing the current page and search state — validated in Phase 6
- ✓ Visitors see stable article ordering and clear empty-state behavior while paging or searching — validated in Phase 6
- ✓ Visitors can browse newsletters through numbered pages backed by paginated queries — validated in Phase 6
- ✓ Visitors can navigate newsletter pages through shareable URL state with clear current-page feedback — validated in Phase 6
- ✓ Visitors see stable newsletter ordering and clear empty-state behavior while paging — validated in Phase 6
- ✓ Visitors get clearer public-page hierarchy, spacing, and navigation flow across the touched frontend pages — validated in Phase 7
- ✓ Visitors see more polished cards, tables, forms, and interaction states while the background-image identity remains intact — validated in Phase 7
- ✓ Visitors can use the touched public pages more effectively on mobile-sized screens — validated in Phase 7
- ✓ Visitors can use pagination, search, and page interactions with improved focus, semantics, and accessibility cues — validated in Phase 7

### Active

- [ ] Visitors can jump directly to archive groupings such as year-based views.
- [ ] Visitors can refine JUFO results with richer advanced filters beyond fast browsing.
- [ ] Visitors can expand JUFO rows for additional on-demand detail without widening the default table.

### Out of Scope

- New end-user product features outside JUFO performance, archive pagination, or public UI polish — this milestone is focused on targeted frontend improvements
- Infinite scroll for articles or newsletters — numbered pagination remains the chosen archive pattern because it keeps archive position and shareability explicit
- Client-side-only pagination over full datasets — this would regress the main performance and memory gains from `v1.1`
- Replacing the public background-image concept — the visual direction should improve the existing identity rather than discard it
- Major backend or infrastructure migration — not necessary to deliver this milestone's frontend-focused goals

## Context

- The codebase contains a `Next.js` app in `nextjs-frontend/` using the app router, React, Tailwind, Supabase client access, and reusable UI components.
- The frontend includes public flows for newsletter subscription, unsubscription, previous newsletters, article discovery, and JUFO publication lookup.
- The frontend now has a shared public-data layer, deterministic background helpers, and server-backed wrappers for the core public pages, reducing repeated client-side setup.
- The backend contains a Python AWS Lambda flow for article retrieval, newsletter generation, email sending, S3 upload, and Supabase persistence.
- The backend now has extracted summary, venue, article-selection, delivery, upload, and workflow modules plus explicit result contracts for newsletter orchestration.
- The public `jufo`, `articles`, and `newsletters` routes now use server-backed data access with canonical URL state instead of browser-heavy fetch-all behavior.
- The public shell and touched routes now expose skip navigation, active-route cues, labeled controls, clearer empty states, and mobile-safe archive/JUFO presentations.
- The current codebase includes roughly 6,484 lines of TypeScript/TSX/Python across the main frontend and backend app code tracked in this repository snapshot.
- Milestone `v1.1` shipped across 2026-04-08 through 2026-04-12 and focused on turning the highest-traffic public browse surfaces into server-backed, shareable routes before polishing their presentation.

## Constraints

- **Tech stack**: Keep the existing Next.js frontend, Supabase integration, and public-page architecture — this milestone should improve the current stack rather than introduce a new platform.
- **Scope**: Focus on JUFO performance, archive pagination, and frontend UI polish — prevents unrelated feature creep.
- **Visual identity**: Preserve the background-image-driven look and feel — polish should refine the current concept rather than replace it.
- **Performance**: Pagination and JUFO fixes must reduce client memory and avoid fake pagination over full datasets — otherwise the milestone misses its main value.
- **Continuity**: Future archive or JUFO enhancements should build on the existing server-backed URL contracts instead of reintroducing client-owned browse state.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Treat this as milestone `v1.0` | No prior planning history exists in `.planning/` for this repository | Accepted |
| Prioritize testing foundation first | Regression protection is the fastest way to support refactors and quality work safely | Validated in Phase 1 |
| Include backend quality improvements with frontend work | The current milestone should improve maintainability across the whole application, not only the UI | Validated in Phase 1 |
| Use fixture-backed server data in E2E mode for server-rendered public pages | Browser route mocks no longer intercept initial server fetches after the Phase 2 server-component refactor | Validated in Phase 2 |
| Use explicit workflow step results for backend newsletter orchestration | Predictable result objects make partial delivery and integration failure handling testable without relying on implicit side effects | Validated in Phase 3 |
| Split public acceptance coverage by journey while keeping a lightweight smoke canary | Focused specs make browser failures easier to localize without losing a fast all-routes check | Validated in Phase 4 |
| Treat the next milestone as `v1.1` | The new work extends the product with targeted frontend improvements rather than resetting scope or direction | Accepted |
| Keep JUFO and pagination improvements server-backed | Client-side CSV parsing and fetch-all pagination are the main causes of poor performance and memory usage | Validated in Phase 5 |
| Keep JUFO as a repo-owned normalized artifact in `v1.1` | Removing browser CSV parsing was higher value than introducing new storage infrastructure mid-milestone | Validated in Phase 5 |
| Standardize archive pagination on canonical URL-driven server pages | Shareable archive state and invalid-page recovery are easier to verify when both archives normalize through the route layer | Validated in Phase 6 |
| Preserve background images during UI polish | The user wants a stronger UI without losing the site's existing visual identity | Validated in Phase 7 |
| Use route-aware shared navigation and skip-link semantics as the public shell baseline | Shared orientation and accessibility cues needed to land before page-specific polish | Validated in Phase 7 |
| Add a dedicated mobile JUFO card presentation beside the desktop table | Mobile readability needed a real alternate rendering, not only horizontal overflow on the dense table | Validated in Phase 7 |

## Current State

Milestones `v1.0` and `v1.1` are complete. The project now has isolated cross-stack test entrypoints, refactored backend newsletter orchestration, server-rendered `/jufo`, `/articles`, and `/newsletters` routes with canonical URL-driven browse/search pagination behavior, a polished shared public shell with skip navigation and active-route cues, editorially framed subscribe/unsubscribe/archive/JUFO surfaces, mobile-friendly JUFO cards, and focused Playwright acceptance coverage for subscribe, unsubscribe, newsletter archive browsing, article browsing/search, and JUFO browsing. The next milestone is not yet defined.

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-12 after v1.1 milestone completion*
