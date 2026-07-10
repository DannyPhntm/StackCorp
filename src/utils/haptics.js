// Progressive-enhancement haptics via the Vibration API. Every call is guarded
// and wrapped so unsupported browsers (and desktop, which has no vibrator) are
// silent no-ops — no permissions, no throws, no console noise. Haptics fire
// ONLY from discrete user activations (a single delegated click listener),
// never on scroll, hover, or pointer-move, so there is no way to spam them.
//
// Reduced-motion intentionally does NOT disable haptics: vibration is tactile,
// not visual/vestibular motion, and a subtle tap is a helpful, non-distracting
// confirmation. (The visual press/glow micro-motion IS disabled under
// reduced-motion, in CSS.)

let lastFire = 0
const THROTTLE_MS = 60 // guard against an accidental double-fire; never spams

export function canVibrate() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
}

function fire(pattern) {
  if (!canVibrate()) return
  const now = Date.now()
  if (now - lastFire < THROTTLE_MS) return
  lastFire = now
  try {
    navigator.vibrate(pattern)
  } catch {
    /* some engines throw on odd patterns or in blocked contexts — ignore */
  }
}

// Small click/tap — buttons, nav links, icon buttons, LinkedIn links.
export function hapticTap() {
  fire(10)
}

// Medium confirmation — primary "Request a Free Audit" CTA, form submit.
export function hapticConfirm() {
  fire([12, 30, 12])
}

// Stack/card opening — a card stack expands from a direct user tap.
export function hapticOpen() {
  fire([8, 20, 16])
}

const PATTERNS = { tap: hapticTap, confirm: hapticConfirm, open: hapticOpen }

// Install a single delegated click listener: any element carrying data-haptic
// (or nested inside one) fires the matching pattern on activation. Click — not
// pointermove/scroll/hover — so it responds only to intentional taps/clicks,
// and it naturally covers keyboard activation (Enter/Space) too. Non-interactive
// elements simply never carry the attribute. Returns a cleanup function.
export function initHaptics() {
  if (typeof document === 'undefined') return () => {}
  const onClick = (e) => {
    const el = e.target?.closest?.('[data-haptic]')
    if (!el) return
    PATTERNS[el.getAttribute('data-haptic')]?.()
  }
  document.addEventListener('click', onClick, { passive: true })
  return () => document.removeEventListener('click', onClick)
}
