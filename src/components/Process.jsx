import { useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion'
import Reveal from './Reveal.jsx'
import './story.css'
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

/*
 * Mobile scroll-driven stepper. A sticky stage shows one step at a time; the
 * active step advances as the page scrolls through the (reasonably tall) track.
 * One rAF-throttled scroll listener drives it — no scroll-jacking, no
 * preventDefault, so native vertical scroll always continues and the section
 * can never trap the user. Only transform/opacity animate.
 */
function MobileStepper() {
  const trackRef = useRef(null)
  const barRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    const update = () => {
      raf = 0
      const stageH = window.innerHeight
      const dist = track.offsetHeight - stageH
      const scrolled = -track.getBoundingClientRect().top
      const p = dist > 0 ? Math.min(1, Math.max(0, scrolled / dist)) : 0
      // Progress bar fills from one step's worth to full across the track.
      if (barRef.current) {
        const frac = 1 / steps.length + p * (1 - 1 / steps.length)
        barRef.current.style.transform = `scaleX(${frac.toFixed(4)})`
      }
      const idx = Math.min(steps.length - 1, Math.floor(p * steps.length))
      setActive((prev) => (prev === idx ? prev : idx))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="process-scroll" ref={trackRef}>
      <div className="process-stage">
        <div className="container process-stage-inner">
          <div className="process-stage-meta">
            <span className="process-stage-count">
              <span className="process-counter-current">
                {String(active + 1).padStart(2, '0')}
              </span>
              {' / '}
              {String(steps.length).padStart(2, '0')}
            </span>
            <span className="process-stage-bar" aria-hidden="true">
              <span ref={barRef} />
            </span>
          </div>
          <div className="process-stage-items">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`process-stage-item ${i === active ? 'is-active' : ''}`}
                aria-hidden={i !== active}
              >
                <span className="process-stage-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const head = (
  <div className="container">
    <Reveal className="story-head">
      <span className="story-node" aria-hidden="true">
        <span className="story-node-top" />
        <span className="story-node-mid" />
        <span className="story-node-bot" />
      </span>
      <div className="story-head-text">
        <p className="story-kicker">How we work</p>
        <h2 className="section-title">A clear path, first call to launch.</h2>
        <p className="section-sub story-sub">
          A six-step process, from first conversation to ongoing improvement.
        </p>
      </div>
    </Reveal>
  </div>
)

const query = (q) => (typeof window !== 'undefined' ? window.matchMedia(q) : null)

function computeMode() {
  if (query('(prefers-reduced-motion: reduce)')?.matches) return 'static'
  return query('(min-width: 901px)')?.matches ? 'desktop' : 'mobile'
}

export default function Process() {
  const [mode, setMode] = useState(computeMode)

  useEffect(() => {
    const queries = [query('(prefers-reduced-motion: reduce)'), query('(min-width: 901px)')]
    const onChange = () => setMode(computeMode())
    queries.forEach((q) => q?.addEventListener('change', onChange))
    return () => queries.forEach((q) => q?.removeEventListener('change', onChange))
  }, [])

  return (
    <section className="process section story-section" id="process">
      {head}

      {mode === 'desktop' && (
        <div className="process-desktop">
          <DragTrack />
        </div>
      )}

      {mode === 'mobile' && <MobileStepper />}

      {mode === 'static' && (
        <div className="process-mobile is-forced">
          <div className="container">
            <ol className="process-list">
              {steps.map((s) => (
                <li key={s.n}>
                  <span className="process-n">{s.n}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </section>
  )
}
