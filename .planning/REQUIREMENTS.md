# Requirements: Myco Newsletter

**Defined:** 2026-03-30
**Core Value:** Readers can reliably discover and receive curated, high-quality mycology research with minimal friction.

## v1 Requirements

Requirements for milestone v1.0. Each maps to roadmap phases.

### Test Infrastructure

- [ ] **TINF-01**: Maintainer can run frontend unit tests with a single project command
- [ ] **TINF-02**: Maintainer can run backend unit tests with a single project command
- [ ] **TINF-03**: Maintainer can run acceptance tests with a single project command
- [ ] **TINF-04**: Maintainer can run automated tests without requiring live Supabase, email, or external article-service dependencies

### Acceptance Coverage

- [ ] **ACCP-01**: Team can verify the newsletter subscribe flow with an automated acceptance test
- [ ] **ACCP-02**: Team can verify the unsubscribe flow with an automated acceptance test
- [ ] **ACCP-03**: Team can verify newsletter archive browsing with an automated acceptance test
- [ ] **ACCP-04**: Team can verify article browsing and search with an automated acceptance test

### Frontend Quality

- [ ] **FEQ-01**: Maintainer can use shared frontend data-access patterns instead of repeating Supabase client and fetch logic across pages
- [ ] **FEQ-02**: Maintainer can use shared frontend helpers or components for repeated page behavior instead of duplicating presentation logic
- [ ] **FEQ-03**: Visitor can load core public pages without avoidable client-side work introduced by duplicated or inefficient frontend patterns
- [ ] **FEQ-04**: Frontend refactors in this milestone are protected by unit tests around extracted UI or shared logic

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
| TINF-01 | Unmapped | Pending |
| TINF-02 | Unmapped | Pending |
| TINF-03 | Unmapped | Pending |
| TINF-04 | Unmapped | Pending |
| ACCP-01 | Unmapped | Pending |
| ACCP-02 | Unmapped | Pending |
| ACCP-03 | Unmapped | Pending |
| ACCP-04 | Unmapped | Pending |
| FEQ-01 | Unmapped | Pending |
| FEQ-02 | Unmapped | Pending |
| FEQ-03 | Unmapped | Pending |
| FEQ-04 | Unmapped | Pending |
| BEQ-01 | Unmapped | Pending |
| BEQ-02 | Unmapped | Pending |
| BEQ-03 | Unmapped | Pending |
| BEQ-04 | Unmapped | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 0
- Unmapped: 16 ⚠

---
*Requirements defined: 2026-03-30*
*Last updated: 2026-03-30 after initial definition*
