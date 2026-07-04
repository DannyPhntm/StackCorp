import { motion, useReducedMotion } from 'framer-motion'

/*
 * Layered SVG recreation of the approved StackCorp icon
 * (public/assets/logo/stackcorp-icon.png). The flat PNG cannot be
 * animated layer-by-layer, so the three layers are rebuilt as vectors:
 * bottom chevron, blue chevron, top frame with blue core.
 * Colors are sampled from the approved asset (see --logo-* tokens).
 */

const spring = { type: 'spring', stiffness: 90, damping: 18 }

const layers = {
  bottom: {
    initial: { opacity: 0, y: 56 },
    animate: { opacity: 1, y: 0 },
  },
  middle: {
    initial: { opacity: 0, x: -64 },
    animate: { opacity: 1, x: 0 },
  },
  top: {
    initial: { opacity: 0, y: -64 },
    animate: { opacity: 1, y: 0 },
  },
}

function Chevron({ y, fill, edge }) {
  /* Wide V-shaped band; edge is the darker 3D lip under the band. */
  return (
    <g>
      <polygon
        points={`22,${y} 100,${y + 46} 178,${y} 178,${y + 26} 100,${y + 72} 22,${y + 26}`}
        fill={fill}
      />
      <polygon
        points={`22,${y + 26} 100,${y + 72} 178,${y + 26} 178,${y + 34} 100,${y + 80} 22,${y + 34}`}
        fill={edge}
      />
    </g>
  )
}

export default function LogoStack({ size = 340, animate = true }) {
  const reduce = useReducedMotion()
  const play = animate && !reduce

  const layerProps = (name, delay) =>
    play
      ? {
          initial: layers[name].initial,
          animate: layers[name].animate,
          transition: { ...spring, delay },
        }
      : {}

  return (
    <motion.svg
      width={size}
      height={size * (216 / 168)}
      viewBox="16 4 168 216"
      fill="none"
      role="img"
      aria-label="StackCorp layered stack logo"
      initial={false}
    >
      <defs>
        <linearGradient id="sc-blue-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--logo-blue)" />
          <stop offset="100%" stopColor="var(--logo-blue-deep)" />
        </linearGradient>
        <linearGradient id="sc-panel-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--logo-panel-hi)" />
          <stop offset="100%" stopColor="var(--logo-panel)" />
        </linearGradient>
      </defs>

      {/* Bottom dark chevron */}
      <motion.g {...layerProps('bottom', 0.15)}>
        <Chevron y={140} fill="url(#sc-panel-grad)" edge="var(--logo-panel-edge)" />
      </motion.g>

      {/* Middle blue chevron */}
      <motion.g {...layerProps('middle', 0.4)}>
        <Chevron y={96} fill="url(#sc-blue-grad)" edge="var(--logo-blue-deep)" />
      </motion.g>

      {/* Top frame with blue core */}
      <motion.g {...layerProps('top', 0.68)}>
        {/* Open frame: outer diamond with diamond cutout */}
        <path
          d="M100 4 L184 52 L100 100 L16 52 Z M100 34 L47 52 L100 82 L153 52 Z"
          fill="url(#sc-panel-grad)"
          fillRule="evenodd"
        />
        {/* 3D lip under the frame */}
        <polygon
          points="16,52 100,100 184,52 184,62 100,110 16,62"
          fill="var(--logo-panel-edge)"
        />
        {/* Blue core diamond */}
        <polygon points="100,38 128,52 100,68 72,52" fill="url(#sc-blue-grad)" />
      </motion.g>
    </motion.svg>
  )
}

export function LogoMark({ size = 34 }) {
  /* Static navbar mark: same geometry, no animation. */
  return <LogoStack size={size} animate={false} />
}
