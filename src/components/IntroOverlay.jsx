import { useEffect, useRef, useState } from 'react'
import { motion, useAnimate } from 'framer-motion'
import LogoStack from './LogoStack.jsx'
import './introoverlay.css'

const EASE = [0.16, 1, 0.3, 1]

/*
 * IntroOverlay — the opening act. A full-screen opaque black layer that sits
 * above everything (navbar included) so no page content is visible until the
 * sequence finishes:
 *
 *   center → swipe fully left, revealing the "StackCorp" wordmark →
 *   swipe back to center, hiding the word → grow into the hero focal object →
 *   the black recedes to reveal the hero underneath.
 *
 * It plays once per session and is skipped entirely for reduced-motion (the
 * parent decides whether to mount it at all). Body scroll is locked while it
 * runs so the hero behind can't be scrolled mid-intro.
 */
export default function IntroOverlay({ onComplete }) {
  const [scope, animate] = useAnimate()
  const rootRef = useRef(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    let cancelled = false
    const done = () => {
      try {
        sessionStorage.setItem('sc_intro_seen_v1', '1')
      } catch {
        /* private mode — replay next load, harmless */
      }
      onComplete?.()
    }

    // Lock scroll for the duration.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const travel = Math.min(Math.round(window.innerWidth * 0.3), 460)

    const run = async () => {
      // Small settle so the first frame isn't the mid-animation state.
      await new Promise((r) => setTimeout(r, 260))
      if (cancelled) return

      // 1 — swipe fully left, reveal the wordmark to the logo's right
      await animate([
        ['.intro-logo', { x: -travel }, { duration: 0.7, ease: EASE }],
        ['.intro-word', { opacity: 1, x: 0 }, { duration: 0.55, ease: EASE, at: 0.18 }],
      ])
      if (cancelled) return
      await new Promise((r) => setTimeout(r, 520))
      if (cancelled) return

      // 2 — swipe back to center, closing the wordmark
      await animate([
        ['.intro-word', { opacity: 0, x: 26 }, { duration: 0.34, ease: 'easeIn' }],
        ['.intro-logo', { x: 0 }, { duration: 0.62, ease: EASE, at: 0.06 }],
      ])
      if (cancelled) return

      // 3 — grow into the hero focal object
      await animate('.intro-logo', { scale: 1.32 }, { type: 'spring', stiffness: 78, damping: 15 })
      if (cancelled) return
      await new Promise((r) => setTimeout(r, 260))
      if (cancelled) return

      // 4 — the black recedes while the logo drifts to its hero resting spot
      // (right of centre on desktop, centred on mobile), so it settles into
      // place rather than jumping when the hero appears underneath.
      document.body.style.overflow = prevOverflow
      // Hand off to the centered 3D hero model: the logo stays centered as the
      // black recedes (no drift), so the 2D intro mark crossfades into the 3D
      // stack in the same spot.
      await animate(rootRef.current, { opacity: 0 }, { duration: 0.62, ease: EASE })
      if (cancelled) return
      setGone(true)
      done()
    }

    run()
    return () => {
      cancelled = true
      document.body.style.overflow = prevOverflow
    }
  }, [animate, onComplete])

  if (gone) return null

  return (
    <motion.div ref={rootRef} className="intro-overlay" aria-hidden="true">
      <div className="intro-stage" ref={scope}>
        <span className="intro-word">StackCorp</span>
        <motion.div className="intro-logo" initial={{ scale: 1, x: 0 }}>
          <LogoStack size={230} animate={false} />
        </motion.div>
      </div>
    </motion.div>
  )
}
