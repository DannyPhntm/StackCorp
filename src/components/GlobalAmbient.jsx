import './globalambient.css'

/*
 * Site-wide ambient backdrop. Mounted once in App, fixed behind all content
 * (sections are transparent, so this reads consistently across the whole
 * page). Deliberately fainter than the hero's AmbientField — a quiet living
 * base, not a feature. Pure CSS transform/opacity; frozen by reduced-motion.
 */
export default function GlobalAmbient() {
  return (
    <div className="global-ambient" aria-hidden="true">
      <div className="global-ambient-grid" />
      <div className="global-ambient-glow" />
    </div>
  )
}
