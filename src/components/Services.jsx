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
]

function LayerGlyph({ count }) {
  /* Small stacked-bars glyph: the "stack" motif, one bar per layer. */
  return (
    <div className="svc-glyph" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ width: `${100 - i * 14}%` }} />
      ))}
    </div>
  )
}

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <Reveal>
          <h2 className="section-title">What we build</h2>
        </Reveal>
        <div className="svc-grid">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07} className={`card svc-card svc-${i}`}>
              <LayerGlyph count={s.layers} />
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
