# StackCorp Design Lessons

Read this before changing the homepage motion, hero, or scroll story. It records what the design must feel like, decisions already made, and technical traps that already cost time. Update it when you learn something new.

## Aesthetic bar & taste filter (READ FIRST — the owner cares about this most)

The owner holds StackCorp to a **much higher visual standard than a normal landing page**. The recurring, explicit feedback:

- **Do NOT ship generic, "AI-looking" work.** This is the #1 rejection. If it reads as a template or an AI default, it's wrong even if it "works".
- The bar is **premium · dark · cinematic · cohesive · subtle-but-impressive · clean-but-not-boring · futuristic-but-believable · visually rich without becoming messy.**
- **Sections must feel linked** — one continuous, evolving story, not disconnected blocks. Background tone should evolve as you scroll; the 3D stack is the connective storytelling device.
- **The hero 3D object must feel intentional and believable** — elegant, centered/considered, never cheap or fake. It stays the main focus. Mostly front-facing; a *subtle* twist on scroll — do not overcomplicate the motion, no awkward spinning.
- **Motion must enhance the story**, not just exist. Smooth, physically believable, never gimmicky or hijacking.
- **Darker is better.** Deep navy / charcoal / deep slate from the palette. Not bright, not flat.

**What "generic" means in this project (avoid all of these):**
- Template-SaaS layouts; three equal feature cards in a row; symmetric everything-centered.
- Bright or flat sections; a lone light section dropped into a dark page (or vice-versa) — use a *shade* of the same palette, never a jarring jump.
- The purple/blue "AI gradient", oversaturated accents, more than one accent colour.
- Default/`Inter`-everywhere type, all-caps on every subhead, weak hierarchy, orphan words, clustered letters.
- Flat vector surfaces with zero texture (add grain), even 45° linear gradients (prefer radial/mesh/tone-drift), pure-black shadows (tint them).
- A 3D object that looks like a cheap placeholder, spins aimlessly, or sits at an unflattering angle (e.g. edge-on so it reads flat).

**What went right (keep doing):**
- One continuous dark canvas (`GlobalAmbient`) with layered depth: tone-drift on scroll + a slow glow + faint grid + a fixed grain overlay. Grain + tinted shadows are the biggest "not-AI" levers.
- The stack model as the through-line; camera + subtle turn carry the story (single-mesh model — no fake layer separation).
- Editorial type: Melodrama display with tight tracking + `text-wrap: balance`, tabular figures for data.
- Founders: a clean **light plate behind the photo cutouts** reads as a deliberate studio treatment against the dark card — cards kept level and balanced.
- Glass depth via inner catch-light + tinted shadow + hover spotlight ring (no `backdrop-filter`, so scrubbed decks stay smooth).

**What went wrong / cost time (don't repeat):**
- Over-flattening the hero camera to "front-facing" put the model **edge-on → flat**. The model reads dimensional only when the camera is **elevated enough to see its face**; keep a moderate 3/4, view from slightly left so it sits upright rather than leaning right. Tune `MODEL_ROT` + the hero camera (`Scene3D.jsx`) by iterating on screenshots.
- Semi-transparent content cards let the bright model **bleed through** — keep section cards opaque enough that content always wins over the model behind (the model is atmosphere, not foreground).

## What the site must feel like

- **One continuous, unfolding experience** — not separate stacked sections. The StackCorp layered logo/stack is the through-line that visually links everything. Sections should feel like *pages opening one after another* (they are technically sections; never call them pages in UI copy).
- **Founder-led, practical, premium.** Not hype, not crypto/neon, not a generic AI-robot template.
- **Dark/near-black canvas** with controlled steel-blue glow. One shared background system runs behind everything so the page reads as a single surface, not disconnected blocks.
- **No fake anything** — no invented numbers, clients, testimonials, awards, or AI claims. Malir Cantt Bazaar stats are live and honest.

## Brand tokens (source of truth: `src/styles/brand.css`, `global.css`)

Palette (2026-07 refresh): `#05297D` Deep Accent Blue (accent; replaced the earlier `#4135C4` Persian Blue — a controlled deep blue, not a bright one) · `#0A1960` Deep Twilight (dark base) · `#8FA1B8` Cool Steel (support/borders) · `#E1ECFF` Lavender (bright text/panels) · `#FFFFFF` White. Lighter accent states come ONLY from the `--sc-accent-a08/a15/a30/a65` rgba tokens — no invented blue shades. Legacy token names (`--sc-blue`, `--sc-navy`, `--sc-ice`, `--sc-stone`, `--sc-persian`) are aliases onto the new values — change colors ONLY in `brand.css`. Display font **Melodrama** (`--font-display`), body **Outfit**. Logo glow blue `--logo-blue #2f6df0` (sampled from the logo asset; intentionally not retinted). Ease `--ease-out: cubic-bezier(0.16,1,0.3,1)` — match it in Framer (`[0.16,1,0.3,1]`).

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

## 3D model / Three.js + GSAP (cinematic scroll build)

- **Model:** `public/model/stackcorp-logo.glb` — glTF 2.0, ~13KB, 12 meshes, **no baked animation**, no textures. Named meshes: `stackcorp_layer_1/2/3` (the stack — separable for "opening"), eight `*_blue_light` emitters, `inner_blue_core`. Drive everything from JS; there is no AnimationMixer clip to play.
- **`Scene3D.jsx`** = a fixed, **transparent** WebGL canvas (`z-index:0`, `pointer-events:none`) behind all content. GLTFLoader + `RoomEnvironment`/PMREM for reflections (no HDR asset needed). Lighting: ambient + white key + steel-blue rim + fill. Make the `*_blue_light`/`inner_blue_core` meshes emissive (`toneMapped:false`) — glow comes from emissive materials + the CSS radial glow behind the canvas; **no post-processing bloom** (keeps the canvas transparent and cheap).
- **Camera:** hero is a 3/4 isometric pose with `lookTarget` biased left (`x:-0.8`) so the model sits right-of-centre and the left hero copy stays clear; GSAP re-centres `lookTarget` on the first scroll. Call `camera.lookAt(lookTarget)` every frame so GSAP can pan by tweening the target.
- **Scroll:** GSAP `ScrollTrigger` **scrub** on the `<main>` (`start top top`, `end bottom bottom`) — reads scroll, never pins/hijacks (no trap). One timeline moves `camera.position` + `lookTarget` through ~6 poses and tweens a `spread` proxy that separates the three layers (`applySpread` offsets each layer's base `y`). Wrap in `gsap.context(fn, mainRef)` and `revert()` on unmount.
- **Readability:** the bright model competes with content — dim it (`emissiveIntensity` ~1.3 strips / 2.0 core, `toneMappingExposure` ~1.05) and keep it modest in scale (`targetSize` ~2.9). Content sits at `z-index:1` over the canvas (`.home3d > *:not(.scene3d)`).
- **Float/parallax** move a **group** wrapper (not the model) so they never fight GSAP's model/layer transforms. Both are gated off for reduced-motion + coarse pointers.
- **`Clock` is deprecated** in recent three — use `performance.now()` for elapsed time to avoid console noise.
- **Reduced-motion:** skip the GSAP timeline entirely (static hero pose, sections scroll normally); Scene3D also drops float/parallax.
- **Dispose** everything on unmount (rAF, listeners, geometries/materials, PMREM, renderer) — React re-mounts otherwise leak GL contexts.
- **The intro is still the 2D `IntroOverlay`** (the user likes it); it crossfades (logo stays centred) into the centered 3D hero model. A fully-3D intro was intentionally not built.
- **Perf:** three.js adds ~600KB to the bundle (chunk-size warning). `Scene3D` is code-split via a state-based dynamic `import()` in `Home` (NOT `React.lazy`/Suspense — the fallback swap remounts the sections and cancels Work's live-stats fetch). Headless WebGL verification needs Playwright launched with `--use-gl=angle --use-angle=swiftshader --ignore-gpu-blocklist`, and a long wait for the model to load.
- **Swapping the GLB:** keep the path `public/model/stackcorp-logo.glb` (Scene3D loads it directly; no import to change). **Inspect first** (parse the GLB JSON chunk): mesh count, names, animations, textures.
  - **Single mesh (e.g. a Tripo/AI-generated model):** there are no named layers, so **do not fake layer separation** — the "unfold" comes from camera movement + a gentle model turn (`model.rotation.y` tween per pose in `Home`, never a spin). Home must NOT early-return on `layers.length === 0`.
  - **Preserve the model's own materials** when it's textured (`mat.map`/normal/roughness) — only style the starter model's named accent meshes.
  - **Base orientation:** raw exports often sit at an odd angle — apply `MODEL_ROT` (radians) and centre/scale from the *rotated* bounds. Tune it by iterating on hero screenshots.
  - **File size is a real risk:** a textured GLB can be tens of MB (the current one is ~55MB). **Compress it (Draco/meshopt) before production** — it can drop to a few MB. Beyond slow load, in local `vite dev` the 55MB download can queue/starve the same-origin `/api/mcb-stats` middleware requests until they hit the 8s abort → the live-stats strip shows "unavailable" in dev even though production (static model + real serverless endpoint) returns 1/3/11 fine. Don't mistake that dev artifact for a stats regression; verify stats on the production build / warm endpoint.
  - **Motion perf (from review):** pause the Three rAF loop on `visibilitychange` (no GPU on hidden tabs) and render a single frame under reduced-motion instead of looping; debounce the resize handler (mobile URL-bar fires resize on scroll). Never animate `scale`/`opacity` on a `filter: blur()` glow layer — translate only. Cache `scrollHeight` (don't read it per scroll frame). Spring-scrub the deck at ~`stiffness 160 / damping 26` (90/30 is over-damped and trails).
  - **Anti-generic (from review):** no always-on `box-shadow`/`text-shadow` glow on resting icons/dots/brand text — glow is a hover event, not a default. Large serif display wants ≤0 letter-spacing. The founders light plate must be cooled off pure-white and given an inset vignette so it blends into the dark card rather than reading as a bright slab.

## Editorial services scene (`ServicesEditorial.jsx`) — lessons

- **Service sections should be editorial storytelling, not generic accordions.** The old "Empowering growth" accordion was replaced by a scroll-driven scene (big changing headline + evolving photo-card stack). One stack evolving beats four separate blocks.
- **A solid, vivid scene creates contrast inside the larger cinematic site.** One Persian Blue full-bleed section works as the crescendo *because* the rest of the page stays deep twilight — same hue family, higher chroma, so it reads as rhythm, not a disconnected page. Don't add a second one lightly.
- **The fixed 3D canvas must fade out where it harms readability.** Two scrubbed tweens on `.scene3d` autoAlpha (fade out on approach `top 85%→30%`, restore `bottom 70%→15%`) — never `display:none` at a boundary. The solid background is still fully opaque on its own, so reduced-motion (no GSAP) stays safe.
- **Palette variation should create rhythm, not disconnected pages** — vivid accent surfaces derive from the same palette (`color-mix` with twilight/lavender), and all colors flow from `brand.css` aliases.
- **Motion references get adapted, not copied.** The reference (awwwards "Our Bond" by Builtt/Copula Agency) contributed the interaction model only: pinned stage, headline crossfade, tinted card entering from the right, previous card receding, small progress markers. Branding, color, copy, and layout are StackCorp's. No external code was used — GSAP ScrollTrigger + the existing sticky-track pattern covered it (so no license/attribution needed; if GitHub animation code is ever adapted, record repo, files, license, and modifications here).
- **Pin = tall track + sticky child, timeline start `top 45%`** so stage 1 assembles while the section approaches — arriving at an empty solid wall feels broken. Start states are `gsap.set` + `.to()` tweens only (no `fromTo` immediateRender surprises in scrubbed timelines).
- **Fixed navbar overlaps pinned stages** — anything anchored to the top of a 100vh sticky scene needs ~92px+ top offset, not the usual section padding.
- **White markers vanish over white paper cards** — give overlay UI a twilight edge/border so it survives any card passing beneath, and keep it outside the container so cards can't cover it.

## Performance regressions & the intro hang (2026-07 fixes — don't re-break)

- **The intro must never depend on sustained frame rate.** On a struggling GPU the page drops to a few FPS and GSAP lag-smoothing stretches the 2.2s dolly toward minutes — a permanent black veil that reads as "the intro disappeared". Fix in `Home.jsx`: a `setTimeout(finishIntro, 4600)` safety net (finishIntro is idempotent). Any future intro needs an equivalent wall-clock escape hatch.
- **Scene3D renders are the page's GPU budget.** Pixel ratio is capped at **1.5** (DPR 2 ≈ 4× the fill of DPR 1 for invisible sharpness behind the veil), and `renderFrame` early-returns while the canvas root is scrubbed to `visibility:hidden` (the services handoff) — no WebGL work behind an opaque scene. Keep both when touching Scene3D.
- **No full-viewport `mix-blend-mode` over translucent sections.** The services grain used `overlay`, forcing a full re-blend of the visible viewport every scrolled frame; plain low-opacity grain looks ~the same and composites cheaply.
- **rAF loops must park when idle.** CursorGlow's lerp loop now stops once the glow settles and restarts on pointermove — a mouse-follow effect should cost zero while the cursor is still.
- **One-shot > looping in decorative canvases.** The StackScout signal dot runs a single 2s CSS pass after reveal (`forwards`), desktop-only, skipped for reduced-motion — then the canvas is fully static.
- Headless-swiftshader FPS numbers are a software-raster floor (~1–3 FPS regardless of commit) — useless for regression comparison; verify perf architecture (what runs per frame), not headless FPS.

## Case studies (proof of systems thinking)

- **Integrate real case studies as proof**, not decoration. They show StackCorp builds AI **systems** (agents, workflows, automation pipelines) — not just websites. Sit them in the Work/Proof area next to Malir Cantt Bazaar. Current two: MCB (live product) + **StackScout** (internal AI workflow agent).
- **Structure every case study as Problem → System → Business Value** — but don't render all of it at once. The original `StackScout.jsx` did (problem + pull-quote → 5-stage pipeline → panels → status → value + CTA) and read as a crowded dashboard: too many bordered boxes, labels, separators, and metrics competing. It was replaced (2026-07) by a product-style section: concise header + CTA left, one calm node-based workflow canvas right (6 nodes, thin connectors, dot grid, one restrained glow). Lesson: a section earns ONE centrepiece; move depth into copy or a dedicated page, not extra panels.
- **Explain the business workflow — never vague "AI agent" wording.** Name the stack (Trigger.dev, TypeScript, Google Sheets, Apify, Apollo.io, Anthropic Claude, Zod) and what each stage does. A pipeline diagram beats an "AI robot" visual (which is banned).
- **Honesty is mandatory:** label internal builds as internal / proof-of-capability, never as a paid client engagement unless explicitly stated. State what's built vs. planned (StackScout: Phases 1–2 built + tested, 3–4 next). Real documented numbers (e.g. "20–30 min/lead manually", "~$0.02/lead", "fit score 0–10") are fine; invented metrics are not.
- Reuse the shared `StorySection` header + palette so a case study reads as part of the one scroll story, not a bolted-on page.

## Scroll-driven "deck" cards (stack opening)

The "Built for businesses ready to modernize" cards fan out of a stacked deck as the section enters (`WhoWeHelp.jsx`). Pattern that stays robust: each card keeps its **real grid cell** the whole time (grid never reflows), and a Framer `useScroll`(section) + per-card `useTransform` gathers it toward the deck centre at progress 0 (translate toward centre + rotate + scale 0.9 + blur + low opacity) and releases it to its cell at progress 1. A per-card **stagger** (offset the transform's input window by index) makes it deal out card by card — elegant/product-like, not a card trick. Keep the scroll transform on an **outer cell** and the visual+hover on an **inner card**, so hover (`translateY`) never fights the scroll transform. Cards gather *inward*, so there's no horizontal overflow.

**Desktop timing = a controlled sticky pin** (the case where a pin is genuinely warranted): wrap the section in a tall track (`height: 220vh`) with a `position: sticky` inner stage (`top:0; height:100vh`), and drive the deck from `useScroll(track, ['start start','end end'])`. This makes the section **fill the screen first**, hold the deck stacked (a `delay` before the first card's window), then open **slowly** over the extra scroll (larger `span`), finishing just before it unpins. It's a sticky child of a tall wrapper, so the page still scrolls normally — no wheel hijack, no trap. **Mobile / reduced-motion: no pin** — the track collapses to normal height and the deck is a lighter reveal-on-enter (fewer columns, smaller offsets) or, for reduced-motion, the final grid directly.

## 3D readability (content over the model)

The bright 3D model competes with text in content sections. Fix used: a **subtle fixed veil** (`.home3d::before`, `color-mix(surface-0, transparent ~62%)`) sitting above the canvas and below the content — it dims the model just enough for text to read everywhere while keeping the cinematic feel. Tune the transparency: too opaque kills the hero's punch, too light and text over the model is hard to read. Combine with dimmer emissive + lower exposure (see the 3D section) rather than relying on the veil alone.

## Verification checklist

`npm run build` → Playwright desktop + 375/390/430 → intro fully hides content → logo travels fully left and back → hero spacing clean → scrub reveals + sections feel linked → not scroll-trapped → reduced-motion fallback → navbar links → founders page → MCB live stats → contact form → no fake claims.
