---
phase: 05-jufo-server-backed-browsing
plan: 01
subsystem: frontend-data
tags: [jufo, pagination, csv-parse, fixtures, vitest]
requires:
  - phase: 02-frontend-quality-efficiency
    provides: shared public-data helpers and fixture-aware public content patterns
provides:
  - Canonical JUFO normalization script and committed JSON artifact
  - Server-only JUFO browse/search adapter with 50-row pagination metadata
  - Deterministic JUFO fixtures and regression coverage for browse/search page math
affects: [jufo-server-backed-browsing, url-driven-archive-pagination, public-ui-clarity-responsiveness-and-accessibility]
tech-stack:
  added: [csv-parse, server-only, JUFO normalization script, generated JUFO artifact]
  patterns: [repo-owned normalized dataset, server-side page slicing, fixture-aware server data adapter]
key-files:
  created: [nextjs-frontend/scripts/normalize-jufo-data.mjs, nextjs-frontend/src/lib/public-data/generated/jufo-publications.json, nextjs-frontend/src/lib/public-data/jufo.ts, nextjs-frontend/src/lib/public-data/pagination.ts, nextjs-frontend/src/lib/public-data/jufo.test.ts]
  modified: [nextjs-frontend/package.json, nextjs-frontend/package-lock.json, nextjs-frontend/src/lib/public-data/types.ts, nextjs-frontend/src/lib/public-data/test-fixtures.ts, nextjs-frontend/src/test/setup.ts]
key-decisions:
  - "Use nextjs-frontend/public/jfp-export-Aug-7-2025-full.csv as the canonical JUFO source because it preserves Jufo_ID for stable identity"
  - "Keep JUFO as a repo-owned normalized artifact in this phase instead of introducing a Supabase table"
patterns-established:
  - "Large static browse datasets can be normalized once into committed generated artifacts and then consumed through server-only public-data adapters"
  - "Fixture-aware server adapters should read environment flags at call time so tests can switch between deterministic and generated data safely"
requirements-completed: [JUFO-01, JUFO-02]
duration: 4 min
completed: 2026-04-08T20:36:08Z
---

# Phase 5 Plan 1: JUFO data foundation Summary

**Canonical JUFO normalization, committed generated data, and a server-only paginated adapter now replace the browser-owned full-dataset path at the data layer.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-08T20:32:30Z
- **Completed:** 2026-04-08T20:36:08Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Added a normalization script that turns the selected JUFO CSV into a committed JSON artifact with precomputed searchable text.
- Added shared JUFO contracts, deterministic fixture rows, a 50-row pagination helper, and a server-only browse/search adapter.
- Added unit coverage that proves JUFO browse/search requests return paginated results and respect deterministic fixture mode.

## Task Commits

Each task was committed atomically:

1. **Task 1: Define JUFO contracts, fixture rows, and failing unit coverage** - `7303940` (test)
2. **Task 2: Implement normalization script, generated artifact, and server-only JUFO adapter** - `43eddc9` (feat)

**Plan metadata:** `pending` (docs: complete plan)

## Files Created/Modified
- `nextjs-frontend/scripts/normalize-jufo-data.mjs` - Converts the canonical JUFO CSV into normalized generated data.
- `nextjs-frontend/src/lib/public-data/generated/jufo-publications.json` - Committed normalized JUFO dataset with `searchText` for server filtering.
- `nextjs-frontend/src/lib/public-data/jufo.ts` - Server-only JUFO browse/search adapter and fixture-aware row loader.
- `nextjs-frontend/src/lib/public-data/pagination.ts` - Shared 50-row page slicing helper.
- `nextjs-frontend/src/lib/public-data/jufo.test.ts` - JUFO browse/search regression coverage.
- `nextjs-frontend/src/lib/public-data/types.ts` - JUFO row/query/result contracts.
- `nextjs-frontend/src/lib/public-data/test-fixtures.ts` - Deterministic JUFO fixture rows for test and Playwright modes.
- `nextjs-frontend/package.json` - Adds `normalize:jufo` and the JUFO normalization/test dependencies.
- `nextjs-frontend/package-lock.json` - Locks the added dependencies.
- `nextjs-frontend/src/test/setup.ts` - Mocks `server-only` for Vitest so server adapters remain unit-testable.

## Decisions Made
- Used `jfp-export-Aug-7-2025-full.csv` as the canonical JUFO source because it includes `Jufo_ID` and the full row set needed for stable server-side identity.
- Kept JUFO in a repo-owned generated artifact for this phase to remove browser parsing immediately without adding new database infrastructure.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Switched generated JUFO loading from JSON module import to server-side file reads**
- **Found during:** Task 2 (Implement normalization script, generated artifact, and server-only JUFO adapter)
- **Issue:** Vitest could not resolve the generated JSON module import reliably in the current setup even after the file existed on disk.
- **Fix:** Changed `jufo.ts` to read `generated/jufo-publications.json` from disk with a cached server-side loader while still keeping the committed generated artifact.
- **Files modified:** `nextjs-frontend/src/lib/public-data/jufo.ts`
- **Verification:** `npm --prefix nextjs-frontend run normalize:jufo && npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/jufo.test.ts`
- **Committed in:** `43eddc9`

**2. [Rule 3 - Blocking] Added server-only test harness support and runtime fixture evaluation**
- **Found during:** Task 2 (Implement normalization script, generated artifact, and server-only JUFO adapter)
- **Issue:** The new server adapter could not run in Vitest because `server-only` threw in the test environment, and the fixture-mode flag was being captured too early for the new tests.
- **Fix:** Added `server-only` to dependencies, mocked it in the shared Vitest setup, and changed JUFO fixture selection to read `NEXT_PUBLIC_E2E_STATIC_DATA` at call time.
- **Files modified:** `nextjs-frontend/package.json`, `nextjs-frontend/package-lock.json`, `nextjs-frontend/src/test/setup.ts`, `nextjs-frontend/src/lib/public-data/jufo.ts`
- **Verification:** `npm --prefix nextjs-frontend run normalize:jufo && npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/jufo.test.ts`
- **Committed in:** `43eddc9`

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes were required to keep the generated-artifact approach while making the new server adapter testable in the existing repo tooling.

## Issues Encountered
- The repo did not already include a working test-time path for `server-only` modules, so the new JUFO adapter needed a small shared test-harness adjustment.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `/jufo` can now consume a server-only `fetchJufoPage` contract instead of parsing CSV in the browser.
- Wave 2 can focus on route rewiring, URL controls, and end-to-end verification without revisiting JUFO source normalization.

## Self-Check: PASSED

---
*Phase: 05-jufo-server-backed-browsing*
*Completed: 2026-04-08*
