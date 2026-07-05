/*
 * Vercel serverless function: GET /api/mcb-stats
 *
 * Proxies Malir Cantt Bazaar's public aggregate stats endpoint so the
 * StackCorp site can show live case-study numbers. The upstream endpoint
 * only allows its own frontend via CORS, so the browser cannot call it
 * directly; this proxy runs server-side and re-exposes a whitelisted
 * subset of the aggregates. No auth, no secrets — the upstream endpoint
 * is already public.
 *
 * Optional env var (set in Vercel project settings, not committed):
 *   MCB_STATS_URL - upstream stats endpoint; defaults to the production URL
 */

const DEFAULT_UPSTREAM =
  'https://malir-cantt-marketplace-production.up.railway.app/api/stats/public'
const UPSTREAM_TIMEOUT_MS = 6000

// Only these upstream aggregate fields are ever passed through. Anything
// else the upstream adds in the future stays server-side.
const PUBLIC_FIELDS = ['activeListings', 'verifiedBusinesses', 'categories']

function isCount(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  // Guard against a misconfigured override being used for SSRF-style
  // fetches: only plain https URLs are accepted, otherwise fall back.
  let upstreamUrl = DEFAULT_UPSTREAM
  if (process.env.MCB_STATS_URL) {
    try {
      const parsed = new URL(process.env.MCB_STATS_URL)
      if (parsed.protocol === 'https:') upstreamUrl = parsed.href
      else console.error('MCB_STATS_URL ignored: not https')
    } catch {
      console.error('MCB_STATS_URL ignored: not a valid URL')
    }
  }

  try {
    const upstreamRes = await fetch(upstreamUrl, {
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      headers: { Accept: 'application/json' },
    })

    if (!upstreamRes.ok) {
      console.error('MCB stats upstream responded with', upstreamRes.status)
      return res.status(502).json({ error: 'Live stats are temporarily unavailable.' })
    }

    const payload = await upstreamRes.json()
    const stats = payload && typeof payload === 'object' ? payload.stats : null

    const out = {}
    for (const field of PUBLIC_FIELDS) {
      if (!stats || !isCount(stats[field])) {
        console.error('MCB stats upstream returned unexpected shape')
        return res.status(502).json({ error: 'Live stats are temporarily unavailable.' })
      }
      out[field] = stats[field]
    }

    // Let Vercel's edge cache absorb traffic so the upstream rate limit is
    // never a concern: fresh for 5 min, stale-while-revalidate for 10 more.
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return res.status(200).json({ ...out, fetchedAt: new Date().toISOString() })
  } catch (err) {
    console.error('MCB stats fetch failed:', err && err.name ? err.name : err)
    return res.status(502).json({ error: 'Live stats are temporarily unavailable.' })
  }
}
