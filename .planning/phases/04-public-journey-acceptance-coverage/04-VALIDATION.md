---
phase: 4
slug: public-journey-acceptance-coverage
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-08
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright |
| **Config file** | `nextjs-frontend/playwright.config.ts` |
| **Quick run command** | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/public-smoke.spec.ts` |
| **Full suite command** | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/public-smoke.spec.ts tests/e2e/subscribe.spec.ts tests/e2e/unsubscribe.spec.ts tests/e2e/newsletters.spec.ts tests/e2e/articles.spec.ts` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task-specific spec command listed below.
- **After every plan wave:** Run `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/public-smoke.spec.ts tests/e2e/subscribe.spec.ts tests/e2e/unsubscribe.spec.ts tests/e2e/newsletters.spec.ts tests/e2e/articles.spec.ts`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 1 | ACCP-01 | acceptance | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/public-smoke.spec.ts` | ✅ | ⬜ pending |
| 4-01-02 | 01 | 1 | ACCP-03 | acceptance | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/public-smoke.spec.ts` | ✅ | ⬜ pending |
| 4-02-01 | 02 | 2 | ACCP-01 | acceptance | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/subscribe.spec.ts` | ❌ W0 | ⬜ pending |
| 4-02-02 | 02 | 2 | ACCP-02 | acceptance | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/unsubscribe.spec.ts` | ❌ W0 | ⬜ pending |
| 4-03-01 | 03 | 2 | ACCP-03 | acceptance | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/newsletters.spec.ts` | ❌ W0 | ⬜ pending |
| 4-03-02 | 03 | 2 | ACCP-04 | acceptance | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/articles.spec.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing Playwright infrastructure covers all phase requirements.

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
