import './ambient.css'

/*
 * Hero-only animated background. Scoped on purpose — the global `.grid-bg`
 * (used by Contact + Founders) stays static; this adds the continuous
 * "alive" motion just for the hero:
 *   - a slowly drifting brand-line grid (masked to fade at the edges)
 *   - two soft steel/blue glow fields that drift and breathe
 * All motion is pure CSS transform/opacity (GPU-friendly) and is frozen by
 * prefers-reduced-motion. Decorative only: aria-hidden, no pointer events.
 */
export default function AmbientField() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-glow ambient-glow--primary" />
      <div className="ambient-glow ambient-glow--secondary" />
    </div>
  )
}
