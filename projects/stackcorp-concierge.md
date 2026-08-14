# StackCorp Concierge — Case Study

**An AI front desk for StackCorp.**
Live at [stackcorp.org/concierge](https://stackcorp.org/concierge) · Case study page at `/work/concierge`

| | |
|---|---|
| Website | React + Vite, deployed on Vercel (this repo) |
| Concierge service | Separate repo `StackCorp-Concierge`, deployed on Railway |
| Visitor API surface | Four endpoints |
| Public UI | A page, not a floating widget — deliberately not in the navbar yet |
| Retention | 30 days, then purged |

> **Scope note.** This document is the written source of truth for the case study rendered at
> `/work/concierge` (`src/pages/WorkConcierge.jsx`). Every claim below is traceable to deployed
> code, and the file it lives in is named. Where something is planned and not built, it says so.

---

## 1. The problem

Our own site could say what we do. It could not tell whether the person reading it had a broken
checkout, a pile of AI subscriptions nobody had audited, or a lead inbox going cold overnight —
and it could not ask.

So the problem was never "we need a chatbot". It was:

**How do you make a website behave like an intelligent front desk without handing a language model
uncontrolled access to what the company claims, or to the systems where customers live?**

Those two goals pull against each other. A model that can say anything is useful and unaccountable.
A model that can only recite a script is accountable and useless. The work was in the middle.

---

## 2. The idea

> **Concierge identifies. Founders decide.**

The Concierge sits between the public website and a controlled knowledge system. It is allowed to
be helpful in real time and is not allowed to decide what is true.

**What it does on its own**

- Answers from knowledge that has been published
- Holds the thread across turns of one conversation
- Asks a qualification question when there is one worth asking
- Recognises when a person should take over
- Offers to take a number or an email, and never insists
- Records what it could not answer

**What it never does**

- Publish knowledge to itself
- Read a founder's correction at answer time
- Learn anything into model weights
- Show a visitor an id, a confidence value or a trigger
- Reach an operator route
- Render a reply as markup

---

## 3. What the visitor experiences

A real production conversation. The visitor's questions are verbatim; the replies are condensed to
their substance.

> **Visitor** — What kinds of projects does StackCorp take on?
>
> **StackCorp** — Websites, AI audits, automations and custom AI systems — the work is building the
> thing, not advising on it. What are you trying to fix or launch?
>
> *Answered from published knowledge, then asked one qualification question.*

> **Visitor** — And roughly how long does a website take?
>
> **StackCorp** — A website build runs four to eight weeks. An AI Audit is two to three weeks.
> Custom AI systems are phased, in chunks of six weeks at most. Which of those is closest to what
> you need?
>
> *Kept the thread: "a website" resolved against the previous turn, and the qualification continued.*

One session, minted on the first message and carried through the second. The reply body the browser
received contained three fields and no identifiers.

---

## 4. How the system works

```
PUBLIC        Visitor → stackcorp.org/concierge → Public API → Session verified
                                                                    │
ENGINE                     Retrieve published knowledge → Assemble → Answer or escalate
                                                                    │
OPERATOR      Escalation queue → Gaps digest → Knowledge review → Publish a version
(authenticated)
```

The two lanes never touch on the public side. Nothing an operator can see — a trigger, a confidence,
a handoff brief — is reachable from the visitor's API.

### The visitor's surface, in full

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/public/session` | Mints one opaque session token |
| `POST` | `/api/public/turn` | One message in, one reply out |
| `POST` | `/api/public/contact` | Optional; never required to continue |
| `GET` | `/api/health` | Answers `{ ok: true }` and nothing else |

One further route answers without a session — `POST /api/operator/login` — because the login has to
be reachable for anyone to sign in. Everything past it is authenticated.

*Source: `backend/app/api.ts` → `routeTable()`.*

### The operator side

A dashboard on the Concierge service, behind a login. Its tabs are the system:

Overview · Escalations · Teachings · Knowledge review · Memory review · What we cannot answer ·
Published knowledge · Conversations · Notifications · Customer memory · Metrics

Reviewer, publisher and time are stored on the records themselves, so "who approved this and when"
is a lookup rather than an argument.

*Source: `backend/app/static/dashboard.html`.*

---

## 5. The learning loop

The distance between "a founder wrote an answer" and "a visitor hears it" is four deliberate human
steps. That distance is the product.

| # | Step | Who | What happens |
|---|---|---|---|
| 01 | Conversation | Visitor | Someone asks something the published knowledge does not cover |
| 02 | Signal | System | Retrieval comes back empty; the turn is recorded as a knowledge gap |
| 03 | Digest | System | Gaps are ranked by how often the same question went unanswered, not by when it was asked |
| 04 | Teaching | **Founder** | A founder writes the answer they would have given, against the turn that failed |
| 05 | Decision | **Founder** | The teaching is approved or rejected, with operator identity and time recorded |
| 06 | Promotion | **Founder** | Creates a fact candidate in `EXTRACTED` — the same state a fact scraped from a document arrives in |
| 07 | Review | **Founder** | The candidate sits in the knowledge queue until a human approves it; reviewer and time are stored on the fact |
| 08 | Publication | **Founder** | A new knowledge version is published, with a written reason and the publisher recorded |
| 09 | Live answer | System | Only now can the Concierge say it to a visitor |

### Promotion is not publication

This is the load-bearing idea. A founder correction entering the queue is not the same event as that
correction reaching a customer, and the system refuses to collapse the two.

**Where a person has to say yes:**

1. **The engine cannot read a teaching.** Founder corrections live at the app layer. No file under
   `backend/conversation/` references the teaching module at all — verified by grep, not by
   convention — so a correction cannot leak into a reply by being written down.
2. **A founder correction is not pre-trusted.** Promotion writes the candidate at confidence `0.5`
   with origin `owner-created`: easier to enter than a document, not more trusted once it is in.
   (`backend/app/promote.ts`)
3. **Publication needs a reason.** The publish route refuses an empty reason string. Publishing is
   an act with an author, a timestamp and a sentence explaining it.
4. **Conflicts block the version.** The queue reports blocking conflicts and whether the tenant is
   publishable at all. A contradiction has to be resolved before it can go live.
5. **Nothing learns in weights.** There is no fine-tuning. Everything learned lands in reviewable,
   revertible records — which is what makes "why does it say that" a question with an answer.

---

## 6. Escalation

When the Concierge cannot answer from published knowledge, it says so and hands over rather than
inventing. The handoff:

- writes an escalation the operator side can see, with a brief written for a founder
- offers — never demands — a way to reply: one field that accepts a phone number or an email,
  plus a channel preference
- notifies fire-and-forget, so a mail provider being down never costs a visitor their reply
- speaks in first person about what *we* did ("this has been passed to the team"), not about what
  the visitor should now go and do

That last point is a behavioural rule enforced in the escalation instructions, added after real
transcripts showed the earlier wording pushing work back onto someone who had just handed it over.

---

## 7. Security and privacy

None of this makes the system unbreakable. It makes the blast radius of a mistake small, and it
makes the boundary something you can read.

**Deny by default.** The router is the access policy. Each route declares a `surface`, and the field
has no default — a new endpoint is operator-only until someone deliberately types `public`.

**Nothing identifying comes from the browser.** Tenant, conversation and customer ids are read out
of a signed session token after the signature verifies, never from a request body. Typing someone
else's id gets you nothing. (`backend/app/access.ts`)

**An opaque session, minted late.** HMAC-SHA256 over a compact payload — deliberately not a JWT, so
there is no algorithm negotiation and no `alg: none`. Created on the first message rather than on
page load, held in `sessionStorage`, sent in the `X-Concierge-Session` header, never in the body.

**The operator surface is authenticated, not hidden.** No secret paths. An unauthenticated request
to an operator route returns the same `404` as a path that does not exist, so the surface cannot be
enumerated by comparing error codes.

**Two origins, one allowlist.** The backend answers the production site and itself; a cross-origin
caller that is not on the list never reaches a handler. This site's CSP names the Railway origin
explicitly in `connect-src`, with `object-src 'none'` and `frame-ancestors 'none'`. (`vercel.json`)

**Replies are text, not markup.** A reply is untrusted output derived from untrusted input. It
renders as a text node — there is no `dangerouslySetInnerHTML` anywhere in the Concierge UI.

**The reply carries three fields.** `reply`, `escalated`, `awaitingContact`. Triggers, confidence,
sources, verification failures and the handoff brief are operator diagnostics and never cross the
public boundary. The health check does not report the model either.

**Retention that actually deletes.** Conversations and the contact details attached to them are
purged on a 30-day policy. Teachings are deleted before transcripts, because the conversation ids
needed to find them are read out of the transcripts. (`backend/app/retention.ts`)

---

## 8. Design decisions

The first version was a card: a transcript in a white panel with its own scrollbar, sitting inside
the site. Two scroll surfaces, and a conversation trapped in a well — which is exactly what makes an
interface read as an embedded third-party thing.

The current version drops the card. The conversation uses the site's own dark surface, scrolls with
the document, and the composer floats above it as translucent chrome. The visitor's message carries
the raised surface; the reply is plain prose at full measure. The earlier layout had it the wrong
way round and faded the visitor's own words to the quietest thing on screen.

- **Openers that do not send.** The three starter questions fill the composer and hand focus back.
  The question someone nearly asked is usually better than the one we guessed.
- **The greeting knows when to leave.** The intro is the empty state's job; once there is a
  transcript to read, it stops earning the space.
- **Contact lives in the transcript.** The ask is one field taking a number or an email, with a
  channel choice — inside the conversation, in the same column, not a form dropped underneath it.
- **Its own button is not called Send.** The composer already has one; two buttons named Send on
  screen at once are indistinguishable to a screen reader.
- **Focus comes back.** Restoring focus in the submit handler silently failed — the textarea was
  still `disabled` at that moment. Waiting for the re-render stopped dropping keyboard users to the
  top of the page after every message.
- **Calm under load.** A typing indicator rather than a spinner, a 15-second timeout so a Railway
  cold start becomes a sentence instead of a stuck button, and autoscroll that respects
  `prefers-reduced-motion`.

---

## 9. What we learned

1. **The response shape is the security model.** The strongest protection was not a check — it was
   deciding the public endpoint returns three fields. What is never serialised cannot be leaked by a
   future bug in a component that reads it.
2. **Wording is behaviour.** Escalation replies telling a visitor to "let the team know" pushed work
   back onto someone who had just handed it over. Rewriting them in first person changed how the
   handoff read without changing a line of logic.
3. **Triggers need context guards.** A price-objection pattern matched "too much" and fired on
   "I spend too much time on admin". The fix was a negative lookahead and twelve regression tests,
   not a smarter model.
4. **Do not let it answer its own template.** Holding lines the system had emitted were re-entering
   the model's context window, so it began replying to itself. Excluding them was a one-line change
   that took a failing test to find.
5. **Export the conversation, not the impression.** Diagnosing quality by reading the chat UI was
   guesswork. An operator export — decision traces and triggers per turn — turned "it felt off" into
   a ranked list with one failing trigger at the top.
6. **Most escalations were one missing paragraph.** The bulk of handoffs traced to a single trigger:
   a question the corpus simply did not answer. That is a writing problem wearing an AI problem's
   clothes.

---

## 10. What's next

- **Close the top gaps in the corpus.** The digest already ranks unanswered questions by frequency.
  The next unit of work is writing those answers, reviewing them and publishing a version — not
  tuning a prompt.
- **Watch containment over time.** Containment is reported, never targeted. A system pushed to
  escalate less will simply answer things it should not.
- **Decide when it goes in the navbar.** The Concierge is reachable and deliberately unadvertised so
  it can be watched before it is pointed at.
- **A second transport.** The engine is written to be channel-agnostic so WhatsApp can become a
  second mouth on the same brain. Planned and designed; **not built**.

---

## Where this lives

| Concern | Repo | Path |
|---|---|---|
| Case study page | StackCorp | `src/pages/WorkConcierge.jsx`, `src/pages/workconcierge.css` |
| Route | StackCorp | `src/App.jsx` → `/work/concierge` |
| Entry point from home | StackCorp | `src/components/Work.jsx` (`#work` section) |
| Live Concierge UI | StackCorp | `src/pages/Concierge.jsx`, `src/components/Concierge.jsx` |
| Public API client | StackCorp | `src/lib/concierge.js` |
| CSP / headers | StackCorp | `vercel.json` |
| API + route table | StackCorp-Concierge | `backend/app/api.ts` |
| Access boundary | StackCorp-Concierge | `backend/app/access.ts` |
| Teaching → fact promotion | StackCorp-Concierge | `backend/app/promote.ts` |
| Retention | StackCorp-Concierge | `backend/app/retention.ts` |
| Operator dashboard | StackCorp-Concierge | `backend/app/static/dashboard.html` |

**Never in this repo:** operator credentials, session tokens, tenant ids, internal trigger ids, or
any customer conversation content.
