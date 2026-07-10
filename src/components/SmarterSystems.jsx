import { motion, useReducedMotion } from 'framer-motion'
import StorySection from './StorySection.jsx'
import './smartersystems.css'

/*
 * "Smarter systems. Real business use." — a bento of practical, honest use
 * cases. No metrics, no robot imagery: just the everyday work a better system
 * takes off a business owner's plate. The lead tile carries a small inline
 * flow diagram (inquiry → tracked → follow-up) to anchor the idea.
 */
const tiles = [
  {
    key: 'inquiry',
    span: 'lead',
    title: 'One inbox for every inquiry',
    body: 'Calls, forms, and messages land in one place, so nothing slips through the cracks.',
  },
  { key: 'leads', title: 'Lead tracking', body: 'See where each inquiry stands, from first contact to closed.' },
  { key: 'followup', title: 'Automated follow-ups', body: 'Timely replies go out on their own, without manual chasing.' },
  { key: 'faq', title: 'Customer FAQs', body: 'Common questions answered instantly, day or night.' },
  { key: 'dash', title: 'Internal dashboards', body: 'The numbers that matter, at a glance, not buried in spreadsheets.' },
  { key: 'workflow', title: 'Workflow clarity', body: 'Who does what, and when, so work moves without confusion.' },
  { key: 'admin', title: 'Less repetitive admin', body: 'Automate the copy-paste work and free up real hours.' },
  { key: 'maintain', span: 'wide', title: 'Maintenance after launch', body: 'We keep it running and improving as the business grows, not left to rot after handoff.' },
]

function FlowDiagram() {
  /* Inquiry → Tracked → Follow-up. Static line, palette only. */
  return (
    <svg className="ss-flow" viewBox="0 0 260 60" fill="none" aria-hidden="true">
      <line x1="30" y1="30" x2="130" y2="30" stroke="var(--line-strong)" strokeWidth="1.5" strokeDasharray="4 5" />
      <line x1="130" y1="30" x2="230" y2="30" stroke="var(--line-strong)" strokeWidth="1.5" strokeDasharray="4 5" />
      {[30, 130, 230].map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy="30" r="11" fill="var(--surface-2)" stroke="var(--accent-strong)" strokeWidth="1.5" />
          <circle cx={cx} cy="30" r="4" fill={i === 1 ? 'var(--logo-blue-hi)' : 'var(--accent-strong)'} />
        </g>
      ))}
      <text x="30" y="54" className="ss-flow-label" textAnchor="middle">Inquiry</text>
      <text x="130" y="54" className="ss-flow-label" textAnchor="middle">Tracked</text>
      <text x="230" y="54" className="ss-flow-label" textAnchor="middle">Follow-up</text>
    </svg>
  )
}

export default function SmarterSystems() {
  const reduce = useReducedMotion()

  return (
    <StorySection
      id="systems"
      kicker="Why it matters"
      title="Smarter systems. Real business use."
      sub="You may not need “AI”. You need less manual work and a clearer picture of what's happening. Here's where better systems actually help."
    >
      <div className="ss-bento">
        {tiles.map((t, i) => (
          <motion.div
            key={t.key}
            className={`ss-tile ${t.span === 'lead' ? 'ss-tile--lead' : ''} ${
              t.span === 'wide' ? 'ss-tile--wide' : ''
            }`}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.span === 'lead' && <FlowDiagram />}
            <div className="ss-tile-text">
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </StorySection>
  )
}
