/*
 * Shared Resend HTTP helper (plain fetch, no SDK — matches repo pattern).
 * Returns true on success, false on failure. Never throws.
 */

const RESEND_TIMEOUT_MS = 8000

export async function sendEmail({ from, to, replyTo, subject, text }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('sendEmail: RESEND_API_KEY not configured')
    return false
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        text,
      }),
    })

    if (!res.ok) {
      console.error('sendEmail: Resend responded with', res.status)
      return false
    }
    return true
  } catch (err) {
    console.error('sendEmail: request failed:', err)
    return false
  }
}
