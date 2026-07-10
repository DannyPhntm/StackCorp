import { useEffect, useState } from 'react'
import Reveal from './Reveal.jsx'
import './story.css'
import './work.css'

const features = [
  'User accounts',
  'Listings and image uploads',
  'Business verification',
  'Shops directory',
  'Admin moderation',
  'Email/contact systems',
  'Production deployment',
]

const flow = ['Users', 'Listings', 'Shops', 'Verification', 'Admin', 'Deployment']

// Same-origin serverless proxy by default (see api/mcb-stats.js); override
// with VITE_MCB_STATS_URL for local dev or a different deployment.
const STATS_URL = import.meta.env.VITE_MCB_STATS_URL || '/api/mcb-stats'
const FETCH_TIMEOUT_MS = 8000

const STAT_LABELS = [
  { key: 'activeListings', label: 'Active listings' },
  { key: 'verifiedBusinesses', label: 'Verified businesses' },
  { key: 'categories', label: 'Marketplace categories' },
]

function useLiveStats() {
  const [state, setState] = useState({ status: 'loading', stats: null })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(STATS_URL, {
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error(`stats responded ${res.status}`)
        const data = await res.json()
        const valid = STAT_LABELS.every(
          ({ key }) => Number.isInteger(data[key]) && data[key] >= 0,
        )
        if (!valid) throw new Error('stats response malformed')
        if (!cancelled) setState({ status: 'ready', stats: data })
      } catch {
        if (!cancelled) setState({ status: 'error', stats: null })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

function LiveStats() {
  const { status, stats } = useLiveStats()

  // Never show placeholder or fake numbers: on failure the strip collapses
  // to a single honest line and the case study stands on its own.
  if (status === 'error') {
    return (
      <div className="work-stats work-stats--unavailable" role="status">
        Live stats temporarily unavailable
      </div>
    )
  }

  return (
    <div className="work-stats" role="status" aria-live="polite">
      <div className="work-stats-head">
        <span className="work-live-dot" aria-hidden="true" />
        <span className="work-stats-title">
          {status === 'loading' ? 'Loading live marketplace stats…' : 'Live from the marketplace'}
        </span>
      </div>
      <div className="work-stats-grid">
        {STAT_LABELS.map(({ key, label }) => (
          <div className="work-stat" key={key}>
            {status === 'loading' ? (
              <span className="work-stat-skeleton" aria-hidden="true" />
            ) : (
              <span className="work-stat-value">{stats[key].toLocaleString('en-US')}</span>
            )}
            <span className="work-stat-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Work() {
  return (
    <section className="section story-section work" id="work">
      <div className="container">
        <Reveal className="story-head">
          <span className="story-node" aria-hidden="true">
            <span className="story-node-top" />
            <span className="story-node-mid" />
            <span className="story-node-bot" />
          </span>
          <div className="story-head-text">
            <p className="story-kicker">
              <b>03</b>Proof of work
            </p>
            <h2 className="section-title">First live product: Malir Cantt Bazaar</h2>
            <p className="section-sub story-sub">
              Malir Cantt Bazaar is a local marketplace and shops directory built for
              residents and businesses in Malir Cantt.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="work-panel card">
          <div className="work-flow" aria-label="System components of Malir Cantt Bazaar">
            {flow.map((step, i) => (
              <div className="work-flow-step" key={step}>
                <span className="work-node">{step}</span>
                {i < flow.length - 1 && <span className="work-link" aria-hidden="true" />}
              </div>
            ))}
          </div>

          <ul className="work-features">
            {features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <LiveStats />

          <a
            className="btn btn-primary work-cta"
            href="https://malircanttbazaar.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Live Project
          </a>
        </Reveal>
      </div>
    </section>
  )
}
