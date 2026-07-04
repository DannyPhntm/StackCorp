import Reveal from '../components/Reveal.jsx'
import './founders.css'

const founders = [
  {
    name: 'Daniyal Ali',
    role: 'Co-Founder, Strategy & Product',
    img: '/assets/founders/daniyal-ali-cutout.png',
    linkedin: 'https://www.linkedin.com/in/daniyal-ali-846681395/?isSelfProfile=false',
    bio: [
      'Daniyal is a BSc Management Science student at LUMS and Co-Founder of StackCorp. His work sits at the intersection of business, digital strategy, product thinking, and practical technology.',
      'Before StackCorp, he explored digital marketing, content, and strategy through student societies and independent projects. He is now focused on helping businesses turn scattered ideas, weak online presence, and manual workflows into cleaner digital systems.',
      'At StackCorp, Daniyal works closely with clients to understand the business problem first — then shapes the positioning, user experience, and product direction around what will actually help.',
    ],
  },
  {
    name: 'Muhammad Affan Athar',
    role: 'Co-Founder, Technology & Systems',
    img: '/assets/founders/affan-cutout.png',
    tall: true,
    linkedin: 'https://www.linkedin.com/in/affan-athar-a3a7b6291/?isSelfProfile=false',
    bio: [
      'Affan focuses on the technical side of StackCorp, including websites, systems, automation workflows, and implementation. He works on turning ideas and client requirements into reliable digital products.',
    ],
  },
]

const approach = [
  'Understand the business first',
  'Build only what is useful',
  'Keep systems clean and maintainable',
  'Improve after launch',
]

export default function Founders() {
  return (
    <main className="founders-page">
      <section className="section founders-hero">
        <div className="grid-bg" aria-hidden="true" />
        <div className="container">
          <Reveal>
            <h1 className="section-title founders-title">
              Meet the founders building StackCorp.
            </h1>
            <p className="section-sub">
              We're building StackCorp to help businesses use websites, strategy,
              automation, and digital systems in practical ways.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section founders-cards">
        <div className="container fd-grid">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.14} className="card fd-card">
              <div className="fd-photo">
                <img
                  src={f.img}
                  alt={`${f.name}, ${f.role} of StackCorp`}
                  className={f.tall ? 'is-tall' : undefined}
                />
              </div>
              <div className="fd-body">
                <h2>{f.name}</h2>
                <p className="fd-role">{f.role}</p>
                {f.bio.map((paragraph, pi) => (
                  <p className="fd-bio" key={pi}>
                    {paragraph}
                  </p>
                ))}
                {/* Stretched link: the whole card is clickable, but the
                    accessible name stays short ("View LinkedIn") instead
                    of swallowing the bio into one giant link label. */}
                <a
                  href={f.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fd-linkedin-cta"
                >
                  View LinkedIn ↗
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section founders-approach">
        <div className="container">
          <Reveal>
            <h2 className="section-title">Our approach</h2>
          </Reveal>
          <div className="fd-approach-grid">
            {approach.map((a, i) => (
              <Reveal key={a} delay={i * 0.06} className="fd-approach-item">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <p>{a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section founders-cta">
        <div className="container">
          <Reveal className="fd-cta-box">
            <h2 className="section-title">Ready to see what your business can improve?</h2>
            <a href="/#contact" className="btn btn-primary">
              Request a Free Audit
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
