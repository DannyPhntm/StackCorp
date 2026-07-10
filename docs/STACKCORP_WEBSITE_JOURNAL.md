# StackCorp Website — Build Journal & Read-First Context

> **READ THIS FIRST.** Before acting on any website instruction, read this file and its companion [`STACKCORP_DESIGN_LESSONS.md`](STACKCORP_DESIGN_LESSONS.md). It is the single source of truth for what the StackCorp website is, what happened while building it, what went right and wrong, and where things stand. It exists so a new session starts oriented instead of re-deriving everything.

- **Repo:** Agency Operating System (StackCorp). Website lives in `src/` (React 19 + Vite 6 + Framer Motion + react-router).
- **Redesign branch:** `redesign/stackcorp-unfolding-scroll-story` (main is `main`).
- **Run:** `npm run dev` (Vite, http://localhost:5173) · **Build:** `npm run build`.
- **Companion docs:** `STACKCORP_DESIGN_LESSONS.md` (design rules + traps), root `CLAUDE.md` (agency protocol), `SECURITY.md`, `SKILLS.md`.

---

## 1. What the website is

Marketing site for **StackCorp** — an AI/web/automation agency. The concept: the site is one continuous **scroll story** where the **StackCorp layered-stack logo is the main character**. It opens/unfolds as you scroll, linking every section into one system, rather than feeling like separate pages. Founder-led, practical, premium — never hype, crypto, or fake claims. Dark near-black canvas with steel-blue glow. Display font **Melodrama**, body **Outfit**.

**Malir Cantt Bazaar (MCB)** is StackCorp's first live product / case study, shown with **real live stats** (proxied via `api/mcb-stats.js`). This is real proof of work — never fake it.

---

## 2. The journey (chronological)

The redesign happened in three rounds inside one long working session.

### Round 1 — hero + stack scrub (first pass)
- Built `HeroStory.jsx` + `herostory.css` replacing the old `Hero.jsx`. Added an `unfold` MotionValue prop to `LogoStack.jsx` so the three logo layers spread apart on scroll ("lid lifts, base drops").
- Desktop = a pinned ~340vh sticky stage, scroll-scrubbed: hero copy fades → logo grows + layers spread → three headlines cross-fade (Empowering / Modernize / MCB) with a progress rail. Mobile/reduced-motion = static hero + reveal-on-enter teaser cards.
- **User decisions:** full scrub story (not lighter reveals) · intro once-per-session · checkpoint after the signature moment.

### Round 2 — fix the intro + relayout the hero
The intro was wrong: content was visible behind it, background not truly black, logo barely moved, hero spacing off. Fixes:
- New **`IntroOverlay.jsx`** — a separate **full-screen opaque black** layer above the navbar. Locks scroll, hides everything. Logo center → swipes fully left revealing "StackCorp" → swipes back → grows → black recedes while the logo drifts into its hero spot. Once per session; reduced-motion skips it. Wired into `App.jsx` (`introDone` state, decided synchronously); `Navbar` takes a `hidden` prop and fades in after.
- **Hero relaid out** to a split: **StackCorp wordmark left → motto → headline → CTAs**, large logo focal on the right. `HeroStory`'s internal intro machine was removed (now the overlay's job).

### Round 3 — rebuild the sections + link them
The remaining complaint: sections still felt separate. Fixes:
- New **`StorySection.jsx` + `story.css`** — a shared section header: a stacked-diamond **node** (echo of the logo) above a numbered kicker + title, with a faint vertical **thread** rising from each node to link sections into one spine. The background was already continuous (fixed `GlobalAmbient`, transparent sections); the real problem was inconsistent, generic, block-styled sections.
- Rebuilt sections, all sharing the story system:
  - **Services** → "Empowering growth through practical AI" **stacked accordion** (4 pillars, one open at a time; old `ServicesDetail` items folded in). Layers 01/02/03 (Services/Who/MCB) match the hero's teased layers.
  - **WhoWeHelp** → premium transparent panel grid (kept hand-drawn palette icons; removed the solid background that made it a separate block).
  - **Work/MCB** → story header "03 · Proof of work" (**live stats untouched**).
  - **Process** → story header; removed solid background/border (drag track already met spec).
  - **FounderPreview** → two equal side-by-side panels with focus tags + clip reveal.
  - New **`SmarterSystems.jsx`** → "Smarter systems. Real business use." **bento** (2×2 lead tile with an inquiry→tracked→follow-up flow SVG; no fake metrics, no robot art).
- `Home.jsx` reordered: Hero → Services(01) → WhoWeHelp(02) → Work(03) → Process → FounderPreview → SmarterSystems → Contact. `ServicesDetail` + `WhySection` removed from Home (now **orphaned files**).

---

## 3. What went RIGHT

- **Grounding before building.** Extracted frames from the reference `.mov` files (Quantum + Altrion templates) and screenshotted the live site before touching code — the design decisions came from real references, not guesses.
- **Synchronous mode/intro decisions** (matchMedia in `useState` initializers) avoided flash-of-wrong-state.
- **Escape-hatch scrub.** A tall section + sticky child means the page always scrolls normally — no wheel hijack, no scroll trap — while still feeling scrubbed.
- **Honest fallbacks everywhere** — mobile/touch/reduced-motion get a real static experience, not a broken pinned one.
- **Live MCB stats + contact form never broken** across all three rounds.
- **Self-audit caught real issues** (title/content misalignment, an empty bento cell) and fixed them before reporting.
- **Consistent verification**: every round ran `npm run build` + Playwright screenshots at 375/390/430/1440, checked overflow + console errors.

## 4. What went WRONG (and the fixes — do not rediscover these)

1. **Framer opacity hijack.** A `motion` child nested inside a `motion` parent had its bound `style={{opacity: motionValue}}` overridden — the property tracked the wrong value entirely. Cost a long debug. **Fix:** drive that property imperatively via `useMotionValueEvent(scrollYProgress, …)` on a plain `<div ref>`. (Hero copy fade + is done this way.)
2. **Static→scrub render flip.** Deciding scrub mode in an effect (not synchronously) left framer's mount `opacity="0"` attribute stuck on the SVG layers → the logo rendered invisible in scrub mode. **Fix:** compute mode synchronously in `useState`; also set explicit `opacity` in the scrub layer styles.
3. **`scroll-behavior: smooth`** (`global.css`) made Playwright `window.scrollTo` animate, so every screenshot/measurement landed mid-scroll and looked broken when it wasn't. **Fix in tests:** inject `html,*{scroll-behavior:auto!important}` via `addStyleTag` and settle ~500ms. This wasted real time chasing a non-bug.
4. **Vite HMR websocket** means Playwright `waitUntil:'networkidle'` never fires. **Fix:** use `'load'`. Import playwright from the project's absolute `node_modules` path when scripting from a scratch dir.
5. **SVG `<g>` transforms** (`scale`/`rotate`) pivoted on the SVG's 0,0 until given `transformBox: fill-box; transformOrigin: center`.
6. **Solid section backgrounds** (`.who`, `.process`) were the actual cause of the "separate blocks" feel — not the (already continuous) global background.
7. **Bento empty cell** — 7 tiles + a 2×2 lead tile left a hole; fixed by spanning one tile wide.
8. **Intro→hero logo jump** — the overlay logo ended centered while the hero logo sits right; fixed by drifting the overlay logo to the hero position as the black recedes.

---

## 5. Current state

- **Live & working:** intro overlay, split hero, stack scrub, all rebuilt sections, live MCB stats (1/3/11), contact form, `/founders` page, navbar anchors. Build clean, 0 overflow @375/390/430/1440, no console errors.
- **New files:** `IntroOverlay.jsx`+css, `HeroStory.jsx`+css, `StorySection.jsx`+`story.css`, `SmarterSystems.jsx`+css.
- **Edited:** `App.jsx`, `Navbar.jsx`+css, `LogoStack.jsx`, `Services.jsx`+css, `WhoWeHelp.jsx`+css, `Work.jsx`, `Process.jsx`+css, `FounderPreview.jsx`+css, `Home.jsx`.
- **Orphaned (unused, not deleted):** `ServicesDetail.jsx`/`servicesdetail.css`, `WhySection.jsx`/`why.css`, old `Hero.jsx` (kept for revert).

## 6. Remaining work / limitations

- `/founders` page still uses a staggered fade (works, but not a dramatic one-at-a-time panel open).
- Orphaned files above can be deleted on approval.
- Founder PNGs differ in formality (Daniyal casual / Affan gown) — real assets, unchangeable.
- Reference `.mov` files (`public/assets/images/Hero-Section.mov` ~110MB, `Inspo.mov` ~195MB) are huge — **do not commit them**.

## 7. Rules that must hold (never break)

- Do **not** touch backend/API/contact-form/live-stats logic. Do not break the contact form or MCB live stats.
- No fake numbers, clients, testimonials, awards, or AI claims. No crypto/neon look. No spinning logo.
- Keep the StackCorp palette, Melodrama, and founder-led tone. Respect `prefers-reduced-motion`. Mobile must work. No horizontal overflow.
- **Do not commit or push without explicit approval.** (This journal + the design-lessons doc were committed on explicit request.)

## 8. How to verify a change

`npm run build` → Playwright at 375/390/430/1440 → intro fully hides content → hero spacing clean → scrub reveals + sections feel linked → not scroll-trapped → reduced-motion fallback → navbar links → `/founders` → MCB live stats → contact form → no fake claims.
