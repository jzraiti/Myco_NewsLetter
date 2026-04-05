# Requirements: Myco Newsletter

**Defined:** 2026-03-30
**Core Value:** Readers can reliably discover and receive curated, high-quality mycology research with minimal friction.

## v1 Requirements

Requirements for milestone v1.0. Each maps to roadmap phases.

### Test Infrastructure

- [x] **TINF-01**: Maintainer can run frontend unit tests with a single project command
- [x] **TINF-02**: Maintainer can run backend unit tests with a single project command
- [x] **TINF-03**: Maintainer can run acceptance tests with a single project command
- [x] **TINF-04**: Maintainer can run automated tests without requiring live Supabase, email, or external article-service dependencies

### Acceptance Coverage

- [ ] **ACCP-01**: Team can verify the newsletter subscribe flow with an automated acceptance test
- [ ] **ACCP-02**: Team can verify the unsubscribe flow with an automated acceptance test
- [ ] **ACCP-03**: Team can verify newsletter archive browsing with an automated acceptance test
- [ ] **ACCP-04**: Team can verify article browsing and search with an automated acceptance test

### Frontend Quality

- [x] **FEQ-01**: Maintainer can use shared frontend data-access patterns instead of repeating Supabase client and fetch logic across pages
- [x] **FEQ-02**: Maintainer can use shared frontend helpers or components for repeated page behavior instead of duplicating presentation logic
- [x] **FEQ-03**: Visitor can load core public pages without avoidable client-side work introduced by duplicated or inefficient frontend patterns
- [x] **FEQ-04**: Frontend refactors in this milestone are protected by unit tests around extracted UI or shared logic

### Backend Quality

- [ ] **BEQ-01**: Maintainer can test backend newsletter and utility logic through isolated unit tests
- [ ] **BEQ-02**: Maintainer can work with backend utilities that have clearer separation between formatting, persistence, and delivery responsibilities
- [ ] **BEQ-03**: Maintainer can handle backend integration failures through predictable error-handling paths
- [ ] **BEQ-04**: Backend refactors in this milestone are protected by unit tests around Supabase, email, or newsletter helper logic

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

None identified for this milestone.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| New end-user product features unrelated to quality or testing | This milestone is dedicated to maintainability, efficiency, and regression protection |
| Major visual redesign | UI polish is not required to achieve this milestone's core goals |
| Infrastructure or provider migration | Replacing core services would expand scope beyond a quality-focused milestone |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TINF-01 | Phase 1 | Complete |
| TINF-02 | Phase 1 | Complete |
| TINF-03 | Phase 1 | Complete |
| TINF-04 | Phase 1 | Complete |
| ACCP-01 | Phase 4 | Pending |
| ACCP-02 | Phase 4 | Pending |
| ACCP-03 | Phase 4 | Pending |
| ACCP-04 | Phase 4 | Pending |
| FEQ-01 | Phase 2 | Complete |
| FEQ-02 | Phase 2 | Complete |
| FEQ-03 | Phase 2 | Complete |
| FEQ-04 | Phase 2 | Complete |
| BEQ-01 | Phase 3 | Pending |
| BEQ-02 | Phase 3 | Pending |
| BEQ-03 | Phase 3 | Pending |
| BEQ-04 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-30*
*Last updated: 2026-03-30 after roadmap creation*
