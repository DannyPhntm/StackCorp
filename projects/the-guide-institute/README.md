# The Guide Institute — Automated Lead & Enrollment System

**Client:** The Guide Institute (O-Level & A-Level tuition) · **Agency:** StackCorp
**Objective:** build, from scratch, an automated lead system that generates consistent, high-quality inquiries and nurtures them to enrollment.
**Status:** planning/spec complete — ready to build.

> This is the index + decisions log for the project. Full detail lives in the linked docs.

---

## Documents in this project

| File | What it is |
|------|-----------|
| [build-guide.md](build-guide.md) | **Step-by-step build tracker** — the system in 15 ordered Parts with verify gates (use this to build) |
| [implementation-roadmap.md](implementation-roadmap.md) | Technical + strategic build plan (6 phases, timeline, tooling, risks) |
| [lead-generation-system.md](lead-generation-system.md) | The 3-engine lead-gen "machine" — channels, automation flow, tool stack, KPIs, rollout |
| [outreach-playbook.md](outreach-playbook.md) | Ready-to-run Apollo personas, cold-email sequence, and call scripts |
| [proposal.md](proposal.md) | Client-facing proposal (markdown) |
| proposal.docx | Client-facing proposal (editable Word, yellow placeholders) |

---

## What we've decided so far

### 1. The system — 3 engines feeding 1 CRM
- **Engine 1 — Inbound (pull):** Meta ads (Parent / Student / Retargeting campaigns) + Google Search + organic Reels + Google Business Profile + referral engine + lead magnets.
- **Engine 2 — Outbound (push), by ROI:** **2A** database reactivation (own past leads/ex-students via WhatsApp/SMS/call) → **2B** B2B partnership outbound (Apollo + cold email to schools/corporates/universities) → **2C** cold calling from legit lists.
- **Engine 3 — Capture → Nurture → Handoff:** one CRM, tag by source, lead scoring (≥50 = Hot), multi-channel nurture (WhatsApp → SMS → Email, Tracks A–D), real-time hot-lead alert + SLA to admissions.

### 2. Audience & the Apollo decision
- The institute sells **B2C (parents/students)**.
- **Apollo/cold-email is used for the B2B partnership arm only** (organizations that each send many students) — **never to email parents** (ineffective + non-compliant).
- **Cold calling + WhatsApp/SMS outbound** run on **owned/opted-in lists** (reactivation) — effective *and* compliant.

### 3. Tooling — lean, **no all-in-one platform (no GoHighLevel at this stage)**
Assembled stack with **Make.com as the automation backbone**:

| Layer | Tool |
|-------|------|
| CRM + pipeline | HubSpot Free CRM *(or Airtable/Notion)* |
| Automation backbone | **Make.com** |
| Email + SMS nurture | Brevo *(or Resend + Make)* |
| WhatsApp automation | AiSensy / WATI / Interakt *(or 360dialog API)* |
| Cold email + warm-up | Instantly.ai |
| B2B data | Apollo.io |
| Mailboxes + domains | Zoho/Google Workspace + Porkbun |
| Landing pages | React+Vite on Vercel (in-house) or Meta Instant Forms |
| Booking | Cal.com |
| Ads | Meta Ads + Google Search |
| Tracking + reporting | Meta Pixel/CAPI, GTM, Looker Studio |

**Trade-off accepted:** more integration/maintenance (Make is critical) + DIY reporting, in exchange for staying lean and unlocked. Revisit an all-in-one only if we scale to many clients.

### 4. Approximate monthly cost — tools only (client pays; excl. ad spend)

| Bucket | Approx USD/mo |
|--------|--------------|
| CRM (HubSpot Free) + Make + Brevo + Cal.com + tracking | $0 – 34 |
| WhatsApp tool (AiSensy/WATI) | ~$20 – 49 |
| Instantly (cold email) | ~$37 |
| Apollo (data) | $0 – 49 |
| Mailboxes (×4–6) + secondary domains | ~$9 – 39 |
| **Total (tools, excl. ads)** | **≈ $70 – 210 / mo** |

- **Ad spend** (separate, client-controlled): start ~$300 – 800/mo, scale winners.
- **One-time hard cost:** secondary domains only (~$30/yr).
- *SaaS prices as of early 2026 — verify before quoting; adjust to client currency/market.*
- **Agency setup fee + retainer are value-based and quoted after discovery — kept out of this repo per [PRICING.md](../../PRICING.md).**

### 5. Timeline
~3–4 weeks to a live system, then ongoing management. Rollout sequenced 30/60/90.

### 6. Session decisions (enhancements & scope)
- **Rollout order:** **database reactivation FIRST** (fastest, cheapest ROI), then ads, then partnerships/cold-call.
- **Prioritized enhancements:** **AI WhatsApp assistant** (24/7 qualify + book — biggest lever) and **AI-generated ad creative & Reels**. Details in [lead-generation-system.md §10](lead-generation-system.md#10-prioritized-enhancements-client-selected).
- **Language rule:** default **English**, mirror **Roman Urdu only when the lead uses it** (nurture, AI assistant, call openers).
- **Scale:** **single branch, delivering online** → one pipeline but **nationwide + overseas-diaspora** reach (ads/partnerships not capped to a local radius — a major addressable-market expansion).

---

## What still needs deciding / building
- [ ] Confirm tool recipe (Recipe 1 HubSpot-centric — current default — vs. Brevo-centric consolidation).
- [ ] Institute specifics for the outreach copy: `[City/Region]`, `[Subjects]`, real `[Results stat]`, discount %, calendar link.
- [ ] **Design the AI WhatsApp assistant** flow (qualification questions, FAQ knowledge, booking + human-handoff rules).
- [ ] **Reactivation-first build:** segment the existing contact list; write the reactivation WhatsApp/SMS/call sequences (English + Roman-Urdu mirror).
- [ ] Build: Make.com scenarios (the backbone), HubSpot pipeline, nurture sequences, Apollo lists + warmed domains, ad campaigns + AI creative, geo tiers (local + national + diaspora).

---

## Guardrails (from agency rules)
- Cold email = B2B only; consumer outreach only to opted-in/existing contacts; easy opt-out everywhere.
- No real pricing figures, secrets, or credentials committed to this repo ([SECURITY.md](../../SECURITY.md), [PRICING.md](../../PRICING.md)).
- Money/commitment/judgment steps stay human-in-the-loop (agency automation filter).
