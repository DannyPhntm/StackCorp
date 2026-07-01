# Outreach Playbook — The Guide Institute (B2B Partnership + Cold Calling)

**Companion to:** [lead-generation-system.md](lead-generation-system.md) (Engine 2B & 2C) · [implementation-roadmap.md](implementation-roadmap.md)
**Use:** ready-to-run Apollo persona filters, cold-email sequence copy, and call scripts for the outbound engines.
**Reminder:** cold email is **B2B only** (organizations, never parents), sent from **secondary warmed domains**; cold calls run on **legitimately-sourced lists**. See compliance notes at the end.

**Fill these institute variables before launch:** `[City/Region]` · `[Subjects]` · `[Results stat]` (e.g. "8 in 10 students improved ≥1 grade last session") · `[Sender name/role]` · `[Phone]` · `[Website]` · `[Calendar link]` · `[Partner discount %]`.
**Email merge fields** (from Apollo/Instantly): `{{first_name}}`, `{{company}}`, `{{title}}`, `{{custom_hook}}`.

---

## Part 1 — Apollo Target Personas (filter recipes)

Build one Apollo saved search per persona. Always set **Email Status = Verified** to protect deliverability, and **exclude** generic/irrelevant titles. Location = `[City/Region]` (Person location or Company HQ).

### Persona A — School Decision-Makers *(primary target)*
Schools that teach O/A-Levels but have limited in-house intensive exam prep.

| Apollo filter | Values |
|---------------|--------|
| **Job titles (include)** | Principal, Vice Principal, Head of Secondary, Academic Coordinator, Head of Cambridge, Exams Officer, Head of Sciences, Coordinator O/A Levels, Head of Academics |
| **Seniority** | Owner, C-Suite, Director, Head, Manager |
| **Industry / keywords** | Education, Primary/Secondary Education, E-Learning · company keywords: "Cambridge", "CAIE", "IGCSE", "O Level", "A Level", "GCE" |
| **Employees** | 50–1000 |
| **Email status** | Verified |
| **Exclude titles** | Teacher (individual), Intern, Admin Assistant, Accountant |

**Partnership angle:** run intensive past-paper/exam prep for their students (after-school or on-site) at a partner rate — lifts their results without adding load to their teachers. Models: referral fee · revenue-share · on-site batch.

### Persona B — Corporate HR / Benefits *(scale target)*
Employers who offer (or would offer) education benefits for staff's children.

| Apollo filter | Values |
|---------------|--------|
| **Job titles (include)** | HR Manager, Head of HR, People Operations, HR Business Partner, L&D Manager, Employee Benefits Manager, Head of Rewards |
| **Seniority** | Director, Head, Manager, VP |
| **Industry** | Any mid–large employer in `[City/Region]` (banks, telecom, FMCG, tech, manufacturing) |
| **Employees** | 100+ |
| **Email status** | Verified |

**Angle:** a staff perk — discounted expert O/A-Level tuition for employees' children; zero cost to the employer, morale/retention win.

### Persona C — Universities & Pathway Programs
Institutions with foundation programs or that advise students needing stronger A-Level grades.

| Apollo filter | Values |
|---------------|--------|
| **Job titles (include)** | Admissions Officer, Head of Admissions, Foundation Program Coordinator, Academic Advisor, Student Recruitment Manager, Pathways Lead |
| **Industry** | Higher Education, Education Management |
| **Employees** | 100+ |
| **Email status** | Verified |

**Angle:** an exam-prep pipeline for applicants who need to lift A-Level grades or complete foundation prep.

### Persona D — Education Consultants & Counseling Agencies
Intermediaries who advise families on schooling/study-abroad.

| Apollo filter | Values |
|---------------|--------|
| **Job titles (include)** | Education Consultant, Student Counselor, Director (Education Consultancy), Founder, Study Abroad Advisor |
| **Industry / keywords** | Education Management, Education · keywords: "study abroad", "admissions consulting", "student counseling" |
| **Employees** | 1–50 |
| **Email status** | Verified |

**Angle:** referral commission for every student they send who enrolls.

> **List hygiene:** cap ~25–40 verified contacts per mailbox per day, rotate across 2–3 secondary domains, and suppress anyone who unsubscribes or replies. Quality > volume.

---

## Part 2 — Cold-Email Sequence (4 steps / ~10 days)

Plain text, no images, one soft CTA each, ≤120 words. The **primary sequence below is written for Persona A (schools)**; per-persona first-line swaps follow. All emails 2–4 send as **replies in the same thread**.

### Email 1 — Day 0 · Value intro
**Subject options:** `quick idea for {{company}}'s O/A Level students` · `{{first_name}} — exam prep partner for {{company}}?`

```
Hi {{first_name}},

I look after partnerships at The Guide Institute — we coach O/A-Level students in [Subjects], and [Results stat].

Many schools like {{company}} have strong teaching but limited bandwidth for intensive past-paper and exam prep. We partner with schools to run exactly that — after-school or on-site — at a partner rate, so your results go up without adding to your teachers' workload.

Worth a quick 15-minute call to see if it's a fit for {{company}}?

[Sender name], The Guide Institute
[Phone] · [Website]
```

### Email 2 — Day 3 · How it works (reply in thread)
**Subject:** `Re: quick idea for {{company}}'s O/A Level students`

```
Hi {{first_name}}, quick follow-up on how a partnership usually works — we keep it simple, three options:

1. Referral — you refer students, we teach, you earn a referral fee.
2. Revenue-share — co-branded prep batches, split fees.
3. On-site — we run prep sessions at {{company}} on a schedule you set.

No cost or admin burden on your side. [Results stat].

Open to a 15-min call this week? Here's my calendar: [Calendar link]
```

### Email 3 — Day 6 · Proof + soft CTA
**Subject:** `Re: quick idea for {{company}}'s O/A Level students`

```
Hi {{first_name}},

Quick example: [1-line partner/success story — e.g. "we ran A-Level prep for a partner school last session and X% of their students improved by a grade or more"].

If that's the kind of result {{company}} wants for its O/A-Level cohort, I'd love to map out how it'd work for you.

Would Tuesday or Thursday suit for a short call?
```

### Email 4 — Day 10 · Break-up
**Subject:** `should I close this out, {{first_name}}?`

```
Hi {{first_name}},

I don't want to keep landing in your inbox — I'll assume the timing isn't right and close the file for now.

If exam prep for your O/A-Level students becomes a priority before the next session, just reply here and I'll pick it straight back up.

Thanks either way,
[Sender name]
```

### Per-persona first-line swaps (replace Email 1's opening line)
- **B (Corporate HR):** *"I run partnerships at The Guide Institute — we help companies like {{company}} offer discounted expert O/A-Level tuition as a staff benefit, at no cost to you."*
- **C (Universities):** *"I run partnerships at The Guide Institute — we help institutions like {{company}} give applicants a reliable route to stronger A-Level grades before they enroll."*
- **D (Consultants):** *"I run partnerships at The Guide Institute — we work with consultants like you to give your students expert O/A-Level prep, with a referral commission for every enrollment."*

### Reply handling (automation rule)
- **Any reply → automation STOPS** and the lead routes to a human in the CRM.
- Positive → book a discovery call (use the [call script](#script-b--b2b-partnership-discovery-call)); create a **Partner** pipeline card.
- "Not now" → move to a light quarterly follow-up before each CAIE session.
- Unsubscribe/negative → suppress immediately.

---

## Part 3 — Cold-Call Scripts

Two scripts: **A** for B2C leads (inbound follow-up / database reactivation — the bulk of Engine 2C), **B** for B2B partnership discovery.

### Script A — B2C parent call (inbound follow-up / reactivation)
*Goal: book a free assessment / trial class. Speed-to-lead: call new inbound within 5 minutes.*

**Open (permission + warmth):**
> "Assalam-o-Alaikum / Hello, is this [Parent name]? Hi, this is [Your name] from **The Guide Institute** — you [enquired about O/A-Level tuition for [Student] / we help students with [Subjects]]. Do you have two quick minutes?"

**Reason + one discovery question:**
> "Great — I just wanted to understand what [Student] needs most right now. Which subjects are the concern, and is it about improving a grade, building confidence, or exam technique?"

*(Listen. Note subject, grade, target session.)*

**Value (tailored to what they said):**
> "That's exactly what we focus on — [e.g. intensive past-paper practice in [subject] with small batches]. [Results stat]. The best way to see if it's a fit is a **free assessment + trial class** — no cost, no obligation."

**Book (assume the close, offer two slots):**
> "I can put [Student] in for [Day A, time] or [Day B, time] — which works better?"

**Confirm + set expectations:**
> "Done — I'll send the details on WhatsApp now. Please bring [X]. We'll see you then!"

**Objection handling:**
- *"It's too expensive."* → "Totally fair — that's why the assessment is free, so you can judge the value before deciding anything. Many parents find the results pay for themselves. Shall I book the free session?"
- *"I need to ask my husband/wife."* → "Of course — the free trial doesn't commit you to anything, so it's the easiest thing to say yes to first. Which day suits [Student]?"
- *"Send me info first."* → "Will do — sending on WhatsApp now. So I tailor it, is the priority [subject] or overall exam prep? … Great, and shall I pencil in [Day/time] which we can move if needed?"
- *"Not interested / already enrolled elsewhere."* → "No problem at all — mind if I check back before the next exam session in case anything changes? … Take care."

**Voicemail / no-answer:**
> "Hi [Parent], [Your name] from The Guide Institute about O/A-Level tuition for [Student]. I'll send a quick WhatsApp — reply any time and we'll arrange a free trial class. Thank you!"

**Dispositions (log in CRM):** Booked · Follow-up (date) · Not now → long-term nurture · Wrong number · Do-not-contact.

### Script B — B2B partnership discovery call
*Goal: qualify the partner and agree a next step (pilot / meeting). Booked from cold email or cold call to Personas A–D.*

**Open:**
> "Hi [Name], [Your name] from **The Guide Institute** — thanks for taking the call. As I mentioned, we partner with [schools/companies] to give students expert O/A-Level exam prep. I'd love to learn how [Organization] handles that today and see if there's a fit — is now still good for 15 minutes?"

**Qualify (discovery):**
> - "How do your O/A-Level students currently get intensive exam / past-paper prep?"
> - "Where do results tend to slip — particular subjects, or exam technique overall?"
> - "If we could lift those results without adding load to your team, who'd need to be involved in a decision like this?"

**Value + fit:**
> "Here's how partners usually work with us — [referral / revenue-share / on-site], whichever suits [Organization]. [Results stat]. For your situation, I'd suggest [recommended model] because [reason]."

**Close to next step (pilot / meeting):**
> "The lowest-risk way to start is a small pilot with one cohort this session. Could we set up a short meeting with [decision-maker] to scope it — does [Day/time] work?"

**Objection handling:**
- *"We already have our own prep."* → "Makes sense — most partners do too. We tend to complement it for the hardest subjects or the students who need extra. Worth a small pilot to compare results?"
- *"No budget."* → "Understood — the referral model costs you nothing; students pay us directly and you earn a referral fee. Would that structure work better?"
- *"Send a proposal."* → "Happy to — so it's tailored, can I confirm [# students, subjects, preferred model]? I'll have it over within [timeframe] and we can review together on [Day]."

**Dispositions:** Meeting booked · Pilot agreed · Proposal requested · Not now (quarterly follow-up) · Not a fit.

---

## Compliance & Deliverability (read before sending)

- **Cold email = B2B only.** Never cold-email parents/consumers. Use secondary warmed domains, low daily volume per mailbox, honest sender identity, and a working one-click unsubscribe.
- **Cold calling:** call reasonable hours, honor do-not-call requests immediately, log consent/dispositions in the CRM.
- **Owned-list outreach (reactivation) to parents** is fine because it's existing/opted-in contacts — keep opt-out easy on WhatsApp/SMS.
- **Data:** no student data shared with partners without consent; keep all contact data and keys server-side ([SECURITY.md](../../SECURITY.md)).
- **Localize** greetings, currency, and timing to `[City/Region]`; adjust claims so every stat used is true and defensible.
