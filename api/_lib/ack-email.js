/*
 * Instant acknowledgment email sent to the lead ("speed to lead").
 * Fully templated — no AI output ever reaches the lead from this path.
 */

// Keyed on the exact values of the contact form's "What do you need help
// with?" dropdown (src/components/Contact.jsx). Unknown values fall back
// to the generic pitch.
const SERVICE_PITCHES = {
  Website: [
    'Websites are our core craft. We recently built and launched Malir Cantt Bazaar —',
    'a verified local marketplace with authentication, listings, admin moderation and',
    'secure payments-ready infrastructure — and we bring that same standard to every build.',
    'We will review your current online presence and come back with concrete, practical',
    'improvements before we talk about any rebuild.',
  ].join(' '),
  'Digital Strategy': [
    'We will look at how customers currently find and reach you — website, search,',
    'social, WhatsApp — and map the shortest path to more enquiries. You will get',
    'practical recommendations you can act on even if we never work together.',
  ].join(' '),
  'AI & Automation': [
    'We help businesses put AI to work on the repetitive parts — enquiry handling,',
    'follow-ups, reporting, internal workflows — while keeping a human in charge of',
    'anything client-facing. (This very email was part of an automation we built for',
    'ourselves, so you are seeing the approach first-hand.)',
  ].join(' '),
  'Business System': [
    'From lead capture to internal dashboards, we build systems that remove manual',
    'busywork. Our own product, Malir Cantt Bazaar, runs on the same foundations we',
    'build for clients: clean data, admin controls, and security checks from day one.',
  ].join(' '),
  'Not sure yet': [
    'No problem — most of our best projects started with "we know something could be',
    'better, but not what." The free audit is exactly for this: we look at your',
    'business, website and workflows, and tell you plainly where the biggest wins are.',
  ].join(' '),
}

const GENERIC_PITCH = SERVICE_PITCHES['Not sure yet']

export function buildAckEmail({ name, help }) {
  const firstName = name.split(/\s+/)[0]
  const pitch = SERVICE_PITCHES[help] || GENERIC_PITCH
  const bookingUrl = process.env.BOOKING_URL

  const bookingBlock = bookingUrl
    ? `If you'd like to talk sooner, you can book a free call directly here:\n${bookingUrl}`
    : 'If you\'d like to talk sooner, just reply to this email and we\'ll set up a call.'

  const text = [
    `Hi ${firstName},`,
    '',
    'Thanks for requesting a free audit from StackCorp — your request is in and a real person will get back to you soon.',
    '',
    pitch,
    '',
    'To make our first reply as useful as possible, it helps if you can answer any of these (just hit reply):',
    '',
    '1. What budget range are you comfortable with for this?',
    '2. When would you like this live or solved — weeks, months, or exploring?',
    '3. What are you using today (current website, tools, or manual process)?',
    '',
    bookingBlock,
    '',
    'Talk soon,',
    'The StackCorp Team',
    'stackcorp.org',
  ].join('\n')

  return {
    subject: `We got your request, ${firstName} — here's what happens next`,
    text,
  }
}
