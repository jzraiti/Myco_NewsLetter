# Phase 01 User Setup

## Playwright

Why: Acceptance tests need local browser binaries the first time they run on a machine.

### Environment Variables

None.

### Setup Checklist

- Run `npx playwright install chromium` once inside `nextjs-frontend/`

### Dashboard Configuration

None.

### Local Dev Notes

- The acceptance suite starts the Next.js app through Playwright `webServer`
- The suite uses mocked Supabase REST routes and does not require live Supabase credentials

### Verification Commands

- `npm --prefix nextjs-frontend run test:e2e`
