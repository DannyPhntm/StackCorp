import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import LogoStack from './LogoStack.jsx'
import AmbientField from './AmbientField.jsx'
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

  // Desktop pointer-tilt for the logo. Motion values feed a spring so the
  // object eases toward the cursor and settles back — subtle (≤10°), never a
  // spin. Disabled for reduced-motion and for coarse (touch) pointers.
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 120, damping: 20, mass: 0.4 })
  const rotateY = useSpring(ry, { stiffness: 120, damping: 20, mass: 0.4 })
  const finePointer = useRef(false)

  useEffect(() => {
    finePointer.current = window.matchMedia?.('(pointer: fine)')?.matches ?? false
  }, [])

  const tiltOn = !reduce
  const handleMove = (e) => {
    if (!tiltOn || !finePointer.current) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5 // -0.5 … 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 10)
    rx.set(-py * 8)
  }
  const handleLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  // Continuous soft float after the stack assembles (starts once the layers
  // have settled). Low amplitude so it reads as "alive", not busy.
  const float = tiltOn
    ? { animate: { y: [0, -10, 0] }, transition: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.6 } }
    : {}

  return (
    <section className="hero" id="top">
      <AmbientField />
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
          <motion.div className="hero-motto" {...anim(0.42)}>
            <span className="hero-motto-mark" aria-hidden="true" />
            <p>
              From websites to workflows — we help businesses build{' '}
              <strong>the stack they need to grow</strong>.
            </p>
          </motion.div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <motion.div
            className="hero-visual-inner"
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            {...float}
          >
            <motion.div className="hero-logo-tilt" style={tiltOn ? { rotateX, rotateY } : undefined}>
              <LogoStack size={340} />
            </motion.div>

            {/* Inner layer labels: what each layer represents, tight to
                the icon's right edge so they read as structure, not
                marketing copy. Timed to land just after each layer
                itself settles (bottom layer lands first, then middle,
                then top), so the labels build up with the stack. */}
            <motion.div className="hero-layer-label hero-layer-label--bottom" {...callout(10, 0, 0.8)}>
              <span className="hero-layer-tick" />
              <span className="hero-layer-text">Systems</span>
            </motion.div>
            <motion.div className="hero-layer-label hero-layer-label--mid" {...callout(10, 0, 1.05)}>
              <span className="hero-layer-tick" />
              <span className="hero-layer-text">Automation</span>
            </motion.div>
            <motion.div className="hero-layer-label hero-layer-label--top" {...callout(10, 0, 1.3)}>
              <span className="hero-layer-tick" />
              <span className="hero-layer-text">Strategy</span>
            </motion.div>

            {/* Outer callouts: anchored to the icon's actual top and
                bottom vertices, reading as leader-line annotations
                rather than floating text. Land last, once the stack
                is fully assembled. */}
            <motion.div className="hero-callout hero-callout--top" {...callout(0, -12, 1.5)}>
              <span className="hero-callout-label">Smarter Workflows</span>
              <span className="hero-callout-line" />
              <span className="hero-callout-dot" />
            </motion.div>

            <motion.div className="hero-callout hero-callout--bottom" {...callout(0, 12, 1.65)}>
              <span className="hero-callout-dot" />
              <span className="hero-callout-line" />
              <span className="hero-callout-label">Lower Costs</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
