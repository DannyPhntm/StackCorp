import { useCallback, useEffect, useRef, useState } from 'react'
import Hero3D from '../components/Hero3D.jsx'
import Services from '../components/Services.jsx'
import WhoWeHelp from '../components/WhoWeHelp.jsx'
import Work from '../components/Work.jsx'
import StackScout from '../components/StackScout.jsx'
import Process from '../components/Process.jsx'
import FounderPreview from '../components/FounderPreview.jsx'
import SmarterSystems from '../components/SmarterSystems.jsx'
import Contact from '../components/Contact.jsx'

export default function Home() {
  const mainRef = useRef(null)
  const ctxRef = useRef(null)

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
    // Pose 2 animates *from* these, so the settled hero (scroll 0) is identical
    // whether GSAP runs or not (reduced-motion keeps this same frame) — no drift
    // between the static hero and the scrubbed one.
    const heroCam = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
    const heroLookX = lookTarget.x

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

      // Gentle poses — mostly front-facing, calm, never an aggressive swing.
      // The model stays largely centred; only a subtle side twist + soft camera
      // drift carry the story (per the brief: don't overcomplicate the motion).
      // Pose 2 — AI: ease in, re-centre the model, begin the unfold. fromTo so
      // the hero (progress 0) is pinned to Scene3D's staged pose, then eases to
      // centre as the story opens.
      tl.fromTo(camera.position, { x: heroCam.x, y: heroCam.y, z: heroCam.z }, { x: 0.4, y: 1.2, z: 4.7 }, 0)
        .fromTo(lookTarget, { x: heroLookX }, { x: 0 }, 0)
      openTo(1, 0)
      turnTo(-0.06, 0)
      // Pose 3 — Business types: gentle shift around the model.
      tl.to(camera.position, { x: -1.5, y: 1.4, z: 4.9 }, 1)
      openTo(0.5, 1)
      turnTo(-0.1, 1)
      // Pose 4 — Malir Cantt Bazaar: soft side/detail angle.
      tl.to(camera.position, { x: 1.7, y: 1.1, z: 4.6 }, 2).to(lookTarget, { x: 0.15 }, 2)
      openTo(0.25, 2)
      turnTo(-0.01, 2)
      // Process — slightly elevated look.
      tl.to(camera.position, { x: 0, y: 1.9, z: 5.3 }, 3).to(lookTarget, { x: 0 }, 3)
      turnTo(0.05, 3)
      // Founders — gentle offset.
      tl.to(camera.position, { x: -1.2, y: 1.4, z: 5.3 }, 4)
      turnTo(0.08, 4)
      // Pose 5 — Finale/contact: settle.
      tl.to(camera.position, { x: 0, y: 1.5, z: 5.8 }, 5)
      openTo(0, 5)
      turnTo(0.08, 5)

      // Content height settles after fonts/live-stats — remeasure.
      ScrollTrigger.refresh()
    }, mainRef)

    // Page height keeps changing after this point (fonts, founder images, the
    // live-stats fetch). Re-measure so every camera pose maps to the right
    // scroll position instead of a stale early height.
    document.fonts?.ready?.then(() => ScrollTrigger.refresh())
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
  }, [])

  useEffect(() => () => ctxRef.current?.revert(), [])

  return (
    <>
      {Scene3D && <Scene3D onReady={handleReady} />}
      <main ref={mainRef} className="home3d">
        <Hero3D />
        <Services />
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
