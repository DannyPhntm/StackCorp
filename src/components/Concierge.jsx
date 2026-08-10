import { useCallback, useEffect, useRef, useState } from 'react'
import { MAX_TEXT, ConciergeError, clearToken, sendContact, sendTurn } from '../lib/concierge.js'
import './concierge.css'

/*
 * The Concierge — a conversation, not a chat widget on a page.
 *
 * WHAT CHANGED IN THE REDESIGN, AND WHY
 *
 * The transcript used to live in a white card with its own 52vh scrollbar. Two
 * scroll surfaces, and a conversation trapped in a well — which is precisely
 * what makes an interface read as an embedded third-party thing. Now the
 * conversation IS the page: it uses the site's own dark surface, scrolls with
 * the document, and the composer floats above it as translucent chrome.
 *
 * The visitor's message carries the raised surface; the reply is plain prose at
 * full measure. That is the right way round — the old layout faded the
 * visitor's own words to 68% opacity, making the thing they just typed the
 * quietest element on screen.
 *
 * WHAT IT NEVER DOES
 *
 *  - No dangerouslySetInnerHTML. A reply is untrusted output derived from
 *    untrusted input, and rendering it as text is where that path is closed.
 *  - Shows no id, no confidence, no source, no diagnostic — the public API
 *    returns none of them, and this component asks for nothing else.
 *  - Never blocks the conversation on the optional contact field.
 */

const GREETING =
  'Ask about what we build, what it costs, or what is going wrong with something you already have. If it needs a person, we will say so and get one.'

/*
 * Openers, not shortcuts: they fill the composer and hand focus back rather
 * than sending. The visitor still chooses to send, and can edit first — the
 * question they nearly asked is usually better than the one we guessed.
 */
const OPENERS = [
  'What does a website actually cost?',
  'Can you audit the AI tools we already pay for?',
  'Our lead follow-up is too slow — can that be automated?',
]

export default function Concierge() {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const [contactState, setContactState] = useState('hidden') // hidden | asking | saved
  const [contact, setContact] = useState('')
  const [contactError, setContactError] = useState('')

  const endRef = useRef(null)
  const inputRef = useRef(null)
  const refocus = useRef(false)

  const started = messages.length > 0 || pending

  /*
   * Return focus to the composer once the turn settles.
   *
   * This used to be a `focus()` in the submit's `finally`, which silently did
   * nothing: `setPending(false)` had not been flushed yet, so the textarea was
   * still `disabled` at the moment focus was requested, and a disabled element
   * cannot take focus. Keyboard users were dropped back to the top of the
   * document after every message. Waiting for the re-render fixes it.
   */
  useEffect(() => {
    if (pending || !refocus.current) return
    refocus.current = false
    inputRef.current?.focus()
  }, [pending])

  // The composer grows with the draft instead of scrolling inside two rows.
  // Capped so a pasted essay cannot swallow the conversation behind it.
  useEffect(() => {
    const field = inputRef.current
    if (!field) return
    field.style.height = 'auto'
    field.style.height = `${String(Math.min(field.scrollHeight, 200))}px`
  }, [draft])

  // Keep the newest turn in view. Anchored to a sentinel after the last turn
  // rather than scrolling a container, because the page is the scroller now.
  useEffect(() => {
    if (!started) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    endRef.current?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'end',
    })
  }, [messages, pending, contactState, started])

  const submit = useCallback(
    async (event) => {
      event.preventDefault()
      const text = draft.trim()
      if (!text || pending) return

      setMessages((current) => [...current, { role: 'visitor', text }])
      refocus.current = true
      setDraft('')
      setError(null)
      setPending(true)

      try {
        const result = await sendTurn(text)
        setMessages((current) => [...current, { role: 'concierge', text: result.reply }])
        if (result.escalated && result.awaitingContact && contactState !== 'saved') {
          setContactState('asking')
        }
      } catch (err) {
        const kind = err instanceof ConciergeError ? err.kind : 'server'
        const message =
          err instanceof ConciergeError ? err.message : 'Something went wrong on our side.'
        setError({ kind, message })
        // An expired session is a restarted conversation, and saying so is
        // better than a reply that silently belongs to nothing.
        if (kind === 'expired') {
          clearToken()
          setMessages([])
          setContactState('hidden')
        }
      } finally {
        // Focus is restored by the effect above, once the re-render has
        // actually re-enabled the field.
        setPending(false)
      }
    },
    [contactState, draft, pending],
  )

  const submitContact = useCallback(
    async (event) => {
      event.preventDefault()
      const email = contact.trim()
      if (!email) return
      setContactError('')
      try {
        await sendContact(email)
        setContactState('saved')
      } catch (err) {
        setContactError(
          err instanceof ConciergeError ? err.message : 'That could not be saved just now.',
        )
      }
    },
    [contact],
  )

  const restart = useCallback(() => {
    clearToken()
    setMessages([])
    setError(null)
    setDraft('')
    setContact('')
    setContactState('hidden')
    setContactError('')
    inputRef.current?.focus()
  }, [])

  const useOpener = useCallback((text) => {
    setDraft(text)
    inputRef.current?.focus()
  }, [])

  const remaining = MAX_TEXT - draft.length
  const nearLimit = remaining <= 200
  const overLimit = remaining < 0

  return (
    <section
      aria-labelledby="sc-concierge-title"
      className={`sc-concierge${started ? ' sc-concierge--started' : ''}`}
    >
      <header className="sc-concierge__head">
        <p className="sc-concierge__eyebrow">Front desk</p>
        <h1 className="sc-concierge__title" id="sc-concierge-title">
          Talk to StackCorp
        </h1>
        {/* The greeting is the empty state's job. Once there is a conversation
            to read, it stops earning the space and the transcript takes it. */}
        {!started && <p className="sc-concierge__intro">{GREETING}</p>}
      </header>

      <div className="sc-concierge__panel">
        <div
          aria-label="Conversation"
          aria-live="polite"
          className="sc-concierge__thread"
          role="log"
        >
          {!started && (
            <div className="sc-concierge__empty">
              <p className="sc-concierge__emptyLead">Start anywhere.</p>
              <ul className="sc-concierge__openers">
                {OPENERS.map((opener) => (
                  <li key={opener}>
                    <button
                      className="sc-concierge__opener"
                      onClick={() => useOpener(opener)}
                      type="button"
                    >
                      {opener}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {messages.map((message, index) => (
            <article
              className={`sc-concierge__turn sc-concierge__turn--${message.role}`}
              // Messages are append-only and never reordered, so the index is
              // a stable identity here. The server returns no id to use instead.
              key={`${message.role}-${String(index)}`}
            >
              <span className="sc-concierge__who">
                {message.role === 'visitor' ? 'You' : 'StackCorp'}
              </span>
              {/* Plain text, always. This is the injection path. */}
              <p className="sc-concierge__text">{message.text}</p>
            </article>
          ))}

          {pending && (
            <p className="sc-concierge__thinking">
              <span className="sc-concierge__dot" />
              <span className="sc-concierge__dot" />
              <span className="sc-concierge__dot" />
              <span className="sc-concierge__sronly">Working on a reply</span>
            </p>
          )}

          {contactState === 'asking' && (
            /* Part of the transcript, not a form that drops in underneath it:
               same column, same rhythm, introduced by the same speaker label. */
            <form className="sc-concierge__contact" onSubmit={submitContact}>
              <span className="sc-concierge__who">StackCorp</span>
              <label className="sc-concierge__label" htmlFor="sc-concierge-email">
                Where should we reach you?
              </label>
              <p className="sc-concierge__note">
                Optional. A person is picking this up, and without an address we have no way to
                reply. Kept for 30 days with the conversation, then deleted.
              </p>
              <div className="sc-concierge__contactRow">
                <input
                  autoComplete="email"
                  className="sc-concierge__input"
                  id="sc-concierge-email"
                  inputMode="email"
                  maxLength={254}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="you@company.com"
                  type="email"
                  value={contact}
                />
                {/*
                  Not "Send". The composer's button is already that, and both
                  are on screen at once here, so a screen reader announced two
                  identical buttons with no way to tell them apart.
                */}
                <button className="sc-concierge__send sc-concierge__send--text" type="submit">
                  Save address
                </button>
                <button
                  className="sc-concierge__skip"
                  onClick={() => setContactState('hidden')}
                  type="button"
                >
                  Not now
                </button>
              </div>
              {contactError && (
                <p className="sc-concierge__error" role="alert">
                  {contactError}
                </p>
              )}
            </form>
          )}

          {contactState === 'saved' && (
            <p className="sc-concierge__saved">
              Thanks — we have your address and will be in touch.
            </p>
          )}

          {error && (
            <p className="sc-concierge__error" role="alert">
              {error.message}
            </p>
          )}

          <div className="sc-concierge__end" ref={endRef} />
        </div>

        <form className="sc-concierge__composer" onSubmit={submit}>
          <div className="sc-concierge__field">
            <label className="sc-concierge__sronly" htmlFor="sc-concierge-input">
              Your message
            </label>
            <textarea
              className="sc-concierge__textarea"
              disabled={pending}
              id="sc-concierge-input"
              maxLength={MAX_TEXT}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                // Enter sends, Shift+Enter breaks the line. Standard for a
                // composer, and the button stays for anyone who never learns it.
                if (event.key === 'Enter' && !event.shiftKey) submit(event)
              }}
              placeholder="Ask about a build, a price, or something that is broken"
              ref={inputRef}
              rows={1}
              value={draft}
            />
            {nearLimit && (
              <span
                aria-live="polite"
                className={`sc-concierge__count${overLimit ? ' sc-concierge__count--over' : ''}`}
              >
                {remaining}
              </span>
            )}
            <button
              aria-label={pending ? 'Sending' : 'Send message'}
              className="sc-concierge__send"
              disabled={pending || draft.trim().length === 0 || overLimit}
              type="submit"
            >
              {/* Decorative: the button's name comes from aria-label above. */}
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
                <path
                  d="M12 19V5M12 5l-6 6M12 5l6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
          <div className="sc-concierge__meta">
            <p className="sc-concierge__foot">
              Replies come from what StackCorp has actually written down. When it does not know, it
              says so and passes you to a person.
            </p>
            {started && (
              <button className="sc-concierge__skip" onClick={restart} type="button">
                Start over
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
