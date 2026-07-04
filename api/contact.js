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
const MAX_FIELD_LENGTH = 2000
const MAX_MESSAGE_LENGTH = 5000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
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

  const { name, business, phone, email, help, message } = body
  const cleanEmail = email.trim()

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
