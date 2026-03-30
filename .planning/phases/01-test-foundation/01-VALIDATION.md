---
phase: 1
slug: test-foundation
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-30
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + React Testing Library, pytest, Playwright |
| **Config file** | `nextjs-frontend/vitest.config.ts`, `backend/pytest.ini`, `nextjs-frontend/playwright.config.ts` |
| **Quick run command** | `npm --prefix nextjs-frontend run test:unit` |
| **Full suite command** | `npm --prefix nextjs-frontend run test:unit && python -m pytest -c backend/pytest.ini backend/tests && npm --prefix nextjs-frontend run test:e2e -- --project=chromium` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix nextjs-frontend run test:unit` or `python -m pytest -c backend/pytest.ini backend/tests` for the subsystem being changed.
- **After every plan wave:** Run `npm --prefix nextjs-frontend run test:unit && python -m pytest -c backend/pytest.ini backend/tests`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | TINF-01 | unit | `npm --prefix nextjs-frontend run test:unit` | ✅ | ⬜ pending |
| 1-01-02 | 01 | 1 | TINF-01 | unit | `npm --prefix nextjs-frontend run test:unit -- src/app/home/page.test.tsx src/app/unsubscribe/page.test.tsx` | ✅ | ⬜ pending |
| 1-02-01 | 02 | 1 | TINF-02 | unit | `python -m pytest -c backend/pytest.ini backend/tests` | ✅ | ⬜ pending |
| 1-02-02 | 02 | 1 | TINF-02 | unit | `python -m pytest -c backend/pytest.ini backend/tests/test_ss_api.py backend/tests/test_lambda_function.py` | ✅ | ⬜ pending |
| 1-03-01 | 03 | 2 | TINF-03 | acceptance | `npm --prefix nextjs-frontend run test:e2e -- --project=chromium` | ✅ | ⬜ pending |
| 1-03-02 | 03 | 2 | TINF-04 | acceptance | `npm --prefix nextjs-frontend run test:e2e -- --project=chromium tests/e2e/public-smoke.spec.ts` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `nextjs-frontend/src/test/setup.ts` — shared frontend test setup
- [ ] `backend/tests/conftest.py` — shared backend fixtures
- [ ] `nextjs-frontend/playwright.config.ts` — acceptance harness entrypoint

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
