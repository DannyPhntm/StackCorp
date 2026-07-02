# Build Guide — The Guide Institute Lead System

**How to build, implement, and launch the system from the ground up.**
Companion to: [README](README.md) · [implementation-roadmap.md](implementation-roadmap.md) · [lead-generation-system.md](lead-generation-system.md) · [outreach-playbook.md](outreach-playbook.md)

---

## How to use this guide

- The system is broken into **15 Parts (0–14)**. Build them **in order** unless the dependency map says otherwise.
- Each Part has: **Goal · Depends on · Steps · Done when (verify)**.
- **Do not move to the next Part until the "Done when" check passes.** Build → verify → proceed.
- Tick `[ ]` → `[x]` as you complete steps. This file is the single build tracker.

### Build principles
- **Lean first:** use free tiers; add paid capacity only when a step needs it.
- **Make.com is the backbone** — most Parts connect through it. Get Part 2 solid before the engines.
- **Keep secrets out of this repo.** API keys, tokens, and passwords live in each tool + a password manager — never in these docs ([SECURITY.md](../../SECURITY.md)).
- **Human-in-the-loop** for money, commitments, and fee talk (agency automation filter).
- **Verify every Part** with a real test lead/record before moving on.

### Recommended build order & the fast path

```
FOUNDATION            ENGINES                         ENHANCE / LAUNCH
0 Accounts        →   6  Reactivation (LAUNCH 1st)  →  11 AI WhatsApp assistant
1 CRM + tracking      7  Paid ads                      12 AI ad creative
2 Make backbone       8  B2B partnership outbound      13 Reporting
3 Channels            9  Cold calling                  14 QA + launch + handoff
4 Capture + pages    10  Conversion handoff
5 Nurture sequences
```

> **⚡ Fast path to first leads (revenue before full build):** Parts **0 → 1 → 2 → 3 → 6**. Reactivation only needs the CRM, Make, and messaging channels — so you can switch on Engine 2A and start booking assessments while you build Parts 4, 5, 7+.

### Dependency map

| Part | Depends on |
|------|-----------|
| 0 Accounts | — |
| 1 CRM + tracking | 0 |
| 2 Make backbone | 1 |
| 3 Channels (WhatsApp/Email/SMS) | 0, 2 |
| 4 Capture + landing pages | 2, 3 |
| 5 Nurture sequences | 2, 3 |
| 6 Reactivation (Engine 2A) | 1, 2, 3 |
| 7 Paid ads (Engine 1) | 2, 3, 4 |
| 8 Partnership outbound (2B) | 0 (domains) |
| 9 Cold calling (2C) | 1 |
| 10 Conversion handoff | 2, 5 |
| 11 AI WhatsApp assistant | 3, 2 |
| 12 AI ad creative | 7 |
| 13 Reporting | 1, 2, 7 |
| 14 QA + launch + handoff | all |

---

## Part 0 — Accounts, Assets & Prerequisites

**Goal:** every tool account and business input ready before building.
**Depends on:** —

**Steps — business inputs**
- [ ] Confirm the **offer / lead magnet** (free diagnostic + trial class; past-paper pack PDF; parent guide).
- [ ] Gather **real proof**: results stat, testimonials, teacher credentials, subjects, fee structure, `[Partner discount %]`.
- [ ] Confirm brand assets (logo, colors) and the WhatsApp Business phone number to use.
- [ ] Write consent/opt-in language for forms and messaging.

**Steps — create accounts** (store logins in a password manager, **not here**)
- [ ] HubSpot (Free CRM) · [ ] Make.com · [ ] Brevo · [ ] WhatsApp API tool (AiSensy / WATI / Interakt) + Meta Business Manager
- [ ] Instantly.ai · [ ] Apollo.io · [ ] Zoho/Google Workspace (4–6 mailboxes) · [ ] Porkbun (2–3 secondary domains)
- [ ] Cal.com · [ ] Meta Ads Manager · [ ] Google Ads · [ ] Vercel (existing) · [ ] Looker Studio

**Done when:** you can log into every tool and the business-inputs checklist is filled.

---

## Part 1 — CRM, Pipeline & Tracking (Foundation)

**Goal:** one source of truth where every lead lives, with tracking that attributes each one.
**Depends on:** 0

**Steps**
- [ ] In HubSpot, create custom **contact properties:** parent name, student name, parent phone, student phone, WhatsApp opt-in, subject(s), current grade, target CAIE session, **lead source**, **lead score**, geo tier (local/national/diaspora), preferred language.
- [ ] Build the **pipeline stages:** `New Lead → Contacted → Engaged → Consultation Booked → Attended → Enrolled → Lost/Nurture`.
- [ ] Define the **lead-scoring model** (booked +30 · replied +20 · clicked pricing +15 · partner-sourced +25 · session ≤3 months +25 · **≥50 = Hot**).
- [ ] Set up **tracking:** Meta Pixel + Conversions API, Google Tag Manager, and a **UTM convention** for every campaign.
- [ ] Connect **Cal.com** to the team calendar; create the "Free Assessment" booking type.

**Done when:** a manually-created test contact can be moved through every pipeline stage; Pixel/GTM fire on the site; a Cal.com test booking lands on the calendar.

---

## Part 2 — Make.com Automation Backbone

**Goal:** the glue that connects every tool and keeps the core promises (one CRM, first touch <5 min, hot-lead alerts).
**Depends on:** 1

**Steps — connect**
- [ ] Connect Make to: HubSpot, Brevo, the WhatsApp tool, Cal.com, Meta Lead Ads, and a **generic webhook** (for landing-page forms).

**Steps — build core scenarios**
- [ ] **S1 — Lead intake:** any source → create/update HubSpot contact → tag **source** → apply initial **score**.
- [ ] **S2 — Speed-to-lead:** new lead → fire first WhatsApp/email touch **within 5 min**.
- [ ] **S3 — Hot-lead alert:** score ≥50 or "booked/asked fees" → notify admissions (WhatsApp/email) + create an **SLA task**.
- [ ] **S4 — Booking flow:** Cal.com booking → confirmation + 24h + 2h reminders (Track C).
- [ ] **S5 — Reply/booking detector:** inbound reply or booking → **stop automation** + route to a human.

**Done when:** a single test lead pushed through the webhook triggers S1→S2 correctly, a forced score ≥50 triggers S3 within the SLA, and a reply halts the sequence (S5).

---

## Part 3 — Messaging Channels (WhatsApp · Email · SMS)

**Goal:** all three channels able to send automated, compliant, on-brand messages.
**Depends on:** 0, 2

**Steps**
- [ ] **WhatsApp:** connect the Business number to the API tool; submit **message templates** for approval (first-touch, nurture, reminders, reactivation); configure opt-in + opt-out (STOP).
- [ ] **Email (Brevo):** authenticate the sending domain (**SPF, DKIM, DMARC**); build branded nurture templates.
- [ ] **SMS:** configure Twilio/Brevo sender for urgent nudges.
- [ ] **Language rule:** create **English default + Roman-Urdu mirror** variants; the Roman-Urdu version is used only when a lead writes in Roman Urdu.

**Done when:** a test message sends successfully on each channel; WhatsApp templates are **approved**; email passes an SPF/DKIM/DMARC check; STOP opt-out works.

---

## Part 4 — Capture Points & Landing Pages

**Goal:** every way a lead can arrive is captured into the CRM.
**Depends on:** 2, 3

**Steps**
- [ ] Build the **landing page** on React+Vite/Vercel (offer + form + click-to-WhatsApp) **or** use **Meta Instant Forms** for a no-page start.
- [ ] Form fields: parent name, student name, phone(s), subject(s), grade, target session, consent checkbox.
- [ ] Host the **lead magnets** (past-paper pack, parent guide) and auto-deliver on submit.
- [ ] Wire **all** capture points → Make S1 → HubSpot: landing form, click-to-WhatsApp, Meta Lead Form, Google Business/phone.

**Done when:** submitting the form, clicking the WhatsApp button, and a Meta test lead each create a correctly-tagged HubSpot contact and deliver the magnet.

---

## Part 5 — Nurture Sequences (Tracks A–D)

**Goal:** automated, multi-channel follow-up that runs until the lead books, replies, or opts out.
**Depends on:** 2, 3 · **Spec:** [roadmap Phase 3](implementation-roadmap.md#phase-3--automated-follow-up-nurture)

**Steps**
- [ ] Build **Track A** (new-lead, 7 days: WhatsApp/SMS/email with the exact delays) in Make + Brevo + WhatsApp.
- [ ] Build **Track B** (student sub-track), **Track C** (booking reminders / no-show recovery), **Track D** (long-term nurture + session-based re-activation trigger).
- [ ] Wire **behavioral triggers** (clicks pricing → alert; books → stop + remind; question → human; cold 7d → Track D).

**Done when:** a test lead runs Track A end-to-end with correct timing, and correctly **stops** on a simulated reply/booking.

---

## Part 6 — Engine 2A: Database Reactivation  ⚡ *(LAUNCH FIRST)*

**Goal:** first leads/enrollments from existing contacts — fastest, cheapest ROI.
**Depends on:** 1, 2, 3

**Steps**
- [ ] Import the existing contact list into HubSpot; **clean + dedupe**.
- [ ] **Segment:** never-enrolled inquiries · trial no-shows · ex-students (finished a level) · dormant leads.
- [ ] Build the **reactivation sequence** (WhatsApp → SMS → cold call), tied to the current CAIE session, English + Roman-Urdu mirror.
- [ ] Prepare the **cold-call script** ([playbook Script A](outreach-playbook.md#script-a--b2c-parent-call-inbound-follow-up--reactivation)) + HubSpot click-to-call logging.
- [ ] **LAUNCH** the campaign to the warmest segment first; route all replies to a human (S5).

**Done when:** the campaign is live, replies are routing correctly, and the first assessments are being **booked**.

---

## Part 7 — Engine 1: Paid Ads (Inbound Volume)

**Goal:** predictable top-of-funnel volume across geo tiers.
**Depends on:** 2, 3, 4 · **Spec:** [lead-gen §2](lead-generation-system.md#2-engine-1--inbound-paid--organic--referral)

**Steps**
- [ ] Build **geo tiers** as separate ad sets: **local**, **national**, **overseas diaspora** (UK/Gulf/US).
- [ ] **Campaign A (Parents)**, **B (Students/Reels)**, **C (Retargeting)**; connect Meta Lead Ads → Make → CRM.
- [ ] Add **conversion tracking** (Pixel + CAPI); set the primary conversion = qualified lead / booking.
- [ ] Launch **Google Search** on high-intent queries.
- [ ] Start **lean** (1–2 campaigns), prove cost-per-qualified-lead, then scale winners; always keep a small retargeting budget.

**Done when:** ads are live, leads flow into the CRM **tagged by source + geo tier**, and retargeting is running.

---

## Part 8 — Engine 2B: B2B Partnership Outbound (Apollo + Cold Email)

**Goal:** sign partners (schools/corporates/universities) who each send many students.
**Depends on:** 0 (domains) · **Spec:** [outreach-playbook Parts 1–2](outreach-playbook.md#part-1--apollo-target-personas-filter-recipes)

**Steps**
- [ ] Set up **secondary domains** + 2–3 **mailboxes each**; start Instantly **warm-up** (~2–3 weeks — begin early!).
- [ ] Build **Apollo persona lists** (A–D), verify emails, export.
- [ ] Load the **4-step sequence** into Instantly; set low daily volume/mailbox.
- [ ] Route **replies** to a human → **Partner pipeline** in HubSpot.

**Done when:** domains are warmed, sequences are sending, and a test reply routes to the partnership pipeline. *(Start warm-up during Part 0/1 since it takes weeks.)*

---

## Part 9 — Engine 2C: Cold Calling

**Goal:** convert warm/high-value targets by phone.
**Depends on:** 1

**Steps**
- [ ] Source legitimate lists (uncontacted inbound, event sign-ups, partner lists, reactivation segment).
- [ ] Use HubSpot **click-to-call**; log call + **disposition** on each contact.
- [ ] Adopt the scripts ([Script A](outreach-playbook.md#script-a--b2c-parent-call-inbound-follow-up--reactivation) / [Script B](outreach-playbook.md#script-b--b2b-partnership-discovery-call)).

**Done when:** calls are logged with dispositions that update the pipeline and feed scoring.

---

## Part 10 — Conversion Handoff & Admissions Workflow

**Goal:** the automation warms the lead; a human closes it — fast.
**Depends on:** 2, 5

**Steps**
- [ ] Finalize the **hot-lead alert** + **SLA task** ("call within 10 min") + manager **escalation**.
- [ ] Build the counselor **context card** (history, source, subject, score) in HubSpot.
- [ ] Build the **disposition workflow** (`Enrolled` → onboarding + referral ask; `Lost` → Track D).

**Done when:** a hot test lead fires the alert + SLA task within target, and dispositions correctly update the pipeline.

---

## Part 11 — AI WhatsApp Assistant *(Enhancement)*

**Goal:** 24/7 instant reply, qualification, and booking on WhatsApp — the biggest conversion lever.
**Depends on:** 3, 2 · **Spec:** [lead-gen §10.1](lead-generation-system.md#10-prioritized-enhancements-client-selected)

**Steps**
- [ ] Build the **knowledge base** (FAQs, offer, subjects, fees-are-human-handoff).
- [ ] Design the **qualification flow** (subject, grade, target session) → score → book via Cal.com.
- [ ] Set **hard handoff rules** (fees, commitments, complex/edge → human) and **guardrails** (tone, no hallucination).
- [ ] Implement **English + Roman-Urdu** mirroring; keep AI keys **server-side**; log every conversation to HubSpot.

**Done when:** the assistant handles a test conversation end-to-end — qualifies, books, and hands off on a fee question — with everything logged to the CRM.

---

## Part 12 — AI Ad Creative Engine *(Enhancement)*

**Goal:** mass-produce ad creative + Reels cheaply to keep Engines 1 and organic fed.
**Depends on:** 7

**Steps**
- [ ] Define hooks/formats (parent-credibility, student "struggling with [subject]?", 1-minute exam tip, solved past-paper).
- [ ] Set up the AI image/video generation workflow; produce a first batch.
- [ ] **Human review** every asset (brand + factual accuracy) before publishing; feed winners into ads/organic.

**Done when:** a reviewed batch of creatives is live in Campaigns A/B and the organic cadence.

---

## Part 13 — Reporting & Optimization

**Goal:** see cost-per-enrollment by engine and improve monthly.
**Depends on:** 1, 2, 7

**Steps**
- [ ] Build a **Looker Studio** dashboard: leads by source, **cost per qualified lead**, **cost per enrollment**, lead→consult→enrolled rates, speed-to-first-contact, no-show rate, revenue by source.
- [ ] Set the **monthly optimization loop:** find the weakest stage → test one change → measure → keep/revert.

**Done when:** the dashboard shows real data end-to-end and the first optimization review is documented.

---

## Part 14 — QA, Launch & Handoff

**Goal:** verify the whole system, train the team, go live.
**Depends on:** all

**Steps — QA**
- [ ] Push a **test lead through every engine** (reactivation, ad, partnership, cold call) and confirm capture → nurture → handoff.
- [ ] **Compliance check:** opt-out works on all channels; cold email is B2B-only on warmed domains; consent captured.
- [ ] **Security check:** all keys server-side, nothing sensitive in the repo, private data admin-only ([SECURITY.md](../../SECURITY.md)).

**Steps — launch & handoff**
- [ ] Run the **go-live checklist**; enable all intended engines at target budgets.
- [ ] **Train the team** (admissions script, SLA discipline, dashboard).
- [ ] Deliver the **handoff document** ([template](../../templates/project-handoff.md)).

**Done when:** every engine is verified live, the team is trained, and the handoff is signed off.

---

## Master Launch Checklist (quick reference)

- [ ] Part 0 — Accounts & assets ready
- [ ] Part 1 — CRM + pipeline + tracking live
- [ ] Part 2 — Make backbone (S1–S5) tested
- [ ] Part 3 — WhatsApp/Email/SMS sending (templates approved, domain authed)
- [ ] Part 6 — **Reactivation launched (first leads)** ⚡
- [ ] Part 4 — Capture + landing pages live
- [ ] Part 5 — Nurture Tracks A–D running
- [ ] Part 7 — Paid ads live (geo tiers)
- [ ] Part 8 — Partnership outbound sending (domains warmed)
- [ ] Part 9 — Cold calling logged in CRM
- [ ] Part 10 — Hot-lead handoff + SLA verified
- [ ] Part 11 — AI WhatsApp assistant live
- [ ] Part 12 — AI ad creative feeding campaigns
- [ ] Part 13 — Dashboard live
- [ ] Part 14 — QA passed, team trained, handoff delivered

> When we build a Part, I can expand it into a **detailed step-by-step sub-guide** (exact field names, scenario blueprints, screenshots-level instructions). This master guide is the map; each Part becomes its own worked build when we get to it.
