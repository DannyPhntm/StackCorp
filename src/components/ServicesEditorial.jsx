import { useEffect, useRef, useState } from 'react'
import './serviceseditorial.css'

/*
 * "What we do" — a scroll-driven editorial scene replacing the old accordion.
 * Four capabilities told as one continuous stage: a solid Persian Blue set,
 * a large changing headline on the left, and a photo-card stack on the right
 * that rotates, fans and settles into a new arrangement per stage.
 *
 * Modes (chosen synchronously so there is no render flip):
 *   pinned — ≥900px, motion allowed: tall track + sticky stage, GSAP scrub.
 *   flow   — <900px, motion allowed: vertical sequence, light reveal-on-enter.
 *   static — reduced motion: the same vertical sequence, no animation.
 *
 * IMAGES — monochrome editorial photos in public/assets/services-scroll/
 * (see the README there for the naming convention).
 */
const IMG_BASE = '/assets/services-scroll'
const stages = [
  {
    title: 'Websites',
    headline: 'Websites built to earn attention and trust.',
    copy: 'Clean, fast digital experiences that explain the business clearly and turn interest into meaningful enquiries.',
    outcome: 'Credibility',
    img: `${IMG_BASE}/websites.jpg`,
    alt: 'Black and white photo of a studio workspace with people at desks',
  },
  {
    title: 'Digital Strategy',
    headline: 'Clarity before execution.',
    copy: 'We connect positioning, customer journeys, content, and conversion so every digital decision supports a real business goal.',
    outcome: 'Direction',
    img: `${IMG_BASE}/digital-strategy.jpg`,
    alt: 'Black and white photo of two people reviewing work on a laptop screen',
  },
  {
    title: 'AI & Automation',
    headline: 'Less repetition. More useful work.',
    copy: 'We identify stable, repeatable processes and introduce automation or AI only where it creates measurable value.',
    outcome: 'Leverage',
    img: `${IMG_BASE}/ai-automation.jpg`,
    alt: 'Black and white overhead photo of a handshake across a desk',
  },
  {
    title: 'Business Systems',
    headline: 'Systems shaped around how the business operates.',
    copy: 'Dashboards, internal tools, portals, and workflows that create clearer ownership, visibility, and control.',
    outcome: 'Operations',
    img: `${IMG_BASE}/business-systems.jpg`,
    alt: 'Black and white overhead photo of a team working around a table',
  },
]

/* Resting rotation per stage card, alternating so the stack reads hand-placed. */
const REST_ROT = [-7, 6, -6, 7]

const query = (q) => (typeof window !== 'undefined' ? window.matchMedia(q) : null)

function computeMode() {
  const reduce = query('(prefers-reduced-motion: reduce)')?.matches
  if (reduce) return 'static'
  return query('(min-width: 900px)')?.matches ? 'pinned' : 'flow'
}

/* Fade the fixed 3D canvas out before the solid scene dominates, and back in
   after it. Scrubbed both ways, so scrolling up restores it naturally. */
function buildSceneHandoff(gsap, ScrollTrigger, track, scene) {
  gsap.to(scene, {
    autoAlpha: 0,
    ease: 'none',
    scrollTrigger: { trigger: track, start: 'top 85%', end: 'top 30%', scrub: true },
  })
  gsap.fromTo(
    scene,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      ease: 'none',
      immediateRender: false,
      scrollTrigger: { trigger: track, start: 'bottom 70%', end: 'bottom 15%', scrub: true },
    },
  )
}

export default function ServicesEditorial() {
  const [mode, setMode] = useState(computeMode)
  const trackRef = useRef(null)
  const counterRef = useRef(null)
  const markerRefs = useRef([])
  const stageIdxRef = useRef(0)

  // Re-evaluate on breakpoint / motion-preference changes (rare).
  useEffect(() => {
    const queries = [query('(prefers-reduced-motion: reduce)'), query('(min-width: 900px)')]
    const onChange = () => setMode(computeMode())
    queries.forEach((q) => q?.addEventListener('change', onChange))
    return () => queries.forEach((q) => q?.removeEventListener('change', onChange))
  }, [])

  useEffect(() => {
    if (mode === 'static' || !trackRef.current) return
    let ctx
    let alive = true
    let sceneWait = null

    ;(async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!alive || !trackRef.current) return

      const track = trackRef.current
      ctx = gsap.context(() => {
        // ---- 3D canvas handoff (both modes). Scene3D is code-split and may
        // mount after us, so wait for its root briefly. ----
        const wire = () => {
          const scene = document.querySelector('.scene3d')
          if (scene) {
            buildSceneHandoff(gsap, ScrollTrigger, track, scene)
            return true
          }
          return false
        }
        if (!wire()) {
          let tries = 0
          sceneWait = setInterval(() => {
            if (wire() || ++tries > 40) clearInterval(sceneWait)
          }, 250)
        }

        if (mode === 'flow') {
          // Light reveal per block — restrained, no pin on touch layouts.
          track.querySelectorAll('.se-block').forEach((block) => {
            gsap.fromTo(
              block,
              { autoAlpha: 0, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: { trigger: block, start: 'top 88%', once: true },
              },
            )
          })
          return
        }

        // ---- Pinned scene ----
        const texts = gsap.utils.toArray('.se-text', track)
        const cards = gsap.utils.toArray('.se-card', track)
        const tints = gsap.utils.toArray('.se-tint', track)
        const dims = gsap.utils.toArray('.se-dim', track)

        // Start state: everything off-stage except nothing — stage 0 animates
        // in over the first stretch of scroll.
        texts.forEach((t) => gsap.set(t, { autoAlpha: 0, y: 44 }))
        // Enter tilted on the SAME side as the rest pose — crossing 0° mid-flight
        // reads as a wobble instead of a photo easing into place.
        cards.forEach((c, i) =>
          gsap.set(c, {
            xPercent: 145,
            rotation: REST_ROT[i] + (REST_ROT[i] > 0 ? 14 : -14),
            zIndex: 10 + i,
          }),
        )
        tints.forEach((t) => gsap.set(t, { autoAlpha: 0.9 }))

        const stageStarts = [0]

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: track,
            // Starts while the stage is still approaching, so stage 1 has
            // fully assembled by the time the section pins — no blank arrival.
            start: 'top 45%',
            end: 'bottom bottom',
            // Tight scrub so the scene answers the wheel almost immediately —
            // higher values read as the page swallowing scroll input.
            scrub: 0.35,
            onUpdate: (self) => {
              // Progress markers + counter follow the dominant stage.
              const t = self.progress * tl.duration()
              let idx = 0
              stageStarts.forEach((s, i) => {
                if (t >= s) idx = i
              })
              if (idx !== stageIdxRef.current) {
                stageIdxRef.current = idx
                markerRefs.current.forEach((m, i) =>
                  m?.classList.toggle('is-active', i === idx),
                )
                if (counterRef.current)
                  counterRef.current.textContent = `0${idx + 1} / 04`
              }
            },
          },
        })

        // Stage 0 entry.
        tl.to(cards[0], { xPercent: 0, rotation: REST_ROT[0], duration: 0.8, ease: 'power3.out' }, 0)
          .to(tints[0], { autoAlpha: 0, duration: 0.55 }, 0.25)
          .to(texts[0], { autoAlpha: 1, y: 0, duration: 0.5 }, 0.25)

        // Timing note: every timeline unit maps to real scroll distance, so
        // holds are scroll the user spends with nothing moving. Keep them to
        // short readable beats (~0.25u) — long holds read as a frozen page.
        let pos = 1.1 // brief hold on stage 0 before the first transition
        for (let i = 1; i < stages.length; i++) {
          stageStarts.push(pos + 0.45)
          // Outgoing text lifts away first.
          tl.to(texts[i - 1], { autoAlpha: 0, y: -28, duration: 0.35 }, pos)
          // Incoming card swings in from the right, tinted, and settles.
          tl.to(
            cards[i],
            { xPercent: 0, rotation: REST_ROT[i], duration: 0.9, ease: 'power3.out' },
            pos + 0.1,
          )
          tl.to(tints[i], { autoAlpha: 0, duration: 0.6 }, pos + 0.4)
          // Previous card recedes: small counter-turn, shrink, dim.
          tl.to(
            cards[i - 1],
            {
              xPercent: -8,
              rotation: REST_ROT[i - 1] + (REST_ROT[i - 1] > 0 ? 5 : -5),
              scale: 0.92,
              duration: 0.9,
            },
            pos + 0.05,
          )
          tl.to(dims[i - 1], { autoAlpha: 0.35, duration: 0.6 }, pos + 0.2)
          // Two-back card exits fully — the stack stays two sheets deep.
          if (i >= 2) tl.to(cards[i - 2], { autoAlpha: 0, duration: 0.5 }, pos + 0.25)
          // Incoming text.
          tl.to(texts[i], { autoAlpha: 1, y: 0, duration: 0.5 }, pos + 0.45)
          pos += 1.25
        }
        // Short settle so the last stage lands before unpinning.
        tl.to({}, { duration: 0.25 }, pos)

        ScrollTrigger.refresh()
      }, trackRef)
    })()

    return () => {
      alive = false
      clearInterval(sceneWait)
      ctx?.revert()
    }
  }, [mode])

  const eyebrow = (
    <p className="se-eyebrow">
      <b>01</b>
      What we do
    </p>
  )

  const card = (s, i) => (
    <figure className="se-card" key={s.title}>
      <span className="se-paper" aria-hidden="true" />
      <img className="se-photo" src={s.img} alt={s.alt} loading="lazy" />
      <span className="se-tint" aria-hidden="true" />
      <span className="se-dim" aria-hidden="true" />
    </figure>
  )

  if (mode !== 'pinned') {
    return (
      <section id="services" className="se-track se-flow" ref={trackRef}>
        <div className="se-grain" aria-hidden="true" />
        <div className="container">
          <div className="se-flow-head">{eyebrow}</div>
          {stages.map((s, i) => (
            <article className="se-block" key={s.title}>
              <p className="se-block-meta">
                <span>
                  0{i + 1} / 04
                </span>
                <span>{s.outcome}</span>
              </p>
              <h2 className="se-headline">{s.headline}</h2>
              <p className="se-sub">{s.copy}</p>
              {card(s, i)}
            </article>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="se-track se-pinned" ref={trackRef}>
      <div className="se-stage">
        <div className="se-grain" aria-hidden="true" />
        <div className="se-inner container">
          {eyebrow}
          <div className="se-copy">
            {stages.map((s) => (
              <div className="se-text" key={s.title}>
                <h2 className="se-headline">{s.headline}</h2>
                <p className="se-sub">{s.copy}</p>
                <p className="se-outcome">
                  <span className="se-outcome-label">Key outcome</span>
                  <span className="se-outcome-value">{s.outcome}</span>
                </p>
              </div>
            ))}
            <p className="se-counter" ref={counterRef} aria-hidden="true">
              01 / 04
            </p>
          </div>
          <div className="se-deck">{stages.map(card)}</div>
        </div>
        <div className="se-markers" aria-hidden="true">
          {stages.map((s, i) => (
            <span
              key={s.title}
              ref={(el) => {
                markerRefs.current[i] = el
              }}
              className={`se-marker ${i === 0 ? 'is-active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
