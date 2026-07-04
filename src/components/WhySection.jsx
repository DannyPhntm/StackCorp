import Reveal from './Reveal.jsx'
import './why.css'

const reasons = [
  'Practical systems, not tech hype',
  'Business thinking with technical execution',
  'Mobile-first experiences for real users',
  'We start with the problem before choosing the tool',
  'Improvement and support after launch',
]

export default function WhySection() {
  return (
    <section className="section" id="why">
      <div className="container why-inner">
        <Reveal>
          <h2 className="section-title">Why StackCorp?</h2>
        </Reveal>
        <ol className="why-list">
          {reasons.map((r, i) => (
            <Reveal as="li" key={r} delay={i * 0.05}>
              <span className="why-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="why-text">{r}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
