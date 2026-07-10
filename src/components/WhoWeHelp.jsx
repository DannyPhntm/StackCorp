import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import StorySection from './StorySection.jsx'
import './whowehelp.css'

/*
 * Small brand-consistent glyphs, hand-drawn as inline SVG (no icon library)
 * so stroke weight, corner radius, and color stay in our control and only ever
 * use the StackCorp palette.
 */
const icons = {
  tutoring: (
    <path d="M12 4 3 8.5 12 13 21 8.5zM6.5 10.8v4.4c0 1.2 2.5 2.8 5.5 2.8s5.5-1.6 5.5-2.8v-4.4M21 8.5v6" />
  ),
  clinics: (
    <path d="M12 5v6m-3-3h6M6 4h5.2c.5 0 .9.3 1.1.7l.7 1.6c.2.4.6.7 1.1.7H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
  ),
  retail: (
    <path d="M6 8h12l-.9 10.1a2 2 0 0 1-2 1.9H8.9a2 2 0 0 1-2-1.9zM9 8V6a3 3 0 0 1 6 0v2" />
  ),
  service: (
    <path d="M14.7 6.3a3.5 3.5 0 0 1-4.6 4.6L5 16l2 2 5.1-5.1a3.5 3.5 0 0 1 4.6-4.6L14.5 10.5z" />
  ),
  realestate: <path d="M4 11 12 4l8 7M6 10v9h5v-5h2v5h5v-9" />,
  automotive: (
    <path d="M4.5 16.5v-3l1.8-4.5A2 2 0 0 1 8.1 7.7h7.8a2 2 0 0 1 1.8 1.3l1.8 4.5v3M4.5 16.5a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-1h6.5v1a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5M4.5 16.5v-1.2h15V16.5M7 12.3h2m6 0h2" />
  ),
  startups: (
    <path d="M12 3.5c2.4 1.3 4 3.9 4 7.2 0 2.3-.6 4.1-1.3 5.3l-.7 1.2-2-1.2-2 1.2-.7-1.2C8.6 14.8 8 13 8 10.7c0-3.3 1.6-5.9 4-7.2zM9.7 15.8 7.5 18M14.3 15.8l2.2 2.2" />
  ),
  community: (
    <path d="M8.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm7 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3.5 18c0-2.5 2.2-4.2 5-4.2s5 1.7 5 4.2m1-4.2c2.5 0 4.5 1.6 4.5 4.2" />
  ),
}

const audiences = [
  { label: 'Tutoring academies', icon: 'tutoring' },
  { label: 'Clinics & healthcare', icon: 'clinics' },
  { label: 'Retail shops', icon: 'retail' },
  { label: 'Service businesses', icon: 'service' },
  { label: 'Real estate & property', icon: 'realestate' },
  { label: 'Automotive businesses', icon: 'automotive' },
  { label: 'Local startups', icon: 'startups' },
  { label: 'Community platforms', icon: 'community' },
]

// Decide behaviour synchronously so the pin height is right on first paint.
function computeMode() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'flow'
  const desktop = window.matchMedia('(min-width: 901px) and (pointer: fine)').matches
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return desktop && !reduce ? 'pin' : 'flow'
}

/*
 * StackCard — one industry card. It lives in its real grid cell the whole time
 * (so the grid never reflows), but a scroll-driven transform gathers it toward
 * the deck centre and releases it: translate → 0, rotate → 0, scale → 1,
 * blur → 0, opacity → 1. `delay` holds the deck stacked until the section is
 * covering the screen; `span` controls how slowly each card opens; `step`
 * staggers them so the deck fans out card by card.
 */
function StackCard({ progress, i, n, dx, dy, tilt, delay, step, span, reduce, children }) {
  const start = delay + i * step
  const lp = useTransform(progress, [start, start + span], [0, 1], { clamp: true })

  // Only GPU-composited properties are animated (transform + opacity) — no
  // per-frame blur/filter repaint, so the scrub stays smooth even with 8 cards.
  const x = useTransform(lp, (v) => dx * (1 - v))
  const y = useTransform(lp, (v) => dy * (1 - v))
  const rotate = useTransform(lp, (v) => tilt * (1 - v))
  const scale = useTransform(lp, [0, 1], [0.9, 1])
  const opacity = useTransform(lp, [0, 0.85], [0.25, 1])

  const style = reduce ? undefined : { x, y, rotate, scale, opacity, zIndex: n - i }

  return (
    <motion.li className="who-cell" style={style}>
      {children}
    </motion.li>
  )
}

export default function WhoWeHelp() {
  const reduce = useReducedMotion()
  const trackRef = useRef(null)

  const [mode, setMode] = useState(computeMode)
  const [cols, setCols] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= 900 ? 2 : 4,
  )
  useEffect(() => {
    const calc = () => {
      setMode(computeMode())
      setCols(window.innerWidth <= 900 ? 2 : 4)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const pin = mode === 'pin'

  // Pin: the section is sticky and fills the screen; scrolling the extra track
  // height (below) drives the open — 0 at the moment it's covered, 1 by the end.
  // Flow (mobile / reduced): a plain reveal-on-enter as the grid scrolls in.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: pin ? ['start start', 'end end'] : ['start 0.85', 'start 0.4'],
  })

  // Spring-smooth the scroll progress so the deck eases and lags slightly
  // rather than snapping 1:1 to raw scroll — the premium "scrub" feel.
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    restDelta: 0.0004,
  })

  // Pin: hold the deck stacked while the section is covering the screen
  // (delay), then open each card slowly (span) with a card-by-card stagger
  // (step). Tuned so the last card finishes just before the section unpins.
  const delay = pin ? 0.15 : 0
  const step = pin ? 0.045 : 0.05
  const span = pin ? 0.4 : 0.5

  const n = audiences.length
  const rows = Math.ceil(n / cols)
  const centerCol = (cols - 1) / 2
  const centerRow = (rows - 1) / 2
  const unitX = cols === 4 ? 150 : 60
  const unitY = cols === 4 ? 116 : 44

  const cards = (
    <ul className="who-grid">
      {audiences.map((a, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const dx = (centerCol - col) * unitX
        const dy = (centerRow - row) * unitY
        const tilt = cols === 4 ? (i - (n - 1) / 2) * 2.2 : (col - centerCol) * 3
        return (
          <StackCard
            key={a.label}
            progress={progress}
            i={i}
            n={n}
            dx={dx}
            dy={dy}
            tilt={tilt}
            delay={delay}
            step={step}
            span={span}
            reduce={reduce}
          >
            <div className="who-card">
              <span className="who-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {icons[a.icon]}
                </svg>
              </span>
              <span className="who-label">{a.label}</span>
            </div>
          </StackCard>
        )
      })}
    </ul>
  )

  const section = (
    <StorySection
      id="who"
      n="02"
      kicker="Who we help"
      title="Built for businesses ready to modernize."
      sub="Local businesses that want to look sharper, capture more inquiries, and run smoother, the industries revealed as the stack opens."
    >
      {cards}
    </StorySection>
  )

  // Pin mode wraps the section in a tall track with a sticky stage, so the
  // section pins (fills the screen) while the extra scroll opens the deck. It's
  // a sticky child of a tall wrapper — the page scrolls normally, never trapped.
  if (pin) {
    return (
      <div ref={trackRef} className="who-track">
        <div className="who-sticky">{section}</div>
      </div>
    )
  }

  return (
    <div ref={trackRef} className="who-track who-track--flow">
      {section}
    </div>
  )
}
