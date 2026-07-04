import Reveal from './Reveal.jsx'
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

export default function Work() {
  return (
    <section className="section work" id="work">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Proof of work</span>
          <h2 className="section-title">First live product: Malir Cantt Bazaar</h2>
          <p className="section-sub">
            Malir Cantt Bazaar is a local marketplace and shops directory built for
            residents and businesses in Malir Cantt.
          </p>
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
