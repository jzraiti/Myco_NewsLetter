# Roadmap: Myco Newsletter

## Overview

Milestone v1.0 shipped the quality, refactor, and acceptance foundations for the existing application. Milestone v1.1 now focuses on public frontend performance and presentation: move JUFO off the browser-heavy path, add real URL-driven archive pagination for articles and newsletters, and polish the touched public pages so they feel faster, clearer, and more consistent without losing the background-image identity.

## Milestones

- **v1.0 Code Quality and Test Foundation** - Phases 1-4 (shipped 2026-04-08)
- **v1.1 Frontend Performance and UI Improvements** - Phases 5-7 (planned)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Test Foundation** - Make unit and acceptance suites runnable through simple, isolated project commands. Completed 2026-04-02.
- [x] **Phase 2: Frontend Quality & Efficiency** - Reduce repeated frontend logic and remove avoidable runtime work on key public pages. Completed 2026-04-05.
- [x] **Phase 3: Backend Quality & Safety** - Refactor backend utility and newsletter paths for clearer boundaries and safer failure handling. Completed 2026-04-08.
- [x] **Phase 4: Public Journey Acceptance Coverage** - Protect the highest-value public user flows with automated acceptance tests. Completed 2026-04-08.
- [ ] **Phase 5: JUFO Server-Backed Browsing** - Replace browser-heavy JUFO loading with a fast server-backed browsing flow.
- [x] **Phase 6: URL-Driven Archive Pagination** - Deliver stable, shareable pagination for article and newsletter archives. Completed 2026-04-08.
- [ ] **Phase 7: Public UI Clarity, Responsiveness & Accessibility** - Polish touched public pages while preserving the existing visual identity.

## Phase Details

### Phase 1: Test Foundation
**Goal**: Maintainers can run isolated automated tests across the frontend and backend without relying on live services.
**Depends on**: Nothing (first phase)
**Requirements**: TINF-01, TINF-02, TINF-03, TINF-04
**Success Criteria** (what must be TRUE):
  1. Maintainer can run frontend unit tests with a single project command.
  2. Maintainer can run backend unit tests with a single project command.
  3. Maintainer can run acceptance tests with a single project command.
  4. Automated test runs complete without requiring live Supabase, email, or external article-service dependencies.
**Plans**: 4 plans
Plans:
- [x] 01-01-PLAN.md — Add Vitest tooling and isolated frontend unit coverage for subscribe/unsubscribe flows.
- [x] 01-02-PLAN.md — Add backend pytest harness and mocked unit tests for Semantic Scholar and Lambda orchestration.
- [x] 01-03-PLAN.md — Add Playwright acceptance tooling and mocked public smoke coverage.
- [x] 01-04-PLAN.md — Add a repo-owned backend test runner and close the phase verification gap.
**UI hint**: yes

### Phase 2: Frontend Quality & Efficiency
**Goal**: Core public frontend pages are easier to maintain and avoid unnecessary client-side or rendering work.
**Depends on**: Phase 1
**Requirements**: FEQ-01, FEQ-02, FEQ-03, FEQ-04
**Success Criteria** (what must be TRUE):
  1. Maintainer can use shared frontend data-access patterns instead of repeating page-level Supabase or fetch logic.
  2. Maintainer can reuse shared helpers or components for repeated page behavior instead of copying presentation logic across public screens.
  3. Visitor can load core public pages without avoidable client-side work caused by duplicated or inefficient frontend patterns.
  4. Frontend refactors introduced in this phase are covered by unit tests around extracted UI or shared logic.
**Plans**: 4 plans
Plans:
- [x] 02-01-PLAN.md — Create shared public-data helpers, typed contracts, and deterministic background utilities.
- [x] 02-02-PLAN.md — Refactor the home and unsubscribe flows around shared subscription helpers and smaller client components.
- [x] 02-03-PLAN.md — Convert the newsletters archive into a server-backed page with a reusable archive renderer.
- [x] 02-04-PLAN.md — Convert the articles route into a server-backed page with a focused client search explorer.
**UI hint**: yes

### Phase 3: Backend Quality & Safety
**Goal**: Backend newsletter and utility paths are easier to change safely and behave predictably when integrations fail.
**Depends on**: Phase 1
**Requirements**: BEQ-01, BEQ-02, BEQ-03, BEQ-04
**Success Criteria** (what must be TRUE):
  1. Maintainer can run isolated unit tests for backend newsletter and utility logic without hitting live persistence or delivery services.
  2. Maintainer can work with backend utilities that separate formatting, persistence, and delivery responsibilities more clearly.
  3. Backend integration failures follow predictable error-handling paths instead of producing ambiguous behavior.
  4. Backend refactors in Supabase, email, or newsletter helper logic are protected by unit tests.
**Plans**: 5 plans
Plans:
- [x] 03-01-PLAN.md — Add workflow result contracts and a lazy Supabase adapter seam.
- [x] 03-02-PLAN.md — Extract article selection, summary, and venue helpers out of `other_utils.py`.
- [x] 03-03-PLAN.md — Refactor email and S3 helpers around explicit success, partial, and failure outcomes.
- [x] 03-04-PLAN.md — Rewire the Lambda newsletter workflow to named step results and partial-delivery continuation.
- [x] 03-05-PLAN.md — Normalize fetch/select failures into explicit `select`-step workflow results and regression tests.

### Phase 4: Public Journey Acceptance Coverage
**Goal**: The most important public user journeys are protected by automated acceptance coverage.
**Depends on**: Phase 1, Phase 2, and Phase 3
**Requirements**: ACCP-01, ACCP-02, ACCP-03, ACCP-04
**Success Criteria** (what must be TRUE):
  1. Team can run an automated acceptance test that verifies a visitor can subscribe from the public site.
  2. Team can run an automated acceptance test that verifies a visitor can unsubscribe from the public site.
  3. Team can run an automated acceptance test that verifies visitors can browse the newsletter archive.
  4. Team can run an automated acceptance test that verifies visitors can browse and search article summaries.
**Plans**: 3 plans
Plans:
- [x] 04-01-PLAN.md — Prepare resettable Playwright public-journey fixtures and slim the umbrella smoke canary.
- [x] 04-02-PLAN.md — Add focused acceptance coverage for the subscribe and unsubscribe public journeys.
- [x] 04-03-PLAN.md — Add focused acceptance coverage for newsletter archive browsing and article browse/search.
**UI hint**: yes

### Phase 5: JUFO Server-Backed Browsing
**Goal**: Visitors can open and explore JUFO rankings through a fast server-backed flow instead of loading the full dataset into browser memory.
**Depends on**: Phase 4
**Requirements**: JUFO-01, JUFO-02
**Success Criteria** (what must be TRUE):
  1. Visitor can open the JUFO page without loading the full ranking dataset into browser memory.
  2. Visitor can browse JUFO results through a fast server-backed flow instead of waiting for client-side CSV parsing.
**Plans**: 2 plans
Plans:
- [x] 05-01-PLAN.md — Normalize the canonical JUFO dataset and add a tested server paging adapter.
- [x] 05-02-PLAN.md — Rebuild `/jufo` around the server adapter with URL-driven controls and end-to-end coverage.
**UI hint**: yes

### Phase 6: URL-Driven Archive Pagination
**Goal**: Visitors can browse article and newsletter archives through stable, shareable, server-backed pagination.
**Depends on**: Phase 4
**Requirements**: ARTP-01, ARTP-02, ARTP-03, NEWS-01, NEWS-02, NEWS-03
**Success Criteria** (what must be TRUE):
  1. Visitor can browse articles through numbered pages backed by paginated Supabase queries.
  2. Visitor can refresh or share an article results URL without losing the current page and search state.
  3. Visitor can browse newsletters through numbered pages backed by paginated Supabase queries.
  4. Visitor can refresh or share a newsletter archive URL and keep clear current-page feedback.
  5. Visitor sees stable ordering and clear empty-state behavior while paging or searching archive results.
**Plans**: 3 plans
Plans:
- [x] 06-01-PLAN.md — Create the shared paginated archive data helpers, contracts, and deterministic multi-page fixtures.
- [x] 06-02-PLAN.md — Rewire `/articles` to server-backed URL pagination with search-state persistence and acceptance coverage.
- [x] 06-03-PLAN.md — Rewire `/newsletters` to server-backed numbered pagination with shareable page URLs and acceptance coverage.
**UI hint**: yes

### Phase 7: Public UI Clarity, Responsiveness & Accessibility
**Goal**: Visitors get a more polished and readable public frontend across touched pages while preserving the background-image-driven visual identity.
**Depends on**: Phase 5 and Phase 6
**Requirements**: UIP-01, UIP-02, UIP-03, UIP-04
**Success Criteria** (what must be TRUE):
  1. Visitor gets clearer hierarchy, spacing, and navigation flow across the touched public pages.
  2. Visitor sees more polished cards, tables, forms, and interaction states without losing the existing background-image identity.
  3. Visitor can use the touched public pages effectively on mobile-sized screens.
  4. Visitor can use pagination, search, and page interactions with improved focus visibility, semantics, and accessibility cues.
**Plans**: 5 plans
Plans:
- [x] 07-01-PLAN.md — Establish shared public-shell styling, navigation cues, and accessibility foundations.
- [x] 07-02-PLAN.md — Polish the home subscribe and unsubscribe flows with stronger hierarchy and clearer destructive-state handling.
- [x] 07-03-PLAN.md — Refresh the articles archive framing, cards, and mobile/search accessibility without changing Phase 6 behavior.
- [x] 07-04-PLAN.md — Refresh the newsletters archive framing, cards, and responsive pagination clarity.
- [x] 07-05-PLAN.md — Reframe JUFO browse/search surfaces for readable tables, mobile usability, and accessible state feedback.
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Test Foundation | 4/4 | Complete | 2026-04-02 |
| 2. Frontend Quality & Efficiency | 4/4 | Complete | 2026-04-05 |
| 3. Backend Quality & Safety | 5/5 | Complete | 2026-04-08 |
| 4. Public Journey Acceptance Coverage | 3/3 | Complete | 2026-04-08 |
| 5. JUFO Server-Backed Browsing | 0/TBD | Not started | - |
| 6. URL-Driven Archive Pagination | 3/3 | Complete | 2026-04-08 |
| 7. Public UI Clarity, Responsiveness & Accessibility | 0/5 | Not started | - |
