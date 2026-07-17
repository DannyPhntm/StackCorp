/*
 * Notion lead logging (plain fetch, no SDK — matches repo pattern).
 * Creates one page per enquiry in the "StackCorp Leads" database.
 *
 * Required env vars (Vercel project settings, never committed):
 *   NOTION_API_KEY      - internal integration secret (the database must be
 *                         shared with the integration in Notion)
 *   NOTION_LEADS_DB_ID  - the Leads database id
 *
 * Expected database properties (created during setup — see
 * docs/SPEED_TO_LEAD.md): Name (title), Business (rich text),
 * Email (email), Phone (phone), Service (select), Score (select),
 * Status (select), Submitted (date).
 *
 * Best-effort: returns true/false, never throws. A Notion failure must
 * never affect the lead's or the team's emails.
 */

const NOTION_TIMEOUT_MS = 8000
const NOTION_VERSION = '2022-06-28'
const RICH_TEXT_CHUNK = 2000 // Notion caps a rich_text item at 2000 chars

function chunkText(text) {
  const chunks = []
  for (let i = 0; i < text.length; i += RICH_TEXT_CHUNK) {
    chunks.push({ type: 'text', text: { content: text.slice(i, i + RICH_TEXT_CHUNK) } })
  }
  return chunks.length ? chunks : [{ type: 'text', text: { content: '' } }]
}

function heading(text) {
  return {
    object: 'block',
    type: 'heading_2',
    heading_2: { rich_text: [{ type: 'text', text: { content: text } }] },
  }
}

function paragraph(text) {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: { rich_text: chunkText(text) },
  }
}

export async function createLeadRow(lead, ai) {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_LEADS_DB_ID
  if (!apiKey || !databaseId) {
    console.warn('createLeadRow: NOTION_API_KEY / NOTION_LEADS_DB_ID not configured — skipping')
    return false
  }

  const children = [
    heading('Message'),
    paragraph(lead.message),
    heading('AI brief'),
    paragraph(ai ? ai.brief : 'AI analysis unavailable for this lead.'),
    heading('Draft reply (review before sending — never auto-sent)'),
    paragraph(ai ? ai.draft_reply : 'No draft generated.'),
  ]

  const body = {
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ type: 'text', text: { content: lead.name } }] },
      Business: { rich_text: [{ type: 'text', text: { content: lead.business } }] },
      Email: { email: lead.email },
      Phone: { phone_number: lead.phone },
      Service: { select: { name: lead.help } },
      Score: { select: { name: ai ? ai.score : 'unscored' } },
      Status: { select: { name: 'New' } },
      Submitted: { date: { start: new Date().toISOString() } },
    },
    children,
  }

  try {
    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      signal: AbortSignal.timeout(NOTION_TIMEOUT_MS),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('createLeadRow: Notion responded with', res.status, detail.slice(0, 300))
      return false
    }
    return true
  } catch (err) {
    console.error('createLeadRow: failed:', err)
    return false
  }
}
