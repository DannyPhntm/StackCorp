# DESIGN.md — UI/UX Philosophy

How we design interfaces. Our bias is **functional, clean, and clear** — especially for the internal tools and dashboards that are core to our work.

This guides every build. The stack we build on is in [TECH_STACK.md](TECH_STACK.md); the services these designs serve are in [SERVICES.md](SERVICES.md).

---

## Design Philosophy

**Function first. Clarity always. Decoration last.**

We design tools people use to get work done — admin dashboards, lead systems, internal workflows. For these, a confusing interface is a broken interface. We optimize for the operator's speed and confidence, not for visual flourish.

### Core beliefs
1. **Clarity beats cleverness.** If a user has to think about the UI, the UI failed.
2. **The fastest path wins.** Reduce clicks, steps, and decisions for the common task.
3. **Show state honestly.** Users should always know what's happening, what succeeded, and what failed.
4. **Don't overbuild the UI.** Build the screens the workflow needs — no speculative widgets.
5. **Mobile is not optional.** Public-facing pages must work well on phones.
6. **Consistency is a feature.** Same patterns, same labels, same behavior everywhere.

---

## Internal Tools & Dashboards (Our Priority)

Most of our differentiated work is internal dashboards and admin tools. These have their own standards.

### Principles
- **Information density with breathing room.** Show what the operator needs at a glance; use spacing so it's scannable, not cramped.
- **Action-oriented.** Every row/record should make its primary actions obvious (approve, reject, edit, view).
- **Status-driven.** Use clear status labels (pending / approved / rejected / sold / inactive) with consistent color meaning.
- **Safe by design.** Destructive actions (delete, reject, suspend) need confirmation and are visually distinct.
- **Fast filtering and sorting.** Operators live in lists — make finding records trivial.
- **Private data stays marked.** Admin-only fields (verification docs, CNIC/NTN, notes) are visually flagged as private and never bleed into public views.

### Dashboard layout default
- A clear navigation for the main sections (e.g. Listings, Businesses, Shops, Users).
- List/table views with filters, search, and status badges.
- Detail views with the record's data, its images, and its actions grouped together.
- Pending/needs-action items surfaced first.

### Reference pattern
The Malir Cantt Bazaar admin dashboard is our template: moderate listings, approve/reject businesses, view **admin-only** verification documents, manage shops. See [reference/malir-cantt-bazaar/features.md](reference/malir-cantt-bazaar/features.md).

---

## Public-Facing Pages

For client websites and public marketplace pages:

- **Conversion-focused.** Lead the user to the one action that matters on the page.
- **Fast.** Performance is design — slow pages lose users.
- **Responsive.** Proper layout and spacing on mobile and desktop.
- **Trustworthy.** Clear contact paths, visible Terms/Privacy, honest framing (e.g. "we connect buyers and sellers; we don't guarantee transactions").
- **Accessible.** Readable contrast, sensible font sizes, labeled inputs.

---

## Interaction & Feedback

Every interaction tells the user what happened.

- **Loading states** for anything that waits on the network.
- **Success confirmation** after create/update/delete.
- **Clear, specific errors** — say what went wrong and what to do, never a silent failure.
- **Blocking failures are visible.** A failed image upload must surface and stop the action, not pass silently.
- **Empty states** that guide the user to the first action.

---

## Forms

Forms are where most real work happens — treat them carefully.

- Validate inline and on submit; show errors next to the field.
- Use allow-listed options (dropdowns/enums) instead of free text where values are fixed.
- Label every field; mark required fields.
- Preserve user input on error — never wipe a form.
- For uploads: image-only, show the selected file, enforce size limits, and report failures clearly.

---

## Visual Standards

- **Restrained palette.** A small, consistent set of colors; reserve strong colors for status and primary actions.
- **Type for reading.** A clear, legible typeface; a consistent size scale; generous line spacing.
- **Consistent spacing scale.** Use the same spacing units throughout for rhythm.
- **Few components, reused.** Buttons, inputs, cards, tables, badges — define once, reuse everywhere.
- **Hierarchy through size and weight,** not decoration.

---

## Accessibility Baseline

- Sufficient color contrast for text and controls.
- Don't rely on color alone to convey status — pair it with a label or icon.
- Keyboard-usable inputs and actions.
- Meaningful labels and alt text.

---

## Anti-Patterns (Avoid)

- Decorative UI that slows down the core task.
- Hidden or ambiguous actions.
- Silent failures.
- Inconsistent labels or status meanings across screens.
- Cramped, unscannable dashboards.
- Public exposure of private/admin-only data.
- Mobile layouts with broken spacing.

---

## Design Review Checklist

Before a UI ships:

- [ ] The primary action on each screen is obvious
- [ ] All states covered: loading, success, error, empty
- [ ] Errors are specific and actionable
- [ ] Status labels are consistent and clear
- [ ] Destructive actions are confirmed and visually distinct
- [ ] Private/admin-only data is never shown publicly
- [ ] Forms validate clearly and preserve input
- [ ] Layout works on mobile and desktop
- [ ] Components and spacing are consistent with the rest of the system
- [ ] Contrast and labels meet the accessibility baseline
