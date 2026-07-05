import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/*
 * Anchor that eases a few pixels toward the cursor on hover ("magnetic"),
 * springing back on leave. Desktop/fine-pointer only and disabled for
 * reduced-motion — on touch or reduced-motion it renders a plain <a>.
 * Keeps normal anchor semantics (href, focus, keyboard).
 */
export default function MagneticButton({ href, className = '', children, strength = 0.3, max = 10, ...rest }) {
  const reduce = useReducedMotion()
  const finePointer = useRef(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 })

  useEffect(() => {
    finePointer.current = window.matchMedia?.('(pointer: fine)')?.matches ?? false
  }, [])

  const active = !reduce
  const clamp = (v) => Math.max(-max, Math.min(max, v))

  const handleMove = (e) => {
    if (!active || !finePointer.current) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength))
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength))
  }
  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      href={href}
      className={className}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={active ? { x: sx, y: sy } : undefined}
      {...rest}
    >
      {children}
    </motion.a>
  )
}
