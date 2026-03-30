# Myco Newsletter

## What This Is

Myco Newsletter is a web application for discovering and distributing mycology-focused research content. It gives readers a public site where they can subscribe, browse past newsletters, search article summaries, and review publication rankings while the backend assembles and sends newsletter content.

## Core Value

Readers can reliably discover and receive curated, high-quality mycology research with minimal friction.

## Current Milestone: v1.0 Code Quality and Test Foundation

**Goal:** Improve maintainability and efficiency across both the frontend and backend while establishing reliable automated test coverage for the app's core user journeys and shared logic.

**Target features:**
- Set up unit test infrastructure for frontend and backend code
- Add acceptance tests for subscribe, unsubscribe, newsletter archive, and article browse/search flows
- Reduce duplication in repeated app logic and shared data-access patterns across frontend and backend
- Improve frontend rendering/runtime efficiency in the most visible pages
- Improve backend code quality in utility modules and integration-heavy paths

## Requirements

### Validated

- ✓ Visitors can subscribe to the newsletter from the home page — inferred from existing codebase
- ✓ Visitors can unsubscribe from the newsletter from a public page — inferred from existing codebase
- ✓ Visitors can browse previously published newsletters — inferred from existing codebase
- ✓ Visitors can browse and search article summaries — inferred from existing codebase
- ✓ Visitors can review JUFO publication rankings and supporting context — inferred from existing codebase
- ✓ Backend can generate newsletter HTML, send emails, and persist newsletter records — inferred from existing codebase

### Active

- [ ] Establish unit testing for frontend components, shared logic, and backend utilities
- [ ] Establish acceptance coverage for the core public user journeys
- [ ] Refactor duplicated frontend and backend logic into clearer shared modules
- [ ] Improve frontend efficiency on data-heavy and high-visibility pages
- [ ] Improve backend maintainability and safety in integration-heavy paths

### Out of Scope

- New end-user product features unrelated to code quality or test coverage — this milestone is focused on quality, efficiency, and regression protection
- Major redesign of the public site — visual changes are not required to deliver this milestone's core value
- Infrastructure migration or provider replacement — not necessary for the current quality-focused scope

## Context

- The codebase contains a `Next.js` app in `nextjs-frontend/` using the app router, React, Tailwind, Supabase client access, and reusable UI components.
- The frontend includes public flows for newsletter subscription, unsubscription, previous newsletters, article discovery, and JUFO publication lookup.
- The backend contains a Python AWS Lambda flow for article retrieval, newsletter generation, email sending, S3 upload, and Supabase persistence.
- Repeated patterns exist in frontend data fetching, random image selection, and Supabase client usage, which makes maintenance and optimization harder.
- Backend utility modules are integration-heavy and currently have no visible automated unit-test safety net.

## Constraints

- **Tech stack**: Keep the existing Next.js frontend and Python/AWS backend structure — this milestone improves the current system rather than replacing it.
- **Scope**: Focus on quality, testing, and efficiency work — prevents feature creep during milestone setup.
- **Data integrations**: Supabase, email delivery, and external article sources need safe test boundaries — direct live dependencies would make automated tests brittle.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Treat this as milestone `v1.0` | No prior planning history exists in `.planning/` for this repository | — Pending |
| Prioritize testing foundation first | Regression protection is the fastest way to support refactors and quality work safely | — Pending |
| Include backend quality improvements with frontend work | The current milestone should improve maintainability across the whole application, not only the UI | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-30 after milestone v1.0 start*
