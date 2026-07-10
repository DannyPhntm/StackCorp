import { motion, useReducedMotion } from 'framer-motion'
import MagneticButton from './MagneticButton.jsx'
import './hero3d.css'

/*
 * Hero3D — the hero copy that sits over the fixed 3D canvas. The StackCorp
 * stack model (rendered by Scene3D behind everything) is the visual; this is
 * just the text on the left + CTA. Framer Motion handles the copy's entrance
 * (the 3D model and camera are driven by Three.js / GSAP, not here).
 */
export default function Hero3D() {
  const reduce = useReducedMotion()
  const fade = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
        }

  return (
    <section className="hero3d" id="top">
      <div className="container hero3d-inner">
        <div className="hero3d-copy">
          <motion.p className="hero3d-brand" {...fade(0.05)}>
            StackCorp
          </motion.p>
          <motion.p className="hero3d-motto" {...fade(0.14)}>
            From websites to workflows, we help businesses build{' '}
            <strong>the stack they need to grow</strong>.
          </motion.p>
          <motion.h1 className="hero3d-headline" {...fade(0.24)}>
            Better websites. <br />
            Smarter workflows. <br />
            <span className="hero3d-accent">Stronger businesses.</span>
          </motion.h1>
          <motion.div className="hero3d-ctas" {...fade(0.34)}>
            <MagneticButton href="#contact" className="btn btn-primary hero3d-cta">
              Request a Free Audit
            </MagneticButton>
            <MagneticButton href="#work" className="btn btn-ghost">
              View Our Work
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      <div className="hero3d-hint" aria-hidden="true">
        <span>Scroll to open the stack</span>
        <span className="hero3d-hint-line" />
      </div>
    </section>
  )
}
