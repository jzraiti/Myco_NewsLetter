---
phase: 2
slug: frontend-quality-efficiency
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-02
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + React Testing Library, Playwright |
| **Config file** | `nextjs-frontend/vitest.config.ts`, `nextjs-frontend/playwright.config.ts` |
| **Quick run command** | `npm --prefix nextjs-frontend run test:unit` |
| **Full suite command** | `npm --prefix nextjs-frontend run test:unit && npm --prefix nextjs-frontend run test:e2e -- --project=chromium tests/e2e/public-smoke.spec.ts` |
| **Estimated runtime** | ~60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix nextjs-frontend run test:unit` for helper/component changes or `npm --prefix nextjs-frontend run test:e2e -- --project=chromium tests/e2e/public-smoke.spec.ts` after visible page refactors.
- **After every plan wave:** Run `npm --prefix nextjs-frontend run test:unit && npm --prefix nextjs-frontend run test:e2e -- --project=chromium tests/e2e/public-smoke.spec.ts`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | FEQ-01 | unit | `npm --prefix nextjs-frontend run test:unit -- --run src/lib/public-data/subscriptions.test.ts src/lib/public-data/content.test.ts` | ✅ | ⬜ pending |
| 2-01-02 | 01 | 1 | FEQ-02 | unit | `npm --prefix nextjs-frontend run test:unit -- --run src/lib/public-data/backgrounds.test.ts src/lib/public-data/content.test.ts` | ✅ | ⬜ pending |
| 2-02-01 | 02 | 2 | FEQ-01 | unit | `npm --prefix nextjs-frontend run test:unit -- --run src/components/subscription/SubscribePanel.test.tsx src/components/subscription/UnsubscribePanel.test.tsx` | ✅ | ⬜ pending |
| 2-02-02 | 02 | 2 | FEQ-03 | acceptance | `npm --prefix nextjs-frontend run test:e2e -- --project=chromium tests/e2e/public-smoke.spec.ts` | ✅ | ⬜ pending |
| 2-03-01 | 03 | 2 | FEQ-02 | unit | `npm --prefix nextjs-frontend run test:unit -- --run src/components/newsletters/NewsletterArchive.test.tsx` | ✅ | ⬜ pending |
| 2-03-02 | 03 | 2 | FEQ-03 | acceptance | `npm --prefix nextjs-frontend run test:e2e -- --project=chromium tests/e2e/public-smoke.spec.ts` | ✅ | ⬜ pending |
| 2-04-01 | 04 | 2 | FEQ-02 | unit | `npm --prefix nextjs-frontend run test:unit -- --run src/components/articles/ArticlesExplorer.test.tsx src/lib/public-data/content.test.ts` | ✅ | ⬜ pending |
| 2-04-02 | 04 | 2 | FEQ-03 | acceptance | `npm --prefix nextjs-frontend run test:e2e -- --project=chromium tests/e2e/public-smoke.spec.ts` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

All phase behaviors have automated verification.

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
