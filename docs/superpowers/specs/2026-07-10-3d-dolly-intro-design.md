# 3D Dolly-In Intro — Design Spec

Date: 2026-07-10
Branch: `redesign/stackcorp-unfolding-scroll-story`
Status: approved (design), pending implementation plan

## Goal

Replace the current 2D SVG opening intro with a code-driven **3D dolly-in intro that
animates the real Scene3D GLB model** into its hero pose. Eliminate the visible
seam where the flat `LogoStack` SVG crossfades into the textured 3D mesh (two
different-looking objects in the same spot). The intro is the hero model itself.

## Users affected

Every first-time (per session) visitor to the StackCorp home page (`/`) on a
motion-enabled device. Reduced-motion users, returning-in-session users, and
non-home routes are unaffected (no intro).

## Background / current state

- `App.jsx` mounts `IntroOverlay` synchronously at first paint (decided by
  `introShouldSkip()` using `sc_intro_seen_v1` + reduced-motion + path check),
  gates `Navbar` via `hidden={!introDone}`.
- `IntroOverlay.jsx` = 2D framer-motion animation of the `LogoStack` SVG:
  center → left (reveal "StackCorp") → center → grow → opacity fade, crossfading
  into the centered 3D model behind it.
- `Home.jsx` lazy-mounts `Scene3D` via a state-based dynamic `import()` (NOT
  React.lazy/Suspense — Suspense remounts siblings and cancels Work's live-stats
  fetch). `Scene3D.onReady({ camera, model, layers, lookTarget })` hands the
  scene objects to `handleReady`, which builds the GSAP `ScrollTrigger` scroll
  timeline pinned to the staged hero pose (pose 0 = `heroCam`/`heroLookX`).
- Active model `public/model/stackcorp-logo.glb` = **single textured PBR mesh,
  no named layers, no baked animation** (confirmed via glTF chunk parse).
  `logo2.glb` = identical-size unused re-export. Only the abandoned 13KB
  `starter.glb` had separable layers. **Literal layer "unfold" is impossible on
  the real model** — entrance must be camera + transform + material.

The current 2D intro also (deliberately) masks the 55MB model download: it plays
while the GLB loads behind. The 3D intro MUST preserve this masking.

## Required behavior

Entrance style: **Dolly + settle** (user-selected).

Sequence on a fresh session, home page, motion enabled:

1. **First paint:** opaque black veil covers everything (above navbar), body
   scroll locked. No flash of hero content.
2. **Load:** `Scene3D` mounts and loads the GLB behind the veil. If the load is
   slow, the veil surfaces the existing Scene3D load progress.
3. **Model ready:** camera is snapped to `INTRO_START` (pulled-back, off-angle,
   slightly low) while still hidden by the veil. No change to Scene3D's hero
   staging — the veil hides the staged first frame; Home overrides to
   `INTRO_START` before the veil fades.
4. **Intro timeline (~2.4s, GSAP):**
   - `camera.position` eases `INTRO_START → hero pose` (`heroCam`) — the dolly-in.
   - `lookTarget.x` eases `INTRO_START look → heroLookX`.
   - `model.rotation.y` eases from a small offset to its base (`MODEL_ROT.y`) — a
     gentle settle turn, never a spin.
   - veil `opacity 1 → 0` across the move.
   - hero copy + navbar fade in over the last ~0.6s.
5. **On complete:** write `sessionStorage['sc_intro_seen_v2'] = '1'`, unlock body
   scroll, build the existing `ScrollTrigger` scroll timeline (unchanged), fire
   `onIntroDone()`.

Skip affordance: a click / scroll / keydown during the intro fast-forwards the
GSAP timeline to its end (then runs the same completion). Cheap and expected.

Easing/feel: reuse the site's premium ease (`[0.16, 1, 0.3, 1]` equivalent /
GSAP `power3.out`); calm, cinematic, no aggressive swing (matches rounds 4–6
taste bar in `docs/STACKCORP_DESIGN_LESSONS.md`).

## Non-goals

- No new 3D asset, no re-rigged/multi-layer model, no rendered video (option A/C
  rejected).
- No literal layer-spread unfold (asset can't do it).
- No change to the scroll-story camera poses or any downstream section.
- No change to `/founders`, live-stats, contact form, or any backend.
- No bloom/post-processing added.

## UI requirements

- Veil: full-screen, opaque near-black matching site surface tokens, `z-index`
  above navbar, `aria-hidden`. Optional minimal centered progress/loader while
  the GLB downloads (reuse Scene3D's progress value if surfaced, else a quiet
  pulse). No 2D logo.
- Navbar fades in at the tail of the intro (existing `.nav--intro-hidden`
  pattern preserved via `introDone`).
- Respect existing hero layout; the model settles into the exact staged hero
  pose so there is zero jump when the veil clears.

## Backend / data requirements

None. No API, DB, or network behavior changes. Live-stats fetch path must remain
untouched (do not reintroduce a Suspense boundary or remount siblings).

## Security / privacy requirements

- No secrets, no new external requests, no new asset hosting.
- `sessionStorage` access stays wrapped in try/catch (private mode safe).
- CSP/asset origins unchanged.

## Edge cases

- **Reduced-motion OR already-seen (`v2`) OR non-`/` path** → `playIntro=false`:
  veil never mounts, current direct hero pose + scroll timeline, navbar instant.
- **Model load failure** → `Scene3D` `onError` callback → Home ends intro
  gracefully (veil off, scroll unlocked, navbar in) with no 3D, rather than
  hanging on black.
- **Mobile / coarse pointer** → same intro; veil masks the heavier 55MB load.
  Scroll story itself stays guarded downstream as today.
- **Private/incognito** (`sessionStorage` throws) → caught; intro replays next
  load, harmless.
- **Unmount mid-intro** (route change / HMR) → GSAP context reverted, scroll
  unlocked, timers cancelled (mirror current cleanup discipline).
- **Fonts/live-stats late height changes** → still `ScrollTrigger.refresh()` on
  `fonts.ready` + `window load` after the scroll timeline builds.

## Verification plan (stated before work)

WebGL-enabled Playwright (`waitUntil:'load'`, inject `scroll-behavior:auto`,
settle ~500ms):

1. Fresh session, `/`: veil present at first paint, no hero flash; GLB loads;
   camera dollies from `INTRO_START` to hero pose; veil clears; navbar fades in;
   scroll timeline responds afterward.
2. Reload in same session: no intro (`v2` seen), hero direct.
3. Reduced-motion emulation: no intro, hero direct, scroll normal.
4. Simulated model-load failure: graceful skip, page usable.
5. 0 horizontal overflow @375/390/430/1440; no console errors.
6. Live stats show 1/3/11 (production preview); contact form 7 inputs intact;
   `/founders` clean (no intro/veil).
7. `npm run build` clean; main bundle unchanged (~409KB); three.js stays a
   separate on-demand chunk.

Report: plan vs actual, commands run, browser checks, pass/fail.

## Files likely affected

- `src/App.jsx` — bump seen key to `v2`, drop `<IntroOverlay>`, pass
  `playIntro` + `onIntroDone` into routed `<Home>`, keep navbar gating.
- `src/pages/Home.jsx` — own the intro: veil render when `playIntro`, branch
  `handleReady` into intro path (entrance TL → scroll TL) vs direct path, skip
  affordance, `onIntroDone`, cleanup.
- `src/components/Scene3D.jsx` — add `onError` callback for failed load.
- `src/components/IntroOverlay.jsx` + `src/components/introoverlay.css` —
  **delete** (2D intro retired).
- Small CSS for the veil (new file or fold into `scene3d.css` / home styles).
- `docs/STACKCORP_DESIGN_LESSONS.md` — add a note on the 3D intro handoff.

## Rollout / deployment notes

- Branch-local; no env/secret/config changes. Do NOT commit without user
  approval (repo rule).
- No migration. Client-only change; Vercel build unaffected.
- `sc_intro_seen_v1` → `v2` means every current session sees the new intro once
  (intended).
- 55MB GLB is still a known weight; compressing it is a separate follow-up noted
  in the redesign memory, out of scope here.
