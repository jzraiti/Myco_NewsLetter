---
phase: 07
slug: public-ui-clarity-responsiveness-accessibility
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-12
---

# Phase 07 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 + Playwright 1.59.1 |
| **Config file** | `nextjs-frontend/vitest.config.ts`, `nextjs-frontend/playwright.config.ts` |
| **Quick run command** | `npm --prefix nextjs-frontend run test:unit -- src/components/public-shell.test.tsx src/components/subscription/SubscribePanel.test.tsx src/components/subscription/UnsubscribePanel.test.tsx src/components/articles/ArticlesExplorer.test.tsx src/components/newsletters/NewsletterArchive.test.tsx src/components/jufo/JufoExplorer.test.tsx` |
| **Full suite command** | `npm --prefix nextjs-frontend run test:unit -- src/components/public-shell.test.tsx src/components/subscription/SubscribePanel.test.tsx src/components/subscription/UnsubscribePanel.test.tsx src/components/articles/ArticlesExplorer.test.tsx src/components/newsletters/NewsletterArchive.test.tsx src/components/jufo/JufoExplorer.test.tsx && npm --prefix nextjs-frontend run test:e2e -- tests/e2e/subscribe.spec.ts tests/e2e/unsubscribe.spec.ts tests/e2e/articles.spec.ts tests/e2e/newsletters.spec.ts tests/e2e/jufo.spec.ts` |
| **Estimated runtime** | ~55 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task's targeted automated command
- **After every plan wave:** Run `npm --prefix nextjs-frontend run test:unit -- src/components/public-shell.test.tsx src/components/subscription/SubscribePanel.test.tsx src/components/subscription/UnsubscribePanel.test.tsx src/components/articles/ArticlesExplorer.test.tsx src/components/newsletters/NewsletterArchive.test.tsx src/components/jufo/JufoExplorer.test.tsx`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 55 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | UIP-01, UIP-04 | unit | `npm --prefix nextjs-frontend run test:unit -- src/components/public-shell.test.tsx` | ✅ | ⬜ pending |
| 07-01-02 | 01 | 1 | UIP-01, UIP-02, UIP-03, UIP-04 | unit | `npm --prefix nextjs-frontend run test:unit -- src/components/public-shell.test.tsx` | ✅ | ⬜ pending |
| 07-02-01 | 02 | 2 | UIP-01, UIP-02, UIP-03, UIP-04 | unit | `npm --prefix nextjs-frontend run test:unit -- src/components/subscription/SubscribePanel.test.tsx` | ✅ | ⬜ pending |
| 07-02-02 | 02 | 2 | UIP-02, UIP-03, UIP-04 | unit+e2e | `npm --prefix nextjs-frontend run test:unit -- src/components/subscription/UnsubscribePanel.test.tsx && npm --prefix nextjs-frontend run test:e2e -- tests/e2e/unsubscribe.spec.ts` | ✅ | ⬜ pending |
| 07-03-01 | 03 | 2 | UIP-01, UIP-02, UIP-03, UIP-04 | unit | `npm --prefix nextjs-frontend run test:unit -- src/components/articles/ArticlesExplorer.test.tsx` | ✅ | ⬜ pending |
| 07-03-02 | 03 | 2 | UIP-03, UIP-04 | e2e | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/articles.spec.ts` | ✅ | ⬜ pending |
| 07-04-01 | 04 | 2 | UIP-01, UIP-02, UIP-03, UIP-04 | unit | `npm --prefix nextjs-frontend run test:unit -- src/components/newsletters/NewsletterArchive.test.tsx` | ✅ | ⬜ pending |
| 07-04-02 | 04 | 2 | UIP-03, UIP-04 | e2e | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/newsletters.spec.ts` | ✅ | ⬜ pending |
| 07-05-01 | 05 | 2 | UIP-01, UIP-02, UIP-03, UIP-04 | unit | `npm --prefix nextjs-frontend run test:unit -- src/components/jufo/JufoExplorer.test.tsx` | ✅ | ⬜ pending |
| 07-05-02 | 05 | 2 | UIP-03, UIP-04 | e2e | `npm --prefix nextjs-frontend run test:e2e -- tests/e2e/jufo.spec.ts` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Editorial polish still feels cohesive over background imagery | UIP-01, UIP-02 | Automated tests can verify copy, labels, semantics, and route behavior, but not aesthetic balance | Review `/`, `/articles`, `/newsletters`, `/jufo`, and `/unsubscribe` at 1440px and 390px widths; confirm foreground surfaces remain readable over photos and accent use stays reserved for focus/current-state/primary CTA only |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
