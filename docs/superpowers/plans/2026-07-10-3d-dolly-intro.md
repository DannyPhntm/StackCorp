# 3D Dolly-In Intro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 2D `LogoStack` SVG intro with a camera dolly-in on the real Scene3D GLB model, settling into the staged hero pose with zero seam.

**Architecture:** The intro runs on the *same* camera/model Scene3D hands to `Home.handleReady`. A black veil covers first paint and masks the 55MB GLB download; once the model is ready, a GSAP timeline dollies the camera from a derived `INTRO_START` pose to the captured hero pose while the veil fades, then the existing ScrollTrigger scroll timeline is built. No second WebGL context, no new asset.

**Tech Stack:** React 18, Vite, three@0.185, gsap@3.15 (ScrollTrigger), framer-motion (existing). No test runner — verification is `npm run build` + WebGL Playwright (`playwright` devDep) driven by ad-hoc Node scripts.

## Global Constraints

- Do NOT commit without explicit user approval (repo rule). Steps below include commits; the executor must pause for approval before running them.
- Branch: `redesign/stackcorp-unfolding-scroll-story`. Do not touch `main`.
- Never break the live-stats fetch: do NOT introduce a React.lazy/Suspense boundary or remount `Home`'s section tree. Scene3D stays state-mounted.
- Verify every task: `npm run build` clean AND the stated browser check. Report plan-vs-actual.
- Preserve: 0 horizontal overflow @375/390/430/1440, no console errors, live stats show 1/3/11 (production preview), contact form 7 inputs, `/founders` clean.
- `sessionStorage` access MUST stay wrapped in try/catch (private-mode safe).
- Seen-key: `sc_intro_seen_v2` (bumped from `v1`).
- Reduced-motion: no intro, no scroll timeline (Scene3D `handleReady` still early-returns for reduce).
- Easing feel: calm/cinematic (GSAP `power3.out`), no aggressive swing. Duration 2.2s dolly.

---

### Task 1: Scene3D `onError` callback (graceful load-fail)

Scene3D already flips internal `failed` state on GLB load error but never tells the parent. Add an `onError` prop so Home can end the intro gracefully instead of hanging on black.

**Files:**
- Modify: `src/components/Scene3D.jsx` (signature line 37, error handler ~189-191, effect deps line 270)

**Interfaces:**
- Produces: `Scene3D` now accepts `onError?: () => void`, invoked once when the GLB fails to load (and not disposed).

- [ ] **Step 1: Add the prop to the signature**

Change line 37 from:
```jsx
export default function Scene3D({ onReady }) {
```
to:
```jsx
export default function Scene3D({ onReady, onError }) {
```

- [ ] **Step 2: Fire it in the load-error handler**

Change the error callback (~lines 189-191) from:
```jsx
      () => {
        if (!disposed) setFailed(true)
      },
```
to:
```jsx
      () => {
        if (!disposed) {
          setFailed(true)
          onError?.()
        }
      },
```

- [ ] **Step 3: Add `onError` to the effect dependency array**

Change line 270 from:
```jsx
  }, [onReady])
```
to:
```jsx
  }, [onReady, onError])
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: builds clean, no new warnings. (Behavior unchanged when no `onError` passed — existing callers still work.)

- [ ] **Step 5: Commit** (pause for user approval first)

```bash
git add src/components/Scene3D.jsx
git commit -m "feat(scene3d): add onError callback for failed GLB load

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Veil CSS

The intro veil is a plain full-screen element Home renders and GSAP fades. Add its styles alongside the scene styles.

**Files:**
- Modify: `src/components/scene3d.css` (append)

**Interfaces:**
- Produces: CSS classes `.intro-veil` (full-screen opaque cover) and `.intro-veil-mark` (quiet centered pulse loader).

- [ ] **Step 1: Append the veil styles**

Add to the end of `src/components/scene3d.css`:
```css
/* 3D intro veil — opaque cover over first paint; GSAP fades its opacity as the
   camera dollies the model into the hero pose. Sits above the navbar. */
.intro-veil {
  position: fixed;
  inset: 0;
  z-index: 2147483000; /* above navbar + all content */
  background: #04070c; /* matches the site's cool near-black surface base */
  display: grid;
  place-items: center;
  will-change: opacity;
}

.intro-veil-mark {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, rgba(120, 170, 255, 0.55), rgba(120, 170, 255, 0) 70%);
  animation: intro-veil-pulse 1.4s ease-in-out infinite;
}

@keyframes intro-veil-pulse {
  0%, 100% { transform: scale(0.7); opacity: 0.35; }
  50% { transform: scale(1); opacity: 0.9; }
}

@media (prefers-reduced-motion: reduce) {
  .intro-veil-mark { animation: none; }
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean (CSS only; nothing consumes the classes yet — verified in Task 3).

- [ ] **Step 3: Commit** (pause for user approval first)

```bash
git add src/components/scene3d.css
git commit -m "style(intro): add 3D intro veil styles

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Home owns the 3D intro

The core task. Home receives `playIntro`/`onIntroDone`, renders the veil when playing, and branches `handleReady` into an intro path (dolly TL → then scroll TL) vs the direct path (build scroll TL immediately). Extract the existing scroll-timeline setup into a local `buildScrollTimeline()` so both paths reuse it.

**Files:**
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: `Scene3D` `onReady({ camera, model, layers, lookTarget })` and `onError()` (Task 1); veil classes `.intro-veil` / `.intro-veil-mark` (Task 2).
- Consumes: props `playIntro: boolean`, `onIntroDone: () => void` (provided by Task 4).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Accept props and add intro refs/state**

Change the component signature and top-of-body from:
```jsx
export default function Home() {
  const mainRef = useRef(null)
  const ctxRef = useRef(null)
```
to:
```jsx
export default function Home({ playIntro = false, onIntroDone }) {
  const mainRef = useRef(null)
  const ctxRef = useRef(null)
  const veilRef = useRef(null)
  const introFinishedRef = useRef(false)
  // Veil is present on the very first render (synchronous from the prop) so the
  // hero never flashes before it. It unmounts once the dolly finishes.
  const [veilOn, setVeilOn] = useState(playIntro)
```

- [ ] **Step 2: Rewrite `handleReady` to branch intro vs direct**

Replace the entire `handleReady` callback body. The existing per-pose scroll timeline is preserved verbatim inside a local `buildScrollTimeline()`; a new intro branch runs before it when `playIntro`.

Replace from `const handleReady = useCallback(async ({ camera, layers, lookTarget, model }) => {` through the end of that `useCallback` (the `}, [])` that closes it) with:

```jsx
  const handleReady = useCallback(async ({ camera, layers, lookTarget, model }) => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (reduce || !mainRef.current) return

    const { default: gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    if (!mainRef.current) return // unmounted while importing

    const hasLayers = layers.length > 0
    const bases = layers.map((l) => l.position.y)
    const mid = (layers.length - 1) / 2
    const spread = { v: 0 }
    const applySpread = () => {
      layers.forEach((l, i) => {
        l.position.y = bases[i] + (i - mid) * spread.v * 0.7
      })
    }
    const baseRotY = model ? model.rotation.y : 0

    // Capture the hero pose exactly as Scene3D staged it (camera + look target).
    const heroCam = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
    const heroLookX = lookTarget.x

    // Build the scroll-driven camera timeline. Extracted so both the intro path
    // and the direct (already-seen) path reuse the identical setup.
    const buildScrollTimeline = () => {
      ctxRef.current = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { duration: 1, ease: 'none' },
          scrollTrigger: {
            trigger: mainRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        })

        const openTo = (v, pos) => {
          if (hasLayers) tl.to(spread, { v, onUpdate: applySpread }, pos)
        }
        const turnTo = (dy, pos) => {
          if (model) tl.to(model.rotation, { y: baseRotY + dy }, pos)
        }

        // Pose 2 — AI: ease in, re-centre, begin the unfold. fromTo so scroll 0
        // is pinned to the staged hero pose (identical to the intro's end frame).
        tl.fromTo(camera.position, { x: heroCam.x, y: heroCam.y, z: heroCam.z }, { x: 0.4, y: 1.2, z: 4.7 }, 0)
          .fromTo(lookTarget, { x: heroLookX }, { x: 0 }, 0)
        openTo(1, 0)
        turnTo(-0.06, 0)
        // Pose 3 — Business types.
        tl.to(camera.position, { x: -1.5, y: 1.4, z: 4.9 }, 1)
        openTo(0.5, 1)
        turnTo(-0.1, 1)
        // Pose 4 — Malir Cantt Bazaar.
        tl.to(camera.position, { x: 1.7, y: 1.1, z: 4.6 }, 2).to(lookTarget, { x: 0.15 }, 2)
        openTo(0.25, 2)
        turnTo(-0.01, 2)
        // Process.
        tl.to(camera.position, { x: 0, y: 1.9, z: 5.3 }, 3).to(lookTarget, { x: 0 }, 3)
        turnTo(0.05, 3)
        // Founders.
        tl.to(camera.position, { x: -1.2, y: 1.4, z: 5.3 }, 4)
        turnTo(0.08, 4)
        // Pose 5 — Finale/contact.
        tl.to(camera.position, { x: 0, y: 1.5, z: 5.8 }, 5)
        openTo(0, 5)
        turnTo(0.08, 5)

        ScrollTrigger.refresh()
      }, mainRef)

      document.fonts?.ready?.then(() => ScrollTrigger.refresh())
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
    }

    // Direct path (reduced-motion is already returned above; this is the
    // already-seen-this-session case): no intro, hero is live immediately.
    if (!playIntro) {
      buildScrollTimeline()
      onIntroDone?.()
      return
    }

    // ---- Intro path: dolly the camera from INTRO_START into the hero pose. ----
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // INTRO_START derived from the hero pose so it survives Scene3D pose tweaks:
    // pulled back, offset left, slightly low, with a small extra turn to settle.
    const introStart = {
      x: heroCam.x - 3.0,
      y: heroCam.y - 0.8,
      z: heroCam.z + 3.5,
      lookX: heroLookX - 1.2,
      rotY: baseRotY + 0.5,
    }

    const finishIntro = () => {
      if (introFinishedRef.current) return
      introFinishedRef.current = true
      try {
        sessionStorage.setItem('sc_intro_seen_v2', '1')
      } catch {
        /* private mode — replay next load, harmless */
      }
      document.body.style.overflow = prevOverflow
      window.removeEventListener('wheel', onSkip)
      window.removeEventListener('touchmove', onSkip)
      window.removeEventListener('keydown', onSkip)
      window.removeEventListener('pointerdown', onSkip)
      setVeilOn(false)
      buildScrollTimeline()
      onIntroDone?.()
    }

    // Snap to the start pose while still hidden by the veil.
    gsap.set(camera.position, { x: introStart.x, y: introStart.y, z: introStart.z })
    gsap.set(lookTarget, { x: introStart.lookX })
    if (model) gsap.set(model.rotation, { y: introStart.rotY })

    const introTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: finishIntro,
    })
    introTl
      .to(camera.position, { x: heroCam.x, y: heroCam.y, z: heroCam.z, duration: 2.2 }, 0)
      .to(lookTarget, { x: heroLookX, duration: 2.2 }, 0)
    if (model) introTl.to(model.rotation, { y: baseRotY, duration: 2.2 }, 0)
    if (veilRef.current) introTl.to(veilRef.current, { opacity: 0, duration: 1.15 }, 0.85)

    // Skip affordance: any user input fast-forwards to the settled hero.
    const onSkip = () => {
      introTl.progress(1) // snap visuals; onComplete fires finishIntro
    }
    window.addEventListener('wheel', onSkip, { passive: true })
    window.addEventListener('touchmove', onSkip, { passive: true })
    window.addEventListener('keydown', onSkip)
    window.addEventListener('pointerdown', onSkip)
  }, [playIntro, onIntroDone])
```

- [ ] **Step 3: Add the load-failure handler**

Immediately after the `handleReady` `useCallback` block, add:
```jsx
  // If the 55MB GLB fails to load, don't strand the user on a black veil:
  // drop the veil, unlock scroll, reveal the navbar. Page works without 3D.
  const handleSceneError = useCallback(() => {
    try {
      sessionStorage.setItem('sc_intro_seen_v2', '1')
    } catch {
      /* ignore */
    }
    document.body.style.overflow = ''
    setVeilOn(false)
    onIntroDone?.()
  }, [onIntroDone])
```

- [ ] **Step 4: Restore scroll on unmount (safety)**

The existing cleanup effect reverts the GSAP context. Extend it to also unlock scroll in case Home unmounts mid-intro. Change:
```jsx
  useEffect(() => () => ctxRef.current?.revert(), [])
```
to:
```jsx
  useEffect(
    () => () => {
      ctxRef.current?.revert()
      document.body.style.overflow = ''
    },
    [],
  )
```

- [ ] **Step 5: Render the veil + pass `onError`**

Change the Scene3D mount line from:
```jsx
      {Scene3D && <Scene3D onReady={handleReady} />}
```
to:
```jsx
      {Scene3D && <Scene3D onReady={handleReady} onError={handleSceneError} />}
      {veilOn && (
        <div className="intro-veil" ref={veilRef} aria-hidden="true">
          <div className="intro-veil-mark" />
        </div>
      )}
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: clean. No unused-var warnings (`veilOn`, `veilRef`, `handleSceneError` all consumed).

- [ ] **Step 7: Manual dev check (temporary prop)**

Temporarily render `<Home playIntro onIntroDone={() => {}} />` is not yet wired (Task 4 does that). For an isolated check now, run `npm run dev`, open `/`, and in DevTools run `sessionStorage.clear()` then reload: with `playIntro` still defaulting to `false` the page must behave exactly as today (no veil, hero direct). Confirm no regression. Full intro behavior is verified after Task 4.

Expected: no veil (prop defaults false), hero + scroll unchanged, live stats load.

- [ ] **Step 8: Commit** (pause for user approval first)

```bash
git add src/pages/Home.jsx
git commit -m "feat(intro): 3D dolly-in intro path in Home (behind playIntro prop)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Wire App → Home, retire the 2D intro

App stops mounting `IntroOverlay`, decides `playIntro` synchronously (bumped key `v2`), passes it plus `onIntroDone` into the routed Home, and keeps gating the navbar.

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: Home props `playIntro`, `onIntroDone` (Task 3).

- [ ] **Step 1: Bump the seen-key and invert to a `playIntro` helper**

Change the helper (lines 11-24) from:
```jsx
function introShouldSkip() {
  if (typeof window === 'undefined' || !window.matchMedia) return true
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let seen = false
  try {
    seen = sessionStorage.getItem('sc_intro_seen_v1') === '1'
  } catch {
    seen = false
  }
  return reduce || seen || window.location.pathname !== '/'
}
```
to:
```jsx
// The 3D dolly intro plays only on the first home-page load of a session, and
// never for reduced-motion. Decided synchronously so the navbar starts hidden
// and no hero flashes before the veil (rendered by Home) covers it.
function shouldPlayIntro() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let seen = false
  try {
    seen = sessionStorage.getItem('sc_intro_seen_v2') === '1'
  } catch {
    seen = false
  }
  return !reduce && !seen && window.location.pathname === '/'
}
```

- [ ] **Step 2: Remove the IntroOverlay import, add `useCallback`**

Delete line 7:
```jsx
import IntroOverlay from './components/IntroOverlay.jsx'
```
And change the React import (line 1) from:
```jsx
import { useEffect, useState } from 'react'
```
to:
```jsx
import { useCallback, useEffect, useState } from 'react'
```

- [ ] **Step 3: Rewire App state, drop the overlay mount, pass props to Home**

`onIntroDone` MUST be a stable reference (`useCallback`). If it's an inline arrow, App's re-render at intro-completion changes `handleReady`'s identity, which changes Scene3D's `onReady` prop and re-runs its effect — reloading the 55MB GLB. Memoize it.

Change the `App` component (lines 43-60) from:
```jsx
export default function App() {
  const [introDone, setIntroDone] = useState(introShouldSkip)

  return (
    <>
      {!introDone && <IntroOverlay onComplete={() => setIntroDone(true)} />}
      <GlobalAmbient />
      <CursorGlow />
      <ScrollManager />
      <Navbar hidden={!introDone} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/founders" element={<Founders />} />
      </Routes>
      <Footer />
    </>
  )
}
```
to:
```jsx
export default function App() {
  const [playIntro] = useState(shouldPlayIntro)
  const [introDone, setIntroDone] = useState(() => !shouldPlayIntro())
  const handleIntroDone = useCallback(() => setIntroDone(true), [])

  return (
    <>
      <GlobalAmbient />
      <CursorGlow />
      <ScrollManager />
      <Navbar hidden={!introDone} />
      <Routes>
        <Route
          path="/"
          element={<Home playIntro={playIntro} onIntroDone={handleIntroDone} />}
        />
        <Route path="/founders" element={<Founders />} />
      </Routes>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: clean. No dangling `IntroOverlay` / `introShouldSkip` references (grep to confirm: `grep -rn "IntroOverlay\|introShouldSkip" src` returns nothing).

- [ ] **Step 5: Manual dev check — full intro**

Run `npm run dev`. In DevTools: `sessionStorage.clear()`, reload `/`.
Expected: black veil at first paint (no hero flash) → model loads → camera dollies the model into the hero pose as the veil fades → navbar fades in → scrolling drives the camera story. Reload again (same session): no intro, hero direct. Toggle OS reduced-motion (or emulate in DevTools rendering): no intro, hero direct, normal scroll.

- [ ] **Step 6: Commit** (pause for user approval first)

```bash
git add src/App.jsx
git commit -m "feat(intro): wire 3D dolly intro through App, retire 2D overlay mount

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Delete the obsolete 2D IntroOverlay

Nothing imports it after Task 4. Remove the component and its CSS.

**Files:**
- Delete: `src/components/IntroOverlay.jsx`
- Delete: `src/components/introoverlay.css`

- [ ] **Step 1: Confirm no references remain**

Run: `grep -rn "IntroOverlay\|introoverlay" src`
Expected: no matches.

- [ ] **Step 2: Delete the files**

Run:
```bash
git rm src/components/IntroOverlay.jsx src/components/introoverlay.css
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 4: Commit** (pause for user approval first)

```bash
git commit -m "chore(intro): remove obsolete 2D IntroOverlay component + css

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Full verification pass + design-lessons note

End-to-end WebGL Playwright verification against the production build, plus a doc note.

**Files:**
- Create: `scripts/verify-intro.mjs` (throwaway verify script; not committed unless useful)
- Modify: `docs/STACKCORP_DESIGN_LESSONS.md` (append a 3D-intro note)

- [ ] **Step 1: Write the verification script**

Create `scripts/verify-intro.mjs`:
```js
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:4173'
const widths = [375, 390, 430, 1440]

const browser = await chromium.launch({ args: ['--use-gl=angle', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

// Fresh session: veil should be present shortly after first paint.
await page.goto(BASE, { waitUntil: 'load' })
await page.addStyleTag({ content: 'html,*{scroll-behavior:auto!important}' })
const veilAtStart = await page.locator('.intro-veil').count()
console.log('veil present fresh session:', veilAtStart === 1 ? 'PASS' : 'FAIL')

// Wait out the intro; veil should be gone and navbar visible.
await page.waitForTimeout(6000)
const veilGone = await page.locator('.intro-veil').count()
console.log('veil cleared after intro:', veilGone === 0 ? 'PASS' : 'FAIL')

// Second load in same session: no intro.
await page.goto(BASE, { waitUntil: 'load' })
await page.waitForTimeout(500)
const veilSecond = await page.locator('.intro-veil').count()
console.log('no intro second load:', veilSecond === 0 ? 'PASS' : 'FAIL')

// Overflow check across widths.
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 })
  await page.waitForTimeout(300)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  console.log(`overflow @${w}:`, overflow <= 0 ? 'PASS' : `FAIL (${overflow}px)`)
}

// Reduced-motion: no intro.
const rmCtx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } })
const rmPage = await rmCtx.newPage()
await rmPage.goto(BASE, { waitUntil: 'load' })
await rmPage.waitForTimeout(500)
console.log('reduced-motion no intro:', (await rmPage.locator('.intro-veil').count()) === 0 ? 'PASS' : 'FAIL')

console.log('console errors:', errors.length === 0 ? 'PASS (none)' : `FAIL: ${errors.join(' | ')}`)
await browser.close()
```

- [ ] **Step 2: Build and preview, then run the script**

Run:
```bash
npm run build && (npm run preview &) && sleep 3 && node scripts/verify-intro.mjs
```
Expected: every line prints PASS. (If the live-stats "unavailable" cold-start race appears in dev it's tooling-only; on the production preview stats must read 1/3/11 — verify manually in the preview tab.)

- [ ] **Step 3: Manually confirm live stats + contact + founders**

In the preview tab: scroll to Work → live stats read 1 / 3 / 11. Contact form shows 7 inputs. Visit `/founders` → no veil, no intro, clean.

- [ ] **Step 4: Append the design-lessons note**

Add to `docs/STACKCORP_DESIGN_LESSONS.md` under the 3D section:
```markdown
### 3D dolly-in intro (replaces the 2D SVG intro)

The opening intro is now the real Scene3D model, not a flat LogoStack SVG — this
kills the old 2D→3D crossfade seam. Home renders an opaque `.intro-veil` on first
paint (masks the 55MB GLB download), and once Scene3D's `onReady` fires, a GSAP
timeline snaps the camera to a derived `INTRO_START` (pulled back/left/low, from
the captured hero pose) and dollies it into the exact staged hero pose while the
veil fades — then the scroll ScrollTrigger timeline is built. `INTRO_START` is
derived from `heroCam`/`heroLookX` so it survives hero-pose tweaks. Any user input
skips to the end. Once/session via `sc_intro_seen_v2`; reduced-motion + non-`/`
skip it entirely (App decides synchronously). Scene3D gained an `onError` prop so
a failed GLB load drops the veil instead of stranding a black screen. The model is
a single textured mesh (no layers), so the entrance is camera + settle-turn only —
there is no literal layer unfold.
```

- [ ] **Step 5: Commit** (pause for user approval first)

```bash
git add docs/STACKCORP_DESIGN_LESSONS.md
git commit -m "docs: note the 3D dolly-in intro handoff in design lessons

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Notes for the executor

- The 55MB GLB makes the intro's visible start depend on download time; the veil's pulse covers it. If you want a real progress bar instead of the pulse, Scene3D already tracks `progress` — surfacing it up is a small follow-up, out of scope here.
- `INTRO_START` offsets (−3.0 x / −0.8 y / +3.5 z / −1.2 lookX / +0.5 rotY) and the 2.2s duration are the tunable feel knobs. Adjust after seeing it live; the derivation-from-hero-pose keeps them safe.
- Do not re-add a Suspense boundary. Keep Scene3D state-mounted.
