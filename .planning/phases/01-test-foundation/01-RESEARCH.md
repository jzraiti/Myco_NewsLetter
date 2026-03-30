# Phase 1: Test Foundation Research

**Date:** 2026-03-30
**Status:** Complete

## Objective

Determine the lowest-risk way to make frontend unit tests, backend unit tests, and acceptance tests runnable from isolated commands without requiring live Supabase, email, S3, OpenAI, or Semantic Scholar services.

## Current Codebase Findings

## Frontend

- `nextjs-frontend/package.json` has no test runner, no test scripts, and no browser automation tooling.
- Public pages in `nextjs-frontend/src/app/home/page.tsx`, `src/app/unsubscribe/page.tsx`, `src/app/newsletters/page.tsx`, and `src/app/articles/page.tsx` instantiate Supabase directly in the module and read `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` at runtime.
- `nextjs-frontend/src/components/ui/toast.tsx` uses `framer-motion`, so jsdom tests should mock motion behavior rather than depend on animation timing.
- The pages are client components, so Vitest + React Testing Library is a good fit for phase-1 unit coverage.

## Backend

- `backend/requirements.txt` is effectively empty for local testing, so maintainers currently have no repeatable local unit-test dependency manifest.
- `backend/src/lambda_function.py` orchestrates article fetch, selection, email rendering, S3 upload, and Supabase persistence in one entrypoint.
- `backend/src/utils/ss_api.py`, `supabase_utils.py`, `email_utils.py`, and `aws_utils.py` all talk to external systems directly.
- Existing `tests/test_semantic_scholar.py` is live-network-dependent and should not be the command used for isolated backend unit runs.

## Recommended Stack

## Frontend Unit Tests

- Use **Vitest** with **jsdom** and **React Testing Library**.
- Add `vite-tsconfig-paths` so the existing `@/*` alias from `nextjs-frontend/tsconfig.json` works in tests.
- Add a dedicated setup file for `@testing-library/jest-dom/vitest`, cleanup hooks, and stable `next/image` mocking.
- Mock `@supabase/supabase-js`, `next/head`, and layout wrappers in tests rather than rewriting app code during this phase.

Why this stack:
- Matches current Next.js 15 + React 19 guidance.
- Requires minimal architectural change.
- Keeps phase 1 focused on test foundation instead of refactoring data-access patterns.

## Backend Unit Tests

- Use **pytest** with `monkeypatch` / `unittest.mock`.
- Create a dedicated `backend/tests/` suite and a `backend/pytest.ini` so the backend command excludes the live `tests/test_semantic_scholar.py` file.
- Add a `backend/requirements-dev.txt` manifest so local test installs are explicit and repeatable.
- Mock `requests.get`, Supabase calls, email sending, S3 upload, and article-selection helpers.

Why this stack:
- Native fit for the existing Python backend.
- No new runtime architecture required.
- Lets phase 1 validate isolated behavior before later refactors in phase 3.

## Acceptance Tests

- Use **Playwright** against the Next.js app.
- Start the app through Playwright `webServer` with test-only env vars:
  - `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key`
- Intercept Supabase REST traffic in Playwright route handlers instead of relying on a live Supabase project.
- Keep phase-1 acceptance coverage to a stable public smoke path:
  - home subscribe flow
  - unsubscribe flow
  - newsletter archive render
  - article list render + search filter

Why this approach:
- Keeps acceptance runs isolated from live services.
- Avoids introducing a separate mock server for phase 1.
- Creates a reliable base that phase 4 can extend with deeper journey coverage.

## Validation Architecture

## Commands to Target

- Frontend unit: `npm --prefix nextjs-frontend run test:unit`
- Backend unit: `python -m pytest -c backend/pytest.ini backend/tests`
- Acceptance: `npm --prefix nextjs-frontend run test:e2e -- --project=chromium`

## Sampling Strategy

- After frontend test-tooling changes: run the frontend unit command.
- After backend fixture/test changes: run the backend pytest command.
- After Playwright config/spec changes: run the acceptance command for the chromium project only.
- Before phase handoff: run all three commands once from a clean state.

## Key Risks and Mitigations

1. **Supabase client created at module scope in frontend pages**
   - Mitigation: use mocked `createClient` in Vitest and route interception in Playwright.

2. **Backend modules import heavy/external dependencies at import time**
   - Mitigation: add a dedicated backend dev requirements file and patch outbound integrations in tests.

3. **Existing live-network root test could confuse maintainers**
   - Mitigation: the isolated backend command must explicitly target `backend/tests`.

4. **Playwright browser installation can be a one-time local requirement**
   - Mitigation: keep the test command stable; if browser installation is needed, capture it as setup documentation inside the plan rather than changing the phase scope.

## Plan-Shaping Implications

- Split frontend tooling from backend tooling because they use different dependency managers and different mocking strategies.
- Let backend unit setup run in parallel with frontend setup.
- Put acceptance coverage after frontend tooling because it reuses the frontend package scripts and test conventions.
- Do not use live Supabase, Resend, S3, OpenAI, or Semantic Scholar calls in any phase-1 verification command.

## Recommended Plan Breakdown

1. Frontend unit test foundation in `nextjs-frontend/`
2. Backend pytest harness in `backend/`
3. Acceptance harness and mocked public smoke flows in `nextjs-frontend/tests/e2e/`
