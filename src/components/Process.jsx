import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Reveal from './Reveal.jsx'
import './story.css'
import './process.css'

/*
 * "How we work" — a two-track delivery process shown as a scroll-illuminated
 * vertical timeline. A segmented toggle switches between the Website and AI
 * workflows. As the page scrolls, each step lights up in turn: reached steps
 * stay illuminated, upcoming steps stay muted, and a rail fills alongside.
 *
 * Motion is gentle (colour + opacity only, no transforms that fight scroll) and
 * fully driven by native scroll — nothing is pinned or hijacked, so the section
 * can never trap the page. Reduced motion renders every step lit and static.
 *
 * Approval stages are flagged so prospects see the built-in client sign-off
 * gates. The trust statement at the end frames the whole thing as a repeatable
 * delivery process, not one-off building.
 */

// Small premium line icons (currentColor, 1.6 stroke). Kept inline so the
// section stays self-contained — no icon dependency, no extra network request.
const Icon = ({ name }) => {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  switch (name) {
    case 'discovery':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
      )
    case 'mood':
      return (
        <svg {...common}>
          <path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.9 2-2a2 2 0 0 1 2-2h1.5A3.5 3.5 0 0 0 21 12 9 9 0 0 0 12 3Z" />
          <circle cx="7.5" cy="10.5" r="1" />
          <circle cx="12" cy="7.5" r="1" />
          <circle cx="16.5" cy="10.5" r="1" />
        </svg>
      )
    case 'sitemap':
      return (
        <svg {...common}>
          <rect x="9.5" y="3" width="5" height="4" rx="1" />
          <rect x="3.5" y="17" width="5" height="4" rx="1" />
          <rect x="15.5" y="17" width="5" height="4" rx="1" />
          <path d="M12 7v4m0 0H6v6m6-6h6v6" />
        </svg>
      )
    case 'wireframe':
      return (
        <svg {...common}>
          <rect x="3.5" y="4" width="17" height="16" rx="2" />
          <path d="M3.5 9h17M9 9v11" />
        </svg>
      )
    case 'style':
      return (
        <svg {...common}>
          <path d="M4 20h16M7 16l4-11 4 11M8.4 12.5h5.2" />
        </svg>
      )
    case 'design':
      return (
        <svg {...common}>
          <path d="M15.5 4.5 19.5 8.5 8.5 19.5 4 20l.5-4.5Z" />
          <path d="M13.5 6.5 17.5 10.5" />
        </svg>
      )
    case 'approve':
      return (
        <svg {...common}>
          <path d="M9 12.5 11 14.5 15.5 10" />
          <path d="M12 3.5 14 5l2.4-.6.6 2.4L19.5 8l-1 2.2 1 2.2-1.5 1.2-.6 2.4L15 15l-2 1.5-2-1.5-2.4.6-.6-2.4L4.5 12l1-2.2-1-2.2 1.5-1.2.6-2.4L9 5Z" />
        </svg>
      )
    case 'develop':
      return (
        <svg {...common}>
          <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
        </svg>
      )
    case 'qa':
      return (
        <svg {...common}>
          <path d="M12 3.5 19 6.5v5c0 4.2-2.9 7.5-7 9-4.1-1.5-7-4.8-7-9v-5Z" />
          <path d="m9 11.5 2 2 4-4" />
        </svg>
      )
    case 'launch':
      return (
        <svg {...common}>
          <path d="M12 3c3 1.4 5 4.6 5 8l-2.2 2.2H9.2L7 11c0-3.4 2-6.6 5-8Z" />
          <circle cx="12" cy="9.5" r="1.4" />
          <path d="M9.2 13.4 7 18l3-1M14.8 13.4 17 18l-3-1" />
        </svg>
      )
    case 'audit':
      return (
        <svg {...common}>
          <rect x="5" y="3.5" width="14" height="17" rx="2" />
          <path d="M9 3.5h6v2H9zM8.5 10l1.6 1.6L13 8.6" />
          <path d="M8.5 15h4" />
        </svg>
      )
    case 'solution':
      return (
        <svg {...common}>
          <circle cx="6" cy="7" r="2" />
          <circle cx="18" cy="7" r="2" />
          <circle cx="12" cy="17" r="2" />
          <path d="M8 7h8M6 9v3a2 2 0 0 0 2 2h2M18 9v3a2 2 0 0 1-2 2h-2" />
        </svg>
      )
    case 'prototype':
      return (
        <svg {...common}>
          <path d="M9 3.5h6M10 3.5v5l-4 8a2 2 0 0 0 1.8 3h8.4a2 2 0 0 0 1.8-3l-4-8v-5" />
          <path d="M7.5 15h9" />
        </svg>
      )
    case 'testing':
      return (
        <svg {...common}>
          <path d="M5 5.5h14M5 12h14M5 18.5h14" />
          <path d="m3 4.5 1 1 1.6-1.8M3 11l1 1 1.6-1.8M3 17.5l1 1 1.6-1.8" />
        </svg>
      )
    case 'optimize':
      return (
        <svg {...common}>
          <path d="M4 15l5-5 3.5 3.5L20 6" />
          <path d="M15 6h5v5" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      )
  }
}

const WEBSITE = [
  { title: 'Discovery', icon: 'discovery', body: 'Understanding the business, goals, audience and project requirements.' },
  { title: 'Mood Board', icon: 'mood', approval: true, body: 'Exploring visual direction, inspiration and brand personality.' },
  { title: 'Sitemap', icon: 'sitemap', body: 'Planning the website structure and user flow.' },
  { title: 'Wireframes', icon: 'wireframe', approval: true, body: 'Designing the layout and user experience before visuals.' },
  { title: 'Style Guide', icon: 'style', approval: true, body: 'Typography, colours, components and the overall design language.' },
  { title: 'High-Fidelity Design', icon: 'design', body: 'Designing the complete website in Figma.' },
  { title: 'Final Design Approval', icon: 'approve', approval: true, body: 'The client reviews and signs off the design before development.' },
  { title: 'Development', icon: 'develop', body: 'Building the site with performance, responsiveness and scalability in mind.' },
  { title: 'Quality Assurance', icon: 'qa', body: 'Testing every interaction, animation, responsiveness and function.' },
  { title: 'Launch', icon: 'launch', body: 'Deploying the site and monitoring post-launch performance.' },
]

const AI = [
  { title: 'Discovery', icon: 'discovery', body: 'Understanding business processes and identifying automation opportunities.' },
  { title: 'Business Audit', icon: 'audit', body: 'Reviewing current workflows and identifying bottlenecks.' },
  { title: 'Solution Design', icon: 'solution', body: 'Planning the AI agent architecture and integrations.' },
  { title: 'Prototype', icon: 'prototype', body: 'Building an initial working version.' },
  { title: 'Testing', icon: 'testing', body: 'Testing against real business scenarios.' },
  { title: 'Deployment', icon: 'launch', body: "Deploying into the client's workflow." },
  { title: 'Optimization', icon: 'optimize', body: 'Monitoring usage and continuously improving performance.' },
]

const TRACKS = {
  website: { label: 'Website projects', steps: WEBSITE },
  ai: { label: 'AI solutions', steps: AI },
}

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function Timeline({ steps }) {
  const nodeRefs = useRef([])
  // -1 = nothing reached yet; steps <= active are lit.
  const [active, setActive] = useState(() => (prefersReduced() ? steps.length - 1 : -1))

  // Refs are populated by the callback below. The whole Timeline is remounted
  // (key={tab}) when tracks switch, so the array is naturally fresh per track —
  // never reset it in render, or the stable ref callback won't repopulate it.
  const setNode = useCallback((el, i) => {
    if (el) nodeRefs.current[i] = el
  }, [])

  useEffect(() => {
    if (prefersReduced()) {
      setActive(steps.length - 1)
      return
    }
    setActive(-1)
    let raf = 0
    const update = () => {
      raf = 0
      // A step lights up once its node passes the trigger line at 66% viewport.
      const line = window.innerHeight * 0.66
      let reached = -1
      for (let i = 0; i < nodeRefs.current.length; i++) {
        const el = nodeRefs.current[i]
        if (!el) continue
        const mid = el.getBoundingClientRect().top + el.offsetHeight / 2
        if (mid <= line) reached = i
      }
      setActive((prev) => (prev === reached ? prev : reached))
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
  }, [steps])

  // Rail fill fraction: 0 at first node, 1 at last reached node.
  const fill =
    active < 0 ? 0 : steps.length > 1 ? Math.min(1, active / (steps.length - 1)) : 1

  return (
    <ol className="pw-timeline" style={{ '--pw-fill': fill }}>
      <span className="pw-rail" aria-hidden="true">
        <span className="pw-rail-fill" />
      </span>
      {steps.map((s, i) => {
        const state = i < active ? 'is-done' : i === active ? 'is-active' : 'is-next'
        return (
          <li className={`pw-step ${state}`} key={s.title} ref={(el) => setNode(el, i)}>
            <span className="pw-node" aria-hidden="true">
              <Icon name={s.icon} />
            </span>
            <div className="pw-body">
              <span className="pw-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              {s.approval && (
                <span className="pw-approve">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 12.5 4 4 10-10" />
                  </svg>
                  Approval required
                </span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default function Process() {
  const [tab, setTab] = useState('website')
  const track = TRACKS[tab]
  const approvals = useMemo(
    () => track.steps.filter((s) => s.approval).length,
    [track],
  )

  return (
    <section className="process section story-section" id="process">
      <div className="container">
        <Reveal className="story-head">
          <span className="story-node" aria-hidden="true">
            <span className="story-node-top" />
            <span className="story-node-mid" />
            <span className="story-node-bot" />
          </span>
          <div className="story-head-text">
            <p className="story-kicker">How we work</p>
            <h2 className="section-title">A structured path from idea to launch.</h2>
            <p className="section-sub story-sub">
              Every project follows a clear, repeatable process — not straight into
              development. Choose a track to see how the work moves, stage by stage.
            </p>
          </div>
        </Reveal>

        <div
          className="pw-toggle"
          role="tablist"
          aria-label="Choose a workflow"
        >
          {Object.entries(TRACKS).map(([key, t]) => (
            <button
              type="button"
              key={key}
              role="tab"
              id={`pw-tab-${key}`}
              aria-selected={tab === key}
              aria-controls={`pw-panel-${key}`}
              className={`pw-toggle-btn ${tab === key ? 'is-active' : ''}`}
              onClick={() => setTab(key)}
              data-haptic
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          className="pw-panel"
          id={`pw-panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`pw-tab-${tab}`}
        >
          <p className="pw-meta">
            <b>{String(track.steps.length).padStart(2, '0')}</b> stages
            {approvals > 0 && (
              <>
                {' · '}
                <b>{String(approvals).padStart(2, '0')}</b> client approval
                {approvals === 1 ? ' gate' : ' gates'}
              </>
            )}
          </p>

          {/* key forces a fresh Timeline (and scroll re-measure) per track. */}
          <Timeline key={tab} steps={track.steps} />
        </div>

        <p className="pw-trust">
          <span className="pw-trust-mark" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3.5 19 6.5v5c0 4.2-2.9 7.5-7 9-4.1-1.5-7-4.8-7-9v-5Z" />
              <path d="m9 11.5 2 2 4-4" />
            </svg>
          </span>
          Every project follows a structured process with multiple client approval
          stages — ensuring clarity, transparency and quality from concept to launch.
        </p>
      </div>
    </section>
  )
}
