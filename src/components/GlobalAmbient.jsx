import { useEffect, useRef } from 'react'
import './globalambient.css'

/*
 * Site-wide ambient backdrop — mounted once in App, fixed behind all content
 * (body is transparent; sections are transparent). Deeper and more atmospheric
 * than a flat fill: a layered dark base, a slow steel-blue glow, a second deep
 * glow, a faint drifting grid, and a fixed grain overlay so the page never
 * reads as flat/digital. A scroll-linked tone drift makes the whole site evolve
 * navy → deep-slate → charcoal as one continuous story rather than separate
 * blocks. All motion is GPU transform/opacity; frozen for reduced-motion.
 */
export default function GlobalAmbient() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (reduce) return

    // Cache the scrollable height — reading scrollHeight per scroll frame forces
    // synchronous layout. Recompute only on resize / content growth.
    let max = document.documentElement.scrollHeight - window.innerHeight
    const remeasure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight
    }
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const sp = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
        el.style.setProperty('--sp', sp.toFixed(4))
        raf = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', remeasure, { passive: true })
    const ro = new ResizeObserver(remeasure)
    ro.observe(document.body)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', remeasure)
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="global-ambient" ref={ref} aria-hidden="true">
      <div className="global-ambient-drift" />
      <div className="global-ambient-grid" />
      <div className="global-ambient-glow global-ambient-glow--primary" />
      <div className="global-ambient-glow global-ambient-glow--deep" />
      <div className="global-ambient-grain" />
    </div>
  )
}
