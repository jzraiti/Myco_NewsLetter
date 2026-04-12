---
phase: 07-public-ui-clarity-responsiveness-accessibility
created: 2026-04-12
status: complete
discovery_level: 1
---

# Phase 7 Research: Public UI Clarity, Responsiveness & Accessibility

## Question

What do we need to know to plan Phase 7 well?

## Inputs Read

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/PROJECT.md`
- `.planning/STATE.md`
- `.planning/phases/07-public-ui-clarity-responsiveness-accessibility/07-CONTEXT.md`
- `.planning/phases/07-public-ui-clarity-responsiveness-accessibility/07-UI-SPEC.md`
- `.planning/phases/05-jufo-server-backed-browsing/05-VERIFICATION.md`
- `.planning/phases/05-jufo-server-backed-browsing/05-02-SUMMARY.md`
- `.planning/phases/06-url-driven-archive-pagination/06-VERIFICATION.md`
- `.planning/phases/06-url-driven-archive-pagination/06-02-SUMMARY.md`
- `.planning/phases/06-url-driven-archive-pagination/06-03-SUMMARY.md`
- `nextjs-frontend/src/app/layout.tsx`
- `nextjs-frontend/src/app/globals.css`
- `nextjs-frontend/src/components/Layout.tsx`
- `nextjs-frontend/src/components/TopBar.tsx`
- `nextjs-frontend/src/components/Footer.tsx`
- `nextjs-frontend/src/components/subscription/SubscribePanel.tsx`
- `nextjs-frontend/src/components/subscription/UnsubscribePanel.tsx`
- `nextjs-frontend/src/components/articles/ArticlesExplorer.tsx`
- `nextjs-frontend/src/components/newsletters/NewsletterArchive.tsx`
- `nextjs-frontend/src/components/jufo/JufoExplorer.tsx`
- `nextjs-frontend/src/components/jufo/JufoSearchControls.tsx`
- `nextjs-frontend/src/components/ui/button.tsx`
- `nextjs-frontend/src/components/ui/input.tsx`
- `nextjs-frontend/src/components/ui/card.tsx`
- `nextjs-frontend/src/components/ui/table.tsx`
- `nextjs-frontend/src/components/subscription/SubscribePanel.test.tsx`
- `nextjs-frontend/src/components/subscription/UnsubscribePanel.test.tsx`
- `nextjs-frontend/src/components/articles/ArticlesExplorer.test.tsx`
- `nextjs-frontend/src/components/newsletters/NewsletterArchive.test.tsx`
- `nextjs-frontend/src/components/jufo/JufoExplorer.test.tsx`
- `nextjs-frontend/tests/e2e/subscribe.spec.ts`
- `nextjs-frontend/tests/e2e/unsubscribe.spec.ts`
- `nextjs-frontend/tests/e2e/articles.spec.ts`
- `nextjs-frontend/tests/e2e/newsletters.spec.ts`
- `nextjs-frontend/tests/e2e/jufo.spec.ts`
- `nextjs-frontend/vitest.config.ts`
- `nextjs-frontend/playwright.config.ts`

## Discovery Result

Phase 7 is a **Level 1 quick-verification** phase.

- No new product capability is being added.
- No new external dependency is needed.
- The correct move is to reuse the existing Next.js 15 + shadcn + Radix + Tailwind stack and refine the already-shipped Phase 5/6 public routes.
- External verification was only needed for current accessibility guidance and responsive table expectations, not for architecture selection.

## Locked Decisions To Honor

- **D-01:** Keep the look editorial, streamlined, and professional.
- **D-02:** Preserve background photography, but strengthen content-surface separation.
- **D-03:** Tighten typography hierarchy, surface treatment, and spacing rhythm across shared public pages.
- **D-04:** Make top navigation and footer clearer, with stronger orientation cues.
- **D-05:** Add clearer page introductions and section framing.
- **D-06:** Improve clarity and trust without adding destinations or discovery surfaces.
- **D-07:** Improve article cards, newsletter cards, and JUFO table readability.
- **D-08:** Keep the current server-backed archive and JUFO interaction model.
- **D-09:** Preserve Phase 6 pagination/search behavior contracts while polishing the UI around them.
- **D-10:** Prioritize practical mobile improvements: spacing, stacking, touch targets, and navigation clarity.
- **D-11:** Prioritize visible accessibility wins: focus states, readable contrast, copy blocks, and interaction feedback.
- **D-12:** Small-screen table-like information may adapt away from strict desktop parity for clarity.
- **D-13:** Prefer shared, high-leverage polish over one-off redesigns.
- **D-14:** Use the frontend-design quality bar while staying grounded in the current stack and identity.

## Existing Codebase Signals

## 1. The public UI is visually consistent in concept, but not yet in system

The codebase already uses:

- photographic full-page backgrounds
- white text over dark scrims
- translucent glass cards
- shared shadcn primitives

But the current implementation is uneven:

- nav/footer lack route orientation and accessible focus cues
- page intros vary heavily in hierarchy and spacing
- home/unsubscribe forms use the same baseline structure but not the stronger framing specified by the UI contract
- archive pagination/search UI is functional from Phases 5/6, but still styled as a thin utility layer rather than a polished reading surface
- JUFO remains desktop-table-first even though D-12 explicitly allows mobile adaptation

## 2. Phase 5 and Phase 6 already locked the interaction model

This phase must not reopen:

- awaited `searchParams` route handling
- canonical page redirects
- URL-owned article search state
- server-backed pagination data seams

The UI layer should refine the framing, controls, semantics, and responsive behavior around those existing flows.

## 3. Existing tests are a good base, but they mostly protect behavior, not presentation

There are already focused unit and Playwright tests for:

- subscribe / unsubscribe feedback
- article pagination/search state
- newsletter pagination state
- JUFO search/pagination state

Phase 7 should extend those tests to cover:

- new copy and CTA labels
- accessible labeling / confirmation states
- stronger current-page and focus semantics
- small-screen path checks where the layout meaningfully changes

## External Guidance Confirmed

## WCAG 2.2 guidance relevant here

Verified from W3C WCAG 2.2 materials:

- visible focus remains required
- target size minimum is now **24x24 CSS px** at AA, but the project's approved UI contract intentionally uses **44px minimum hit area** and **48px primary mobile controls**, which is a stronger practical target and should be kept
- headings/labels must clearly describe purpose
- responsive and zoom-safe layouts matter as much as nominal contrast compliance

## shadcn / table guidance relevant here

Verified from shadcn table docs and responsive table references:

- keep semantic tables on desktop where table comprehension matters
- provide a mobile-adapted presentation or clearly usable scroll strategy when the full table becomes unreadable
- add captions / labels so the table purpose is clear

For this codebase, JUFO should keep a semantic desktop table and add a mobile card/list view instead of relying only on cramped horizontal scrolling.

## Recommended Technical Approach

## 1. Establish a shared public-shell foundation first

First update the highest-leverage shared surfaces:

- `Layout.tsx`
- `TopBar.tsx`
- `Footer.tsx`
- minimal global focus/token refinements in `globals.css`

This should provide:

- a skip link / content landmark target
- active-route highlighting in the nav
- stronger glass/surface framing
- mobile-safe wrapping and larger hit areas
- a shared focus ring color aligned to the approved accent

This is the one real dependency for the rest of the phase because every public route sits inside that shell.

## 2. Keep page work vertical by route/surface

After the shared shell lands, route polish can run in parallel:

- home + unsubscribe surfaces
- articles archive
- newsletters archive
- JUFO browse/search/table surface

This follows the existing file ownership boundaries and avoids merge conflicts.

## 3. Use copy and spacing contracts from the approved UI-SPEC directly

Do not leave key visible states to executor interpretation. The approved contract already gives exact defaults for:

- CTA text: `Subscribe Free`
- empty-state headings/body
- destructive unsubscribe confirmation labels
- spacing scale
- color usage constraints

Those values should appear verbatim in plan actions.

## 4. Prefer local page/component polish over new infrastructure

No new library is needed. Use the current stack only:

- Next.js App Router
- React 19
- Tailwind CSS
- shadcn / Radix primitives already in repo
- existing Google font setup in `src/app/layout.tsx`

## Concrete UI Moves That Fit The Current Codebase

## Shared shell

- Make `TopBar` route-aware with `usePathname()` so the active route gets a visible cue.
- Add a clear home link plus shorter primary-route labels.
- Keep the Madison Mycological Society partner link, but visually subordinate it to the app brand.
- Group footer links into clearer editorial/project buckets instead of one flat strip.

## Home and unsubscribe

- Keep the photographic hero, but wrap content in stronger glass/backplate surfaces.
- Use a labeled email field and 48px-high primary controls.
- Change the primary CTA text to `Subscribe Free` per the UI-SPEC.
- Add an explicit unsubscribe confirmation state instead of firing the destructive action immediately.

## Articles and newsletters

- Preserve Phase 6 URL/search/page behavior exactly.
- Add stronger page intros and result-summary framing above the archive bodies.
- Treat pagination as a surfaced control row with visible current-page treatment and stronger focus states.
- Keep cards readable over imagery with stronger metadata grouping and calmer CTA styling.

## JUFO

- Keep the desktop semantic table.
- Add a mobile card/list representation for the same dataset.
- Add table caption / labeling and clearer result summary.
- Keep the current URL search/page flow untouched.

## Pitfalls To Avoid

- Do **not** change archive/JUFO data flow or canonical URL behavior while polishing UI (violates D-08/D-09).
- Do **not** replace the photographic identity with flat neutral backgrounds (violates D-02).
- Do **not** introduce new routes, drawers, hamburger menus, or extra discovery destinations (violates D-06).
- Do **not** globally turn every button/border green; the accent is reserved, not dominant.
- Do **not** rely on class-only visual changes without semantic updates like `aria-current`, labels, captions, or confirmation states.
- Do **not** leave JUFO as a cramped small-screen table if the content becomes unreadable; D-12 explicitly allows layout adjustment.

## Planning Implications

Recommended breakdown:

1. Shared public shell and accessibility foundation
2. Home + unsubscribe polish
3. Articles archive polish
4. Newsletters archive polish
5. JUFO polish

Wave structure:

- **Wave 1:** shared shell foundation
- **Wave 2:** four parallel route/surface plans with exclusive file ownership

## Validation Architecture

## Framework

- Unit/component: Vitest via `npm --prefix nextjs-frontend run test:unit -- ...`
- Acceptance: Playwright via `npm --prefix nextjs-frontend run test:e2e -- ...`

## Fast feedback loop

- Shared shell: `npm --prefix nextjs-frontend run test:unit -- src/components/public-shell.test.tsx`
- Home/unsubscribe: `npm --prefix nextjs-frontend run test:unit -- src/components/subscription/SubscribePanel.test.tsx src/components/subscription/UnsubscribePanel.test.tsx`
- Articles: `npm --prefix nextjs-frontend run test:unit -- src/components/articles/ArticlesExplorer.test.tsx`
- Newsletters: `npm --prefix nextjs-frontend run test:unit -- src/components/newsletters/NewsletterArchive.test.tsx`
- JUFO: `npm --prefix nextjs-frontend run test:unit -- src/components/jufo/JufoExplorer.test.tsx`

## Phase-level suite

```bash
npm --prefix nextjs-frontend run test:unit -- src/components/public-shell.test.tsx src/components/subscription/SubscribePanel.test.tsx src/components/subscription/UnsubscribePanel.test.tsx src/components/articles/ArticlesExplorer.test.tsx src/components/newsletters/NewsletterArchive.test.tsx src/components/jufo/JufoExplorer.test.tsx
npm --prefix nextjs-frontend run test:e2e -- tests/e2e/subscribe.spec.ts tests/e2e/unsubscribe.spec.ts tests/e2e/articles.spec.ts tests/e2e/newsletters.spec.ts tests/e2e/jufo.spec.ts
```

## Research Conclusion

Phase 7 should stay entirely inside the current frontend stack, start with one shared shell/accessibility foundation, and then polish each touched public route in parallel. The work is mostly about applying the approved UI contract consistently, preserving the server-backed Phase 5/6 interaction model, and turning existing public components into clearer, more mobile-safe, and more accessible surfaces.

## Sources

- W3C WCAG 2.2 Recommendation and editor's draft — focus visibility, headings/labels, and target-size guidance
- shadcn table docs — semantic table structure, captions, and responsive guidance
- Local codebase files listed above — primary source of truth for stack, patterns, and current route behavior
