# Phase 4: Public Journey Acceptance Coverage - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Add automated acceptance coverage for the existing highest-value public journeys: subscribe, unsubscribe, newsletter archive browsing, and article browsing/search. This phase strengthens automated journey protection for behavior already present in the app; it does not add new user-facing capabilities.

</domain>

<decisions>
## Implementation Decisions

### Journey structure
- **D-01:** Phase 4 should split acceptance coverage into one focused Playwright spec per public journey instead of keeping all deeper checks in one broad file.
- **D-02:** The four focused journey specs should cover subscribe, unsubscribe, newsletter archive browsing, and article browsing/search as separate acceptance surfaces.

### Smoke coverage role
- **D-03:** `nextjs-frontend/tests/e2e/public-smoke.spec.ts` should remain in the suite as a minimal umbrella canary after the journey split.
- **D-04:** The smoke spec should stay lightweight and verify route boot plus a core happy-path signal, while richer behavior assertions move into the focused journey specs.

### the agent's Discretion
- Exact spec filenames and shared helper layout, as long as the suite is clearly split by journey and keeps the umbrella smoke check.
- Exact assertion mix inside each focused journey, as long as it stays centered on the scoped public behavior and remains maintainable.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone and requirement docs
- `.planning/ROADMAP.md` — Phase 4 goal, dependencies, and success criteria for Public Journey Acceptance Coverage.
- `.planning/REQUIREMENTS.md` — `ACCP-01` through `ACCP-04`, which define the required automated public-journey acceptance checks.
- `.planning/PROJECT.md` — Milestone constraints, quality/test scope guardrails, and the current validated state through Phase 3.
- `.planning/STATE.md` — Current milestone position and the expectation that Phase 4 is the active next phase.

### Prior verification context
- `.planning/phases/01-test-foundation/01-VERIFICATION.md` — Existing Playwright harness, repo command expectations, and no-live-services acceptance-test baseline that Phase 4 must preserve.
- `.planning/phases/02-frontend-quality-efficiency/02-VERIFICATION.md` — Confirms the public pages are server-backed and notes the human/live checks that remained outside automation.
- `.planning/phases/03-backend-quality-safety/03-VERIFICATION.md` — Confirms backend newsletter and workflow seams are stable, so Phase 4 can focus on public browser journeys rather than backend refactoring.

### Acceptance-test implementation hotspots
- `nextjs-frontend/playwright.config.ts` — Current Playwright project/server configuration, including E2E static-data mode.
- `nextjs-frontend/tests/e2e/public-smoke.spec.ts` — Existing umbrella smoke spec that should remain as a lightweight canary.
- `nextjs-frontend/tests/e2e/support/mockSupabase.ts` — Current shared route-mock fixture layer for recipients, newsletters, and articles.
- `nextjs-frontend/src/app/home/page.tsx` — Subscribe-page server wrapper and route under test.
- `nextjs-frontend/src/app/unsubscribe/page.tsx` — Unsubscribe-page route under test.
- `nextjs-frontend/src/app/newsletters/page.tsx` — Newsletter archive route under test.
- `nextjs-frontend/src/app/articles/page.tsx` — Article browsing/search route under test.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `nextjs-frontend/tests/e2e/support/mockSupabase.ts`: Existing shared Supabase route-mock helper that already supports the four public surfaces and should likely stay central to automated acceptance runs.
- `nextjs-frontend/tests/e2e/public-smoke.spec.ts`: Existing end-to-end smoke canary that can be slimmed to a fast route-health check instead of discarded.
- `nextjs-frontend/playwright.config.ts`: Existing Playwright setup with `NEXT_PUBLIC_E2E_STATIC_DATA=true`, giving server-rendered pages deterministic browser-test data.
- `nextjs-frontend/src/components/subscription/SubscribePanel.tsx`, `nextjs-frontend/src/components/subscription/UnsubscribePanel.tsx`, `nextjs-frontend/src/components/newsletters/NewsletterArchive.tsx`, and `nextjs-frontend/src/components/articles/ArticlesExplorer.tsx`: Focused interaction surfaces that map cleanly to journey-specific browser specs.

### Established Patterns
- Acceptance coverage already runs through a single Playwright Chromium project and local Next dev server started by `playwright.config.ts`.
- Automated acceptance runs are intentionally fixture-backed rather than live-service backed, and that pattern is already required by prior phases.
- Public pages are now server-backed wrappers with smaller interactive islands, which supports spec organization by user journey rather than by implementation detail.

### Integration Points
- Journey specs will exercise the browser routes `/`, `/unsubscribe`, `/newsletters`, and `/articles` against the existing mocked-data harness.
- Shared E2E fixtures should connect through `mockSupabase(page)` and any follow-on helper modules added under `nextjs-frontend/tests/e2e/support/`.
- The suite continues to run through the existing project command path exposed by `nextjs-frontend/package.json` and `nextjs-frontend/playwright.config.ts`.

</code_context>

<specifics>
## Specific Ideas

- Keep the current broad public smoke test, but demote it to a fast confidence canary once the deeper journey specs exist.
- Prefer one focused spec per public journey so failures point directly at the affected surface instead of burying everything in one long browser script.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-public-journey-acceptance-coverage*
*Context gathered: 2026-04-08*
