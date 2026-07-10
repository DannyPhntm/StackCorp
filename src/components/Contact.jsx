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

const emptyFields = {
  name: '',
  business: '',
  phone: '',
  email: '',
  help: '',
  message: '',
  company: '', // honeypot — real visitors never see or fill this
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const [fields, setFields] = useState(emptyFields)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [error, setError] = useState('')
  const [sentEmail, setSentEmail] = useState('')

  const set = (key) => (e) => {
    setFields((f) => ({ ...f, [key]: e.target.value }))
    if (error) setError('')
    if (status === 'error') setStatus('idle')
  }

  const validate = () => {
    if (
      !fields.name.trim() ||
      !fields.business.trim() ||
      !fields.phone.trim() ||
      !fields.email.trim() ||
      !fields.help.trim() ||
      !fields.message.trim()
    ) {
      return 'Please fill in every field so we understand how to help.'
    }
    if (!EMAIL_PATTERN.test(fields.email.trim())) {
      return 'Please enter a valid email address.'
    }
    return ''
  }

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return // prevent duplicate submits

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setStatus('sending')
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setStatus('error')
        setError(data.error || 'Something went wrong. Please try again shortly.')
        return
      }

      setStatus('success')
      setSentEmail(fields.email.trim())
      setFields(emptyFields)
    } catch {
      setStatus('error')
      setError('Could not reach the server. Please check your connection and try again.')
    }
  }

  const sending = status === 'sending'

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
          {status === 'success' ? (
            <div className="cf-success" role="status">
              <h3>Thanks, that's in.</h3>
              <p>
                We've received your request and will get back to you at {sentEmail} shortly.
              </p>
              <button type="button" className="btn btn-ghost" onClick={() => setStatus('idle')}>
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              {/* Honeypot field: hidden from sighted users, off-screen
                  rather than display:none so most bots still see and
                  fill it. */}
              <div className="cf-honeypot" aria-hidden="true">
                <label>
                  Company
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={fields.company}
                    onChange={set('company')}
                  />
                </label>
              </div>

              <div className="cf-row">
                <label>
                  Name
                  <input
                    type="text"
                    value={fields.name}
                    onChange={set('name')}
                    autoComplete="name"
                    required
                    disabled={sending}
                  />
                </label>
                <label>
                  Business name
                  <input
                    type="text"
                    value={fields.business}
                    onChange={set('business')}
                    autoComplete="organization"
                    required
                    disabled={sending}
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
                    required
                    disabled={sending}
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
                    disabled={sending}
                  />
                </label>
              </div>
              <label>
                What do you need help with?
                <select value={fields.help} onChange={set('help')} required disabled={sending}>
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
                <textarea
                  rows={5}
                  value={fields.message}
                  onChange={set('message')}
                  required
                  disabled={sending}
                />
              </label>

              {error && (
                <p className="cf-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="btn btn-primary cf-submit" disabled={sending}>
                {sending ? 'Sending…' : 'Request a Free Audit'}
              </button>
              <p className="cf-note">We'll reply to the email you provide above.</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
