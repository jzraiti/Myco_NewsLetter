# Backend

## Overview

This directory contains the Python AWS Lambda backend for Myco Newsletter. It fetches article data, selects newsletter content, renders newsletter HTML, and coordinates delivery and persistence helpers.

## Test Command

Run backend unit tests from the repository root with:

```bash
python backend/scripts/run_backend_tests.py
```

That command is the canonical maintainer entrypoint. It bootstraps `backend/.venv` automatically when needed, installs `backend/requirements-dev.txt`, and then runs the isolated pytest suite in `backend/tests`.

## Key Files

- `src/lambda_function.py` - Lambda entrypoint
- `src/utils/` - article, email, Supabase, and AWS helper modules
- `pytest.ini` - backend pytest discovery config
- `requirements-dev.txt` - local backend test dependencies
- `scripts/run_backend_tests.py` - repo-owned backend test bootstrap and runner

## Notes

- The backend test suite is intentionally scoped to `backend/tests`
- The root-level live Semantic Scholar test is not part of the isolated phase-1 backend command
- Backend unit tests use mocked integrations rather than live Supabase, email, S3, OpenAI, or Semantic Scholar services
