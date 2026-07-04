import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import Reveal from './Reveal.jsx'
import './process.css'

const steps = [
  {
    n: '01',
    title: 'Discover',
    body: 'We understand your business, customers, current workflow, and pain points.',
  },
  {
    n: '02',
    title: 'Audit',
    body: 'We review your online presence, customer flow, and operational gaps.',
  },
  {
    n: '03',
    title: 'Design',
    body: 'We shape the user experience, content, and system structure around what your business actually needs.',
  },
  {
    n: '04',
    title: 'Build',
    body: 'We develop the website, automation, or system with clean implementation and responsive design.',
  },
  {
    n: '05',
    title: 'Launch',
    body: 'We test, deploy, and make sure the experience works across real devices.',
  },
  {
    n: '06',
    title: 'Improve',
    body: 'We keep refining based on feedback, usage, and changing business needs.',
  },
]

/*
 * Desktop: a horizontally draggable track (Framer Motion drag) with
 * arrow controls and a progress line. Vertical page scroll is never
 * captured — the section has normal height and no pinning.
 * Mobile / reduced motion: vertical timeline.
 */
function DragTrack() {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [maxDrag, setMaxDrag] = useState(0)
  const x = useMotionValue(0)
  const progress = useTransform(x, [0, -Math.max(maxDrag, 1)], ['6%', '100%'])

  const measure = useCallback(() => {
    if (!viewportRef.current || !trackRef.current) return
    const overflow = trackRef.current.scrollWidth - viewportRef.current.offsetWidth
    setMaxDrag(Math.max(0, overflow))
  }, [])

  useEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (viewportRef.current) ro.observe(viewportRef.current)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [measure])

  const nudge = (dir) => {
    const stepWidth = trackRef.current
      ? trackRef.current.scrollWidth / steps.length
      : 420
    const target = Math.min(0, Math.max(-maxDrag, x.get() + dir * stepWidth))
    animate(x, target, { type: 'spring', stiffness: 220, damping: 32 })
  }

  /*
   * Translate vertical wheel/trackpad intent into horizontal motion
   * while hovered, but only up to the track's own limits. At either
   * end we deliberately do NOT preventDefault, so the wheel event
   * falls through to normal page scroll instead of trapping the user.
   *
   * React's synthetic onWheel is registered passive, which silently
   * no-ops preventDefault, so this needs a real native listener.
   */
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const onWheelNative = (e) => {
      const dy = Math.abs(e.deltaY)
      const dx = Math.abs(e.deltaX)
      const delta = dy > dx ? e.deltaY : e.deltaX
      const current = x.get()
      const next = Math.min(0, Math.max(-maxDrag, current - delta))
      if (next === current) return
      e.preventDefault()
      x.set(next)
    }

    el.addEventListener('wheel', onWheelNative, { passive: false })
    return () => el.removeEventListener('wheel', onWheelNative)
  }, [maxDrag, x])

  return (
    <div className="process-carousel">
      <div className="process-viewport" ref={viewportRef}>
        <motion.div
          className="process-track"
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.06}
          dragTransition={{ power: 0.28, timeConstant: 180 }}
          style={{ x }}
        >
          {steps.map((s) => (
            <article className="process-step" key={s.n}>
              <span className="process-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </motion.div>
      </div>

      <div className="process-controls">
        <div className="process-progress" aria-hidden="true">
          <motion.span style={{ width: progress }} />
        </div>
        <div className="process-arrows">
          <button
            type="button"
            className="process-arrow"
            aria-label="Previous steps"
            onClick={() => nudge(1)}
          >
            &#8592;
          </button>
          <button
            type="button"
            className="process-arrow"
            aria-label="Next steps"
            onClick={() => nudge(-1)}
          >
            &#8594;
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Process() {
  const reduce = useReducedMotion()

  return (
    <section className="process section" id="process">
      <div className="container">
        <Reveal>
          <h2 className="section-title">How we work</h2>
          <p className="section-sub">
            A clear six-step process, from first conversation to ongoing improvement.
          </p>
        </Reveal>
      </div>

      {/* Desktop draggable track */}
      {!reduce && (
        <div className="process-desktop">
          <DragTrack />
        </div>
      )}

      {/* Mobile + reduced-motion vertical timeline */}
      <div className={`process-mobile ${reduce ? 'is-forced' : ''}`}>
        <div className="container">
          <ol className="process-list">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.05}>
                <span className="process-n">{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
