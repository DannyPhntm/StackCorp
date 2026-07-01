# Lead Generation System — The Guide Institute

**Companion to:** [implementation-roadmap.md](implementation-roadmap.md) · [proposal.md](proposal.md)
**Purpose:** the full strategic + automated lead-generation "machine" — how leads are *created* across paid, organic, and outbound channels and fed into the CRM/nurture system already designed.
**Stack posture:** lean / low-cost (see [Tool Stack](#recommended-lean-tool-stack)).

---

## 0. Design Principle — Three Engines, One CRM

Most institutes rely on a single, unreliable lead source (word of mouth). We build **three independent engines** so lead flow never depends on one channel — all feeding one central CRM where the nurture + handoff system takes over.

```
 ENGINE 1: INBOUND (pull)          ENGINE 2: OUTBOUND (push)         ENGINE 3: CONVERT
 ┌───────────────────────┐        ┌────────────────────────────┐   ┌──────────────────┐
 │ • Paid ads (Meta/Goog)│        │ 2A Database reactivation    │   │ Capture → Tag →  │
 │ • Organic / SEO / Reels│  ───▶ │ 2B B2B partnership outbound │──▶│ Score → Nurture →│
 │ • Referral engine      │        │    (Apollo + cold email)    │   │ Hot-lead handoff │
 │ • Lead magnets         │        │ 2C Cold calling             │   │ → Admissions     │
 └───────────────────────┘        └────────────────────────────┘   └──────────────────┘
                    \_________________________|__________________________/
                                     ONE CRM (single source of truth)
```

**Rule:** a lead is never "one channel's" — every inquiry lands in the same CRM, is tagged by source, scored, and nurtured identically. We optimize on **cost per enrollment**, not cost per lead.

---

## 1. Important Note on Audience & Tool Fit (read before Engine 2)

The Guide Institute sells to **parents and students (B2C)**. That shapes *how* each outbound tool is used:

- **Apollo is a B2B contact database** — it holds *professional/organizational* contacts, not individual parents. We therefore use Apollo/cold-email for the **B2B partnership arm only** (schools, corporates, universities), which is a legitimate, high-leverage way to reach *many* students at once. We do **not** cold-email parents (ineffective and non-compliant).
- **Cold calling & WhatsApp/SMS outbound** deliver their best, cleanest ROI on **your own database** (past inquiries, ex-students, event lists) — warm, permission-based, and free of the compliance risk of cold consumer contact.

This keeps every channel both **effective** and **above-board**.

---

## 2. ENGINE 1 — Inbound (Paid + Organic + Referral)

### 2.1 Paid Ads (primary volume driver)
Structured so spend is always-on and scaled into peak windows (results days, term starts).

**Meta Ads (Facebook + Instagram) — primary.** Campaign structure:
- **Campaign A — Parents / Conversions:** objective = leads; creative = results, credibility, "book a free assessment." Audience: location radius around the institute + parent-age + interest layers.
- **Campaign B — Students / Reels:** objective = leads/engagement; creative = relatable "struggling with [subject]?" Reels → free past-paper pack.
- **Campaign C — Retargeting:** everyone who watched 50%+ of a Reel, visited the landing page, or opened WhatsApp but didn't convert → strongest offer (free trial class).
- **Split-test** Meta Lead Forms (cheap, instant) vs. click-to-landing-page vs. **click-to-WhatsApp** (usually the winner in this market). Keep the lowest cost-per-*qualified*-lead.

**Google Search Ads (high intent):** exact/phrase match on *"A level [subject] tuition [area]"*, *"O level tuition near me"*, *"best [subject] teacher [city]"*. Lower volume, higher intent — run seasonally.

**Budget logic:** start lean on 1–2 campaigns, prove cost-per-qualified-lead, then scale the winners. Always run a small retargeting budget (cheapest conversions).

### 2.2 Organic (compounds, lowers blended cost over time)
- **Short-form video (Reels/TikTok):** "1-minute exam tip" + "solve this past-paper question" — positions teachers as experts, feeds the student audience, and doubles as ad creative.
- **Google Business Profile:** fully optimized for "near me" search + a **reviews engine** (auto-request a review from every enrolled family).
- **Local SEO landing pages:** one page per subject/level (*"A-Level Chemistry Tuition in [Area]"*) targeting search intent.

### 2.3 Referral Engine (cheapest, highest-trust source)
- Every enrolled family gets a **referral offer** (fee discount for a successful referral), delivered automatically post-enrollment via WhatsApp.
- Student "bring-a-friend" free-trial mechanic.

### 2.4 Lead Magnets (the hook that converts traffic → contact)
- *Free diagnostic test + trial class* (highest intent)
- *"O/A-Level [Subject] Solved Past-Paper Pack" (PDF)* — student magnet
- *"Parent's Guide: Choosing the Right A-Level Path for University"* — parent magnet

---

## 3. ENGINE 2 — Outbound (Push)

Three sub-engines, ordered by ROI and cleanliness.

### 3.1 (2A) Database Reactivation — *start here; highest ROI, lowest cost*
Your existing/old contacts are the cheapest leads you'll ever get.

- **Segment the list:** never-enrolled inquiries · trial-class no-shows · ex-students who finished a level · long-dormant leads.
- **Channels:** WhatsApp (spine) → SMS → **cold call** for the warmest.
- **Trigger:** run reactivation campaigns tied to each CAIE session (results day, term start) — e.g. *"Registration for [session] is open — want us to hold [Student]'s seat?"*
- **Automation:** CRM pulls the segment, fires the sequence, and routes any reply to a human instantly.

### 3.2 (2B) B2B Partnership Outbound — *Apollo + cold email* (reach many students at once)
Instead of chasing parents one by one, we sign **partners** who each deliver a batch of students.

**Target personas (built in Apollo):**
- School principals / academic coordinators (schools without strong in-house exam prep)
- Corporate HR / L&D (employee children study-benefit programs)
- University foundation-program & admissions advisors
- Hostel wardens, community-center admins, education consultants

**Workflow (automated):**
1. **Build lists in Apollo** — filter by title + industry + location; pull verified work emails + phone.
2. **Enrich & verify** — Apollo verification (or Neverbounce free tier) to protect deliverability.
3. **Load into cold-email tool (Instantly)** running **secondary domains** (never the main domain) with built-in **warm-up**.
4. **Automated sequence (4 steps / ~10 days):**
   - *Day 0* — Value intro: "We help [School]'s students hit A*/A in O/A-Level [subjects] with a partner discount."
   - *Day 3* — Proof: results snapshot + how a partnership works (revenue-share / referral / on-site batch).
   - *Day 6* — Case angle: 1 short success story + a soft ask for a 15-min call.
   - *Day 10* — Break-up: "Should I close the file or is this worth a quick chat before [session]?"
5. **Reply handling** — any reply stops automation and routes to a human in the CRM; booked calls → partnership pipeline.
6. **Outcome** — a signed partner funnels many students into the **B2C nurture engine**.

> Apollo/cold-email here is **B2B → B2C bridge**: we email *organizations*, not parents.
>
> **Ready-to-run copy:** Apollo persona filters, the full 4-step cold-email sequence, and both call scripts live in the **[outreach-playbook.md](outreach-playbook.md)**.

### 3.3 (2C) Cold Calling — *for warm & high-value targets*
- **List sources (legitimate only):** uncontacted inbound leads (speed-to-lead), event/school-fair sign-ups, partner-provided lists, reactivation segment.
- **Tooling:** CRM built-in dialer (GoHighLevel) — click-to-call, auto-logged, dispositioned.
- **Script skeleton:** *Open (permission) → Reason (their inquiry / relevant offer) → 1 discovery question → Value → Book the free assessment → Log disposition.*
- **Dispositions:** Booked · Follow-up · Not now (→ long-term nurture) · Do-not-contact. All feed the CRM + scoring.

### 3.4 Compliance & Deliverability Guardrails
- **No cold consumer email/SMS.** Consumer outreach (parents) is only to **opted-in / existing** contacts.
- **Cold email = B2B only,** on secondary warmed domains, low daily volume per mailbox, one-click unsubscribe, honest sender identity.
- **Cold calling:** respect do-not-call requests; log consent; call within reasonable hours.
- **WhatsApp:** permission-based, approved templates, easy opt-out (per [SECURITY.md](../../SECURITY.md) and platform rules).

---

## 4. ENGINE 3 — Capture, Routing & Nurture

This is the system already defined in the [roadmap](implementation-roadmap.md) (Phases 2–4). Every engine above feeds it:

- **Capture:** landing forms, click-to-WhatsApp, Meta Lead Forms, calls, cold-email replies, partner referrals — all into one CRM.
- **Auto-routing:** tag by **source** (Ad-Parent, Ad-Student, Reactivation, Partner-[name], Cold-Call, Referral) + subject + grade.
- **Lead scoring:** booked +30 · replied +20 · clicked pricing +15 · partner-sourced +25 · exam session ≤3 months +25 → **≥50 = Hot**.
- **Nurture:** the multi-channel WhatsApp → SMS → Email sequences (Tracks A–D).
- **Handoff:** hot-lead alert + SLA to admissions.

---

## 5. The Automation Layer (how it all connects)

```
 Ad / Reel / SEO ─┐
 Referral ────────┤
 Reactivation ────┼──▶  CRM (tag + score + route)  ──▶  Nurture (WhatsApp/SMS/Email)
 Cold call ───────┤            │                              │
 Partner (Apollo) ┘            └── Hot (score ≥50) ──▶  Admissions alert + SLA ──▶  Enrolled
                                                                                     │
                                                          Enrolled ──▶ Referral ask + onboarding
```

- **One inbox / one pipeline:** counselors work a single prioritized list, regardless of source.
- **Speed-to-lead:** every new lead gets an automated first touch in <5 min; hot leads alert a human in real time.
- **Closed-loop reporting:** revenue is attributed back to the originating engine, so budget flows to what actually enrolls students.

---

## 6. Recommended Lean Tool Stack

| Layer | Lean pick | Why it's the low-cost choice |
|-------|-----------|------------------------------|
| CRM + automation + SMS + email + **dialer** + funnels | **GoHighLevel** | One subscription replaces 4–5 tools; runs pipeline, nurture, calling, and reporting |
| Cold-email sending + domain warm-up | **Instantly.ai** (or Smartlead) | Cheap per-seat, built-in warm-up, multi-inbox rotation |
| B2B contact data (partnership arm) | **Apollo.io** (free/starter credits) | Verified work emails + phones for schools/corporates |
| Email verification | Apollo built-in / **Neverbounce** free tier | Protects sender reputation |
| Secondary sending domains + mailboxes | **Porkbun** domains + Google Workspace / Zoho | Keeps cold email off the primary domain; cheap |
| WhatsApp Business API | **360dialog** (or Meta/Twilio) | Cost-effective automated WhatsApp at scale |
| Paid ads | **Meta Ads** (primary) + **Google Search** | Highest-intent reach for B2C |
| Landing pages | GHL funnels *(or React+Vite on Vercel — agency stack)* | No extra tool if GHL; custom route if data-ownership needed |
| Tracking/analytics | Meta Pixel + CAPI, GTM, GHL dashboard | Free, closes the attribution loop |

> **Lean principle:** GoHighLevel is the backbone (it collapses CRM, SMS, email, calling, funnels, and automation into one bill). The only *added* outbound costs are Instantly (cold email), a few secondary domains/mailboxes, WhatsApp API usage, and ad spend — the last two billed to the client separately.

---

## 7. KPIs & Targets (per engine)

| Engine | Leading metric | What "healthy" looks like |
|--------|----------------|---------------------------|
| Inbound – Paid | Cost per qualified lead; lead→consult rate | Falling CPL; ≥ [target]% book |
| Inbound – Organic | Reach → profile/DM; review count | Compounding month over month |
| Referral | Referrals per enrolled family | ≥ [target] per family |
| Outbound – Reactivation | Re-engaged → booked | Highest ROI of all engines |
| Outbound – Partnership | Positive replies; partners signed | ≥ [target] partners / quarter |
| Outbound – Cold call | Connect rate; booked rate | Speed-to-lead < 5 min |
| Whole system | **Cost per enrollment**; speed-to-first-contact | The number that actually matters |

---

## 8. Rollout — 30 / 60 / 90 Days

- **Days 0–30 (Foundation + fastest wins):** stand up CRM + tracking; launch Engine 1 paid ads (parent + student); run **Engine 2A database reactivation** (fastest ROI); build nurture sequences.
- **Days 31–60 (Add outbound + optimize):** launch **Engine 2B partnership outbound** (Apollo lists + warmed domains + sequences) and **2C cold calling**; begin optimization loop; publish dashboard.
- **Days 61–90 (Scale what works):** scale winning ad campaigns, double down on the best-converting engine, formalize partnerships, and lock the seasonal playbook for the next CAIE session.

---

## 9. Risks & Mitigations

- **Cold-email deliverability** → secondary warmed domains only, low volume/mailbox, verified lists, B2B-only.
- **Wrong-audience tool use (Apollo→parents)** → explicitly scoped to the B2B partnership arm (Section 1 & 3.2).
- **Consumer-contact compliance** → outbound to parents only when opted-in/existing; easy opt-out everywhere.
- **Slow human follow-up** → the #1 killer; hard SLA + escalation on hot leads.
- **Over-reliance on one engine** → three engines by design; report per-engine and rebalance budget.
- **Data/privacy** → no student data shared with partners without consent; secrets/keys server-side only ([SECURITY.md](../../SECURITY.md)).
