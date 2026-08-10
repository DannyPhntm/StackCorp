/*
 * Concierge public API client.
 *
 * The Concierge service lives in a separate repo and is reached cross-origin.
 * Only three public endpoints exist and nothing else may be called:
 *
 *   POST /api/public/session  {}                -> { sessionToken }
 *   POST /api/public/turn     { text }          -> { reply, escalated, awaitingContact }
 *   POST /api/public/contact  { email }         -> { recorded }
 *
 * The responses carry no ids, no confidence, no sources, no diagnostics — so
 * this module never reads, stores or surfaces anything beyond the fields above.
 *
 * The session token is opaque and lives in sessionStorage on purpose:
 *   - two tabs are two conversations, by design
 *   - it must not outlive the browser session
 *   - it is not a secret we own, and nothing else is held client-side
 */

/*
 * The deployed service. A production build with no VITE_CONCIERGE_ORIGIN set
 * must still reach Railway — the site is hosted, the backend is not part of it,
 * and a missing env var must not silently point visitors at localhost. Dev
 * keeps the local backend as its fallback.
 */
const PRODUCTION_ORIGIN = 'https://stackcorp-concierge-production.up.railway.app'
const DEV_ORIGIN = 'http://localhost:8787'

const ORIGIN = (
  import.meta.env.VITE_CONCIERGE_ORIGIN || (import.meta.env.DEV ? DEV_ORIGIN : PRODUCTION_ORIGIN)
).replace(/\/+$/, '')

const STORAGE_KEY = 'sc_concierge_session_v1'

/*
 * Long enough that a Railway cold start still lands — the service sleeps and the
 * first request of the day pays for the wake-up. Short enough that a visitor is
 * not left watching a button that will never change.
 */
const REQUEST_TIMEOUT_MS = 15_000

export const MAX_TEXT = 2000

/*
 * A single error shape for the UI to switch on. `kind` drives which designed
 * state renders; `message` is either the server's own safe message (shown
 * verbatim, as the contract requires) or our own calm fallback. Raw error
 * objects never reach the UI.
 */
export class ConciergeError extends Error {
  constructor(kind, message) {
    super(message)
    this.name = 'ConciergeError'
    this.kind = kind // 'network' | 'expired' | 'rate-limited' | 'invalid' | 'server'
  }
}

export function readToken() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) || null
  } catch {
    return null
  }
}

function writeToken(token) {
  try {
    sessionStorage.setItem(STORAGE_KEY, token)
  } catch {
    /* private mode / storage disabled — the conversation still works in-memory */
  }
}

export function clearToken() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* nothing to do */
  }
}

async function post(path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['X-Concierge-Session'] = token

  // A service that REFUSES gives us an error to show. One that simply never
  // answers — a cold start, a stalled connection — gives us nothing, and the
  // composer sits on "Sending" until the visitor reloads the page. The abort is
  // what turns that silence into a state the UI already knows how to render.
  const controller = new AbortController()
  const timer = setTimeout(() => {
    controller.abort()
  }, REQUEST_TIMEOUT_MS)

  let res
  let data
  try {
    try {
      res = await fetch(`${ORIGIN}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      })
    } catch (err) {
      // Same `kind` either way: to the visitor, and to every error branch in
      // the UI, a request that timed out and one that never connected are the
      // same event. Only the sentence differs, because "taking too long" is
      // worth waiting out and "could not reach" is not.
      if (err?.name === 'AbortError') {
        throw new ConciergeError('network', 'The Concierge is taking longer than usual.')
      }
      throw new ConciergeError('network', 'We could not reach the Concierge just now.')
    }

    // Inside the timeout too: headers can arrive promptly and the body still
    // never finish, which strands the UI exactly the same way.
    // Body may be absent or not JSON on an error; never let that throw.
    data = await res.json().catch(() => ({}))

    // That `catch` would otherwise turn an aborted body into an empty object
    // and a confident, wrong error further down. If the abort fired, say so.
    if (controller.signal.aborted) {
      throw new ConciergeError('network', 'The Concierge is taking longer than usual.')
    }
  } finally {
    // Cleared on every path — success, refusal, timeout — so a settled request
    // leaves no timer behind.
    clearTimeout(timer)
  }

  const safeMessage = typeof data?.error === 'string' ? data.error : ''

  if (res.ok) return data

  if (res.status === 401) {
    throw new ConciergeError('expired', safeMessage || 'This conversation has expired.')
  }
  if (res.status === 429) {
    throw new ConciergeError('rate-limited', safeMessage || 'Too many messages in a short time.')
  }
  if (res.status === 400) {
    throw new ConciergeError('invalid', safeMessage || 'That message could not be sent.')
  }
  throw new ConciergeError('server', safeMessage || 'The Concierge is having trouble responding.')
}

/* Mints a session only when one is actually needed — the first message. */
async function ensureSession() {
  const existing = readToken()
  if (existing) return existing

  const data = await post('/api/public/session', {})
  const token = typeof data?.sessionToken === 'string' ? data.sessionToken : ''
  if (!token) {
    throw new ConciergeError('server', 'The Concierge could not start a conversation.')
  }
  writeToken(token)
  return token
}

/*
 * Sends one turn. Returns { reply, escalated, awaitingContact }.
 * A 401 discards the stored token so the next message starts a fresh
 * conversation; the caller is responsible for telling the user that happened.
 */
export async function sendTurn(text) {
  const token = await ensureSession()
  try {
    const data = await post('/api/public/turn', { text }, token)
    return {
      reply: typeof data?.reply === 'string' ? data.reply : '',
      escalated: data?.escalated === true,
      awaitingContact: data?.awaitingContact === true,
    }
  } catch (err) {
    if (err instanceof ConciergeError && err.kind === 'expired') clearToken()
    throw err
  }
}

/* Optional contact capture. Never required to continue the conversation. */
export async function sendContact(email) {
  const token = readToken()
  if (!token) {
    throw new ConciergeError('expired', 'This conversation has expired.')
  }
  try {
    const data = await post('/api/public/contact', { email }, token)
    return data?.recorded === true
  } catch (err) {
    if (err instanceof ConciergeError && err.kind === 'expired') clearToken()
    throw err
  }
}
