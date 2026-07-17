# Speed-to-Lead Agent

Responds to every enquiry from the stackcorp.org contact form within seconds, and turns the internal notification into a pre-qualified, action-ready lead package.

## What happens on every submission

```
Form POST /api/contact
├─ (sync)  validate → honeypot → rate-limit                [unchanged]
├─ (sync)  instant templated ack email to the lead          [new]
├─ (sync)  200 returned to the browser
└─ (background, via waitUntil)
     ├─ Claude Haiku analysis → { score, brief, draft reply }
     ├─ Notion "StackCorp Leads" row (fields + message + brief + draft)
     └─ internal email to stackcorp7@gmail.com (submission + brief + score)
```

**The lead receives:** a templated acknowledgment (no AI content) with a service-specific pitch based on their dropdown choice, 3 qualification questions (budget, timeline, current setup), and a booking CTA (`BOOKING_URL` if set, otherwise "reply to this email").

**You receive:** the usual internal email, now with an AI lead brief and a hot/warm/cold score in the subject line. The AI-drafted personalized reply lives in the Notion lead row — review, edit, and send it yourself. **AI output is never auto-sent to a lead.**

## Failure isolation

- AI call fails → internal email still sends (without brief); Notion row says "AI analysis unavailable".
- Notion fails → the draft reply is included in the internal email instead; error logged.
- Ack email fails → logged; internal pipeline unaffected.
- Internal email fails → `LEAD ALERT` error in Vercel logs (the lead may still be in Notion).
- Rate limit (5 per 10 min per IP) and honeypot also cap AI spend.

## Code map

- [api/contact.js](../api/contact.js) — handler and orchestration
- [api/_lib/ack-email.js](../api/_lib/ack-email.js) — lead-facing template (edit pitches here)
- [api/_lib/ai.js](../api/_lib/ai.js) — Claude Haiku call (model `claude-haiku-4-5`, strict JSON schema, ~1 cent per lead or less)
- [api/_lib/notion.js](../api/_lib/notion.js) — Notion lead row
- [api/_lib/internal-email.js](../api/_lib/internal-email.js) — internal notification
- [api/_lib/resend.js](../api/_lib/resend.js) — shared Resend send helper

## Environment variables (names only — values live in Vercel project settings)

Already configured:

```
RESEND_API_KEY=<resend api key>
CONTACT_TO_EMAIL=<stackcorp inbox>
CONTACT_FROM_EMAIL=<verified sender>
```

New — the pipeline degrades gracefully while these are unset:

```
ANTHROPIC_API_KEY=<anthropic api key>        # enables AI brief + draft
NOTION_API_KEY=<notion integration secret>   # enables Notion logging
NOTION_LEADS_DB_ID=<leads database id>       # enables Notion logging
BOOKING_URL=<cal.com event link>             # optional booking CTA in the ack
```

## One-time setup runbook

1. **Anthropic API key** — create at console.anthropic.com (billing must be enabled; Haiku costs roughly a cent or less per lead). Add as `ANTHROPIC_API_KEY` in Vercel.
2. **Notion** — the "StackCorp Leads" database already exists:
   https://app.notion.com/p/9345c23360544b56adb3c3fbdc6b66ca
   1. Go to notion.so/my-integrations → create an internal integration (e.g. "StackCorp Website") with *Insert content* capability.
   2. On the Leads database page: ⋯ menu → Connections → add the integration.
   3. Add `NOTION_API_KEY` (the integration secret) and `NOTION_LEADS_DB_ID=9345c23360544b56adb3c3fbdc6b66ca` in Vercel.
3. **Cal.com** — create a free account + event type ("Free audit call — 30 min"), then set `BOOKING_URL` in Vercel. Until then the ack email automatically uses the reply-to CTA.
4. **Redeploy** after adding env vars.

## Daily workflow

1. Enquiry arrives → lead already has the ack in their inbox.
2. Open the internal email — score is in the subject, brief in the body.
3. Open the Notion row → review/edit the draft reply → paste into a reply from the inbox (the internal email's reply-to is already the lead).
4. Update Status in Notion (New → Replied → Call booked → Won/Lost).

## Notion database schema

Name (title), Business (rich text), Email, Phone, Service (select: the form's dropdown values), Score (select: hot/warm/cold/unscored), Status (select: New/Replied/Call booked/Won/Lost), Submitted (date). Page body: Message, AI brief, Draft reply.

Do not rename these properties without updating [api/_lib/notion.js](../api/_lib/notion.js).
