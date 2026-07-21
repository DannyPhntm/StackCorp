import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import Reveal from '../components/Reveal.jsx'
import './founders.css'

const founders = [
  {
    name: 'Daniyal Ali',
    role: 'Co-Founder, Strategy & Product',
    img: '/assets/founders/daniyal-ali-cutout.png',
    linkedin: 'https://www.linkedin.com/in/daniyal-ali-846681395/?isSelfProfile=false',
    // Per-founder photo framing so both faces sit level and read at the same
    // size despite the source crops differing (Daniyal is head-to-waist; Affan
    // is a full-body graduation shot). `ph` = image height vs. panel; `py` =
    // vertical nudge (px) to seat the face on the shared line.
    frame: { ph: '152%', py: '14px' },
    bio: [
      "Business has always fascinated me, not just how companies operate, but why some grow while others don't. I'm passionate about building practical AI solutions that solve real business problems, and documenting the journey of turning StackCorp into a company that proudly represents Pakistan on a global stage.",
    ],
    focus: ['Strategy', 'Product Thinking', 'Digital Marketing', 'Positioning'],
  },
  {
    name: 'Muhammad Affan Athar',
    role: 'Co-Founder, Technology & Systems',
    img: '/assets/founders/affan-cutout.png',
    linkedin: 'https://www.linkedin.com/in/muhammad-affan-athar-a3a7b6291',
    frame: { ph: '132%', py: '40px' },
    bio: [
      "A builder at heart, I love learning by creating. From freelancing in design to engineering AI-powered systems, I'm passionate about turning ideas into products that solve real problems and deliver measurable value.",
    ],
    focus: ['Websites', 'Systems', 'Automation', 'Implementation'],
  },
]

const approach = [
  'Understand the business first',
  'Build only what is useful',
  'Keep systems clean and maintainable',
  'Improve after launch',
]

/*
 * FounderCard — one founder as a card in the deck. The two cards start gathered
 * toward the centre (a stacked pair) and fan out to their layout as the section
 * enters, one after the other (stagger). Only transform + opacity animate — no
 * per-frame blur — and the driving progress is spring-smoothed, so the open
 * eases in smoothly rather than snapping to raw scroll.
 */
function FounderCard({ progress, i, n, dx, dy, tilt, reduce, children }) {
  const start = i * 0.14
  const lp = useTransform(progress, [start, start + 0.62], [0, 1], { clamp: true })

  const x = useTransform(lp, (v) => dx * (1 - v))
  const y = useTransform(lp, (v) => dy * (1 - v))
  const rotate = useTransform(lp, (v) => tilt * (1 - v))
  const scale = useTransform(lp, [0, 1], [0.92, 1])
  const opacity = useTransform(lp, [0, 0.8], [0.2, 1])

  const style = reduce ? undefined : { x, y, rotate, scale, opacity, zIndex: n - i }

  return (
    <motion.article className="card fd-card" style={style}>
      {children}
    </motion.article>
  )
}

export default function Founders() {
  const reduce = useReducedMotion()
  const gridRef = useRef(null)

  const [cols, setCols] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= 900 ? 1 : 2,
  )
  useEffect(() => {
    const calc = () => setCols(window.innerWidth <= 900 ? 1 : 2)
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const { scrollYProgress } = useScroll({
    target: gridRef,
    // Wider scroll window so the deck opens more gradually as you scroll in.
    offset: ['start 0.95', 'start 0.3'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.0004 })

  const n = founders.length
  const rows = Math.ceil(n / cols)
  const centerCol = (cols - 1) / 2
  const centerRow = (rows - 1) / 2

  return (
    <main className="founders-page">
      <section className="section founders-hero">
        <div className="grid-bg" aria-hidden="true" />
        <div className="container">
          <Reveal>
            <h1 className="section-title founders-title">
              Meet the founders building StackCorp.
            </h1>
            <p className="section-sub">
              We're building StackCorp to help businesses use websites, strategy,
              automation, and digital systems in practical ways.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section founders-cards">
        <div className="container fd-grid" ref={gridRef}>
          {founders.map((f, i) => {
            const col = i % cols
            const row = Math.floor(i / cols)
            const dx = (centerCol - col) * (cols === 2 ? 90 : 0)
            const dy = (centerRow - row) * (cols === 2 ? 0 : 64)
            const tilt = cols === 2 ? (col - centerCol) * -3.2 : 0
            return (
              <FounderCard
                key={f.name}
                progress={progress}
                i={i}
                n={n}
                dx={dx}
                dy={dy}
                tilt={tilt}
                reduce={reduce}
              >
                <div className="fd-photo">
                  <img
                    src={f.img}
                    alt={`${f.name}, ${f.role} of StackCorp`}
                    style={{ '--ph': f.frame.ph, '--py': f.frame.py }}
                  />
                </div>
                <div className="fd-body">
                  <h2>{f.name}</h2>
                  <p className="fd-role">{f.role}</p>
                  {f.bio.map((paragraph, pi) => (
                    <p className="fd-bio" key={pi}>
                      {paragraph}
                    </p>
                  ))}
                  <ul className="fd-focus">
                    {f.focus.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <span className="fd-linkedin-cta">View LinkedIn ↗</span>
                </div>
                {/* Full-card link — the whole card opens the founder's LinkedIn
                    in a new tab (overlay above photo + body). */}
                <a
                  className="fd-cardlink"
                  href={f.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${f.name} on LinkedIn`}
                />
              </FounderCard>
            )
          })}
        </div>
      </section>

      <section className="section founders-approach">
        <div className="container">
          <Reveal>
            <h2 className="section-title">Our approach</h2>
          </Reveal>
          <div className="fd-approach-grid">
            {approach.map((a, i) => (
              <Reveal key={a} delay={i * 0.06} className="fd-approach-item">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <p>{a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section founders-cta">
        <div className="container">
          <Reveal className="fd-cta-box">
            <h2 className="section-title">Ready to see what your business can improve?</h2>
            <a href="/#contact" className="btn btn-primary" data-haptic="confirm">
              Request a Free Audit
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
