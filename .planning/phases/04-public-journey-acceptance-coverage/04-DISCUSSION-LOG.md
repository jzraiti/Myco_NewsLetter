# Phase 4: Public Journey Acceptance Coverage - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-08T04:20:25Z
**Phase:** 04-public-journey-acceptance-coverage
**Areas discussed:** Journey granularity

---

## Journey granularity

| Option | Description | Selected |
|--------|-------------|----------|
| Split by journey | Create one focused spec per journey and keep the broad smoke spec lightweight. | ✓ |
| Keep one broad spec | Deepen the current single multi-page spec only. | |
| Hybrid grouped specs | Group related journeys into a smaller number of focused specs. | |

**User's choice:** Split by journey
**Notes:** User chose debuggability and long-term maintainability over keeping all public checks in a single file.

| Option | Description | Selected |
|--------|-------------|----------|
| Keep minimal umbrella smoke | Retain `public-smoke.spec.ts` as a lightweight canary while richer assertions move to journey specs. | ✓ |
| Replace it entirely | Delete the smoke spec once journey specs exist. | |
| Expand it too | Keep and deepen the smoke spec alongside journey specs. | |

**User's choice:** Keep minimal umbrella smoke
**Notes:** The current smoke test should remain as a fast all-routes confidence check, not the main place for detailed journey assertions.

---

## the agent's Discretion

- Exact spec file naming and support-helper breakdown
- Exact assertion mix inside each journey spec

## Deferred Ideas

None.
