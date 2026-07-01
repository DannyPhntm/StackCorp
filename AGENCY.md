# AGENCY.md — Who We Are & How We Operate

This document defines the agency: our mission, our positioning, the principles we hold, and the **audit-to-build pipeline** that turns a conversation into a shipped, supported system.

For the catalog of what we sell, see [SERVICES.md](SERVICES.md). For working rules inside this repo, see [CLAUDE.md](CLAUDE.md).

---

## Mission

We help businesses modernize through **real, shipped systems** — websites, AI tooling, and automations that work in production and keep working.

We are an AI services, web development, AI consultancy, audit, automation, and custom-systems agency. We are deliberately practical: we measure ourselves by what we launch and what it does for the client, not by decks or demos.

---

## What We Believe

1. **Shipped beats theoretical.** A small system live in production is worth more than a large plan that never launches.
2. **AI is a tool, not the point.** We adopt AI where it saves time, money, or risk — and skip it where it doesn't.
3. **Don't overbuild.** We solve the actual problem at the right size. Scope creep is a failure mode.
4. **Clarity is a deliverable.** Clear docs, clear handoffs, clear pricing. Markdown is our source of truth.
5. **Security is baseline, not an upsell.** Every system handles real user data as if it matters — because it does.
6. **Own the outcome.** We design flows, build, secure, deploy, and support. We don't hand over a half-finished system and disappear.

---

## Positioning

We sit between three kinds of providers and take the best of each:

| Provider type | Their gap | What we add |
|---------------|-----------|-------------|
| Freelancers | Inconsistent, often disappear after delivery | Process, security, ongoing support |
| Traditional web agencies | Slow, expensive, weak on AI | Speed, modern stack, real AI capability |
| AI "prompt" consultants | Talk, little shipped | Working systems deployed to production |

**Our edge:** we audit honestly, scope tightly, and actually ship — with proof of work to back it up.

---

## Who We Serve

- Local and regional businesses ready to modernize
- Founders who need a real product launched, not a prototype
- Teams drowning in manual, repetitive work
- Businesses unsure where AI fits and wanting an honest assessment first

---

## Proof of Work — Malir Cantt Bazaar

Our flagship case study is **[Malir Cantt Bazaar](https://malircanttbazaar.com)** — a verified local marketplace and shops directory for Malir Cantt residents and businesses, built and launched end-to-end.

It proves we can build and run **production systems**, not just static sites. Highlights:

- User authentication and email verification
- Personal and business listings across many categories
- Image uploads via multipart/form-data, stored on Cloudinary
- Business verification with **admin-only private documents**
- Shops directory and permanent shop profiles
- Admin dashboard for moderation and approvals
- Listing limits, featured slots, and contact-seller flows
- Security hardening and a full pre-launch audit
- Production deployment: Vercel (frontend), Railway (backend), Neon Postgres, Prisma, Resend, Cloudinary

**Stack:** React / Vite · Node / Express · Neon Postgres · Prisma · Vercel + Railway · Cloudinary · Resend.

Full reference lives in [`reference/malir-cantt-bazaar/`](reference/malir-cantt-bazaar/). We use this project to show prospective clients exactly what "shipped" looks like.

> **Boundary:** This repo is the agency operating system, **not** the Malir Cantt Bazaar application source. The marketplace code is referenced here only.

---

## The Audit-to-Build Pipeline

Our core operating model. Every engagement flows through these stages — though small jobs may skip straight to Build, and consultancy-only clients may stop after Roadmap.

```
Lead  →  Discovery  →  Audit  →  Roadmap  →  Build  →  Deploy  →  Support
```

### 1. Lead
A prospect reaches us (referral, the Malir Cantt Bazaar case study, outreach, or inbound).
- **Goal:** qualify fit and intent.
- **Artifacts:** [templates/client-intake.md](templates/client-intake.md)
- **Process:** [CLIENT_WORKFLOW.md](CLIENT_WORKFLOW.md)

### 2. Discovery
We understand the business, its goals, and its current systems.
- **Goal:** know the real problem before proposing a solution.
- **Output:** scope notes, constraints, success criteria.

### 3. Audit
We assess what exists and where the opportunity is. This is where we earn trust by being honest.
- **AI audit** — where AI can save time, money, or risk → [templates/ai-audit.md](templates/ai-audit.md)
- **Website audit** — performance, UX, conversion, security → [templates/website-audit.md](templates/website-audit.md)
- **Goal:** a clear, prioritized list of opportunities and risks.

### 4. Roadmap & Proposal
We turn findings into a concrete plan with scope, sequence, and price.
- **Output:** proposal → [templates/proposal-template.md](templates/proposal-template.md)
- **Pricing:** [PRICING.md](PRICING.md)
- **Principle:** scope tightly. Phase work so the client sees value early.

### 5. Build
We design flows and build the system.
- **Process:** [PROJECT_WORKFLOW.md](PROJECT_WORKFLOW.md)
- **Standards:** [TECH_STACK.md](TECH_STACK.md), [DESIGN.md](DESIGN.md), [SECURITY.md](SECURITY.md)
- **Rules:** branches and pull requests; never merge automatically unless told; never commit secrets or `.env` files.

### 6. Deploy
We launch to production with a smoke test and a pre-launch security check.
- **Reference pattern:** [reference/malir-cantt-bazaar/deployment.md](reference/malir-cantt-bazaar/deployment.md)
- **Rules:** no fake production data; no casual production DB edits; build/lint/tests pass before deploy; migrations additive where possible.

### 7. Support
We keep what we shipped healthy.
- **Artifacts:** [templates/maintenance-checklist.md](templates/maintenance-checklist.md), [templates/project-handoff.md](templates/project-handoff.md)
- **Goal:** stable systems and a long client relationship.

---

## How We Run Internally

- **Source of truth:** markdown files in this repo. When knowledge changes, the relevant `.md` changes.
- **Roles:** [docs/roles-and-responsibilities.md](docs/roles-and-responsibilities.md)
- **Tooling accounts:** [docs/tool-accounts.md](docs/tool-accounts.md) (no secrets stored)
- **Operating rhythm:** [docs/weekly-checklist.md](docs/weekly-checklist.md)
- **Decisions:** logged in [DECISIONS.md](DECISIONS.md)

---

## Operating Principles (Non-Negotiable)

- Do not expose secrets. Do not commit `.env` files. Never put client passwords or API keys in docs.
- Do not overbuild.
- Keep docs clear and practical.
- Use branches and pull requests for code; do not merge automatically unless explicitly told.
- Security and privacy are part of every build, not an optional extra.

---

## End-of-Session Rule

At the end of each session, report **files changed**, **what was added/updated**, **what still needs work**, and **suggested next steps**.
