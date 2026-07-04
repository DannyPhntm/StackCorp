import Reveal from '../components/Reveal.jsx'
import './founders.css'

const founders = [
  {
    name: 'Daniyal Ali',
    role: 'Co-Founder, Strategy & Product',
    img: '/assets/founders/daniyal-ali-cutout.png',
    bio: 'Daniyal is a BSc Management Science student at LUMS with interests in digital strategy, business, product, and building practical systems for companies. He focuses on understanding client needs, positioning, user experience, and turning business problems into clear digital solutions.',
  },
  {
    name: 'Affan',
    role: 'Co-Founder, Technology & Systems',
    img: '/assets/founders/affan-cutout.png',
    tall: true,
    bio: 'Affan focuses on the technical side of StackCorp, including websites, systems, automation workflows, and implementation. He works on turning ideas and client requirements into reliable digital products.',
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
                <p className="fd-bio">{f.bio}</p>
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
