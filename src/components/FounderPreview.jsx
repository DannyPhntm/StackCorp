import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import StorySection from './StorySection.jsx'
import './founderpreview.css'

const founders = [
  {
    name: 'Daniyal Ali',
    role: 'Co-Founder, Strategy & Product',
    img: '/assets/founders/daniyal-ali-cutout.png',
    // Per-founder photo framing (see founders.css / founderpreview.css) so both
    // faces sit level and read at the same size despite differing source crops.
    frame: { ph: '150%', py: '8px' },
    focus: ['Strategy', 'Product', 'Positioning'],
    linkedin: 'https://www.linkedin.com/in/daniyal-ali-846681395/?isSelfProfile=false',
  },
  {
    name: 'Muhammad Affan Athar',
    role: 'Co-Founder, Technology & Systems',
    img: '/assets/founders/affan-cutout.png',
    frame: { ph: '286%', py: '4px' },
    focus: ['Websites', 'Systems', 'Automation'],
    linkedin: 'https://www.linkedin.com/in/affan-athar-a3a7b6291/?isSelfProfile=false',
  },
]

/*
 * FounderPreviewCard — one founder as a card in a two-card deck. The pair starts
 * gathered toward the centre (a stacked pair, slightly tilted) and fans out to
 * its layout as the section enters, one after the other (stagger). Only
 * transform + opacity animate and the driving progress is spring-smoothed — the
 * same "revealed from the StackCorp stack" motion as the industry cards.
 */
function FounderPreviewCard({ progress, i, n, dx, tilt, reduce, children }) {
  const start = i * 0.14
  const lp = useTransform(progress, [start, start + 0.5], [0, 1], { clamp: true })

  const x = useTransform(lp, (v) => dx * (1 - v))
  const rotate = useTransform(lp, (v) => tilt * (1 - v))
  const scale = useTransform(lp, [0, 1], [0.92, 1])
  const opacity = useTransform(lp, [0, 0.8], [0.2, 1])

  const style = reduce ? undefined : { x, rotate, scale, opacity, zIndex: n - i }

  return (
    <motion.article className="fp-card" style={style}>
      {children}
    </motion.article>
  )
}

export default function FounderPreview() {
  const reduce = useReducedMotion()
  const cardsRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: cardsRef,
    offset: ['start 0.9', 'start 0.45'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 26, restDelta: 0.0004 })

  const n = founders.length
  const centerCol = (n - 1) / 2

  return (
    <StorySection
      id="founders"
      kicker="Founders"
      title="Founder-led, practical, and close to the work."
      sub="StackCorp is built by two founders who care about business problems, clean design, and systems that actually work in the real world."
    >
      <div className="fp-cards" ref={cardsRef}>
        {founders.map((f, i) => {
          const dx = (centerCol - i) * 84
          const tilt = (i - centerCol) * -3
          return (
            <FounderPreviewCard
              key={f.name}
              progress={progress}
              i={i}
              n={n}
              dx={dx}
              tilt={tilt}
              reduce={reduce}
            >
              <div className="fp-photo">
                <img
                  src={f.img}
                  alt={`${f.name}, ${f.role} of StackCorp`}
                  loading="lazy"
                  style={{ '--ph': f.frame.ph, '--py': f.frame.py }}
                />
              </div>
              <div className="fp-info">
                <h3>{f.name}</h3>
                <p className="fp-role">{f.role}</p>
                <ul className="fp-focus">
                  {f.focus.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <a
                  href={f.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fp-linkedin-cta"
                  data-haptic="tap"
                >
                  View LinkedIn ↗
                </a>
              </div>
            </FounderPreviewCard>
          )
        })}
      </div>

      <div className="fp-foot">
        <Link to="/founders" className="btn btn-ghost" data-haptic="tap">
          Meet the founders
        </Link>
      </div>
    </StorySection>
  )
}
