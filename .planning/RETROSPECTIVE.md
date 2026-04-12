# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.1 — Frontend Performance and UI Improvements

**Shipped:** 2026-04-12
**Phases:** 3 | **Plans:** 10 | **Sessions:** Not tracked in repo state

### What Was Built
- JUFO browsing moved to a normalized repo-owned dataset with server-backed paging and URL-driven search.
- Article and newsletter archives moved to canonical server-backed pagination with stable shareable URLs.
- Public shell, subscribe, unsubscribe, archive, and JUFO surfaces gained stronger hierarchy, mobile behavior, and accessibility cues.

### What Worked
- Phase summaries and verification reports made milestone closeout straightforward because each shipped behavior already had clear evidence.
- Locking URL/data contracts in Phases 5 and 6 made Phase 7 UI polish lower risk.
- Focused unit plus Playwright coverage kept regressions visible while public routes were reworked.

### What Was Inefficient
- The milestone archive CLI left `ROADMAP.md`, `PROJECT.md`, and `STATE.md` in a stale post-archive state and still required manual cleanup.
- `STATE.md` metrics lagged behind actual milestone progress, so closeout still needed manual normalization.

### Patterns Established
- Large public browse datasets can be normalized once and consumed through server-only adapters rather than parsed in the browser.
- Public archive pages work best when the server owns canonical URL state and client islands only update that state.
- Shared shell accessibility work should land before page-level polish so later UI plans inherit stable semantics.

### Key Lessons
1. Frontload data-contract and routing decisions before UI polish so later presentation work can stay behavior-preserving.
2. Keep milestone-closeout automation narrow unless it can fully update milestone-level docs without leaving stale planning state behind.

### Cost Observations
- Model mix: Not tracked in repo artifacts
- Sessions: Not tracked in repo artifacts
- Notable: The strongest efficiency gains came from reusing the same URL-driven server-route pattern across JUFO, articles, and newsletters.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | Not tracked | 4 | Established isolated test, refactor, and acceptance foundations before larger public-route work |
| v1.1 | Not tracked | 3 | Shifted public browse routes to server-backed URL state, then polished the shared UI layer |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | Frontend unit, backend pytest, and Playwright foundations | Not tracked | Repo-owned backend test runner and mocked acceptance harness |
| v1.1 | Focused unit and Playwright coverage for JUFO, archives, subscribe, and unsubscribe | Not tracked | Normalized JUFO artifact and shared paginated public-data adapters |

### Top Lessons (Verified Across Milestones)

1. Shared test seams and deterministic fixtures make refactors and public-route rewrites much safer.
2. Establishing reusable platform patterns first reduces risk and churn in later milestone-specific polish.
