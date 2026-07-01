# SERVICES.md — Service Catalog

What we sell, what each engagement includes, and how it maps to our [audit-to-build pipeline](AGENCY.md#the-audit-to-build-pipeline).

This is the practical menu. For positioning and principles see [AGENCY.md](AGENCY.md); for packaging and price points see [PRICING.md](PRICING.md).

---

## Service Overview

| # | Service | Best for | Typical output |
|---|---------|----------|----------------|
| 1 | [Websites](#1-websites) | Businesses needing a modern, fast site | Deployed, responsive site |
| 2 | [AI Audits](#2-ai-audits) | Teams unsure where AI fits | Prioritized opportunity report |
| 3 | [AI Consultancy](#3-ai-consultancy) | Leaders planning AI adoption | Strategy + roadmap |
| 4 | [Automations](#4-automations) | Teams doing repetitive manual work | Working automated workflows |
| 5 | [Internal Dashboards](#5-internal-dashboards) | Teams lacking visibility/control | Admin/analytics dashboard |
| 6 | [Lead Capture Systems](#6-lead-capture-systems) | Businesses wasting traffic | Capture + routing pipeline |
| 7 | [Custom AI Workflows](#7-custom-ai-workflows) | Unique processes needing bespoke tooling | Custom AI system |
| 8 | [Maintenance & Support](#8-maintenance--support) | Anyone running a live system | Ongoing upkeep |

---

## 1. Websites

Fast, modern, conversion-focused websites — designed, built, secured, and deployed.

**Includes**
- Discovery of goals, audience, and required pages
- Responsive design (desktop + mobile) per [DESIGN.md](DESIGN.md)
- Build on our default stack ([TECH_STACK.md](TECH_STACK.md))
- Contact / inquiry forms with email delivery
- Basic SEO and performance pass
- Production deployment and a post-launch smoke test

**Good fit when** a client needs a credible, fast web presence that actually converts — not a template they'll abandon.

**Pipeline stages:** Discovery → Build → Deploy → (optional) Support.

---

## 2. AI Audits

An honest assessment of where AI can save time, money, or risk — and where it shouldn't be used.

**Includes**
- Review of current processes, tools, and pain points
- Identification of AI/automation opportunities
- Prioritized recommendations with effort vs. impact
- Risk, privacy, and feasibility notes
- A clear next-step roadmap

**Output:** a written audit using [templates/ai-audit.md](templates/ai-audit.md).

**Good fit when** a client knows AI matters but doesn't know where to start. The audit de-risks investment before any build.

**Pipeline stages:** Discovery → Audit → Roadmap.

> Related: [website audits](templates/website-audit.md) assess performance, UX, conversion, and security for existing sites.

---

## 3. AI Consultancy

Strategy and guidance for adopting AI across a business.

**Includes**
- AI strategy aligned to business goals
- Tooling and platform recommendations (default to the latest, most capable models)
- Adoption roadmap with phased priorities
- Team enablement and best-practice guidance
- Guardrails for security, privacy, and responsible use

**Output:** a roadmap and recommendations the client can act on, with or without us building.

**Good fit when** leadership needs direction before committing budget to build.

**Pipeline stages:** Discovery → Audit → Roadmap.

---

## 4. Automations

Remove repetitive manual work by connecting tools and automating workflows.

**Includes**
- Mapping the current manual process
- Designing the automated flow
- Integrating tools, APIs, and notifications
- Error handling and basic monitoring
- Documentation and handoff

**Examples**
- Auto-routing inbound leads to the right person
- Syncing data between systems
- Scheduled reports and reminders
- Email / notification workflows

**Good fit when** a team spends hours on copy-paste, manual data entry, or repetitive follow-ups.

**Pipeline stages:** Discovery → Build → Deploy → (optional) Support.

---

## 5. Internal Dashboards

Give teams visibility and control with custom admin and analytics dashboards.

**Includes**
- Data sources and key metrics definition
- Admin views, moderation, and management tools
- Role-based access where needed
- Secure handling of sensitive/private data
- Deployment and access setup

**Reference pattern:** the Malir Cantt Bazaar admin dashboard handles listing moderation, business approvals, and **admin-only private verification documents** — see [reference/malir-cantt-bazaar/features.md](reference/malir-cantt-bazaar/features.md).

**Good fit when** a team is flying blind or managing operations through spreadsheets and DMs.

**Pipeline stages:** Discovery → Build → Deploy → (optional) Support.

---

## 6. Lead Capture Systems

Turn traffic into qualified leads with capture forms and routing pipelines.

**Includes**
- Lead capture forms and landing pages
- Validation and spam/rate-limit protection
- Email notifications and confirmations
- Routing leads to the right destination (inbox, CRM, sheet)
- Basic tracking of submissions

**Good fit when** a business gets visitors but loses them because there's no clear, reliable way to capture interest.

**Pipeline stages:** Discovery → Build → Deploy → (optional) Support.

---

## 7. Custom AI Workflows

Bespoke AI-powered tooling built around a client's specific processes.

**Includes**
- Deep discovery of the unique workflow
- Custom AI integration (latest capable models by default)
- Connection to the client's existing data and tools
- Security, privacy, and guardrail design
- Deployment, documentation, and handoff

**Examples**
- AI-assisted content or document generation
- Classification, extraction, or summarization pipelines
- Internal AI assistants tuned to the business
- AI-augmented review or moderation flows

**Good fit when** off-the-shelf tools don't fit and the process is core enough to justify custom work.

**Pipeline stages:** Discovery → Audit → Roadmap → Build → Deploy → Support.

---

## 8. Maintenance & Support

Keep what we (or others) shipped healthy and current.

**Includes**
- Monitoring and uptime checks
- Bug fixes and small enhancements
- Dependency and security updates
- Periodic reviews using [templates/maintenance-checklist.md](templates/maintenance-checklist.md)
- A clear point of contact

**Good fit when** a client has a live system and wants it to stay stable, secure, and improving.

**Pipeline stages:** Support (ongoing).

---

## How Services Map to the Pipeline

```
Lead → Discovery → Audit → Roadmap → Build → Deploy → Support
                    │         │         │       │        │
        AI Audits ──┘         │         │       │        │
   AI Consultancy ────────────┘         │       │        │
         Websites ──────────────────────┤───────┤        │
      Automations ──────────────────────┤───────┤        │
       Dashboards ──────────────────────┤───────┤        │
     Lead Capture ──────────────────────┤───────┤        │
Custom AI Workflows ────────────────────┤───────┤────────┤
  Maintenance & Support ────────────────────────────────-┘
```

Full pipeline detail: [AGENCY.md](AGENCY.md#the-audit-to-build-pipeline).

---

## Engagement Standards (All Services)

Every engagement follows the same baseline:

- **Tight scope.** We solve the actual problem at the right size — no overbuilding.
- **Security first.** No exposed secrets, no committed `.env` files, no client credentials in docs. See [SECURITY.md](SECURITY.md).
- **Branches & PRs.** Code work uses branches and pull requests; we never merge automatically unless told.
- **Production discipline.** Build/lint/tests pass before deploy; no fake production data; migrations additive where possible.
- **Clear handoff.** Documentation and an end-of-session report: files changed, what was added/updated, what still needs work, and next steps.

---

## How to Start

1. Client intake → [templates/client-intake.md](templates/client-intake.md)
2. Audit (if applicable) → [templates/ai-audit.md](templates/ai-audit.md) or [templates/website-audit.md](templates/website-audit.md)
3. Proposal → [templates/proposal-template.md](templates/proposal-template.md)
4. Pricing → [PRICING.md](PRICING.md)
5. Build & deliver → [PROJECT_WORKFLOW.md](PROJECT_WORKFLOW.md)
