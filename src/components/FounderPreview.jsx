import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import './founderpreview.css'

const founders = [
  {
    name: 'Daniyal Ali',
    role: 'Co-Founder, Strategy & Product',
    img: '/assets/founders/daniyal-ali-cutout.png',
    linkedin: 'https://www.linkedin.com/in/daniyal-ali-846681395/?isSelfProfile=false',
  },
  {
    name: 'Muhammad Affan Athar',
    role: 'Co-Founder, Technology & Systems',
    img: '/assets/founders/affan-cutout.png',
    tall: true,
    linkedin: 'https://www.linkedin.com/in/affan-athar-a3a7b6291/?isSelfProfile=false',
  },
]

export default function FounderPreview() {
  return (
    <section className="section founders-preview" id="founders">
      <div className="container">
        <div className="fp-layout">
          <Reveal className="fp-copy">
            <h2 className="section-title">Founder-led, practical, and close to the work.</h2>
            <p className="section-sub">
              StackCorp is built by founders who care about business problems, clean
              design, and systems that actually work in the real world.
            </p>
            <Link to="/founders" className="btn btn-ghost fp-cta">
              Meet the founders
            </Link>
          </Reveal>

          <div className="fp-cards">
            {founders.map((f, i) => (
              <Reveal key={f.name} delay={0.1 + i * 0.12} className="card fp-card">
                <div className="fp-photo">
                  <img
                    src={f.img}
                    alt={`${f.name}, ${f.role} of StackCorp`}
                    loading="lazy"
                    className={f.tall ? 'is-tall' : undefined}
                  />
                </div>
                <h3>{f.name}</h3>
                <p>{f.role}</p>
                <a
                  href={f.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fp-linkedin-cta"
                >
                  View LinkedIn ↗
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
