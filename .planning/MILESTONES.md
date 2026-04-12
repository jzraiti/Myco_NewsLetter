# Project Milestones: Myco Newsletter

## v1.1 Frontend Performance and UI Improvements (Shipped: 2026-04-12)

**Delivered:** Server-backed JUFO and archive browsing plus a cohesive public UI/accessibility polish across the touched public routes.

**Phases completed:** 5-7 (10 plans total)

**Key accomplishments:**
- Replaced browser-owned JUFO CSV parsing with a repo-owned normalized artifact and a server-backed browse/search path.
- Rebuilt `/jufo`, `/articles`, and `/newsletters` around canonical URL-driven pagination and search state.
- Preserved stable ordering, invalid-page recovery, and shareable URLs across both public archives.
- Added shared shell accessibility improvements including skip navigation, active-route cues, and stronger focus treatment.
- Polished subscribe, unsubscribe, archive, and JUFO surfaces for readability, mobile use, and clearer interaction feedback.

**Stats:**
- 62 files modified in the milestone commit range
- 6,484 lines of TypeScript/TSX/Python in the current repo snapshot
- 3 phases, 10 plans, 20 tasks
- 4 days from milestone start to ship

**Git range:** `feat(05-01)` → `feat(07-05)`

**What's next:** Plan the next milestone around deeper archive discovery and richer JUFO exploration on top of the new server-backed public-route foundations.

---

## v1.0 Code Quality and Test Foundation (Shipped: 2026-04-08)

**Delivered:** Quality, refactor, and acceptance-test foundations for safer iteration across the existing frontend and backend application.

**Phases completed:** 1-4 (16 plans total)

**What's next:** `v1.1` frontend performance and UI improvements.
