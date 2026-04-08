# Requirements: Myco Newsletter

**Defined:** 2026-04-08
**Core Value:** Readers can reliably discover and receive curated, high-quality mycology research with minimal friction.

## v1 Requirements

Requirements for milestone v1.1. Each maps to roadmap phases 5-7.

### JUFO Performance

- [x] **JUFO-01**: Visitor can open the JUFO page without loading the full ranking dataset into browser memory
- [x] **JUFO-02**: Visitor can browse JUFO results through a fast server-backed flow instead of client-side CSV parsing

### Articles Pagination

- [ ] **ARTP-01**: Visitor can browse articles through numbered pages backed by paginated Supabase queries
- [ ] **ARTP-02**: Visitor can share or refresh an article results URL without losing the current page and search state
- [ ] **ARTP-03**: Visitor sees stable article ordering and clear empty-state behavior while paging or searching

### Newsletters Pagination

- [ ] **NEWS-01**: Visitor can browse newsletters through numbered pages backed by paginated Supabase queries
- [ ] **NEWS-02**: Visitor can navigate newsletter pages through shareable URL state with clear current-page feedback
- [ ] **NEWS-03**: Visitor sees stable newsletter ordering and clear empty-state behavior while paging

### Public UI Polish

- [ ] **UIP-01**: Visitor gets clearer public-page hierarchy, spacing, and navigation flow across the touched frontend pages
- [ ] **UIP-02**: Visitor sees more polished cards, tables, forms, and interaction states while the background-image identity remains intact
- [ ] **UIP-03**: Visitor can use the touched public pages more effectively on mobile-sized screens
- [ ] **UIP-04**: Visitor can use pagination, search, and page interactions with improved focus, semantics, and accessibility cues

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Archive Enhancements

- **ARCH-01**: Visitor can jump directly to archive groupings such as year-based views

### JUFO Discovery

- **JUFO-03**: Visitor can refine JUFO results with richer advanced filters beyond fast browsing
- **JUFO-04**: Visitor can expand JUFO rows for additional on-demand detail without widening the default table

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Infinite scroll for articles or newsletters | Numbered pagination is the chosen archive pattern and provides better orientation and shareability |
| Client-side-only pagination over full datasets | This would not solve the current performance and memory issues |
| Advanced JUFO filter builder | Defer until real usage validates the need beyond fast browse performance |
| Replacing the background-image visual identity | The milestone should refine the current look rather than discard it |
| Broad backend or infrastructure migration | The milestone is focused on targeted frontend improvements |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| JUFO-01 | Phase 5 | Complete |
| JUFO-02 | Phase 5 | Complete |
| ARTP-01 | Phase 6 | Pending |
| ARTP-02 | Phase 6 | Pending |
| ARTP-03 | Phase 6 | Pending |
| NEWS-01 | Phase 6 | Pending |
| NEWS-02 | Phase 6 | Pending |
| NEWS-03 | Phase 6 | Pending |
| UIP-01 | Phase 7 | Pending |
| UIP-02 | Phase 7 | Pending |
| UIP-03 | Phase 7 | Pending |
| UIP-04 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-08*
*Last updated: 2026-04-08 after milestone v1.1 roadmap creation*
