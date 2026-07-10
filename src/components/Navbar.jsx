import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogoMark } from './LogoStack.jsx'
import './navbar.css'

const links = [
  { label: 'Services', anchor: '#services' },
  { label: 'Work', anchor: '#work' },
  { label: 'Process', anchor: '#process' },
  { label: 'Founders', to: '/founders' },
  { label: 'Contact', anchor: '#contact' },
]

export default function Navbar({ hidden = false }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const goToAnchor = (anchor) => (e) => {
    e.preventDefault()
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/' + anchor)
    } else {
      document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={`nav ${hidden ? 'nav--intro-hidden' : ''}`} aria-hidden={hidden}>
      <div className="container nav-inner">
        <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <LogoMark size={30} />
          <span>StackCorp</span>
        </Link>

        <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          {links.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={`/${l.anchor}`} onClick={goToAnchor(l.anchor)}>
                {l.label}
              </a>
            ),
          )}
          <a
            href="/#contact"
            onClick={goToAnchor('#contact')}
            className="btn btn-primary nav-cta-mobile"
          >
            Request a Free Audit
          </a>
        </nav>

        <a
          href="/#contact"
          onClick={goToAnchor('#contact')}
          className="btn btn-primary nav-cta"
        >
          Request a Free Audit
        </a>

        <button
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
