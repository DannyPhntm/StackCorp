import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import GlobalAmbient from './components/GlobalAmbient.jsx'
import CursorGlow from './components/CursorGlow.jsx'
import { initHaptics } from './utils/haptics.js'
import Home from './pages/Home.jsx'
import Founders from './pages/Founders.jsx'

// The 3D dolly intro plays only on the first home-page load of a session, and
// never for reduced-motion. Decided synchronously so the navbar starts hidden
// and no hero flashes before the veil (rendered by Home) covers it.
function shouldPlayIntro() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let seen = false
  try {
    seen = sessionStorage.getItem('sc_intro_seen_v2') === '1'
  } catch {
    seen = false
  }
  return !reduce && !seen && window.location.pathname === '/'
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
  const [playIntro] = useState(shouldPlayIntro)
  const [introDone, setIntroDone] = useState(() => !shouldPlayIntro())
  const handleIntroDone = useCallback(() => setIntroDone(true), [])

  // Single delegated haptics listener for the whole app (progressive; a no-op
  // where the Vibration API is unavailable). Elements opt in via data-haptic.
  useEffect(() => initHaptics(), [])

  return (
    <>
      <GlobalAmbient />
      <CursorGlow />
      <ScrollManager />
      <Navbar hidden={!introDone} />
      <Routes>
        <Route
          path="/"
          element={<Home playIntro={playIntro} onIntroDone={handleIntroDone} />}
        />
        <Route path="/founders" element={<Founders />} />
      </Routes>
      <Footer />
    </>
  )
}
