import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import StorySection from './StorySection.jsx'
import MagneticButton from './MagneticButton.jsx'
import './stackscout.css'

/*
 * StackScout — presented as a clean product section: concise copy + CTA on the
 * left, a calm node-based workflow visual on the right (built with real
 * HTML/CSS/SVG, no screenshots). Replaces the old five-block dashboard-style
 * composition that competed with itself.
 *
 * Honesty rule (docs/STACKCORP_DESIGN_LESSONS.md): StackScout is an internal
 * StackCorp build — the muted status line under the CTA keeps that visible.
 */

const nodes = [
  {
    title: 'Business Discovery',
    label: 'Google Maps and directories',
    icon: (
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    ),
  },
  {
    title: 'Contact Enrichment',
    label: 'Owner and contact data',
    icon: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0M17.5 8.5l1.6 1.6 3-3" />,
  },
  {
    title: 'Website Analysis',
    label: 'Site and review signals',
    icon: <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM16 16l4 4M8.5 11l1.8 1.8L14 9" />,
  },
  {
    title: 'AI Scoring',
    label: 'Lead quality and fit',
    icon: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 12l4-3M12 12v4.5" />,
  },
  {
    title: 'Outreach Insights',
    label: 'Personalised talking points',
    icon: <path d="M21 4 3 11l6 2.5L21 4zM9 13.5V19l3.2-3.1M21 4l-4 15-4.8-4.6" />,
  },
  {
    title: 'CRM Export',
    label: 'Structured lead records',
    icon: (
      <path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    ),
  },
]

function Glyph({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export default function StackScout() {
  const reduce = useReducedMotion()
  // Flips once when the workflow scrolls into view: mounts the single one-shot
  // signal dot (CSS animation, forwards fill) — after it runs the canvas is
  // fully static. No loops, no per-frame JS.
  const [live, setLive] = useState(false)

  return (
    <StorySection
      id="stackscout"
      kicker="StackScout"
      title="Turn scattered business data into qualified opportunities."
      sub="StackScout discovers businesses, enriches decision-maker information, analyses websites and customer reviews, scores lead quality, and prepares personalised outreach insights."
      className="ss3"
    >
      <div className="ss3-actions">
        <MagneticButton href="#contact" className="btn btn-primary" data-haptic="confirm">
          Explore StackScout
        </MagneticButton>
        <p className="ss3-status">
          Internal StackCorp system · discovery, enrichment and research live
        </p>
      </div>

      <div className="ss3-canvas">
        <div className="ss3-canvas-grid" aria-hidden="true" />
        <ol className="ss3-flow" aria-label="StackScout workflow">
          {nodes.map((n, i) => (
            <motion.li
              key={n.title}
              className={`ss3-step ${i === 3 ? 'is-primary' : ''}`}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
              onViewportEnter={i === 0 ? () => setLive(true) : undefined}
            >
              {/* Reveal transform lives on the li; hover lift lives on the
                  inner card so the two transforms never fight. */}
              <div className="ss3-node">
                <span className="ss3-node-icon">
                  <Glyph>{n.icon}</Glyph>
                </span>
                <span className="ss3-node-text">
                  <span className="ss3-node-title">{n.title}</span>
                  <span className="ss3-node-label">{n.label}</span>
                </span>
              </div>
            </motion.li>
          ))}
          {/* Last child on purpose: as a first child it would shift the
              steps' nth-child odd/even offsets the moment it mounts. */}
          {live && !reduce && <li className="ss3-pulse" aria-hidden="true" />}
        </ol>
      </div>
    </StorySection>
  )
}
