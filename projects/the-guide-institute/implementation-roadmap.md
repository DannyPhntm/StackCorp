# Implementation Roadmap — Automated Lead System for The Guide Institute

**Client:** The Guide Institute (A-Level & O-Level tuition)
**Objective:** Build an automated lead engine that generates consistent, high-quality inquiries and nurtures them to enrollment — from scratch.
**Prepared by:** [Agency / Team member] · **Date:** [Date]

---

## Audience Insight (read this first)

Every decision below is driven by one fact: **the buyer and the user are two different people.**

| | **Parents** (the payer) | **Students** (the user) |
|---|---|---|
| Emotional driver | Fear of wasted money/time; wants their child to succeed | Fear of failing; wants to feel capable and understood |
| Decides on | Trust, safety, proof of results, teacher quality, value | Relatability, ease, "will this actually help me?" |
| Objections | "Is it worth the fee?", "Are the teachers qualified?", "Is it near/safe?" | "Is it boring?", "Do my friends go?", "Will I be judged?" |
| Wins them | Results data, testimonials, credentials, clear pricing, a real human callback | Relatable creators, past-paper help, social proof, low-friction chat |
| Primary channel | Facebook/Instagram feed, WhatsApp, phone call | Instagram Reels/TikTok, WhatsApp |
| Peak intent moments | Right after results day; start of a new session/term | Right before exams; when a subject "clicks" as too hard |

**Implication:** we run **two message tracks** (Parent track + Student track) off a single lead, and we lead with **WhatsApp** because it's the default communication channel for this market and gets 5–10× the response rate of email alone. Email and SMS are supporting channels, not the spine.

**Seasonality:** CAIE runs two exam sessions (May/June and Oct/Nov). Demand spikes around **results release** and the **start of each academic term**. The system is built to run always-on but scale spend into these windows.

---

## System at a Glance

```
        AD / ORGANIC / REFERRAL
                 │
        ┌────────▼────────┐
        │  LANDING PAGE   │  (offer + form / WhatsApp click)
        └────────┬────────┘
                 │  lead + source + subject + grade
        ┌────────▼────────┐
        │      CRM        │  auto-tag, score, assign pipeline stage
        └────────┬────────┘
        ┌────────▼────────────────────────┐
        │  MULTI-CHANNEL NURTURE            │
        │  WhatsApp → SMS → Email           │
        │  (time-delays + behavior triggers)│
        └────────┬────────────────────────┘
      hot lead? │  booked call / replied / clicked pricing
        ┌────────▼────────┐
        │ ADMISSIONS ALERT│  → human closes → mark Enrolled
        └─────────────────┘
```

---

## Phase 0 — Foundation & Discovery (Week 1)

Nothing converts without positioning and tracking. Do this first.

**Actions**
- **Discovery workshop** with the institute: capture their real differentiators (teacher credentials, results %, batch sizes, location, fee structure, subjects offered per O/A Level).
- **Define the offer / lead magnet** — the single most important lever. Options that work for education:
  - *Free diagnostic test + 1 free trial class* (highest intent, best for hot leads)
  - *"O/A Level [Subject] Past-Paper Solved Pack" PDF* (great top-of-funnel magnet for students)
  - *"Parent's Guide: How to Pick the Right A-Level Path for University"* (magnet for parents)
- **Set up tracking infrastructure:** Meta Pixel + Conversions API, Google Tag Manager, WhatsApp click tracking, UTM convention for every campaign.
- **Define the pipeline stages** (used everywhere downstream):
  `New Lead → Contacted → Engaged → Consultation Booked → Attended → Enrolled → Lost/Nurture`
- **Compliance:** collect explicit opt-in consent on every form (name, parent phone, student phone, subject, grade) so WhatsApp/SMS sending is permission-based.

**Deliverable:** Positioning + offer doc, tracking live, pipeline defined.

---

## Phase 1 — Top-of-Funnel (Lead Generation)

Goal: a **predictable, always-on flow** of qualified inquiries, scaled up in peak windows.

### Paid (fastest to consistency)
- **Meta Ads (Facebook + Instagram) — primary.** Two audience sets:
  - *Parent set:* interests + location radius around the institute; creative = results, credibility, "book a free assessment."
  - *Student set:* Reels-first creative; relatable "struggling with [subject]?" hooks → free past-paper pack.
- **Lead objective split-test:** Meta Lead Forms (instant, cheap leads) **vs.** click-to-landing-page (higher intent). Run both; keep the cheaper cost-per-*qualified*-lead.
- **Click-to-WhatsApp ads** — for this market these often outperform form ads because they open a live chat instantly.
- **Google Search Ads** for high-intent queries: *"A level chemistry tuition [area]"*, *"O level tuition near me"*. Lower volume, higher intent — worth it seasonally.

### Organic (compounds over time, lower cost)
- **Instagram/TikTok Reels:** short "1-minute exam tip" and "how to solve this past-paper question" clips. Positions teachers as experts, feeds the student audience.
- **Google Business Profile:** fully optimized for local "near me" search + reviews engine (ask every enrolled family for a review).
- **Referral loop:** every enrolled student's parent gets a referral offer (fee discount for a successful referral) — the cheapest, highest-trust lead source in education.

### Partnerships
- School exam-prep talks, coaching-center cross-promos, and results-day pop-up presence.

**Deliverable:** 2–3 live campaigns, creative library, organic content cadence, referral mechanism.

---

## Phase 2 — Lead Capture & CRM Routing

Goal: **no lead ever lands in a place no one checks.** Every inquiry is captured, tagged, and routed in seconds.

### Recommended engine
- **Primary recommendation: a unified CRM + automation platform (e.g., GoHighLevel or HubSpot).** One platform gives us CRM, pipeline, WhatsApp/SMS/email sending, landing pages, calendar booking, and automation in one place — fastest path to a working system and easiest for the institute's staff to run.
- **WhatsApp sending:** WhatsApp Business API via **Meta / Twilio / 360dialog** (required for automated + templated messages at scale, vs. a personal number).
- **Data-ownership option:** if the institute wants to own its data on our proven stack, we build a lightweight capture layer — **React landing page → Node/Express webhook → Neon Postgres**, with **Resend** for email — and sync to the CRM. (See [TECH_STACK.md](../../TECH_STACK.md).) We'll recommend the pragmatic path in discovery.

### Capture points (all feed one CRM)
- Landing-page form (name, parent phone, student phone, subject(s), current grade, target session).
- Click-to-WhatsApp (auto-creates a contact from the first message).
- Meta Lead Form (auto-synced via native integration / webhook).
- Google Business & phone calls (logged as leads with source).

### Auto-routing logic (fires on capture)
- **Tag by source** (Meta-Parent, Meta-Student, Google, Referral, Walk-in) and **by subject + grade**.
- **Lead scoring** — start simple, e.g.:
  - +30 booked a consultation · +20 replied on WhatsApp · +15 clicked pricing · +10 opened 3+ messages · +25 selected an exam session ≤ 3 months away.
  - Score ≥ 50 = **Hot** → immediate admissions alert (Phase 4).
- **Assignment:** round-robin to the right admissions counselor, or by subject specialism.
- **Deduplication:** merge repeat inquiries so a parent isn't messaged twice.

**Deliverable:** CRM configured, all capture points wired in, tagging + scoring + routing live.

---

## Phase 3 — Automated Follow-Up (Nurture)

Goal: **respond in under 5 minutes, then follow up relentlessly but respectfully** across channels until the lead books, replies, or opts out. Most institutes lose deals here — a lead that isn't contacted in the first 5 minutes is up to 10× less likely to convert.

**Channel priority:** WhatsApp (spine) → SMS (urgent nudges) → Email (detail, proof, credibility). Every sequence stops the moment the lead replies or books, and hands off to a human.

### Track A — New Lead Nurture (default, first 7 days)

| When | Channel | Message intent |
|------|---------|----------------|
| **0–2 min** | WhatsApp | Instant: "Thanks [Parent], we got your inquiry about [Subject] for [Student]. When's a good time for a quick call?" + booking link |
| **0–2 min** | Email | Deliver the lead magnet (past-paper pack / parent's guide) + institute credibility one-pager |
| **+20 min (no reply)** | WhatsApp | Soft nudge: offer 2 concrete time slots for a free assessment |
| **+3 hrs (no reply)** | SMS | Short: "Still keen on the free trial class for [Subject]? Reply YES and we'll book it." |
| **Day 1** | WhatsApp | Social proof: 1 short result/testimonial (e.g., "A2→A* in 4 months") |
| **Day 2** | Email | "Why parents choose The Guide Institute" — teachers, results %, batch size, location |
| **Day 3** | WhatsApp | Objection-handler: address fee/value + reminder the trial is free |
| **Day 5** | SMS | Scarcity (honest): "Batches for [session] are filling — want us to hold a seat?" |
| **Day 7** | WhatsApp | Break-up + soft close: "Should I keep your spot open or check back before [session]?" → moves to long-term nurture if silent |

### Track B — Student sub-track (runs in parallel when the student's own number is captured)
- Tone shift: relatable, emoji-light, "we make [Subject] click" — Reels links, a solved past-paper question, and "your friends are already prepping for [session]." Purpose: build the student's desire so they push the parent to say yes.

### Behavioral triggers (override the time-based flow)
- **Clicks pricing / fees** → immediately send fee breakdown + "want to talk to a counselor?" + **alert admissions** (warm intent).
- **Books a consultation** → stop nurture, send confirmation + reminders (see Track C).
- **Replies with a question** → stop automation, route to human within CRM.
- **Opens the lead magnet but doesn't reply in 24h** → send a "did the [subject] pack help?" WhatsApp.
- **Goes cold (no engagement 7 days)** → move to **Long-Term Nurture** (Track D).

### Track C — Consultation / Trial-Class Reminders (reduce no-shows)
- **On booking:** WhatsApp + Email confirmation with date, time, location/map, what to bring.
- **24 hrs before:** WhatsApp reminder + "reply to reschedule."
- **2 hrs before:** SMS reminder.
- **If no-show:** immediate WhatsApp "sorry we missed you — rebook here?" + 2 follow-ups over 3 days.

### Track D — Long-Term Nurture (the "not now" gold mine)
- Low-frequency value drip (1 message / 1–2 weeks): exam tips, session countdowns, results-day congratulations, early-bird batch openings.
- **Re-activation trigger:** as the next exam session approaches, automatically pull long-term leads back into Track A.

**Deliverable:** All four tracks built, tested end-to-end with a live sample lead, WhatsApp templates approved by Meta, opt-out handling in place.

---

## Phase 4 — Conversion Handoff (Hot-Lead Alerts)

Goal: **the automation warms the lead; a human closes it.** The moment a lead is hot, admissions knows instantly.

**A lead becomes "Hot" when it:** books a consultation · replies asking about fees/start dates · clicks pricing · hits lead-score ≥ 50.

**On "Hot," the system automatically:**
1. **Moves the card** to `Consultation Booked` / `Engaged` in the pipeline.
2. **Alerts admissions in real time** — internal WhatsApp/SMS + email to the assigned counselor: *"🔥 HOT: [Parent] — [Student], [Subject], [Grade]. Source: [x]. Wants: [x]. Call within 10 min."*
3. **Creates a task with an SLA** — "Call within 10 minutes," with escalation to a manager if untouched.
4. **Hands the counselor a one-screen context card** — full conversation history, source, subject, score — so the call opens warm, not cold.
5. **Post-call disposition** — counselor marks `Enrolled`, `Follow-up`, or `Lost (reason)`. `Lost` auto-drops into Long-Term Nurture; `Enrolled` triggers onboarding + a referral-ask sequence.

**Guardrail:** automation never sends fee negotiations, enrollment confirmations, or anything requiring judgment — those are always human. (Per the agency's [automation filter](../../CLAUDE.md): money, commitments, and client-facing judgment stay human.)

**Deliverable:** Real-time alerting, SLA tasks + escalation, disposition workflow, enrolled-student onboarding trigger.

---

## Phase 5 — Measurement & Optimization (Ongoing)

Goal: turn the system into a **compounding asset** — cheaper leads and higher conversion every month.

**Dashboard (single source of truth) tracks:**
- Leads by source · **Cost per qualified lead** · Lead→Consultation rate · Consultation→Enrolled rate · **Cost per enrollment** · Speed-to-first-contact · No-show rate · Revenue by source.

**Optimization loop (monthly):**
`Review dashboard → find the weakest stage → test one change → measure → keep or revert.`
- Weak top-of-funnel → new creative/offer test.
- Weak nurture → rework the sequence step where drop-off spikes.
- Weak handoff → tighten SLA / retrain counselors on the hot-lead script.

**Seasonal playbook:** scale ad spend into results-day and term-start windows; pull long-term-nurture leads back in ahead of each CAIE session.

**Deliverable:** Live dashboard, monthly optimization report, documented playbook the institute keeps.

---

## Build Timeline (summary)

| Phase | Focus | Est. duration |
|-------|-------|---------------|
| 0 | Foundation, offer, tracking | Week 1 |
| 1 | Lead-gen campaigns live | Weeks 1–2 |
| 2 | CRM + capture + routing | Week 2 |
| 3 | Nurture sequences (all tracks) | Weeks 2–3 |
| 4 | Hot-lead handoff + SLAs | Week 3 |
| 5 | Dashboard + optimization | Week 4 → ongoing retainer |

**Total to live system: ~3–4 weeks**, then an ongoing management + optimization retainer.

---

## Tooling Summary

| Need | Recommended | Alt / notes |
|------|-------------|-------------|
| CRM + automation + pipeline | GoHighLevel *(agency-run)* or HubSpot | One platform = fastest to value |
| WhatsApp (automated) | WhatsApp Business API (Meta / Twilio / 360dialog) | Required for templated bulk sending |
| SMS | Twilio / platform-native | Urgent nudges only |
| Email | Resend *(agency stack)* or platform-native | Detail + proof messages |
| Landing pages | Platform funnels, or React+Vite on Vercel | Custom route if data-ownership matters |
| Ads | Meta Ads (primary) + Google Search | Meta Pixel + CAPI required |
| Booking | Platform calendar | Feeds Track C reminders |
| Data (custom route) | Neon Postgres + Prisma via Node/Express | Agency's proven stack |
| Analytics | GTM + platform dashboard | Single KPI dashboard |

---

## Key Risks & Mitigations

- **WhatsApp template approval / spam limits** → use approved templates, permission-based opt-in, respect 24-hr session windows, keep opt-out easy.
- **Slow human response kills hot leads** → hard SLA + escalation; this is the #1 thing that makes or breaks the system.
- **Lead quality vs. quantity** → optimize on cost-per-*enrollment*, not cost-per-lead; qualify by subject/grade/session at capture.
- **Staff adoption** → keep the counselor view to one screen; train on the hot-lead script; report value monthly.
- **Consent & privacy** → explicit opt-in, no sharing of student data, secrets/keys server-side only (per [SECURITY.md](../../SECURITY.md)).
