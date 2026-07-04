import Reveal from './Reveal.jsx'
import './whowehelp.css'

const audiences = [
  'Tutoring academies',
  'Clinics and healthcare providers',
  'Retail shops',
  'Service businesses',
  'Real estate and property dealers',
  'Automotive businesses',
  'Local startups',
  'Community platforms',
]

export default function WhoWeHelp() {
  return (
    <section className="section who" id="who">
      <div className="container">
        <Reveal>
          <h2 className="section-title">Built for businesses ready to modernize.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="who-list">
            {audiences.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
