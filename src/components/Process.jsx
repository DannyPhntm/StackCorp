import { useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
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
  const [current, setCurrent] = useState(0)
  const x = useMotionValue(0)
  const progress = useTransform(x, [0, -Math.max(maxDrag, 1)], ['6%', '100%'])

  /* Map the drag fraction onto the step range for the counter, and
     track the exact ends so the arrows can disable. */
  const [ends, setEnds] = useState({ start: true, end: false })
  useMotionValueEvent(x, 'change', (v) => {
    const fraction = maxDrag > 0 ? Math.min(1, Math.max(0, -v / maxDrag)) : 0
    setCurrent(Math.round(fraction * (steps.length - 1)))
    setEnds({ start: -v <= 2, end: maxDrag > 0 && -v >= maxDrag - 2 })
  })

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
   * Horizontal trackpad swipes (deltaX) pan the track — that gesture
   * already means "move sideways", so consuming it is expected and we
   * preventDefault only then (also stops browser back/forward swipe).
   * Vertical wheel/trackpad scrolling is NEVER captured: deltaY always
   * falls through to normal page scroll, so the section cannot trap.
   *
   * React's synthetic onWheel is registered passive, which silently
   * no-ops preventDefault, so this needs a real native listener.
   */
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const onWheelNative = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      const current = x.get()
      const next = Math.min(0, Math.max(-maxDrag, current - e.deltaX))
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
        <span className="process-counter" aria-live="polite">
          <span className="process-counter-current">
            {String(current + 1).padStart(2, '0')}
          </span>
          {' / '}
          {String(steps.length).padStart(2, '0')}
        </span>
        <div className="process-progress" aria-hidden="true">
          <motion.span style={{ width: progress }} />
        </div>
        <div className="process-arrows">
          <button
            type="button"
            className="process-arrow"
            aria-label="Previous steps"
            disabled={ends.start}
            onClick={() => nudge(1)}
          >
            &#8592;
          </button>
          <button
            type="button"
            className="process-arrow"
            aria-label="Next steps"
            disabled={ends.end}
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
