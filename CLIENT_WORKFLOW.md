# CLIENT_WORKFLOW.md — From Lead to Handoff

How **StackCorp** moves a prospect through the full journey: **initial business audit → pitching AI solutions → custom build → handoff and support.**

This is the client-facing side of our [audit-to-build pipeline](AGENCY.md#the-audit-to-build-pipeline). For the internal coding and delivery mechanics, see [PROJECT_WORKFLOW.md](PROJECT_WORKFLOW.md).

---

## The Journey at a Glance

```
1. Lead & Intake
2. Discovery & Business Audit
3. Findings & AI Solution Pitch
4. Proposal & Agreement
5. Custom Build
6. Review & Acceptance
7. Deploy & Launch
8. Handoff
9. Support & Growth
```

Small jobs may compress stages; consultancy-only clients may stop after Stage 4. The sequence and the gates between stages stay the same.

---

## Stage 1 — Lead & Intake

**Goal:** qualify fit and capture the basics.

A prospect reaches us via referral, the [Malir Cantt Bazaar case study](reference/malir-cantt-bazaar/overview.md), outreach, or inbound.

**Do**
- Run the client intake → [templates/client-intake.md](templates/client-intake.md)
- Capture business type, goals, current systems, timeline, and budget signal
- Confirm there's a real problem we can solve at the right size

**Exit gate:** the prospect is a fit and wants to proceed to discovery.

**Output:** completed intake notes.

---

## Stage 2 — Discovery & Business Audit

**Goal:** understand the business and assess where AI and modernization actually help — honestly.

This is where we earn trust. We assess before we propose.

**Do**
- Map the client's current processes, tools, and pain points
- Identify where AI/automation saves time, money, or risk — **and where it shouldn't be used**
- Note constraints: data privacy, integrations, team capacity, compliance
- Define success criteria with the client

**Templates**
- AI audit → [templates/ai-audit.md](templates/ai-audit.md)
- Website audit (for existing sites) → [templates/website-audit.md](templates/website-audit.md)

**Principles**
- Be honest. If AI is the wrong tool, say so.
- Prioritize by effort vs. impact.
- Don't overbuild the audit either — clarity over volume.

**Exit gate:** a prioritized list of opportunities and risks the client recognizes as accurate.

**Output:** written audit.

---

## Stage 3 — Findings & AI Solution Pitch

**Goal:** turn audit findings into a clear, compelling solution the client understands and wants.

**Do**
- Present findings in plain language — lead with the business problem, not the technology
- Recommend specific solutions from our [service catalog](SERVICES.md): websites, automations, dashboards, lead capture, custom AI workflows, etc.
- Show effort vs. impact and a phased sequence so value lands early
- Use Malir Cantt Bazaar as proof we ship production systems, not demos
- Default to the latest, most capable AI models where AI is involved

**Principles**
- Pitch outcomes, not features.
- Phase the work. A client should see value in the first milestone.
- Tight scope wins — propose the right size, not the biggest size.

**Exit gate:** the client agrees on the direction and wants a proposal.

**Output:** agreed solution direction and rough phasing.

---

## Stage 4 — Proposal & Agreement

**Goal:** a concrete plan with scope, sequence, price, and terms.

**Do**
- Write the proposal → [templates/proposal-template.md](templates/proposal-template.md)
- Price per [PRICING.md](PRICING.md)
- Define scope explicitly, including what is **out** of scope
- Set milestones, timeline, and responsibilities on both sides
- Agree on how access and credentials will be shared **securely** (never in this repo, never in docs)

**Principles**
- Scope tightly and write it down. Ambiguity becomes scope creep.
- Phase payments and deliverables together where possible.

**Exit gate:** signed agreement and confirmed start.

**Output:** signed proposal; project created from [projects/future-project-template.md](projects/future-project-template.md).

---

## Stage 5 — Custom Build

**Goal:** design and build the system.

The build runs on our internal delivery process — see [PROJECT_WORKFLOW.md](PROJECT_WORKFLOW.md) for branches, PRs, and coding rules.

**Do**
- Design user flows before building
- Build on our standard stack → [TECH_STACK.md](TECH_STACK.md)
- Apply design standards → [DESIGN.md](DESIGN.md)
- Apply security baseline → [SECURITY.md](SECURITY.md)
- Work in branches and pull requests; **never merge automatically unless explicitly told**
- Keep the client updated at milestone boundaries

**Principles**
- Don't overbuild. Solve the actual problem.
- Never commit secrets or `.env` files; never put client passwords or API keys in docs.

**Exit gate:** milestone(s) complete and ready for client review.

**Output:** working system on a staging/preview environment.

---

## Stage 6 — Review & Acceptance

**Goal:** confirm the build meets the agreed scope and success criteria.

**Do**
- Walk the client through the system against the agreed scope
- Collect feedback; separate in-scope fixes from new requests
- Handle out-of-scope requests as a change order, not silent extra work
- Run pre-launch checks: build/lint/tests pass, security review, mobile layout

**Exit gate:** client accepts the build (with agreed fixes scheduled).

**Output:** acceptance + punch list.

---

## Stage 7 — Deploy & Launch

**Goal:** get the system live, safely.

**Do**
- Follow the deployment pattern proven on Malir Cantt Bazaar → [reference/malir-cantt-bazaar/deployment.md](reference/malir-cantt-bazaar/deployment.md)
- Confirm production environment variables are set securely (outside this repo)
- Run migrations (additive where possible) and a full post-deploy smoke test
- Verify on desktop and mobile

**Production rules**
- No fake production data
- No casual production database edits without approval
- Build/lint/tests pass before deploy

**Exit gate:** system live and smoke-tested.

**Output:** production launch.

---

## Stage 8 — Handoff

**Goal:** leave the client with a clear, complete handover.

**Do**
- Complete the handoff → [templates/project-handoff.md](templates/project-handoff.md)
- Document architecture, accounts (no secrets in docs), and how to operate the system
- Hand over access cleanly and securely
- Record key decisions in [DECISIONS.md](DECISIONS.md)

**Exit gate:** client can operate the system and knows who to contact.

**Output:** handoff document.

---

## Stage 9 — Support & Growth

**Goal:** keep the system healthy and grow the relationship.

**Do**
- Offer maintenance & support → [SERVICES.md](SERVICES.md#8-maintenance--support)
- Run periodic reviews → [templates/maintenance-checklist.md](templates/maintenance-checklist.md)
- Monitor, patch, and propose the next phase when it adds real value

**Output:** ongoing stable system and a long client relationship.

---

## End-of-Session Rule

At the end of each working session on a client engagement, report **files changed**, **what was added/updated**, **what still needs work**, and **suggested next steps**.
