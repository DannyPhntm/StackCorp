import Reveal from './Reveal.jsx'
import './services.css'

const services = [
  {
    title: 'Websites',
    body: 'Clean, mobile-first websites that make your business look credible and turn visitors into inquiries.',
    layers: 3,
  },
  {
    title: 'Digital Strategy',
    body: 'We help you understand where your digital presence, customer flow, and online trust can improve.',
    layers: 2,
  },
  {
    title: 'AI & Automation',
    body: 'Practical automations for repetitive work, lead capture, inquiry tracking, notifications, and customer flows.',
    layers: 4,
  },
  {
    title: 'Business Systems',
    body: 'Dashboards, portals, directories, internal tools, and workflows built around how your business actually operates.',
    layers: 5,
  },
  {
    title: 'Lead Flow',
    body: 'Capture, track, and follow up on every inquiry so no potential customer slips through.',
    layers: 3,
  },
  {
    title: 'Dashboards',
    body: 'Live views of your inquiries, sales, and operations — in one place you actually check.',
    layers: 4,
  },
  {
    title: 'Maintenance',
    body: 'Ongoing updates, fixes, and monitoring so your website and systems stay fast and reliable.',
    layers: 2,
  },
]

/* Decorative keyword rail: duplicated list for a seamless CSS loop.
   aria-hidden — the real list of services is the grid below. Removed
   entirely under prefers-reduced-motion (see services.css). */
function ServiceRail() {
  const row = services.map((s) => s.title)
  return (
    <div className="svc-rail" aria-hidden="true">
      <div className="svc-rail-track">
        {[0, 1].map((copy) => (
          <ul className="svc-rail-row" key={copy}>
            {row.map((t) => (
              <li key={t}>
                {t}
                <span className="svc-rail-dot" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

function LayerGlyph({ count }) {
  /* Small stacked-bars glyph: the "stack" motif, one bar per layer.
     Bars are full-width and scaled down with transform so the hover
     stagger animates scaleX only (no layout work). */
  return (
    <div className="svc-glyph" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{ '--bar-scale': (100 - i * 14) / 100, '--bar-i': i }}
        />
      ))}
    </div>
  )
}

export default function Services() {
  return (
    <section className="section svc-section" id="services">
      <div className="container">
        <Reveal>
          <h2 className="section-title">What we build</h2>
        </Reveal>
      </div>

      <ServiceRail />

      <div className="container">
        <div className="svc-grid">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06} className={`card svc-card svc-${i}`}>
              <div className="svc-card-top">
                <LayerGlyph count={s.layers} />
                <span className="svc-index">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
