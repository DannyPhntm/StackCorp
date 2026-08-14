import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import './workconcierge.css'

/*
 * /work/concierge — the Concierge case study.
 *
 * Every claim on this page is traceable to code that is deployed: the route
 * table in the Concierge repo (backend/app/api.ts), the access boundary
 * (backend/app/access.ts), the promotion path (backend/app/promote.ts), the
 * retention policy (backend/app/retention.ts), this site's CSP (vercel.json),
 * and the public client (src/lib/concierge.js). Where something is planned and
 * not built, the page says so in the same sentence.
 *
 * No screenshots. The transcript, the architecture and the loop are real DOM
 * and inline SVG, so they stay sharp at every width, follow the brand tokens,
 * and carry no risk of a stray id, token or customer detail baked into a PNG.
 */

/*
 * A real production exchange. The visitor's questions are verbatim; the replies
 * are condensed to their substance, which is why the page labels the transcript
 * as sanitized rather than presenting it as a screenshot of one.
 */
const TRANSCRIPT = [
  {
    role: 'visitor',
    text: 'What kinds of projects does StackCorp take on?',
  },
  {
    role: 'concierge',
    text:
      'Websites, AI audits, automations and custom AI systems — the work is building the thing, not advising on it. What are you trying to fix or launch?',
    note: 'Answered from published knowledge, then asked one qualification question.',
  },
  {
    role: 'visitor',
    text: 'And roughly how long does a website take?',
  },
  {
    role: 'concierge',
    text:
      'A website build runs four to eight weeks. An AI Audit is two to three weeks. Custom AI systems are phased, in chunks of six weeks at most. Which of those is closest to what you need?',
    note: 'Kept the thread: "a website" resolved against the previous turn, and the qualification continued.',
  },
]

const PUBLIC_ROUTES = [
  { method: 'POST', path: '/api/public/session', note: 'Mints one opaque session token' },
  { method: 'POST', path: '/api/public/turn', note: 'One message in, one reply out' },
  { method: 'POST', path: '/api/public/contact', note: 'Optional, never required to continue' },
  { method: 'GET', path: '/api/health', note: 'Answers { ok: true } and nothing else' },
]

const OPERATOR_SURFACE = [
  'Overview',
  'Escalations',
  'Teachings',
  'Knowledge review',
  'Memory review',
  'What we cannot answer',
  'Published knowledge',
  'Conversations',
  'Notifications',
  'Customer memory',
  'Metrics',
]

const LOOP = [
  {
    step: 'Conversation',
    who: 'visitor',
    body: 'Someone asks something the published knowledge does not cover.',
  },
  {
    step: 'Signal',
    who: 'system',
    body: 'Retrieval comes back empty and the turn is recorded as a knowledge gap.',
  },
  {
    step: 'Digest',
    who: 'system',
    body: 'Gaps are ranked by how often the same question went unanswered, not by when it was asked.',
  },
  {
    step: 'Teaching',
    who: 'founder',
    body: 'A founder writes the answer they would have given, against the turn that failed.',
  },
  {
    step: 'Decision',
    who: 'founder',
    body: 'The teaching is approved or rejected, with the operator identity and time recorded.',
  },
  {
    step: 'Promotion',
    who: 'founder',
    body: 'Promoting it creates a fact candidate in EXTRACTED — the same state a fact scraped from a document arrives in.',
  },
  {
    step: 'Review',
    who: 'founder',
    body: 'The candidate sits in the knowledge queue until a human approves it. Reviewer and time are stored on the fact.',
  },
  {
    step: 'Publication',
    who: 'founder',
    body: 'A new knowledge version is published, with a written reason and the publisher recorded on the version.',
  },
  {
    step: 'Live answer',
    who: 'system',
    body: 'Only now can the Concierge say it to a visitor.',
  },
]

const GATES = [
  {
    title: 'The engine cannot read a teaching',
    body: 'Founder corrections live at the app layer. No component of the conversation engine imports the teaching module, so a correction cannot leak into a reply by being written down.',
  },
  {
    title: 'A founder correction is not pre-trusted',
    body: 'Promotion writes the candidate at confidence 0.5 with origin owner-created — easier to enter than a document, not more trusted once it is in.',
  },
  {
    title: 'Publication needs a reason',
    body: 'The publish route refuses an empty reason string. Publishing is an act with an author, a timestamp and a sentence explaining it.',
  },
  {
    title: 'Conflicts block the version',
    body: 'The queue reports blocking conflicts and whether the tenant is publishable at all. A contradiction has to be resolved before it can go live.',
  },
  {
    title: 'Nothing learns in weights',
    body: 'There is no fine-tuning. Everything the system learns lands in reviewable, revertible records, which is what makes "why does it say that" a question with an answer.',
  },
]

const SECURITY = [
  {
    title: 'Deny by default',
    body: 'The router is the access policy. Each route declares a surface, and the field has no default — so a new endpoint is operator-only until someone deliberately types public. Five routes do: the four a visitor uses, and the operator login, which has to be reachable unauthenticated for anyone to ever authenticate.',
  },
  {
    title: 'Nothing identifying comes from the browser',
    body: 'Tenant, conversation and customer ids are read out of a signed session token after the signature verifies, never from a request body. Typing someone else’s id gets you nothing.',
  },
  {
    title: 'An opaque session, minted late',
    body: 'HMAC-SHA256 over a compact payload — deliberately not a JWT, so there is no algorithm negotiation and no alg: none. Created on the first message rather than on page load, held in sessionStorage, sent in the X-Concierge-Session header, never in the body.',
  },
  {
    title: 'The operator surface is authenticated, not hidden',
    body: 'No secret paths. An unauthenticated request to an operator route returns the same 404 as a path that does not exist, so the surface cannot be enumerated by comparing error codes.',
  },
  {
    title: 'Two origins, one allowlist',
    body: 'The backend answers the production site and itself; a cross-origin caller that is not on the list never reaches a handler. The site’s CSP names the Railway origin explicitly in connect-src, with object-src none and frame-ancestors none.',
  },
  {
    title: 'Replies are text, not markup',
    body: 'A reply is untrusted output derived from untrusted input. It renders as a text node — there is no dangerouslySetInnerHTML anywhere in the Concierge UI.',
  },
  {
    title: 'The reply carries three fields',
    body: 'reply, escalated, awaitingContact. Triggers, confidence, sources, verification failures and the handoff brief are operator diagnostics and never cross the public boundary. The health check does not report the model either.',
  },
  {
    title: 'Retention that actually deletes',
    body: 'Conversations and the contact details attached to them are purged on a 30-day policy. Teachings are deleted before transcripts, because the conversation ids needed to find them are read out of the transcripts.',
  },
]

const LEARNED = [
  {
    title: 'The response shape is the security model',
    body: 'The strongest protection was not a check — it was deciding the public endpoint returns three fields. What is never serialised cannot be leaked by a future bug in a component that reads it.',
  },
  {
    title: 'Wording is behaviour',
    body: 'Escalation replies that told a visitor to "let the team know" pushed the work back onto someone who had just handed it over. Rewriting them in first person — we have passed this on — changed how the handoff read without changing a line of logic.',
  },
  {
    title: 'Triggers need context guards',
    body: 'A price-objection pattern matched "too much" and fired on "I spend too much time on admin". The fix was a negative lookahead and twelve regression tests, not a smarter model.',
  },
  {
    title: 'Do not let it answer its own template',
    body: 'Holding lines the system had emitted were re-entering the model’s context window, so it began replying to itself. Excluding them from context was a one-line change that took a failing test to find.',
  },
  {
    title: 'Export the conversation, not the impression',
    body: 'Diagnosing quality by reading the chat UI was guesswork. Building an operator export — decision traces and triggers per turn — turned "it felt off" into a ranked list of one failing trigger.',
  },
  {
    title: 'Most escalations were one missing paragraph',
    body: 'The bulk of handoffs traced to a single trigger: a question the corpus simply did not answer. That is a writing problem wearing an AI problem’s clothes.',
  },
]

const NEXT = [
  {
    title: 'Close the top gaps in the corpus',
    body: 'The digest already ranks the unanswered questions by frequency. The next unit of work is writing those answers, reviewing them and publishing a version — not tuning a prompt.',
  },
  {
    title: 'Watch containment over time',
    body: 'Containment is reported, never targeted. A system pushed to escalate less will simply answer things it should not.',
  },
  {
    title: 'Decide when it goes in the navbar',
    body: 'The Concierge is reachable at /concierge and deliberately unadvertised, so it can be watched before it is pointed at.',
  },
  {
    title: 'A second transport',
    body: 'The engine is written to be channel-agnostic so WhatsApp can become a second mouth on the same brain. Planned and designed; not built.',
  },
]

function Kicker({ n, label }) {
  return (
    <p className="wc-kicker">
      <b>{n}</b>
      {label}
    </p>
  )
}

/* The visitor's path to a reply, and where the operator side branches off. */
function FlowDiagram() {
  return (
    <div className="wc-flow" role="img" aria-label="Visitor sends a message to the public API, which resolves the session, retrieves published knowledge, and either answers or escalates. Escalations and knowledge gaps are written to the operator side, which is separately authenticated.">
      <div className="wc-flow-lane">
        <span className="wc-lane-label">Public</span>
        <div className="wc-flow-row">
          {['Visitor', 'stackcorp.org/concierge', 'Public API', 'Session verified'].map(
            (node, i, all) => (
              <div className="wc-flow-node-wrap" key={node}>
                <span className="wc-flow-node">{node}</span>
                {i < all.length - 1 && <span className="wc-flow-link" aria-hidden="true" />}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="wc-flow-lane">
        <span className="wc-lane-label">Engine</span>
        <div className="wc-flow-row">
          {['Retrieve published knowledge', 'Assemble', 'Answer or escalate'].map(
            (node, i, all) => (
              <div className="wc-flow-node-wrap" key={node}>
                <span className="wc-flow-node">{node}</span>
                {i < all.length - 1 && <span className="wc-flow-link" aria-hidden="true" />}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="wc-flow-lane wc-flow-lane--operator">
        <span className="wc-lane-label">Operator (authenticated)</span>
        <div className="wc-flow-row">
          {['Escalation queue', 'Gaps digest', 'Knowledge review', 'Publish a version'].map(
            (node, i, all) => (
              <div className="wc-flow-node-wrap" key={node}>
                <span className="wc-flow-node">{node}</span>
                {i < all.length - 1 && <span className="wc-flow-link" aria-hidden="true" />}
              </div>
            ),
          )}
        </div>
      </div>

      <p className="wc-flow-foot">
        The two lanes never touch on the public side. Nothing an operator can see — a trigger, a
        confidence, a handoff brief — is reachable from the visitor&rsquo;s API.
      </p>
    </div>
  )
}

export default function WorkConcierge() {
  return (
    <main className="wc">
      {/* ---------------------------------------------------------------- 01 */}
      <section className="section wc-hero">
        <div className="container">
          <Reveal>
            <p className="wc-breadcrumb">
              <Link to="/#work">Work</Link>
              <span aria-hidden="true">/</span>
              <span>Concierge</span>
            </p>
            <h1 className="wc-title">StackCorp Concierge</h1>
            <p className="wc-lede">
              An AI front desk for StackCorp. It answers from knowledge we have published, keeps
              the thread of a conversation, asks the questions a person would ask, and hands over
              to a human when it should.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="wc-facts">
            {[
              ['Live at', 'stackcorp.org/concierge'],
              ['Site', 'React + Vite on Vercel'],
              ['Service', 'Separate repo, deployed on Railway'],
              ['Visitor API surface', 'Four endpoints'],
            ].map(([label, value]) => (
              <div className="wc-fact" key={label}>
                <span className="wc-fact-label">{label}</span>
                <span className="wc-fact-value">{value}</span>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <Link className="btn btn-primary wc-cta" data-haptic="tap" to="/concierge">
              Open the Concierge
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 02 */}
      <section className="section wc-section">
        <div className="container">
          <Reveal>
            <Kicker n="01" label="The challenge" />
            <h2 className="section-title">A website can explain. It cannot listen.</h2>
            <div className="wc-prose">
              <p>
                Our own site could say what we do. It could not tell whether the person reading it
                had a broken checkout, a pile of AI subscriptions nobody had audited, or a lead
                inbox going cold overnight — and it could not ask.
              </p>
              <p>
                So the problem was never &ldquo;we need a chatbot&rdquo;. It was this: how do you
                make a website behave like an intelligent front desk without handing a language
                model uncontrolled access to what the company claims, or to the systems where
                customers live?
              </p>
              <p>
                Those two goals pull against each other. A model that can say anything is useful
                and unaccountable. A model that can only recite a script is accountable and
                useless. The interesting work was in the middle.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 03 */}
      <section className="section wc-section wc-section--tint">
        <div className="container">
          <Reveal>
            <Kicker n="02" label="The idea" />
            <h2 className="section-title">Concierge identifies. Founders decide.</h2>
            <div className="wc-prose">
              <p>
                The Concierge sits between the public website and a controlled knowledge system. It
                is allowed to be helpful in real time and is not allowed to decide what is true.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="wc-split">
            <div className="wc-col card">
              <h3 className="wc-col-title">What it does on its own</h3>
              <ul className="wc-list">
                <li>Answers from knowledge that has been published</li>
                <li>Holds the thread across turns of one conversation</li>
                <li>Asks a qualification question when there is one worth asking</li>
                <li>Recognises when a person should take over</li>
                <li>Offers to take a number or an email, and never insists</li>
                <li>Records what it could not answer</li>
              </ul>
            </div>
            <div className="wc-col card wc-col--negative">
              <h3 className="wc-col-title">What it never does</h3>
              <ul className="wc-list">
                <li>Publish knowledge to itself</li>
                <li>Read a founder&rsquo;s correction at answer time</li>
                <li>Learn anything into model weights</li>
                <li>Show a visitor an id, a confidence or a trigger</li>
                <li>Reach an operator route</li>
                <li>Render a reply as markup</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 04 */}
      <section className="section wc-section">
        <div className="container">
          <Reveal>
            <Kicker n="03" label="How it works" />
            <h2 className="section-title">Two lanes, one boundary</h2>
            <p className="section-sub">
              A visitor&rsquo;s entire world is four endpoints. Everything else — the queues, the
              review, the metrics — is behind an operator login on the same service.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="wc-panel card">
            <FlowDiagram />
          </Reveal>

          <Reveal delay={0.14} className="wc-routes">
            <h3 className="wc-col-title">The visitor&rsquo;s surface, in full</h3>
            <ul className="wc-route-list">
              {PUBLIC_ROUTES.map((route) => (
                <li className="wc-route" key={route.path}>
                  <span className="wc-route-method">{route.method}</span>
                  <code className="wc-route-path">{route.path}</code>
                  <span className="wc-route-note">{route.note}</span>
                </li>
              ))}
            </ul>
            <p className="wc-operator-note">
              One more route answers without a session — the operator login, which has to be
              reachable for anyone to sign in. Everything past it is authenticated.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 05 */}
      <section className="section wc-section wc-section--tint">
        <div className="container">
          <Reveal>
            <Kicker n="04" label="The conversation" />
            <h2 className="section-title">What it actually sounds like</h2>
            <p className="section-sub">
              From a real production conversation. The visitor&rsquo;s questions are verbatim; the
              replies are condensed to what they said.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="wc-thread card">
            {TRANSCRIPT.map((turn, i) => (
              <article className={`wc-turn wc-turn--${turn.role}`} key={`${turn.role}-${String(i)}`}>
                <span className="wc-who">{turn.role === 'visitor' ? 'Visitor' : 'StackCorp'}</span>
                <p className="wc-turn-text">{turn.text}</p>
                {turn.note && <p className="wc-turn-note">{turn.note}</p>}
              </article>
            ))}
            <p className="wc-thread-foot">
              One session, minted on the first message and carried through the second. The reply
              body the browser received contained three fields and no identifiers.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 06 */}
      <section className="section wc-section">
        <div className="container">
          <Reveal>
            <Kicker n="05" label="The learning loop" />
            <h2 className="section-title">Promotion is not publication</h2>
            <p className="section-sub">
              The distance between &ldquo;a founder wrote an answer&rdquo; and &ldquo;a visitor
              hears it&rdquo; is four deliberate human steps. That distance is the product.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="wc-loop">
            <ol className="wc-loop-list">
              {LOOP.map((stage, i) => (
                <li className={`wc-loop-item wc-loop-item--${stage.who}`} key={stage.step}>
                  <span className="wc-loop-index" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="wc-loop-body">
                    <h3 className="wc-loop-step">
                      {stage.step}
                      <span className="wc-loop-who">
                        {stage.who === 'founder' ? 'Human' : stage.who === 'visitor' ? 'Visitor' : 'System'}
                      </span>
                    </h3>
                    <p>{stage.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 07 */}
      <section className="section wc-section wc-section--tint">
        <div className="container">
          <Reveal>
            <Kicker n="06" label="Human control" />
            <h2 className="section-title">Where a person has to say yes</h2>
          </Reveal>

          <div className="wc-grid">
            {GATES.map((gate, i) => (
              <Reveal className="wc-card card" delay={0.06 * i} key={gate.title}>
                <h3 className="wc-card-title">{gate.title}</h3>
                <p>{gate.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 08 */}
      <section className="section wc-section">
        <div className="container">
          <Reveal>
            <Kicker n="07" label="Under the hood" />
            <h2 className="section-title">Two deployments that barely know each other</h2>
            <div className="wc-prose">
              <p>
                The site is a React app on Vercel. The Concierge is a separate repository and a
                separate deployment on Railway, reached cross-origin. The website holds no
                knowledge, no model configuration and no operator anything — it holds a client for
                four endpoints and a token it did not mint.
              </p>
              <p>
                That separation is why the site can be rebuilt, redesigned or rolled back without
                touching what the company claims, and why the Concierge can change models without a
                website deploy.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="wc-operator card">
            <h3 className="wc-col-title">The operator dashboard, by its tabs</h3>
            <p className="wc-operator-note">
              Behind a login on the Concierge service. Not pictured, deliberately: every panel is
              full of real conversations.
            </p>
            <ul className="wc-tabs">
              {OPERATOR_SURFACE.map((tab) => (
                <li className="wc-tab" key={tab}>
                  {tab}
                </li>
              ))}
            </ul>
            <p className="wc-operator-note">
              Reviewer, publisher and time are stored on the records themselves, so &ldquo;who
              approved this and when&rdquo; is a lookup rather than an argument.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 09 */}
      <section className="section wc-section wc-section--tint">
        <div className="container">
          <Reveal>
            <Kicker n="08" label="Security & privacy" />
            <h2 className="section-title">The boundary, stated plainly</h2>
            <p className="section-sub">
              None of this makes the system unbreakable. It makes the blast radius of a mistake
              small, and it makes the boundary something you can read.
            </p>
          </Reveal>

          <div className="wc-grid wc-grid--two">
            {SECURITY.map((item, i) => (
              <Reveal className="wc-card card" delay={0.05 * i} key={item.title}>
                <h3 className="wc-card-title">{item.title}</h3>
                <p>{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 10 */}
      <section className="section wc-section">
        <div className="container">
          <Reveal>
            <Kicker n="09" label="Designing the experience" />
            <h2 className="section-title">The conversation is the page</h2>
            <div className="wc-prose">
              <p>
                The first version was a card: a transcript in a white panel with its own scrollbar,
                sitting inside the site. Two scroll surfaces, and a conversation trapped in a well —
                which is exactly what makes an interface read as an embedded third-party thing.
              </p>
              <p>
                The current version drops the card. The conversation uses the site&rsquo;s own dark
                surface, scrolls with the document, and the composer floats above it as translucent
                chrome. The visitor&rsquo;s message carries the raised surface; the reply is plain
                prose at full measure. The earlier layout had it the wrong way round and faded the
                visitor&rsquo;s own words to the quietest thing on screen.
              </p>
            </div>
          </Reveal>

          <div className="wc-grid">
            {[
              [
                'Openers that do not send',
                'The three starter questions fill the composer and hand focus back. The question someone nearly asked is usually better than the one we guessed.',
              ],
              [
                'The greeting knows when to leave',
                'The intro is the empty state’s job. Once there is a transcript to read, it stops earning the space.',
              ],
              [
                'Contact lives in the transcript',
                'When a handoff happens, the ask is one field that takes a number or an email, with a channel choice — inside the conversation, in the same column, not a form dropped underneath it.',
              ],
              [
                'Its own button is not called Send',
                'The composer already has one. Two buttons named Send, on screen at once, are indistinguishable to a screen reader.',
              ],
              [
                'Focus comes back',
                'Restoring focus in the submit handler silently failed — the textarea was still disabled at that moment. Waiting for the re-render is what stopped dropping keyboard users to the top of the page after every message.',
              ],
              [
                'Calm under load',
                'A typing indicator rather than a spinner, a 15-second timeout so a cold start becomes a sentence instead of a stuck button, and autoscroll that respects reduced-motion.',
              ],
            ].map(([title, body], i) => (
              <Reveal className="wc-card card" delay={0.05 * i} key={title}>
                <h3 className="wc-card-title">{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 11 */}
      <section className="section wc-section wc-section--tint">
        <div className="container">
          <Reveal>
            <Kicker n="10" label="What we learned" />
            <h2 className="section-title">Six things that cost us a day each</h2>
          </Reveal>

          <div className="wc-grid wc-grid--two">
            {LEARNED.map((item, i) => (
              <Reveal className="wc-card card" delay={0.05 * i} key={item.title}>
                <h3 className="wc-card-title">{item.title}</h3>
                <p>{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 12 */}
      <section className="section wc-section">
        <div className="container">
          <Reveal>
            <Kicker n="11" label="What's next" />
            <h2 className="section-title">The work we can already name</h2>
          </Reveal>

          <div className="wc-grid">
            {NEXT.map((item, i) => (
              <Reveal className="wc-card card" delay={0.06 * i} key={item.title}>
                <h3 className="wc-card-title">{item.title}</h3>
                <p>{item.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.16} className="wc-outro card">
            <h3 className="wc-outro-title">Want one of these on your site?</h3>
            <p>
              The interesting part is not the model. It is deciding what your system is allowed to
              say, and who has to approve it before it says it.
            </p>
            <div className="wc-outro-actions">
              <Link className="btn btn-primary" data-haptic="tap" to="/concierge">
                Ask the Concierge
              </Link>
              <Link className="btn btn-ghost" data-haptic="tap" to="/#contact">
                Talk to a founder
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
