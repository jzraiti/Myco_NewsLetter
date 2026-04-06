---
phase: 3
slug: backend-quality-safety
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-06
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | pytest |
| **Config file** | `backend/pytest.ini`, `backend/scripts/run_backend_tests.py` |
| **Quick run command** | `python backend/scripts/run_backend_tests.py` |
| **Full suite command** | `python backend/scripts/run_backend_tests.py` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `python backend/scripts/run_backend_tests.py`
- **After every plan wave:** Run `python backend/scripts/run_backend_tests.py`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | BEQ-01 | unit | `python backend/scripts/run_backend_tests.py` | ✅ | ⬜ pending |
| 3-01-02 | 01 | 1 | BEQ-02 | unit | `python backend/scripts/run_backend_tests.py` | ✅ | ⬜ pending |
| 3-02-01 | 02 | 2 | BEQ-01 | unit | `python backend/scripts/run_backend_tests.py` | ✅ | ⬜ pending |
| 3-02-02 | 02 | 2 | BEQ-02 | unit | `python backend/scripts/run_backend_tests.py` | ✅ | ⬜ pending |
| 3-03-01 | 03 | 2 | BEQ-03 | unit | `python backend/scripts/run_backend_tests.py` | ✅ | ⬜ pending |
| 3-03-02 | 03 | 2 | BEQ-01 | unit | `python backend/scripts/run_backend_tests.py` | ✅ | ⬜ pending |
| 3-04-01 | 04 | 3 | BEQ-03 | unit | `python backend/scripts/run_backend_tests.py` | ✅ | ⬜ pending |
| 3-04-02 | 04 | 3 | BEQ-04 | unit | `python backend/scripts/run_backend_tests.py` | ✅ | ⬜ pending |

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
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
