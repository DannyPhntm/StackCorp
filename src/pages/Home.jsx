import { useCallback, useEffect, useRef, useState } from 'react'
import Hero3D from '../components/Hero3D.jsx'
import ServicesEditorial from '../components/ServicesEditorial.jsx'
import WhoWeHelp from '../components/WhoWeHelp.jsx'
import Work from '../components/Work.jsx'
import StackScout from '../components/StackScout.jsx'
import Process from '../components/Process.jsx'
import FounderPreview from '../components/FounderPreview.jsx'
import SmarterSystems from '../components/SmarterSystems.jsx'
import Contact from '../components/Contact.jsx'

export default function Home({ playIntro = false, onIntroDone }) {
  const mainRef = useRef(null)
  const ctxRef = useRef(null)
  const veilRef = useRef(null)
  const introFinishedRef = useRef(false)
  // Veil is present on the very first render (synchronous from the prop) so the
  // hero never flashes before it. It unmounts once the dolly finishes.
  const [veilOn, setVeilOn] = useState(playIntro)

  // Three.js (~600KB) is code-split via a dynamic import and mounted only after
  // first paint. A React.lazy/Suspense boundary was avoided on purpose: its
  // fallback→content swap remounts the sibling sections, which cancels Work's
  // in-flight live-stats fetch and leaves it stuck loading. This keeps the
  // section tree mounted exactly once. The canvas is fixed, so mounting it late
  // causes no layout shift.
  const [Scene3D, setScene3D] = useState(null)
  useEffect(() => {
    let alive = true
    import('../components/Scene3D.jsx').then((m) => {
      if (alive) setScene3D(() => m.default)
    })
    return () => {
      alive = false
    }
  }, [])

  // Wire the scroll-driven camera once the model is in the scene. GSAP + its
  // ScrollTrigger plugin are dynamically imported here so they stay out of the
  // main bundle. ScrollTrigger scrub reads scroll (never hijacks it — no pin,
  // no trap). Reduced-motion keeps the static hero pose and scrolls normally.
  const handleReady = useCallback(async ({ camera, layers, lookTarget, model }) => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (reduce || !mainRef.current) return

    const { default: gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    if (!mainRef.current) return // unmounted while importing

    // Layer-spread only applies to the multi-mesh starter model. The current
    // single-mesh GLB has no layers, so the "unfold" comes from the camera plus
    // a gentle model turn (never a spin) — set up below and applied per pose.
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
      clearTimeout(introSafety)
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

    // Hard safety net: on a struggling GPU the page can drop to a few FPS and
    // GSAP's lag smoothing stretches the 2.2s dolly into a near-permanent black
    // veil (the "intro disappeared" hang). Whatever happens, release the page.
    // finishIntro is idempotent, so the timeline's own onComplete stays a no-op.
    const introSafety = setTimeout(finishIntro, 4600)

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
    // progress(1) snaps the visuals but GSAP does not reliably fire onComplete
    // when seeking, so call finishIntro directly — it is idempotent (guarded by
    // introFinishedRef), so a later onComplete is a harmless no-op.
    const onSkip = () => {
      introTl.progress(1)
      finishIntro()
    }
    window.addEventListener('wheel', onSkip, { passive: true })
    window.addEventListener('touchmove', onSkip, { passive: true })
    window.addEventListener('keydown', onSkip)
    window.addEventListener('pointerdown', onSkip)
  }, [playIntro, onIntroDone])

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

  useEffect(
    () => () => {
      ctxRef.current?.revert()
      document.body.style.overflow = ''
    },
    [],
  )

  return (
    <>
      {Scene3D && <Scene3D onReady={handleReady} onError={handleSceneError} />}
      {veilOn && (
        <div className="intro-veil" ref={veilRef} aria-hidden="true">
          <div className="intro-veil-mark" />
        </div>
      )}
      <main ref={mainRef} className="home3d">
        <Hero3D />
        <ServicesEditorial />
        <WhoWeHelp />
        <Work />
        <StackScout />
        <Process />
        <FounderPreview />
        <SmarterSystems />
        <Contact />
      </main>
    </>
  )
}
