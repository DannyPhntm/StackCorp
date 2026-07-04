import Reveal from './Reveal.jsx'
import './servicesdetail.css'

const groups = [
  {
    title: 'Website Development',
    items: [
      'Landing pages',
      'Business websites',
      'Academy, clinic, and service provider websites',
      'Marketplace and directory websites',
    ],
  },
  {
    title: 'Digital Strategy',
    items: [
      'Online presence review',
      'Customer journey review',
      'Trust and conversion review',
      'Content and positioning guidance',
    ],
  },
  {
    title: 'AI & Automation',
    items: [
      'Lead capture systems',
      'Inquiry tracking',
      'Email/WhatsApp notification flows',
      'Repetitive workflow automation',
    ],
  },
  {
    title: 'Business Systems',
    items: [
      'Dashboards',
      'Admin panels',
      'Customer portals',
      'Listing systems',
      'Booking/inquiry systems',
    ],
  },
]

export default function ServicesDetail() {
  return (
    <section className="section" id="services-detail">
      <div className="container">
        <Reveal>
          <h2 className="section-title">Services built around real business needs.</h2>
        </Reveal>
        <div className="sd-grid">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.06} className="sd-col">
              <h3>{g.title}</h3>
              <ul>
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
