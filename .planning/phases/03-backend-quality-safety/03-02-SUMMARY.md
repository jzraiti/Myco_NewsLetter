---
phase: 03-backend-quality-safety
plan: 02
subsystem: backend-quality-and-safety
tags: [services, article-selection, openai, venue-enrichment, compatibility]
requires: [03-01]
provides:
  - Focused summary and venue service modules with injectable seams
  - Extracted article-selection algorithms with offline tests
  - Compatibility imports preserved through `other_utils.py`
affects: [backend-quality-and-safety]
tech-stack:
  added: []
  patterns: [function injection, thin compatibility wrappers, isolated service modules]
key-files:
  created: [backend/src/utils/summary_service.py, backend/src/utils/venue_service.py, backend/src/utils/article_selection_service.py, backend/tests/test_summary_service.py, backend/tests/test_article_selection_service.py]
  modified: [backend/src/utils/other_utils.py]
key-decisions:
  - "Keep `other_utils.py` as a compatibility layer while extracted modules become the real owners of summary, venue, and article-selection logic"
  - "Use function-parameter injection instead of a new class hierarchy so backend tests stay aligned with the repo's monkeypatch-first style"
requirements-completed: [BEQ-01, BEQ-02, BEQ-04]
duration: 0 min
completed: 2026-04-08T03:50:55Z
---

# Phase 3 Plan 2: Extract backend helper modules Summary

**Focused summary, venue, and article-selection service modules that preserve existing imports while making newsletter helper logic testable without live OpenAI, HTTP, Semantic Scholar, or Supabase calls**

## Performance

- **Duration:** 0 min
- **Started:** 2026-04-08T03:47:10Z
- **Completed:** 2026-04-08T03:50:55Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Moved GPT summary generation into `backend/src/utils/summary_service.py` with an injected client seam and preserved the existing model/system-prompt behavior
- Moved DOI redirect and favicon enrichment into `backend/src/utils/venue_service.py` with injectable request functions and fallback-safe behavior
- Extracted `article_selection()` and `article_selection_JUFO()` into `backend/src/utils/article_selection_service.py` with injectable persistence, detail-fetch, and summary seams
- Kept `backend/src/utils/other_utils.py` as a thin compatibility surface so existing imports continue to resolve during the refactor

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract summary and venue enrichment helpers into focused modules** - `022c33c` (feat)
2. **Task 2: Extract article-selection algorithms and keep `other_utils` as a thin wrapper** - `cb6318b` (feat)

**Plan metadata:** `pending` (docs: complete plan)

## Files Created/Modified
- `backend/src/utils/summary_service.py` - Injected OpenAI summary helper
- `backend/src/utils/venue_service.py` - Injected DOI redirect and favicon helper functions
- `backend/src/utils/article_selection_service.py` - Extracted article-selection algorithms and service seams
- `backend/tests/test_summary_service.py` - Offline tests for summary generation and venue helpers
- `backend/tests/test_article_selection_service.py` - Offline tests for JUFO ordering, TLDR fallback, and summary failure skipping
- `backend/src/utils/other_utils.py` - Compatibility imports over the extracted services

## Decisions Made
- Bounded the refactor to function-based service modules rather than introducing classes or a repository-wide service layer
- Preserved the current `generate_gpt_paper_summary()` outward behavior while moving ownership to a dedicated service module

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- None

## User Setup Required

None - all new backend tests run through the existing repo-owned test command.

## Next Phase Readiness
- Wave 2 delivery/upload work can now use the shared workflow results from `03-01` alongside cleaner helper-module seams
- Wave 3 can wire Lambda orchestration against explicit article-selection and summary modules instead of the old monolithic helper file

## Self-Check: PASSED

---
*Phase: 03-backend-quality-safety*
*Completed: 2026-04-08*
