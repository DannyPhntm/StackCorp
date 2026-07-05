/*
 * Vercel serverless function: POST /api/contact
 *
 * Sends the "Request a Free Audit" form to StackCorp via Resend's HTTP
 * API (plain fetch — no SDK dependency needed). Secrets are read from
 * server-side env vars only; never exposed to the frontend bundle.
 *
 * Required env vars (set in Vercel project settings, not committed):
 *   RESEND_API_KEY      - Resend API key
 *   CONTACT_TO_EMAIL     - inbox that receives submissions (stackcorp7@gmail.com)
 *   CONTACT_FROM_EMAIL   - verified sender address for the Resend domain
 */

const REQUIRED_FIELDS = ['name', 'business', 'phone', 'email', 'help', 'message']
const MAX_FIELD_LENGTH = 300
const MAX_MESSAGE_LENGTH = 5000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESEND_TIMEOUT_MS = 8000

// Best-effort rate limit: per-IP fixed window held in instance memory.
// Resets on cold start and is per-region, so it is a stopgap against
// naive spam scripts, not a hard guarantee — Vercel WAF / a KV-backed
// limiter is the durable fix.
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const rateWindows = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  for (const [key, entry] of rateWindows) {
    if (now - entry.start > RATE_LIMIT_WINDOW_MS) rateWindows.delete(key)
  }
  const entry = rateWindows.get(ip)
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    rateWindows.set(ip, { start: now, count: 1 })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT_MAX
}

// Strip control characters (incl. CR/LF) so user input can never shape
// email headers/subject lines.
function clean(value) {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim()
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const forwarded = req.headers['x-forwarded-for']
  const ip = (typeof forwarded === 'string' && forwarded.split(',')[0].trim()) || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: 'Too many messages from your connection. Please try again in a few minutes.',
    })
  }

  const body = req.body || {}

  // Honeypot: a hidden field real visitors never fill in. Bots that
  // blindly fill every field will trip it; we quietly no-op instead of
  // telling them so.
  if (body.company) {
    return res.status(200).json({ ok: true })
  }

  for (const field of REQUIRED_FIELDS) {
    const value = typeof body[field] === 'string' ? body[field].trim() : ''
    if (!value) {
      return res.status(400).json({ error: 'Please fill in all required fields.' })
    }
    const limit = field === 'message' ? MAX_MESSAGE_LENGTH : MAX_FIELD_LENGTH
    if (value.length > limit) {
      return res.status(400).json({ error: 'One of the fields is too long. Please shorten it.' })
    }
  }

  const name = clean(body.name)
  const business = clean(body.business)
  const phone = clean(body.phone)
  const help = clean(body.help)
  const message = body.message.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, ' ').trim()
  const cleanEmail = clean(body.email)

  if (!EMAIL_PATTERN.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL
  const fromEmail = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !toEmail || !fromEmail) {
    console.error('Contact form: RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not configured')
    return res.status(500).json({
      error: 'The contact form is not fully set up yet. Please email us directly in the meantime.',
    })
  }

  const timestamp = new Date().toISOString()
  const text = [
    `Name: ${name.trim()}`,
    `Business name: ${business.trim()}`,
    `Phone/WhatsApp: ${phone.trim()}`,
    `Email: ${cleanEmail}`,
    `Needs help with: ${help.trim()}`,
    '',
    'Message:',
    message.trim(),
    '',
    '---',
    'Submitted from the StackCorp website contact form',
    `Submitted at: ${timestamp}`,
  ].join('\n')

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        reply_to: cleanEmail,
        subject: `Free audit request from ${name.trim()}`,
        text,
      }),
    })

    if (!resendRes.ok) {
      console.error('Resend API responded with', resendRes.status)
      return res.status(502).json({
        error: 'We could not send your message right now. Please try again shortly.',
      })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Contact form send failed:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again shortly.' })
  }
}
