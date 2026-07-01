# StackCorp — Agency Operating System

The single source of truth for how **StackCorp** ([stackcorp.org](https://stackcorp.org)) runs. This repository is not a client app — it is the **operating system** for our AI services, web development, AI consultancy, audits, automation, and custom systems work.

> **StackCorp** builds websites, AI workflows, automations, audits, and business systems for modern businesses.
> *Websites, AI workflows, and business systems that help companies operate better.*
>
> - **StackCorp** is the agency brand.
> - **Malir Cantt Bazaar** is StackCorp's first live product and case study.
> - Production secrets and client credentials must **never** be stored in this repo.

Everything here is written in markdown so it stays readable, versioned, and easy to update. When knowledge changes, we update the relevant `.md` file rather than letting it live in someone's head.

---

## What This Repo Is

| | |
|---|---|
| **Purpose** | Run the agency: services, pricing, workflows, standards, and proof-of-work |
| **Format** | Markdown files as the source of truth |
| **Audience** | Internal team, collaborators, and AI assistants working in this repo |
| **Not included** | Client application source code (see [Important Boundary](#important-boundary)) |

---

## Start Here

New to the repo? Read these in order:

1. **[AGENCY.md](AGENCY.md)** — who we are, our mission, principles, and the audit-to-build pipeline.
2. **[SERVICES.md](SERVICES.md)** — what we sell and what each engagement includes.
3. **[CLAUDE.md](CLAUDE.md)** — operating instructions and working rules for this repo.
4. **[reference/malir-cantt-bazaar/overview.md](reference/malir-cantt-bazaar/overview.md)** — our flagship case study and proof-of-work.

---

## Repository Map

### Core operating documents
| File | Purpose |
|------|---------|
| [README.md](README.md) | This file — entry point and map |
| [AGENCY.md](AGENCY.md) | Mission, positioning, principles, audit-to-build pipeline |
| [SERVICES.md](SERVICES.md) | Service catalog and deliverables |
| [CLAUDE.md](CLAUDE.md) | Working rules for AI assistants in this repo |
| [PRICING.md](PRICING.md) | Packaging and pricing guidance |
| [TECH_STACK.md](TECH_STACK.md) | Default tools and technology choices |
| [DECISIONS.md](DECISIONS.md) | Log of key agency decisions |
| [DESIGN.md](DESIGN.md) | Design standards and conventions |
| [SECURITY.md](SECURITY.md) | Security baseline for all work |

### Workflows
| File | Purpose |
|------|---------|
| [CLIENT_WORKFLOW.md](CLIENT_WORKFLOW.md) | From lead to signed client |
| [PROJECT_WORKFLOW.md](PROJECT_WORKFLOW.md) | From kickoff to delivery |
| [PROMPTS.md](PROMPTS.md) | Reusable prompts for the team |

### Operations (`docs/`)
| File | Purpose |
|------|---------|
| [docs/roles-and-responsibilities.md](docs/roles-and-responsibilities.md) | Who owns what |
| [docs/tool-accounts.md](docs/tool-accounts.md) | Tooling accounts (no secrets) |
| [docs/weekly-checklist.md](docs/weekly-checklist.md) | Recurring operating rhythm |

### Templates (`templates/`)
Reusable starting points for client-facing work:
- [client-intake.md](templates/client-intake.md)
- [ai-audit.md](templates/ai-audit.md)
- [website-audit.md](templates/website-audit.md)
- [proposal-template.md](templates/proposal-template.md)
- [project-handoff.md](templates/project-handoff.md)
- [maintenance-checklist.md](templates/maintenance-checklist.md)

### Projects (`projects/`)
- [malir-cantt-bazaar.md](projects/malir-cantt-bazaar.md) — live flagship project
- [future-project-template.md](projects/future-project-template.md) — scaffold for new projects

### Reference (`reference/`)
Deep reference material for case studies and past builds:
- [malir-cantt-bazaar/overview.md](reference/malir-cantt-bazaar/overview.md)
- [malir-cantt-bazaar/features.md](reference/malir-cantt-bazaar/features.md)
- [malir-cantt-bazaar/security.md](reference/malir-cantt-bazaar/security.md)
- [malir-cantt-bazaar/deployment.md](reference/malir-cantt-bazaar/deployment.md)
- [malir-cantt-bazaar/claude-notes.md](reference/malir-cantt-bazaar/claude-notes.md)

---

## What We Do

We help businesses modernize through real, shipped systems — not slideware.

- **Websites** — fast, modern, conversion-focused sites
- **AI audits** — find where AI saves time, money, and risk
- **AI consultancy** — strategy and roadmaps for adopting AI
- **Automations** — remove repetitive manual work
- **Internal dashboards** — give teams visibility and control
- **Lead capture systems** — turn traffic into qualified leads
- **Custom AI workflows** — bespoke tooling around your processes
- **Maintenance and support** — keep what we ship healthy

See **[SERVICES.md](SERVICES.md)** for the full catalog.

---

## Proof of Work — Malir Cantt Bazaar

Our flagship case study is **[Malir Cantt Bazaar](https://malircanttbazaar.com)**, a verified local marketplace and shops directory we designed, built, secured, and deployed end-to-end.

It demonstrates that we ship **production systems**, not just static pages:

- User authentication and email verification
- Personal and business listings with image uploads (Cloudinary)
- Business verification with admin-only private documents
- Shops directory and permanent shop profiles
- Admin dashboard for moderation and approvals
- Listing limits, featured slots, and contact flows
- Security hardening and a full pre-launch audit
- Production deployment across Vercel, Railway, and Neon Postgres

Read the full story in [`reference/malir-cantt-bazaar/`](reference/malir-cantt-bazaar/).

---

## Important Boundary

This repository is **not** the Malir Cantt Bazaar application codebase. Malir Cantt Bazaar is referenced here as a case study and reference only. Do not assume the full marketplace source exists in this repo unless it has been explicitly copied in.

---

## Working Rules (Summary)

These are enforced for everyone — humans and AI — working in this repo. Full detail in [CLAUDE.md](CLAUDE.md).

- Never expose secrets, commit `.env` files, or put client passwords / API keys in docs.
- Don't overbuild — solve the actual problem.
- Keep docs clear and practical; markdown is the source of truth.
- When updating project knowledge, update the relevant `.md` file.
- For code projects, use branches and pull requests.
- Do not merge automatically unless explicitly told.

---

## End-of-Session Rule

At the end of each working session, report:

- **Files changed**
- **What was added or updated**
- **What still needs work**
- **Suggested next steps**
