import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import './cursorglow.css'

/*
 * Soft blue glow that eases behind the cursor on desktop — the site's
 * "reactive" feel. Non-interactive (pointer-events: none) so it never blocks
 * clicks/focus, and the native cursor is untouched. Only runs for fine
 * pointers (mouse/trackpad) and never under reduced-motion, so touch/mobile
 * and motion-sensitive users see nothing.
 */
export default function CursorGlow() {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  useEffect(() => {
    if (reduce) return
    const fine = window.matchMedia?.('(pointer: fine)')?.matches ?? false
    if (!fine) return
    const el = ref.current
    if (!el) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let x = tx
    let y = ty
    let raf = 0

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      el.style.opacity = '1'
    }
    const onLeave = () => {
      el.style.opacity = '0'
    }

    const tick = () => {
      // Ease toward the cursor (lerp) so the glow trails softly.
      x += (tx - x) * 0.15
      y += (ty - y) * 0.15
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [reduce])

  if (reduce) return null
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}
