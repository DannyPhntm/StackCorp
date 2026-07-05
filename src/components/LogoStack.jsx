import { motion, useReducedMotion } from 'framer-motion'

/*
 * Layered SVG recreation of the approved StackCorp icon
 * (public/assets/logo/stackcorp-icon.png). The flat PNG cannot be
 * animated layer-by-layer, so the three layers are rebuilt as vectors:
 * bottom chevron, blue chevron, top frame with blue core.
 * Colors are sampled from the approved asset (see --logo-* tokens).
 *
 * Dimensionality comes from three things layered flat art normally
 * lacks: a real cast shadow per layer (feDropShadow), a lit-from-top
 * highlight stop on every gradient, and a thin catch-light stroke
 * along each shape's top edge.
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

function Chevron({ y, fill, edge, sheen }) {
  /* Wide V-shaped band; edge is the darker 3D lip under the band. */
  const topEdge = `${22},${y} ${100},${y + 46} ${178},${y}`
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
      {/* Catch-light: thin bright stroke along the top-facing edge only. */}
      <polyline
        points={topEdge}
        fill="none"
        stroke={sheen}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
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
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="sc-blue-grad" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="var(--logo-blue-hi)" />
          <stop offset="45%" stopColor="var(--logo-blue)" />
          <stop offset="100%" stopColor="var(--logo-blue-deep)" />
        </linearGradient>
        <linearGradient id="sc-panel-grad" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="var(--logo-panel-sheen)" />
          <stop offset="45%" stopColor="var(--logo-panel-hi)" />
          <stop offset="100%" stopColor="var(--logo-panel)" />
        </linearGradient>
        <radialGradient id="sc-core-grad" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0%" stopColor="var(--logo-blue-hi)" />
          <stop offset="100%" stopColor="var(--logo-blue-deep)" />
        </radialGradient>
        <filter id="sc-layer-shadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="9" stdDeviation="7" floodColor="#050a10" floodOpacity="0.4" />
        </filter>
        <filter id="sc-contact-blur" x="-15%" y="-120%" width="130%" height="340%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        {/* Blue light bloom that sits behind the layers so the icon reads
            as emitting light rather than being lit from outside. */}
        <radialGradient id="sc-glow-grad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--logo-blue-hi)" stopOpacity="0.9" />
          <stop offset="45%" stopColor="var(--logo-blue)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--logo-blue)" stopOpacity="0" />
        </radialGradient>
        <filter id="sc-glow-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* Emission glow — behind everything. Gently pulses when motion is on
          (a slow "light breath"), static otherwise. */}
      <motion.ellipse
        cx="100"
        cy="104"
        rx="104"
        ry="96"
        fill="url(#sc-glow-grad)"
        filter="url(#sc-glow-blur)"
        initial={false}
        animate={play ? { opacity: [0.45, 0.75, 0.45] } : { opacity: 0.5 }}
        transition={
          play ? { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.9 } : { duration: 0 }
        }
      />

      {/* Bottom dark chevron */}
      <motion.g {...layerProps('bottom', 0.15)} filter="url(#sc-layer-shadow)">
        <Chevron y={140} fill="url(#sc-panel-grad)" edge="var(--logo-panel-edge)" sheen="var(--logo-panel-sheen)" />
      </motion.g>

      {/* Middle blue chevron */}
      <motion.g {...layerProps('middle', 0.4)} filter="url(#sc-layer-shadow)">
        <Chevron y={96} fill="url(#sc-blue-grad)" edge="var(--logo-blue-deep)" sheen="var(--logo-blue-hi)" />
      </motion.g>

      {/* Top frame with blue core */}
      <motion.g {...layerProps('top', 0.68)}>
        {/* Contact shadow: grounds the frame onto the chevron below it
            instead of leaving a floating gap between the two layers. */}
        <ellipse cx="100" cy="102" rx="78" ry="10" fill="#04070a" opacity="0.5" filter="url(#sc-contact-blur)" />
        <g filter="url(#sc-layer-shadow)">
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
        {/* Catch-light along the frame's top-facing edges */}
        <polyline
          points="16,52 100,4 184,52"
          fill="none"
          stroke="var(--logo-panel-sheen)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        {/* Blue core diamond with soft top-left sheen */}
        <polygon points="100,38 128,52 100,68 72,52" fill="url(#sc-core-grad)" />
        </g>
      </motion.g>
    </motion.svg>
  )
}

export function LogoMark({ size = 34 }) {
  /* Static navbar mark: same geometry, no animation. */
  return <LogoStack size={size} animate={false} />
}
