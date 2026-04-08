---
phase: 6
slug: url-driven-archive-pagination
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-08
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + Playwright |
| **Config file** | `nextjs-frontend/playwright.config.ts` |
| **Quick run command** | `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/content.test.ts` |
| **Full suite command** | `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/content.test.ts src/components/articles/ArticlesExplorer.test.tsx src/components/newsletters/NewsletterArchive.test.tsx && npm --prefix nextjs-frontend run test:e2e -- tests/e2e/articles.spec.ts tests/e2e/newsletters.spec.ts` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task-local command from the plan `<verify><automated>` block.
- **After every plan wave:** Run `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/content.test.ts src/components/articles/ArticlesExplorer.test.tsx src/components/newsletters/NewsletterArchive.test.tsx && npm --prefix nextjs-frontend run test:e2e -- tests/e2e/articles.spec.ts tests/e2e/newsletters.spec.ts`
- **Before `/gsd-verify-work`:** Full suite must be green.
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | ARTP-01, NEWS-01 | unit | `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/content.test.ts` | ✅ | ⬜ pending |
| 06-01-02 | 01 | 1 | ARTP-03, NEWS-03 | unit | `npm --prefix nextjs-frontend run test:unit -- src/lib/public-data/content.test.ts` | ✅ | ⬜ pending |
| 06-02-01 | 02 | 2 | ARTP-01, ARTP-02, ARTP-03 | component | `npm --prefix nextjs-frontend run test:unit -- src/components/articles/ArticlesExplorer.test.tsx` | ✅ | ⬜ pending |
| 06-02-02 | 02 | 2 | ARTP-01, ARTP-02, ARTP-03 | e2e | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/articles.spec.ts` | ✅ | ⬜ pending |
| 06-03-01 | 03 | 2 | NEWS-01, NEWS-02, NEWS-03 | component | `npm --prefix nextjs-frontend run test:unit -- src/components/newsletters/NewsletterArchive.test.tsx` | ✅ | ⬜ pending |
| 06-03-02 | 03 | 2 | NEWS-01, NEWS-02, NEWS-03 | e2e | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/newsletters.spec.ts` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

All phase behaviors have automated verification.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 45s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-04-08
