import { motion, useReducedMotion } from 'framer-motion'
import StorySection from './StorySection.jsx'
import Reveal from './Reveal.jsx'
import MagneticButton from './MagneticButton.jsx'
import './stackscout.css'

/*
 * StackScout — StackCorp's internal, proof-of-capability case study: an
 * autonomous lead-generation agent. Honest framing only — it's our own build,
 * not a paid client engagement; Phases 1–2 are built + tested, 3–4 are next.
 * Positioned next to Malir Cantt Bazaar as the second "proof" item so leads
 * see StackCorp builds AI workflow systems, not just websites.
 */

// The pipeline — the section's centrepiece.
const stages = [
  {
    label: 'Discover',
    tool: 'Google Maps',
    body: 'Scrape shops by city + term, then filter and dedupe the junk.',
    icon: (
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    ),
  },
  {
    label: 'Enrich',
    tool: 'Apollo.io',
    body: "Find the owner's name and verified email.",
    icon: (
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0M17.5 8.5l1.6 1.6 3-3" />
    ),
  },
  {
    label: 'Research',
    tool: 'Claude',
    body: 'Read the website, forms and reviews; pull real signals.',
    icon: (
      <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM16 16l4 4M9 11h4m-2-2v4" />
    ),
  },
  {
    label: 'Score',
    tool: 'Fit 0–10',
    body: 'Rank fit from verifiable facts; keep only strong matches.',
    icon: (
      <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 12l4-3M12 12v4.5" />
    ),
  },
  {
    label: 'Outreach prep',
    tool: 'Personalization',
    body: 'Assemble concrete, verifiable talking points for the founder.',
    icon: <path d="M21 4 3 11l6 2.5L21 4zM9 13.5V19l3.2-3.1M21 4l-4 15-4.8-4.6" />,
  },
]

const doesIt = [
  'Finds businesses from Google Maps',
  'Filters and dedupes leads',
  'Enriches owner and contact details',
  'Scrapes websites, forms and recent reviews',
  'Uses Claude to score fit and extract personalization',
  'Stores everything in Google Sheets, the source of truth',
]

const stack = ['Trigger.dev', 'TypeScript', 'Google Sheets', 'Apify', 'Apollo.io', 'Anthropic Claude', 'Zod']

const built = ['Discovery', 'Enrichment', 'AI research']
const next = ['Message drafting', 'Instantly sequencing', 'Reply classification', 'Slack alerts']

const value = [
  'Reduce manual research',
  'Organize scattered information',
  'Qualify leads faster',
  'Support personalized outreach',
  'Keep humans focused on judgment and conversations',
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

  return (
    <StorySection
      id="stackscout"
      kicker="Internal case study"
      title="StackScout: Autonomous Lead-Generation Agent"
      sub="An AI workflow system that finds, enriches, researches, and qualifies high-fit leads. It's StackCorp's own proof that we build practical AI systems and automation, not just websites."
    >
      <div className="ss2">
        {/* Problem + pull quote */}
        <div className="ss2-top">
          <Reveal className="ss2-problem">
            <span className="ss2-eyebrow">The problem</span>
            <p>
              Finding the right businesses means searching city by city, checking websites,
              reading reviews, hunting for owner details, and writing personalized outreach.
              That's 20 to 30 minutes per lead, and many still turn out unqualified.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="ss2-quote">
            <p>
              “Most businesses don't just need more tools. They need systems that turn scattered
              manual work into a <strong>repeatable workflow</strong>.”
            </p>
          </Reveal>
        </div>

        {/* System — the pipeline */}
        <div className="ss2-flow">
          <span className="ss2-eyebrow ss2-flow-label">The system</span>
          <ol className="ss2-pipe">
            {stages.map((s, i) => (
              <motion.li
                key={s.label}
                className="ss2-node"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="ss2-node-icon">
                  <Glyph>{s.icon}</Glyph>
                </span>
                <span className="ss2-node-step">{String(i + 1).padStart(2, '0')}</span>
                <span className="ss2-node-label">{s.label}</span>
                <span className="ss2-node-tool">{s.tool}</span>
                <span className="ss2-node-body">{s.body}</span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* What it does + Stack */}
        <div className="ss2-cols">
          <Reveal className="ss2-panel">
            <h3>What it does</h3>
            <ul className="ss2-list">
              {doesIt.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="ss2-panel">
            <h3>Stack</h3>
            <ul className="ss2-chips">
              {stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="ss2-target">
              Built to discover, research, and qualify high-fit leads before outreach, turning
              manual lead research into a repeatable pipeline.
            </p>
          </Reveal>
        </div>

        {/* Status — honest phases */}
        <Reveal className="ss2-status">
          <div className="ss2-status-col ss2-status-col--built">
            <span className="ss2-status-head">
              <span className="ss2-dot ss2-dot--on" />
              Built &amp; tested · Phases 1–2 of 4
            </span>
            <ul>
              {built.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div className="ss2-status-col ss2-status-col--next">
            <span className="ss2-status-head">
              <span className="ss2-dot" />
              Next · Phases 3–4
            </span>
            <ul>
              {next.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Business value + CTA */}
        <Reveal className="ss2-value">
          <div className="ss2-value-text">
            <h3>What this proves</h3>
            <ul className="ss2-list ss2-list--value">
              {value.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
          <div className="ss2-cta">
            <p>Want a system like this for your business?</p>
            <MagneticButton href="#contact" className="btn btn-primary">
              Request a Free Audit
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </StorySection>
  )
}
