# StackCorp Design Lessons

Read this before changing the homepage motion, hero, or scroll story. It records what the design must feel like, decisions already made, and technical traps that already cost time. Update it when you learn something new.

## What the site must feel like

- **One continuous, unfolding experience** — not separate stacked sections. The StackCorp layered logo/stack is the through-line that visually links everything. Sections should feel like *pages opening one after another* (they are technically sections; never call them pages in UI copy).
- **Founder-led, practical, premium.** Not hype, not crypto/neon, not a generic AI-robot template.
- **Dark/near-black canvas** with controlled steel-blue glow. One shared background system runs behind everything so the page reads as a single surface, not disconnected blocks.
- **No fake anything** — no invented numbers, clients, testimonials, awards, or AI claims. Malir Cantt Bazaar stats are live and honest.

## Brand tokens (source of truth: `src/styles/brand.css`, `global.css`)

Palette: `#416D8A` steel-blue · `#F1F4FF` ice · `#F0F1ED` mist · `#153243` navy · `#D8D9D3` stone · `#20211C` near-black. Display font **Melodrama** (`--font-display`), body **Outfit**. Logo glow blue `--logo-blue #2f6df0`. Ease `--ease-out: cubic-bezier(0.16,1,0.3,1)` — match it in Framer (`[0.16,1,0.3,1]`).

## Opening intro — required behaviour

- A **full-screen opaque black overlay** owns the intro. Nothing else (navbar, hero, sections, ambient cards) is visible until the intro finishes. The overlay sits above the navbar.
- Sequence: logo centered → swipes **fully to the left** (viewport-relative travel, not a small nudge) revealing the word "StackCorp" → swipes back to center, hiding the word → logo **grows into the hero focal object** → overlay releases and the hero reveals.
- **Once per session** (`sessionStorage sc_intro_seen_v1`). `prefers-reduced-motion` → skip straight to the final hero, no overlay.
- The handoff from overlay to hero should crossfade so the logo appears to settle, not jump.

## Hero — required layout

- Dark background + subtle blue/steel ambient motion (`AmbientField`).
- **"StackCorp" wordmark on the left**, **motto beneath it** ("From websites to workflows, we help businesses build the stack they need to grow."), then headline ("Better websites. Smarter workflows. Stronger businesses.") and CTAs — spaced cleanly, not crowded.
- The **logo stays the main visual focus** (large, centered/right). Text left, logo focal.

## Scroll story

- Pinned sticky stage (desktop, fine pointer, motion allowed), `useScroll` scrub — a tall section with a sticky child, so the page always scrolls normally (no wheel hijack, no trap).
- As you scroll: hero copy lifts away → logo grows and its three layers spread (lid lifts, base drops) → three linked reveals cross-fade, each feeling like it comes out of the stack:
  1. "Empowering growth through practical AI."
  2. "Built for businesses ready to modernize."
  3. "First live product: Malir Cantt Bazaar."
- Link the sections with a shared background, consistent motion, connecting glow/lines, and the recurring stack motif. Avoid plain tab boxes, generic cards, disconnected white sections, abrupt jumps.
- **Mobile / touch / reduced-motion**: no pin, no scrub — static hero + the reveals as premium reveal-on-enter blocks.

## Must-not-break

- Contact form + its API, and the Malir Cantt Bazaar **live stats** (proxied via `api/mcb-stats.js`; see the MCB section rendering `1 / 3 / 11` live).
- Navbar anchors `#services #work #process #contact` and the `/founders` route.
- No horizontal overflow at 375 / 390 / 430 / desktop. No console errors.

## Technical traps already hit (do not rediscover)

- **Framer opacity hijack:** a `motion` child nested inside a `motion` parent can have a bound `style={{opacity: motionValue}}` overridden — the property tracks the wrong value. Fix: drive that property imperatively via `useMotionValueEvent(scrollYProgress, ...)` on a plain `<div ref>`. (This is why the hero copy fade is imperative in `HeroStory`.)
- **Compute mode/intro synchronously** in `useState` initializers via `matchMedia`, not in an effect. A static→scrub render flip leaves framer's mount `opacity="0"` attribute stuck on the SVG layers, making the logo invisible in scrub mode.
- **SVG group transforms** (`scale`/`rotate` on `<g>`) need `transformBox: fill-box; transformOrigin: center`, else they pivot on the SVG's 0,0.
- **`global.css` sets `html{scroll-behavior:smooth}`** — in Playwright, `window.scrollTo` then animates, so screenshots/measurements land mid-scroll. Inject `html,*{scroll-behavior:auto!important}` via `addStyleTag` and settle ~500ms.
- **Vite HMR websocket** means Playwright `waitUntil:'networkidle'` never fires — use `'load'`. Import playwright from the project's absolute `node_modules` path when running a script from a scratch dir.

## Verification checklist

`npm run build` → Playwright desktop + 375/390/430 → intro fully hides content → logo travels fully left and back → hero spacing clean → scrub reveals + sections feel linked → not scroll-trapped → reduced-motion fallback → navbar links → founders page → MCB live stats → contact form → no fake claims.
