# Myco Newsletter

## What This Is

Myco Newsletter is a web application for discovering and distributing mycology-focused research content. It gives readers a public site where they can subscribe, browse past newsletters, search article summaries, and review publication rankings while the backend assembles and sends newsletter content.

## Core Value

Readers can reliably discover and receive curated, high-quality mycology research with minimal friction.

## Current Milestone: v1.0 Code Quality and Test Foundation

**Goal:** Improve maintainability and efficiency across both the frontend and backend while establishing reliable automated test coverage for the app's core user journeys and shared logic.

**Target features:**
- Set up unit test infrastructure for frontend and backend code
- Add acceptance tests for subscribe, unsubscribe, newsletter archive, and article browse/search flows
- Reduce duplication in repeated app logic and shared data-access patterns across frontend and backend
- Improve frontend rendering/runtime efficiency in the most visible pages
- Improve backend code quality in utility modules and integration-heavy paths

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

### Active

- [ ] Extend acceptance coverage from smoke paths into deeper public user journeys

### Out of Scope

- New end-user product features unrelated to code quality or test coverage — this milestone is focused on quality, efficiency, and regression protection
- Major redesign of the public site — visual changes are not required to deliver this milestone's core value
- Infrastructure migration or provider replacement — not necessary for the current quality-focused scope

## Context

- The codebase contains a `Next.js` app in `nextjs-frontend/` using the app router, React, Tailwind, Supabase client access, and reusable UI components.
- The frontend includes public flows for newsletter subscription, unsubscription, previous newsletters, article discovery, and JUFO publication lookup.
- The frontend now has a shared public-data layer, deterministic background helpers, and server-backed wrappers for the core public pages, reducing repeated client-side setup.
- The backend contains a Python AWS Lambda flow for article retrieval, newsletter generation, email sending, S3 upload, and Supabase persistence.
- The backend now has extracted summary, venue, article-selection, delivery, upload, and workflow modules plus explicit result contracts for newsletter orchestration.
- Repeated patterns exist in frontend data fetching, random image selection, and Supabase client usage, which makes maintenance and optimization harder.
- Backend utility modules are integration-heavy, and the codebase now has a repo-owned isolated backend test runner plus mocked unit coverage as the baseline safety net.

## Constraints

- **Tech stack**: Keep the existing Next.js frontend and Python/AWS backend structure — this milestone improves the current system rather than replacing it.
- **Scope**: Focus on quality, testing, and efficiency work — prevents feature creep during milestone setup.
- **Data integrations**: Supabase, email delivery, and external article sources need safe test boundaries — direct live dependencies would make automated tests brittle.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Treat this as milestone `v1.0` | No prior planning history exists in `.planning/` for this repository | Accepted |
| Prioritize testing foundation first | Regression protection is the fastest way to support refactors and quality work safely | Validated in Phase 1 |
| Include backend quality improvements with frontend work | The current milestone should improve maintainability across the whole application, not only the UI | Validated in Phase 1 |
| Use fixture-backed server data in E2E mode for server-rendered public pages | Browser route mocks no longer intercept initial server fetches after the Phase 2 server-component refactor | Validated in Phase 2 |
| Use explicit workflow step results for backend newsletter orchestration | Predictable result objects make partial delivery and integration failure handling testable without relying on implicit side effects | Validated in Phase 3 |

## Current State

Phases 1, 2, and 3 are complete. The project now has isolated frontend, backend, and smoke test commands, a shared frontend data layer, and a backend newsletter workflow with extracted service modules plus explicit result-based failure handling. The next focus is Phase 4 public journey acceptance coverage.

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
*Last updated: 2026-04-08 after Phase 3 completion*
