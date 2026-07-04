import { useState } from 'react'
import Reveal from './Reveal.jsx'
import './contact.css'

const EMAIL = 'stackcorp7@gmail.com'

const helpOptions = [
  'Website',
  'Digital Strategy',
  'AI & Automation',
  'Business System',
  'Not sure yet',
]

/*
 * No form backend exists yet. Submitting composes a prefilled email in the
 * visitor's mail app (mailto). This is stated in the UI so the behavior is
 * honest. Swap for a real endpoint later without changing the fields.
 */
export default function Contact() {
  const [fields, setFields] = useState({
    name: '',
    business: '',
    phone: '',
    email: '',
    help: '',
    message: '',
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => {
    setFields({ ...fields, [key]: e.target.value })
    if (error) setError('')
  }

  const submit = (e) => {
    e.preventDefault()
    if (!fields.name.trim() || !fields.email.trim()) {
      setError('Please add your name and email so we can reply to you.')
      return
    }
    const subject = encodeURIComponent(`Free audit request from ${fields.name}`)
    const body = encodeURIComponent(
      [
        `Name: ${fields.name}`,
        `Business: ${fields.business || '(not provided)'}`,
        `Phone/WhatsApp: ${fields.phone || '(not provided)'}`,
        `Email: ${fields.email}`,
        `Needs help with: ${fields.help || '(not selected)'}`,
        '',
        fields.message,
      ].join('\n'),
    )
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <section className="section contact" id="contact">
      <div className="grid-bg" aria-hidden="true" />
      <div className="container contact-inner">
        <Reveal className="contact-copy">
          <h2 className="section-title">Request a free audit.</h2>
          <p className="section-sub">
            Tell us about your business and we'll suggest practical ways to improve
            your website, customer flow, or internal systems.
          </p>
          <ul className="contact-channels">
            <li>
              <span>Email</span>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
            <li>
              <span>LinkedIn</span>
              <em>Company page coming soon</em>
            </li>
            <li>
              <span>WhatsApp</span>
              <em>Number coming soon</em>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.12} className="contact-form card">
          <form onSubmit={submit} noValidate>
            <div className="cf-row">
              <label>
                Name
                <input
                  type="text"
                  value={fields.name}
                  onChange={set('name')}
                  autoComplete="name"
                  required
                />
              </label>
              <label>
                Business name
                <input
                  type="text"
                  value={fields.business}
                  onChange={set('business')}
                  autoComplete="organization"
                />
              </label>
            </div>
            <div className="cf-row">
              <label>
                Phone/WhatsApp
                <input
                  type="tel"
                  value={fields.phone}
                  onChange={set('phone')}
                  autoComplete="tel"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={fields.email}
                  onChange={set('email')}
                  autoComplete="email"
                  required
                />
              </label>
            </div>
            <label>
              What do you need help with?
              <select value={fields.help} onChange={set('help')}>
                <option value="">Select an option</option>
                {helpOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Message
              <textarea rows={5} value={fields.message} onChange={set('message')} />
            </label>

            {error && (
              <p className="cf-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary cf-submit">
              Request a Free Audit
            </button>
            <p className="cf-note">
              Submitting opens a prefilled email to {EMAIL} in your mail app.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
