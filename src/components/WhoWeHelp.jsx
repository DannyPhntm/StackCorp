import Reveal from './Reveal.jsx'
import './whowehelp.css'

/*
 * Small brand-consistent glyphs, hand-drawn as inline SVG (no icon
 * library) so stroke weight, corner radius, and color stay in our
 * control and only ever use the StackCorp palette.
 */
const icons = {
  tutoring: (
    <path d="M12 4 3 8.5 12 13 21 8.5zM6.5 10.8v4.4c0 1.2 2.5 2.8 5.5 2.8s5.5-1.6 5.5-2.8v-4.4M21 8.5v6" />
  ),
  clinics: (
    <path d="M12 5v6m-3-3h6M6 4h5.2c.5 0 .9.3 1.1.7l.7 1.6c.2.4.6.7 1.1.7H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
  ),
  retail: (
    <path d="M6 8h12l-.9 10.1a2 2 0 0 1-2 1.9H8.9a2 2 0 0 1-2-1.9zM9 8V6a3 3 0 0 1 6 0v2" />
  ),
  service: (
    <path d="M14.7 6.3a3.5 3.5 0 0 1-4.6 4.6L5 16l2 2 5.1-5.1a3.5 3.5 0 0 1 4.6-4.6L14.5 10.5z" />
  ),
  realestate: (
    <path d="M4 11 12 4l8 7M6 10v9h5v-5h2v5h5v-9" />
  ),
  automotive: (
    <path d="M4.5 16.5v-3l1.8-4.5A2 2 0 0 1 8.1 7.7h7.8a2 2 0 0 1 1.8 1.3l1.8 4.5v3M4.5 16.5a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-1h6.5v1a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5M4.5 16.5v-1.2h15V16.5M7 12.3h2m6 0h2" />
  ),
  startups: (
    <path d="M12 3.5c2.4 1.3 4 3.9 4 7.2 0 2.3-.6 4.1-1.3 5.3l-.7 1.2-2-1.2-2 1.2-.7-1.2C8.6 14.8 8 13 8 10.7c0-3.3 1.6-5.9 4-7.2zM9.7 15.8 7.5 18M14.3 15.8l2.2 2.2" />
  ),
  community: (
    <path d="M8.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm7 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3.5 18c0-2.5 2.2-4.2 5-4.2s5 1.7 5 4.2m1-4.2c2.5 0 4.5 1.6 4.5 4.2" />
  ),
}

const audiences = [
  { label: 'Tutoring academies', icon: 'tutoring' },
  { label: 'Clinics and healthcare providers', icon: 'clinics' },
  { label: 'Retail shops', icon: 'retail' },
  { label: 'Service businesses', icon: 'service' },
  { label: 'Real estate and property dealers', icon: 'realestate' },
  { label: 'Automotive businesses', icon: 'automotive' },
  { label: 'Local startups', icon: 'startups' },
  { label: 'Community platforms', icon: 'community' },
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
            {audiences.map((a, i) => (
              <li key={a.label} className="who-card" style={{ '--i': i }}>
                <span className="who-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {icons[a.icon]}
                  </svg>
                </span>
                <span className="who-label">{a.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
