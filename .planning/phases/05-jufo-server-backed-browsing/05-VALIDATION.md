---
phase: 5
slug: jufo-server-backed-browsing
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-08
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 + Playwright 1.59.1 |
| **Config file** | `nextjs-frontend/vitest.config.ts`, `nextjs-frontend/playwright.config.ts` |
| **Quick run command** | `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/jufo.test.ts src/components/jufo/JufoExplorer.test.tsx` |
| **Full suite command** | `npm --prefix nextjs-frontend run test:unit && npm --prefix nextjs-frontend run test:e2e -- tests/e2e/jufo.spec.ts` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/jufo.test.ts src/components/jufo/JufoExplorer.test.tsx`
- **After every plan wave:** Run `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/jufo.spec.ts`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | JUFO-01 | unit | `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/jufo.test.ts` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | JUFO-02 | unit | `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/jufo.test.ts` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 2 | JUFO-01 | unit | `npm --prefix nextjs-frontend run test:unit -- src/components/jufo/JufoExplorer.test.tsx` | ❌ W0 | ⬜ pending |
| 05-02-02 | 02 | 2 | JUFO-02 | e2e | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/jufo.spec.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `nextjs-frontend/src/lib/public-data/jufo.test.ts` — unit coverage for JUFO filtering, clamping, and page-slice behavior for `JUFO-01` and `JUFO-02`
- [ ] `nextjs-frontend/src/components/jufo/JufoExplorer.test.tsx` — component coverage for empty-state and current-slice rendering
- [ ] `nextjs-frontend/tests/e2e/jufo.spec.ts` — acceptance coverage for public browse/search behavior on `/jufo`
- [ ] Fixture-backed JUFO static data path for Playwright mode — deterministic `/jufo` behavior under `NEXT_PUBLIC_E2E_STATIC_DATA=true`

---

## Manual-Only Verifications

All phase behaviors have automated verification.

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 45s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
