import { Link } from 'react-router-dom'
import { LogoMark } from './LogoStack.jsx'
import './footer.css'

const EMAIL = 'stackcorp7@gmail.com'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-mark">
            <LogoMark size={28} />
            <span>StackCorp</span>
          </div>
          <p>Better websites. Smarter workflows. Stronger businesses.</p>
          <a href={`mailto:${EMAIL}`} className="footer-email">
            {EMAIL}
          </a>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <a href="/#services">Services</a>
          <a href="/#work">Work</a>
          <a href="/#process">Process</a>
          <Link to="/founders">Founders</Link>
          <a href="/#contact">Contact</a>
        </nav>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 StackCorp. All rights reserved.</p>
      </div>
    </footer>
  )
}
