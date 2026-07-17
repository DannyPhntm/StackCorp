/*
 * Vercel serverless function: POST /api/contact  — "speed to lead" pipeline.
 *
 * Sync path (before the 200 response):
 *   validate → honeypot → rate-limit → send instant templated ack to the lead
 *
 * Background path (via waitUntil, after the response):
 *   Claude Haiku lead analysis → Notion lead row (with draft reply)
 *   → internal email to CONTACT_TO_EMAIL (submission + AI brief + score)
 *
 * Failure isolation: the internal email always sends (without the AI brief
 * if the AI call fails); Notion failures are logged only; ack failures never
 * block anything. AI output is never sent to the lead without human review.
 *
 * Required env vars (Vercel project settings, never committed):
 *   RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
 * Optional (enable AI / Notion / booking link):
 *   ANTHROPIC_API_KEY, NOTION_API_KEY, NOTION_LEADS_DB_ID, BOOKING_URL
 */

import { waitUntil } from '@vercel/functions'
import { sendEmail } from './_lib/resend.js'
import { buildAckEmail } from './_lib/ack-email.js'
import { analyzeLead } from './_lib/ai.js'
import { createLeadRow } from './_lib/notion.js'
import { buildInternalEmail } from './_lib/internal-email.js'

const REQUIRED_FIELDS = ['name', 'business', 'phone', 'email', 'help', 'message']
const MAX_FIELD_LENGTH = 300
const MAX_MESSAGE_LENGTH = 5000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Best-effort rate limit: per-IP fixed window held in instance memory.
// Resets on cold start and is per-region, so it is a stopgap against
// naive spam scripts, not a hard guarantee — Vercel WAF / a KV-backed
// limiter is the durable fix. It also caps AI spend per IP.
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

function runInBackground(promise) {
  try {
    waitUntil(promise)
  } catch {
    // Outside Vercel (local dev/tests) waitUntil may be unavailable —
    // fall back to fire-and-forget so the request still completes.
    promise.catch((err) => console.error('background task failed:', err))
  }
}

async function processLead(lead, { toEmail, fromEmail }) {
  try {
    const ai = await analyzeLead(lead)
    const notionLogged = await createLeadRow(lead, ai)
    const internal = buildInternalEmail(lead, ai, { notionLogged })
    const sent = await sendEmail({
      from: fromEmail,
      to: toEmail,
      replyTo: lead.email,
      subject: internal.subject,
      text: internal.text,
    })
    if (!sent) {
      // Loud log: this is the one failure that can lose a lead's visibility.
      console.error('LEAD ALERT: internal email failed for', lead.email, '— check Notion/Vercel logs')
    }
  } catch (err) {
    console.error('processLead: unexpected failure:', err)
  }
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

  const lead = {
    name: clean(body.name),
    business: clean(body.business),
    phone: clean(body.phone),
    help: clean(body.help),
    message: body.message.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, ' ').trim(),
    email: clean(body.email),
  }

  if (!EMAIL_PATTERN.test(lead.email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  const toEmail = process.env.CONTACT_TO_EMAIL
  const fromEmail = process.env.CONTACT_FROM_EMAIL

  if (!process.env.RESEND_API_KEY || !toEmail || !fromEmail) {
    console.error('Contact form: RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not configured')
    return res.status(500).json({
      error: 'The contact form is not fully set up yet. Please email us directly in the meantime.',
    })
  }

  // Speed-to-lead: instant templated acknowledgment. Best-effort — a
  // failed ack must never block the internal notification.
  const ack = buildAckEmail(lead)
  const ackSent = await sendEmail({
    from: fromEmail,
    to: lead.email,
    replyTo: toEmail,
    subject: ack.subject,
    text: ack.text,
  })
  if (!ackSent) {
    console.error('Contact form: ack email failed for', lead.email)
  }

  // Heavy lifting (AI brief, Notion row, internal email) continues after
  // the response so the form stays fast.
  runInBackground(processLead(lead, { toEmail, fromEmail }))

  return res.status(200).json({ ok: true })
}
