# DECISIONS.md — Decision Log

A running log of significant decisions: architecture, tooling, process, and pricing precedent. This is our institutional memory — **why** we do things the way we do.

## How to Use This Log

- Add a new entry whenever a decision sets a lasting precedent or would otherwise be forgotten.
- Newest entries go at the top of the log.
- Keep entries short and factual. The point is the **reasoning**, not prose.
- Never put secrets, credentials, or real client figures in an entry.
- Once recorded, a decision stays in the log. To change course, add a **new** entry that supersedes the old one and link them.

### Entry format

```
## ADR-NNNN — <Short title>
- **Date:** YYYY-MM-DD
- **Status:** Accepted | Superseded by ADR-XXXX | Deprecated
- **Context:** What problem or question prompted this.
- **Decision:** What we decided.
- **Consequences:** Trade-offs, follow-ups, what this commits us to.
```

---

## Log

## ADR-0006 — Value-based pricing across audit → build → retainer
- **Date:** 2026-07-01
- **Status:** Accepted
- **Context:** We needed a consistent way to price work without competing on hourly rates.
- **Decision:** Price by outcome using three models — fixed-fee audits, milestone-based fixed-price builds, and monthly retainers — with audit fees creditable toward builds. Documented in [PRICING.md](PRICING.md).
- **Consequences:** Quotes always follow discovery; scope must be written explicitly; the standard engagement funnels clients from audit into build into a recurring retainer.

## ADR-0005 — Function-first design, dashboards as the priority
- **Date:** 2026-07-01
- **Status:** Accepted
- **Context:** Much of our differentiated work is internal tools and admin dashboards, where usability matters more than visual flair.
- **Decision:** Adopt a function-first UI/UX philosophy prioritizing clean, fast, clear internal tools; mobile-required public pages; honest state and error feedback. Documented in [DESIGN.md](DESIGN.md).
- **Consequences:** Every UI ships against a design review checklist; private/admin data must never appear in public views; decoration never outranks the core task.

## ADR-0004 — Security baseline applies to all work
- **Date:** 2026-07-01
- **Status:** Accepted
- **Context:** Every system we build handles real user data; security can't be optional or an upsell.
- **Decision:** Adopt an agency-wide security baseline — absolute rules on secrets, auth/authorization, data privacy, input validation, uploads, rate limiting, and a deployment readiness checklist. Documented in [SECURITY.md](SECURITY.md), proven in [reference/malir-cantt-bazaar/security.md](reference/malir-cantt-bazaar/security.md).
- **Consequences:** Security checks are part of the PR checklist, not a separate phase; secrets live only in host environments; leaked secrets are treated as incidents and rotated.

## ADR-0003 — Branch + PR workflow; no automatic merges
- **Date:** 2026-07-01
- **Status:** Accepted
- **Context:** We need consistent, reviewable engineering across all code projects.
- **Decision:** All code work happens on branches and reaches `main` through reviewed pull requests; we never merge automatically unless explicitly told. Documented in [PROJECT_WORKFLOW.md](PROJECT_WORKFLOW.md).
- **Consequences:** `main` stays deployable; every change passes build/lint/tests and a security check before merge.

## ADR-0002 — Audit-to-build pipeline as the operating model
- **Date:** 2026-07-01
- **Status:** Accepted
- **Context:** We needed a single, repeatable way to take clients from first contact to a supported, shipped system.
- **Decision:** Adopt the Lead → Discovery → Audit → Roadmap → Build → Deploy → Support pipeline. Documented in [AGENCY.md](AGENCY.md) and [CLIENT_WORKFLOW.md](CLIENT_WORKFLOW.md).
- **Consequences:** Audits become the trusted entry point; scope is set before building; every engagement has clear stage gates and handoff.

## ADR-0001 — Standard stack: React/Vite, Node/Express, Neon, Prisma, Vercel, Railway, Cloudinary, Resend
- **Date:** 2026-07-01
- **Status:** Accepted
- **Context:** We wanted a default, proven stack to build fast and reuse what we know works, rather than re-choosing tools per project.
- **Decision:** Standardize on the stack proven by Malir Cantt Bazaar. Documented in [TECH_STACK.md](TECH_STACK.md).
- **Consequences:** Faster builds and lower risk through reuse; deviations require a documented reason in the project file and, if lasting, a new ADR here.

---

> ADR-0001 through ADR-0006 record the founding decisions captured when the agency operating system was first documented. Add the next decision as **ADR-0007** at the top of the log.
