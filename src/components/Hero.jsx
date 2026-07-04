import { motion, useReducedMotion } from 'framer-motion'
import LogoStack from './LogoStack.jsx'
import './hero.css'

const fade = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
})

const calloutAnim = (originX, originY, delay) => ({
  initial: { opacity: 0, x: originX, y: originY },
  animate: { opacity: 1, x: 0, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
})

export default function Hero() {
  const reduce = useReducedMotion()
  const anim = (delay) => (reduce ? {} : fade(delay))
  const callout = (originX, originY, delay) =>
    reduce ? {} : calloutAnim(originX, originY, delay)

  return (
    <section className="hero" id="top">
      <div className="grid-bg" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <motion.h1 {...anim(0.05)}>
            Better websites.
            <br />
            Smarter workflows.
            <br />
            <span className="hero-accent">Stronger businesses.</span>
          </motion.h1>
          <motion.p className="hero-sub" {...anim(0.18)}>
            StackCorp helps businesses build the digital systems they need to look
            sharper, capture more inquiries, and run smoother.
          </motion.p>
          <motion.div className="hero-ctas" {...anim(0.3)}>
            <a href="#contact" className="btn btn-primary">
              Request a Free Audit
            </a>
            <a href="#work" className="btn btn-ghost">
              View Our Work
            </a>
          </motion.div>
          <motion.p className="hero-tagline" {...anim(0.42)}>
            From websites to workflows, we help businesses build the stack they need
            to grow.
          </motion.p>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-visual-inner">
            <LogoStack size={340} />

            <motion.div
              className="hero-callout hero-callout--a"
              {...callout(18, -14, 1.3)}
            >
              <span className="hero-callout-line" />
              <span className="hero-callout-dot" />
              <span className="hero-callout-label">Smarter Workflows</span>
            </motion.div>

            <motion.div
              className="hero-callout hero-callout--b"
              {...callout(-18, 14, 1.48)}
            >
              <span className="hero-callout-line" />
              <span className="hero-callout-dot" />
              <span className="hero-callout-label">Lower Costs</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
