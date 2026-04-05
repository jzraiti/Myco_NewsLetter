# Roadmap: Myco Newsletter

## Overview

This milestone strengthens the existing Myco Newsletter application without adding new product surface area. The roadmap starts by making automated tests runnable and isolated, then improves frontend maintainability and efficiency, hardens backend quality in integration-heavy paths, and finishes with acceptance coverage for the most important public journeys.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Test Foundation** - Make unit and acceptance suites runnable through simple, isolated project commands. Completed 2026-04-02.
- [ ] **Phase 2: Frontend Quality & Efficiency** - Reduce repeated frontend logic and remove avoidable runtime work on key public pages.
- [ ] **Phase 3: Backend Quality & Safety** - Refactor backend utility and newsletter paths for clearer boundaries and safer failure handling.
- [ ] **Phase 4: Public Journey Acceptance Coverage** - Protect the highest-value public user flows with automated acceptance tests.

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
- [ ] 02-02-PLAN.md — Refactor the home and unsubscribe flows around shared subscription helpers and smaller client components.
- [ ] 02-03-PLAN.md — Convert the newsletters archive into a server-backed page with a reusable archive renderer.
- [ ] 02-04-PLAN.md — Convert the articles route into a server-backed page with a focused client search explorer.
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
**Plans**: TBD

### Phase 4: Public Journey Acceptance Coverage
**Goal**: The most important public user journeys are protected by automated acceptance coverage.
**Depends on**: Phase 1, Phase 2, and Phase 3
**Requirements**: ACCP-01, ACCP-02, ACCP-03, ACCP-04
**Success Criteria** (what must be TRUE):
  1. Team can run an automated acceptance test that verifies a visitor can subscribe from the public site.
  2. Team can run an automated acceptance test that verifies a visitor can unsubscribe from the public site.
  3. Team can run an automated acceptance test that verifies visitors can browse the newsletter archive.
  4. Team can run an automated acceptance test that verifies visitors can browse and search article summaries.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Test Foundation | 4/4 | Complete | 2026-04-02 |
| 2. Frontend Quality & Efficiency | 0/TBD | Not started | - |
| 3. Backend Quality & Safety | 0/TBD | Not started | - |
| 4. Public Journey Acceptance Coverage | 0/TBD | Not started | - |
