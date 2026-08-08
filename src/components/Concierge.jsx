import { useCallback, useEffect, useRef, useState } from 'react'
import { MAX_TEXT, ConciergeError, clearToken, sendContact, sendTurn } from '../lib/concierge.js'
import './concierge.css'

/*
 * The Concierge — a front desk, not a chat bubble.
 *
 * It reads as part of stackcorp.org rather than an embedded third-party widget:
 * Recia for the one display line, Supreme for everything read continuously, the
 * brand tokens for every colour, and the same restraint as the rest of the site.
 * No floating launcher, no notification dot, no "How can I assist you today?".
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

export default function Concierge() {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const [contactState, setContactState] = useState('hidden') // hidden | asking | saved
  const [contact, setContact] = useState('')
  const [contactError, setContactError] = useState('')

  const listRef = useRef(null)
  const inputRef = useRef(null)

  // Keep the newest turn in view without yanking the page for someone reading
  // back through the conversation.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, pending])

  const submit = useCallback(
    async (event) => {
      event.preventDefault()
      const text = draft.trim()
      if (!text || pending) return

      setMessages((current) => [...current, { role: 'visitor', text }])
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
        setPending(false)
        inputRef.current?.focus()
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

  const remaining = MAX_TEXT - draft.length
  const nearLimit = remaining <= 200
  const overLimit = remaining < 0

  return (
    <section className="sc-concierge" aria-labelledby="sc-concierge-title">
      <header className="sc-concierge__head">
        <p className="sc-concierge__eyebrow">Front desk</p>
        <h1 className="sc-concierge__title" id="sc-concierge-title">
          Talk to StackCorp
        </h1>
        <p className="sc-concierge__intro">{GREETING}</p>
      </header>

      <div className="sc-concierge__panel">
        <div
          className="sc-concierge__thread"
          ref={listRef}
          role="log"
          aria-live="polite"
          aria-label="Conversation"
        >
          {messages.length === 0 && !pending && (
            <p className="sc-concierge__empty">No messages yet. Start whenever you like.</p>
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
            <p className="sc-concierge__thinking" aria-live="polite">
              <span className="sc-concierge__dot" />
              <span className="sc-concierge__dot" />
              <span className="sc-concierge__dot" />
              <span className="sc-concierge__sronly">Working on a reply</span>
            </p>
          )}
        </div>

        {contactState === 'asking' && (
          <form className="sc-concierge__contact" onSubmit={submitContact}>
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
              <button className="sc-concierge__send" type="submit">
                Send
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
          <p className="sc-concierge__saved">Thanks — we have your address and will be in touch.</p>
        )}

        {error && (
          <p className="sc-concierge__error" role="alert">
            {error.message}
          </p>
        )}

        <form className="sc-concierge__composer" onSubmit={submit}>
          <label className="sc-concierge__sronly" htmlFor="sc-concierge-input">
            Your message
          </label>
          <textarea
            className="sc-concierge__field"
            disabled={pending}
            id="sc-concierge-input"
            maxLength={MAX_TEXT}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              // Enter sends, Shift+Enter breaks the line. Standard for a
              // composer, and the button stays for anyone who never learns it.
              if (event.key === 'Enter' && !event.shiftKey) submit(event)
            }}
            placeholder="What are you trying to fix, build, or price?"
            ref={inputRef}
            rows={2}
            value={draft}
          />
          <div className="sc-concierge__actions">
            {nearLimit && (
              <span
                aria-live="polite"
                className={`sc-concierge__count${overLimit ? ' sc-concierge__count--over' : ''}`}
              >
                {remaining} left
              </span>
            )}
            {messages.length > 0 && (
              <button className="sc-concierge__skip" onClick={restart} type="button">
                Start over
              </button>
            )}
            <button
              className="sc-concierge__send"
              disabled={pending || draft.trim().length === 0 || overLimit}
              type="submit"
            >
              {pending ? 'Sending' : 'Send'}
            </button>
          </div>
        </form>
      </div>

      <p className="sc-concierge__foot">
        Replies come from what StackCorp has actually written down. When it does not know, it says
        so and passes you to a person.
      </p>
    </section>
  )
}
