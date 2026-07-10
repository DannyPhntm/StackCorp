import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import GlobalAmbient from './components/GlobalAmbient.jsx'
import CursorGlow from './components/CursorGlow.jsx'
import IntroOverlay from './components/IntroOverlay.jsx'
import Home from './pages/Home.jsx'
import Founders from './pages/Founders.jsx'

// The opening intro plays only on the first home-page load of a session, and
// never for reduced-motion. Decided synchronously so the overlay is present on
// the very first paint (no flash of the hero before it covers up).
function introShouldSkip() {
  if (typeof window === 'undefined' || !window.matchMedia) return true
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let seen = false
  try {
    seen = sessionStorage.getItem('sc_intro_seen_v1') === '1'
  } catch {
    seen = false
  }
  return reduce || seen || window.location.pathname !== '/'
}

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Let the page render first, then jump to the anchor.
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

export default function App() {
  const [introDone, setIntroDone] = useState(introShouldSkip)

  return (
    <>
      {!introDone && <IntroOverlay onComplete={() => setIntroDone(true)} />}
      <GlobalAmbient />
      <CursorGlow />
      <ScrollManager />
      <Navbar hidden={!introDone} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/founders" element={<Founders />} />
      </Routes>
      <Footer />
    </>
  )
}
