import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import StorySection from './StorySection.jsx'
import './services.css'

/*
 * "Empowering growth through practical AI" — the service pillars as a stacked
 * accordion. Each pillar is a layer that opens to reveal what it actually
 * covers (the old ServicesDetail lists, folded in here). One open at a time,
 * so it reads as the stack unfolding rather than a wall of cards.
 */
const pillars = [
  {
    title: 'Websites',
    tag: 'Credibility',
    body: 'Make your business look credible and turn visitors into inquiries with clean, fast, mobile-first sites.',
    items: [
      'Landing pages',
      'Business websites',
      'Academy, clinic & service-provider sites',
      'Marketplace & directory sites',
    ],
  },
  {
    title: 'Digital Strategy',
    tag: 'Clarity',
    body: 'Find where your online presence, customer flow, and trust signals can improve, before building anything.',
    items: [
      'Online presence review',
      'Customer journey review',
      'Trust & conversion review',
      'Content & positioning guidance',
    ],
  },
  {
    title: 'AI & Automation',
    tag: 'Leverage',
    body: 'Reduce repetitive work and make inquiry handling smoother with practical automation around real operations.',
    items: [
      'Lead capture systems',
      'Inquiry tracking',
      'Email / WhatsApp notification flows',
      'Repetitive workflow automation',
    ],
  },
  {
    title: 'Business Systems',
    tag: 'Operations',
    body: 'Build dashboards, portals, workflows, and tools around how your business actually operates.',
    items: [
      'Dashboards & admin panels',
      'Customer portals',
      'Listing & directory systems',
      'Booking / inquiry systems',
    ],
  },
]

export default function Services() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  // Tracks the panel a user just opened by tapping, so the glow-sweep + snap
  // play ONLY on that intentional action — never on page load (panel 0 is open
  // by default). Cleared shortly after the sweep finishes.
  const [opening, setOpening] = useState(-1)
  const dur = reduce ? 0 : 0.42

  const openPanel = (i) => {
    setActive(i)
    setOpening(i)
  }

  useEffect(() => {
    if (opening < 0) return
    const t = setTimeout(() => setOpening(-1), 720)
    return () => clearTimeout(t)
  }, [opening])

  return (
    <StorySection
      id="services"
      n="01"
      kicker="What we do"
      title="Empowering growth through practical AI."
      sub="StackCorp helps businesses use technology practically, to capture leads, cut repetitive work, and build systems around how they really operate. No hype, just outcomes."
    >
      <div className="ep-panels">
        {pillars.map((p, i) => {
          const open = active === i
          return (
            <div
              key={p.title}
              className={`ep-panel ${open ? 'is-open' : ''} ${opening === i ? 'is-opening' : ''}`}
            >
              <button
                type="button"
                className="ep-head"
                aria-expanded={open}
                onClick={() => openPanel(i)}
                data-haptic="open"
              >
                <span className="ep-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="ep-titles">
                  <span className="ep-title">{p.title}</span>
                  <span className="ep-tag">{p.tag}</span>
                </span>
                <span className="ep-plus" aria-hidden="true" />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    className="ep-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: dur, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="ep-body-inner">
                      <p className="ep-desc">{p.body}</p>
                      <ul className="ep-list">
                        {p.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </StorySection>
  )
}
