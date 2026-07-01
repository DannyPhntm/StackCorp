# PROMPTS.md — Standard Claude Code Prompts

A repository of reusable prompts for daily work in Claude Code. These keep our work consistent with the agency operating system — the same standards, the same workflow, every time.

## How to Use

- Copy a prompt, fill in the `<placeholders>`, and run it.
- These assume Claude Code is working **inside the relevant project repo**, with [CLAUDE.md](CLAUDE.md), [SECURITY.md](SECURITY.md), [PROJECT_WORKFLOW.md](PROJECT_WORKFLOW.md), [TECH_STACK.md](TECH_STACK.md), and [DESIGN.md](DESIGN.md) available as context.
- Always respect the working rules: no secrets, no `.env` commits, branches + PRs, no auto-merge.
- When a prompt produces something reusable, add or refine it here.

---

## Default Claude Task Prompt

Use this before meaningful agency or client tasks:

```text
Before starting, read CLAUDE.md, SECURITY.md, SKILLS.md, and the relevant project files.

Do not edit anything yet.

First:
1. Summarize the task.
2. Identify what files/docs are relevant.
3. Decide whether any skill from SKILLS.md applies.
4. Decide whether subagents/perspectives are needed. If yes, state how many and what each perspective will check.
5. Create or confirm the spec.
6. Ask clarifying questions if anything is unclear.
7. State how you will verify the work before calling it done.

Rules:
- Do not assume important details.
- Do not rewrite whole files unless approved.
- Do not touch production data.
- Do not merge automatically.
- Do not expose secrets.
- Update relevant docs after meaningful changes.
- Before saying done, run the verification and report results.
```

## Default End-of-Task Prompt

```text
Before ending, verify the task.

Report:
1. What changed
2. Files changed
3. Skills used, if any
4. Subagents/perspectives used, if any
5. Verification plan stated before work
6. Verification actually run after work
7. Browser/manual checks performed, if applicable
8. Tests/checks run
9. What passed
10. What could not be verified
11. Risks/blockers
12. Docs updated
13. Commit/PR status
14. Deployment steps
15. Next recommended task

Do not claim the task is complete unless the verification supports it.
```

## Website Build Prompt Add-On

```text
For this website task, use browser verification if available.

Before coding:
- create/confirm the spec
- identify pages/components affected
- identify mobile states
- identify success criteria
- state verification plan

After coding:
- run lint/build
- open/preview the affected page if possible
- check desktop and mobile widths
- check forms/interactions
- report screenshots or viewport results if possible
```

## Security Task Prompt Add-On

```text
For this security task, use separate perspectives:
1. auth/access control
2. data/privacy
3. input validation/injection
4. deployment/config

Before coding:
- state threat being addressed
- state files/routes affected
- state how protection will be verified

After coding:
- run relevant tests/checks
- verify the protection actually blocks the bad case
- report any remaining risk
```


## 1. Client Work — Audits & Discovery

### AI audit
```
Using templates/ai-audit.md, run an AI audit for <client/business>.
Context: <what they do, their tools, their pain points>.
Identify where AI or automation saves time, money, or risk — and where it should NOT be used.
Prioritize by effort vs. impact and produce the filled-in audit. Be honest about low-value areas.
```

### Website audit
```
Using templates/website-audit.md, audit <website URL>.
Assess performance, UX, conversion, and security.
Give prioritized, specific recommendations with effort vs. impact. Note any security or privacy risks.
```

### Turn findings into a pitch
```
Based on the audit at <path>, draft a client-facing solution pitch.
Lead with the business problem, not the technology. Recommend specific services from SERVICES.md,
phase the work so value lands early, and reference Malir Cantt Bazaar as proof we ship production systems.
```

### Draft a proposal
```
Using templates/proposal-template.md and PRICING.md, draft a proposal for <client>.
Scope: <summary>. Define what's included AND out of scope, milestones, timeline, and a value-based price.
Suggest where the audit fee can be credited and where a retainer fits.
```

---

## 2. Project Setup

### Start a new project
```
Create a new project file from projects/future-project-template.md for <project name>.
Fill in goals, scope, stack (default to TECH_STACK.md), and milestones based on: <details>.
Do not invent secrets or env values.
```

### Scaffold on the standard stack
```
Plan the initial structure for <project> on our standard stack (TECH_STACK.md):
React/Vite frontend, Node/Express backend, Neon Postgres + Prisma, deployed to Vercel + Railway.
Propose the folder structure, core models, and first milestone. Don't overbuild — only what the milestone needs.
```

---

## 3. Building — Features & Code

### Implement a feature (branch + PR)
```
Implement <feature> in this repo.
Follow PROJECT_WORKFLOW.md: create a branch named per convention, match the existing code style,
validate all input, use Prisma (no raw SQL), and apply the SECURITY.md baseline.
Open a PR with a clear description and the PR checklist. Do NOT merge.
```

### Build an admin/dashboard view
```
Build <dashboard/admin view> following DESIGN.md (function-first, clean, status-driven).
Include loading/success/error/empty states, clear status labels, confirmed destructive actions,
and keep any admin-only/private data out of public views. Make it work on mobile and desktop.
```

### Add a secure upload flow
```
Add an image upload for <feature> per SECURITY.md upload rules:
multipart/form-data, images only, size limits, reject empty/non-image files,
upload to Cloudinary, validate the response, store the secure URL (no base64).
A failed upload must block the operation and surface a clear error.
```

---

## 4. Review & Quality

### Self-review a diff
```
Review the current diff for correctness bugs and for security issues against SECURITY.md.
Check: no secrets/.env committed, input validated, auth/role guards correct, private data not exposed,
ownership checks present, uploads validated. Report findings most-severe first.
```

### Pre-deploy security check
```
Run the SECURITY.md deployment readiness checklist against this project.
Confirm no secrets in repo/history, env vars are referenced (not hardcoded), auth and private-data
rules hold, uploads and rate limiting are in place, and build/lint/tests pass. List anything failing.
```

### Pre-launch smoke test plan
```
Using reference/malir-cantt-bazaar/deployment.md as the model, produce a post-deploy smoke test
for <project>: homepage, auth, core flows, admin/moderation, mobile layout, and any project-specific flows.
```

---

## 5. Deployment

### Deploy checklist run
```
Walk through the deployment steps from PROJECT_WORKFLOW.md for a <backend/frontend/database> change.
Confirm migrations are additive and reviewed, run the right redeploy steps, and list the smoke tests to run after.
Do not perform production database edits without explicit approval.
```

---

## 6. Documentation & Knowledge

### Update project knowledge
```
Update the relevant .md files to reflect <change>.
Markdown is the source of truth. Keep docs clear and practical. Do not include any secrets or real client figures.
```

### Log a decision
```
Add a new ADR to DECISIONS.md for the decision to <decision>.
Use the standard ADR format (Context / Decision / Consequences), put it at the top of the log,
and link any decision it supersedes.
```

### End-of-session report
```
Run the end-of-session rule from CLAUDE.md: report files changed, what was added/updated,
what still needs work, and suggested next steps.
```

---

## 7. Maintenance & Support

### Monthly maintenance pass
```
Run the maintenance pass for <project> using templates/maintenance-checklist.md.
Check monitoring/uptime, dependency and security updates, and open small fixes.
Summarize what changed and what needs the client's attention.
```

---

## Prompt-Writing Guidelines

When adding prompts here, keep them:
- **Specific** — name the template, file, or standard to follow.
- **Standards-aware** — reference the relevant `.md` (SECURITY, DESIGN, PROJECT_WORKFLOW, etc.).
- **Safe** — never request or embed secrets, credentials, or real client data.
- **Scoped** — tell Claude what NOT to do (e.g. don't merge, don't overbuild, don't edit prod data).
