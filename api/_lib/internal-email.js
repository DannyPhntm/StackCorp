/*
 * Internal notification email sent to the StackCorp inbox
 * (CONTACT_TO_EMAIL). Extends the original raw-submission email with the
 * AI lead brief + score when available. The AI-drafted reply itself lives
 * in the Notion lead row for review.
 */

export function buildInternalEmail(lead, ai, { notionLogged } = {}) {
  const timestamp = new Date().toISOString()

  const lines = [
    `Name: ${lead.name}`,
    `Business name: ${lead.business}`,
    `Phone/WhatsApp: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Needs help with: ${lead.help}`,
    '',
    'Message:',
    lead.message,
    '',
  ]

  if (ai) {
    lines.push(
      '--- AI lead brief ---',
      `Score: ${ai.score.toUpperCase()}`,
      '',
      ai.brief,
      '',
      notionLogged
        ? 'A draft reply is waiting in the Notion "StackCorp Leads" row for this lead — review, edit, and send.'
        : 'Draft reply (review and edit before sending — Notion logging was unavailable):',
    )
    if (!notionLogged) {
      lines.push('', ai.draft_reply)
    }
    lines.push('')
  } else {
    lines.push('--- AI lead brief unavailable for this submission ---', '')
  }

  lines.push(
    '---',
    'Submitted from the StackCorp website contact form',
    `Submitted at: ${timestamp}`,
    'The lead received an instant acknowledgment email.',
  )

  const scoreTag = ai ? ` [${ai.score.toUpperCase()}]` : ''
  return {
    subject: `Free audit request from ${lead.name}${scoreTag}`,
    text: lines.join('\n'),
  }
}
