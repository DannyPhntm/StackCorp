# PRICING.md — Pricing Structure

How we package and price our work. Our model is **value-based**: we price by the outcome and risk we remove for the client, not by hours logged.

This is internal guidance for scoping and proposals. It maps directly to the [service catalog](SERVICES.md) and the [client workflow](CLIENT_WORKFLOW.md).

> **Note on numbers:** the figures below are **internal reference bands**, not a public rate card. Always set the final price per project after discovery, using the [value-based factors](#value-based-pricing-factors). Adjust to the client's market and currency.

---

## Pricing Philosophy

1. **Price the outcome, not the hours.** What is solving this worth to the client — in revenue, saved time, or reduced risk?
2. **Tight scope, clear price.** Every quote names what's included and what's out. Ambiguity is how projects lose money.
3. **Phase the work.** Break large projects into milestones so the client sees value early and risk stays low for both sides.
4. **Anchor on proof.** Malir Cantt Bazaar shows we ship production systems — that lowers client risk and justifies real pricing.
5. **Don't underprice support.** A live system needs ongoing care; recurring revenue keeps it healthy.
6. **Don't overbuild.** We quote the right-sized solution, not the biggest one.

---

## The Three Pricing Models

| Model | Used for | Structure |
|-------|----------|-----------|
| **Fixed-fee audit** | AI / website audits, consultancy | One-time fee for a defined deliverable |
| **Fixed-price build** | Websites, automations, dashboards, custom AI | Milestone-based project price |
| **Monthly retainer** | Maintenance, support, ongoing AI/automation work | Recurring monthly fee |

---

## 1. Audits & Consultancy (Fixed Fee)

A defined assessment with a written deliverable. Often the **entry point** to a larger build.

| Offering | Scope | Reference band |
|----------|-------|----------------|
| **AI Audit** | Process review, opportunity map, prioritized recommendations | Small one-time fee |
| **Website Audit** | Performance, UX, conversion, security review | Small one-time fee |
| **AI Consultancy** | Strategy + adoption roadmap, may be sessions or a sprint | One-time or short engagement |

**How we price it**
- Flat fee based on business size and depth required.
- Deliverable is the [ai-audit](templates/ai-audit.md) or [website-audit](templates/website-audit.md) template, filled in.
- **Audit-to-build credit:** we can credit part of the audit fee toward a build if the client proceeds within an agreed window. This de-risks the audit for the client and pulls them into the pipeline.

---

## 2. Custom Builds (Fixed Price, Milestone-Based)

Websites, automations, dashboards, lead capture, and custom AI workflows. Priced per project, paid across milestones.

### How we scope a build
1. Define the outcome and success criteria (from discovery).
2. Break it into milestones (e.g. design & flows → core build → admin/dashboard → deploy & launch).
3. Price each milestone by the value and effort it represents.
4. Name what's **out of scope** explicitly.

### Reference complexity bands

| Tier | Looks like | Notes |
|------|-----------|-------|
| **Starter** | Brochure/marketing site, simple lead capture | Few pages, no complex backend |
| **Standard** | Multi-feature site, automation, single dashboard | Backend + database + integrations |
| **Production system** | Full app like Malir Cantt Bazaar | Auth, roles, uploads, admin, deploy, security hardening |

> Malir Cantt Bazaar (auth, listings, uploads, business verification, admin moderation, shops, security, deployment) is a **Production system** — use it to calibrate the top tier.

### Payment structure
- **Deposit** to start (commonly ~30–50%).
- **Milestone payments** tied to delivered, reviewable work.
- **Final payment** on acceptance, before or at handoff.

### Change orders
- Out-of-scope requests are quoted separately as a change order.
- We never absorb scope creep silently — it's how projects become unprofitable.

---

## 3. Monthly Retainers (Recurring)

For maintenance, support, and ongoing work. This is the relationship that keeps shipped systems healthy and creates predictable revenue.

| Tier | Includes | Best for |
|------|----------|----------|
| **Care** | Monitoring, security/dependency updates, small fixes, periodic review | Any live system |
| **Care + Growth** | Care, plus a budgeted block of enhancement work each month | Clients actively improving their system |
| **Partner** | Priority support, ongoing builds/automations, regular strategy | Clients treating us as their tech team |

**How we price it**
- Based on system complexity, uptime expectations, and included work hours/blocks.
- Define response expectations and what's included vs. billed extra.
- Use [templates/maintenance-checklist.md](templates/maintenance-checklist.md) to deliver the recurring value visibly.

---

## Value-Based Pricing Factors

Adjust the final price up or down based on:

- **Business impact** — revenue enabled, hours saved, risk removed.
- **Complexity** — auth, roles, integrations, data sensitivity, custom AI.
- **Data sensitivity & security burden** — private documents, compliance needs.
- **Timeline** — rush work carries a premium.
- **Ongoing relationship** — a strong retainer can justify a leaner build price.
- **Client size & market** — price to the client's context and currency.
- **Reuse** — work that reuses our proven stack/patterns is lower-risk for us and can be priced competitively.

---

## Quoting Rules

- **Always quote after discovery,** never before understanding the problem.
- **Write scope explicitly,** including exclusions, in the [proposal](templates/proposal-template.md).
- **Quote a price, not a rate,** for builds and audits.
- **Bundle the retainer** into build conversations — sell the long-term relationship early.
- **Put nothing sensitive in the repo** — proposals with real client figures stay out of these docs.
- **Record pricing decisions** that set precedent in [DECISIONS.md](DECISIONS.md).

---

## Standard Engagement Shape

A typical full-pipeline client:

```
Audit (fixed fee)
   → credited toward →
Build (fixed price, milestones)
   → rolls into →
Retainer (monthly, recurring)
```

This is the ideal: a low-risk entry, a value-priced build, and a lasting recurring relationship.
