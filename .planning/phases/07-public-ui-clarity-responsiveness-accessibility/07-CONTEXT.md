# Phase 7: Public UI Clarity, Responsiveness & Accessibility - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Polish the touched public frontend pages so they feel clearer, more readable, more responsive, and more accessible while preserving the existing background-image-driven identity. This phase improves the current public presentation and interaction quality across the already-built public routes; it does not add new public capabilities or replace the established visual concept.

</domain>

<decisions>
## Implementation Decisions

### Visual direction
- **D-01:** Phase 7 should refine the site into a more editorial, streamlined, and professional presentation rather than pushing toward a playful or highly experimental redesign.
- **D-02:** Background photography should remain a core part of the visual identity, but key content areas should gain stronger glass/surface separation so text and controls read cleanly over imagery.
- **D-03:** Shared public pages should feel more visually cohesive through tighter typography hierarchy, more consistent surface treatment, and calmer spacing rhythm across hero, archive, and information sections.

### Navigation and page framing
- **D-04:** The shared top navigation and footer should become clearer and more polished, with stronger orientation cues for primary routes and cleaner grouping of supporting links.
- **D-05:** Public pages should use more deliberate page introductions and section framing so visitors understand what each route is for before interacting with cards, tables, or forms.
- **D-06:** Navigation polish should prioritize clarity and trust over adding new destinations, menus, or feature discovery surfaces.

### Archive and JUFO readability
- **D-07:** Article cards, newsletter cards, and JUFO table sections should move toward better scanning and reading comfort through stronger titles, metadata hierarchy, spacing, and contrast.
- **D-08:** The archive and JUFO surfaces should keep their current server-backed interaction model while improving visible polish around controls, summaries, table/card containers, and state feedback.
- **D-09:** Existing pagination and search controls should receive accessibility and readability polish, but their Phase 6 behavior contracts remain locked and should not be redefined here.

### Mobile and accessibility priorities
- **D-10:** Phase 7 should prioritize practical mobile improvements first: tighter responsive spacing, more reliable stacking/layout behavior, better touch-target sizing, and clearer small-screen navigation.
- **D-11:** Accessibility work should focus on visible wins in the touched public UI: stronger focus states, clearer contrast over imagery, better readable copy blocks, and more obvious interactive-state feedback.
- **D-12:** Table-like information on smaller screens should favor clarity over strict visual parity with desktop, including layout adjustments if needed to keep JUFO and archive interactions usable.

### Implementation posture
- **D-13:** Phase 7 should prefer high-leverage shared polish across `Layout`, shared navigation, shared surfaces, and the touched public routes rather than isolated one-off page redesigns.
- **D-14:** The frontend-design skill standard should guide the quality bar: polished, professional, and intentional, but still grounded in the site’s existing visual identity and current stack.

### the agent's Discretion
- Exact typography choices, font-variable usage, and display/body balance, as long as the result feels more editorial and readable than the current baseline.
- Exact visual treatments for cards, tables, overlays, dividers, and motion, as long as they improve clarity without abandoning the background-image concept.
- Exact responsive breakpoints, stacking behavior, and accessibility refinements, as long as the touched public pages become easier to use on mobile and with keyboard/focus interaction.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone and requirement docs
- `.planning/ROADMAP.md` — Phase 7 goal, dependency order, and success criteria for Public UI Clarity, Responsiveness & Accessibility.
- `.planning/REQUIREMENTS.md` — `UIP-01` through `UIP-04`, which define the hierarchy, visual polish, mobile usability, and accessibility targets for this phase.
- `.planning/PROJECT.md` — Milestone constraints, the preserved background-image identity, and the decision to keep this milestone focused on targeted frontend improvements.
- `.planning/STATE.md` — Current milestone position and the expectation that Phase 7 is the active next phase after Phase 6 completion.

### Prior phase context that remains binding
- `.planning/phases/04-public-journey-acceptance-coverage/04-CONTEXT.md` — Public-route coverage structure that should remain intact while UI polish evolves touched surfaces.
- `.planning/phases/06-url-driven-archive-pagination/06-CONTEXT.md` — Locked pagination/search behavior for `articles` and `newsletters`; Phase 7 may polish these controls but should not redefine their interaction model.
- `.planning/phases/06-url-driven-archive-pagination/06-VERIFICATION.md` — Confirms the archive routes now have stable canonical URL behavior that UI work must preserve.
- `.planning/phases/05-jufo-server-backed-browsing/05-VERIFICATION.md` — Confirms `/jufo` is server-backed and URL-driven; UI work should polish this route without reopening the data-flow solution.

### Public UI implementation hotspots
- `nextjs-frontend/src/components/Layout.tsx` — Shared shell for the touched public pages.
- `nextjs-frontend/src/components/TopBar.tsx` — Shared primary navigation and top-level route framing.
- `nextjs-frontend/src/components/Footer.tsx` — Shared footer framing and supporting-link presentation.
- `nextjs-frontend/src/components/subscription/SubscribePanel.tsx` — Public home-page hero and subscription call-to-action surface.
- `nextjs-frontend/src/components/subscription/UnsubscribePanel.tsx` — Public unsubscribe flow surface.
- `nextjs-frontend/src/components/articles/ArticlesExplorer.tsx` — Article archive card layout, search controls, pagination framing, and empty-state surface.
- `nextjs-frontend/src/components/newsletters/NewsletterArchive.tsx` — Newsletter archive card layout and pagination framing.
- `nextjs-frontend/src/components/jufo/JufoExplorer.tsx` — JUFO table container, results summary, and table readability surface.
- `nextjs-frontend/src/components/jufo/JufoSearchControls.tsx` — Shared JUFO search/pagination control styling and interaction surface.
- `nextjs-frontend/src/app/home/page.tsx`, `nextjs-frontend/src/app/articles/page.tsx`, `nextjs-frontend/src/app/newsletters/page.tsx`, `nextjs-frontend/src/app/jufo/page.tsx`, and `nextjs-frontend/src/app/unsubscribe/page.tsx` — Route-level framing and page-introduction surfaces touched by this phase.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `nextjs-frontend/src/components/Layout.tsx`: Existing shared shell makes it possible to improve global framing without duplicating page-level structure.
- `nextjs-frontend/src/components/TopBar.tsx` and `nextjs-frontend/src/components/Footer.tsx`: Existing shared navigation surfaces are the highest-leverage place to improve orientation and overall professionalism.
- `nextjs-frontend/src/components/ui/card.tsx`, `button.tsx`, `input.tsx`, `separator.tsx`, and `table.tsx`: Existing UI primitives can support a more cohesive polish pass without introducing a new component system.
- `nextjs-frontend/src/lib/public-data/backgrounds`: Existing deterministic background helpers preserve the current image-driven identity while allowing more consistent surface treatments above them.

### Established Patterns
- Public routes already use server page wrappers plus smaller focused interactive components, so Phase 7 should mostly polish presentation rather than restructure data flow.
- The current public UI relies on white text over image backgrounds with translucent/glass surfaces, which Phase 7 should refine instead of replace.
- Archive and JUFO interactions are already URL-driven and server-backed, so this phase should treat those behaviors as fixed and focus on hierarchy, readability, responsive layout, and accessibility.

### Integration Points
- Shared navigation polish will flow through every public route that renders `Layout`.
- Readability and interaction polish will concentrate in `SubscribePanel`, `UnsubscribePanel`, `ArticlesExplorer`, `NewsletterArchive`, and `JufoExplorer`.
- Responsive and focus/accessibility improvements should be validated against the current archive/JUFO/search interactions rather than implemented as isolated style-only changes.

</code_context>

<specifics>
## Specific Ideas

- Use the frontend-design skill quality bar, but keep the result streamlined and professional rather than flashy.
- Lean into an editorial/scientific tone: clearer hierarchy, calmer surfaces, better reading rhythm, stronger trust cues, and more deliberate route framing.
- Preserve the photographic background identity, but make foreground content feel more intentionally composed and easier to read.

</specifics>

<deferred>
## Deferred Ideas

- New public capabilities such as advanced filtering, bookmarking, or archive grouping shortcuts.
- Replacing the background-image concept with a completely different visual system.
- Broad backend or infrastructure changes unrelated to frontend polish.

</deferred>

---

*Phase: 07-public-ui-clarity-responsiveness-accessibility*
*Context gathered: 2026-04-08*
