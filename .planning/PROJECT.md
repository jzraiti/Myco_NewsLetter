# Myco Newsletter

## What This Is

Myco Newsletter is a web application for discovering and distributing mycology-focused research content. It gives readers a public site where they can subscribe, browse past newsletters, search article summaries, and review publication rankings while the backend assembles and sends newsletter content.

## Core Value

Readers can reliably discover and receive curated, high-quality mycology research with minimal friction.

## Current Milestone: v1.1 Frontend Performance and UI Improvements

**Goal:** Improve the public frontend experience by fixing JUFO's heavy client-side loading, adding server-backed pagination for article and newsletter browsing, and delivering a broader UI polish pass without changing the background-image concept.

**Target features:**
- Fix the JUFO page so visitors can open and browse it without the current browser memory spike from client-side CSV loading
- Add numbered, server-backed pagination for `articles` and `newsletters`
- Keep article search aligned with pagination and URL state
- Improve shared public-page UI clarity, navigation flow, responsiveness, and accessibility while preserving background imagery

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

### Active

- [ ] Visitors can open and browse JUFO quickly without loading the full ranking dataset into browser memory
- [ ] Visitors can browse articles through numbered, URL-driven pages while search stays in sync with pagination
- [ ] Visitors can browse newsletters through numbered, URL-driven pages backed by Supabase queries
- [ ] Visitors get a more polished and readable public frontend across touched pages without losing the existing background-image identity

### Out of Scope

- New end-user product features outside JUFO performance, archive pagination, or public UI polish — this milestone is focused on targeted frontend improvements
- Replacing the public background-image concept — the visual direction should improve the existing identity rather than discard it
- Major backend or infrastructure migration — not necessary to deliver this milestone's frontend-focused goals

## Context

- The codebase contains a `Next.js` app in `nextjs-frontend/` using the app router, React, Tailwind, Supabase client access, and reusable UI components.
- The frontend includes public flows for newsletter subscription, unsubscription, previous newsletters, article discovery, and JUFO publication lookup.
- The frontend now has a shared public-data layer, deterministic background helpers, and server-backed wrappers for the core public pages, reducing repeated client-side setup.
- The backend contains a Python AWS Lambda flow for article retrieval, newsletter generation, email sending, S3 upload, and Supabase persistence.
- The backend now has extracted summary, venue, article-selection, delivery, upload, and workflow modules plus explicit result contracts for newsletter orchestration.
- The current `jufo` route still loads and parses CSV data in the browser, and the user reports roughly 2 GB RAM usage when opening that page.
- The current `articles` and `newsletters` routes render full result sets instead of URL-driven Supabase pagination.
- This milestone should use the existing frontend stack and frontend-design quality bar to improve clarity, editorial feel, interaction polish, and mobile/accessibility behavior on public pages.

## Constraints

- **Tech stack**: Keep the existing Next.js frontend, Supabase integration, and public-page architecture — this milestone should improve the current stack rather than introduce a new platform.
- **Scope**: Focus on JUFO performance, archive pagination, and frontend UI polish — prevents unrelated feature creep.
- **Visual identity**: Preserve the background-image-driven look and feel — polish should refine the current concept rather than replace it.
- **Performance**: Pagination and JUFO fixes must reduce client memory and avoid fake pagination over full datasets — otherwise the milestone misses its main value.

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
| Keep JUFO and pagination improvements server-backed | Client-side CSV parsing and fetch-all pagination are the main causes of poor performance and memory usage | Pending |
| Preserve background images during UI polish | The user wants a stronger UI without losing the site's existing visual identity | Pending |

## Current State

Milestone `v1.0` is complete. The project now has isolated frontend and backend test commands, server-backed public page refactors, explicit backend workflow seams, and focused Playwright acceptance coverage for subscribe, unsubscribe, newsletter archive browsing, and article search/browsing. The next milestone shifts focus to frontend performance and presentation, especially JUFO data handling plus paginated archive browsing.

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
*Last updated: 2026-04-08 after milestone v1.1 start*
