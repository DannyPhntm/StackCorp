# PROJECT_WORKFLOW.md — Internal Delivery Rules

How we build: coding standards, branch management, pull requests, deployment discipline, and security hygiene.

This is the internal engineering side of delivery. For the client-facing journey, see [CLIENT_WORKFLOW.md](CLIENT_WORKFLOW.md). For the technology we build on, see [TECH_STACK.md](TECH_STACK.md).

---

## Core Principles

1. **Don't overbuild.** Solve the actual problem at the right size.
2. **Branches and PRs for all code work.** No direct commits to `main` on code projects.
3. **Never merge automatically unless explicitly told.**
4. **Never expose secrets.** No `.env` files committed. No client passwords or API keys in docs or code.
5. **Markdown is the source of truth.** When project knowledge changes, update the relevant `.md`.
6. **Ship working software.** Build/lint/tests pass before anything reaches production.

---

## Repository & Branch Management

### Branch model
- `main` is always deployable. It reflects production.
- All work happens on a branch off `main`.
- Keep branches short-lived and focused on one change.

### Branch naming
Use a type prefix and a short, kebab-case description:

```
feature/<short-description>
fix/<short-description>
chore/<short-description>
docs/<short-description>
refactor/<short-description>
```

Examples: `feature/listing-image-upload`, `fix/admin-auth-guard`, `docs/services-catalog`.

### Working on a branch
1. Start from an up-to-date `main`.
2. Create your branch with a clear name.
3. Commit in small, logical steps.
4. Push regularly so work isn't lost.

---

## Commit Standards

- Write clear, present-tense messages describing **what** and **why**.
- Keep commits focused — one logical change per commit where practical.
- Reference the project or task when useful.
- Never commit secrets, `.env` files, credentials, or generated junk.

**Format**
```
<type>: <concise summary>

<optional body: context, reasoning, trade-offs>
```
Types: `feature`, `fix`, `chore`, `docs`, `refactor`, `test`.

---

## Pull Requests

Every code change reaches `main` through a pull request.

**A good PR**
- Has a focused scope and a descriptive title
- Explains what changed, why, and how it was tested
- Stays small enough to review properly
- Passes build, lint, and tests
- Includes any required migrations (additive where possible)
- Touches no secrets

**PR checklist**
- [ ] Branch named per convention
- [ ] Scope is focused and matches the title
- [ ] Build passes
- [ ] Lint passes
- [ ] Tests pass (and added/updated where relevant)
- [ ] No secrets, `.env` files, or credentials included
- [ ] Migrations reviewed and additive where possible
- [ ] Security baseline respected ([SECURITY.md](SECURITY.md))
- [ ] Docs/markdown updated if knowledge changed

**Review & merge**
- Changes get reviewed before merge.
- **Do not merge automatically unless explicitly told.**
- Prefer creating a new commit over amending shared history.
- Delete the branch after merge.

---

## Coding Standards

- **Match the surrounding code.** Follow the existing naming, structure, and idioms of the project.
- **Validate all input** before it reaches the database. Use allow-listed enum values for statuses, categories, roles, and sorting.
- **Use the ORM.** Prefer Prisma; avoid raw SQL. Never concatenate user input into SQL.
- **Keep functions and modules focused.** Small, readable units over clever density.
- **Handle errors explicitly.** Failures (e.g. a failed image upload) should block the operation, not silently pass.
- **No dead scaffolding.** Don't add abstractions "for later" — build for the current need.

---

## Security Hygiene (Every Project)

Follow the full baseline in [SECURITY.md](SECURITY.md). Always:

- Hash passwords; never return password hashes to the frontend.
- Guard admin routes by role; restrict business routes to approved accounts.
- Let users edit/delete only their own data unless admin.
- Keep private data (verification documents, CNIC/NTN, admin notes) **admin-only and never public**.
- Validate upload responses; accept images only with size limits; store secure URLs, not base64.
- Rate-limit sensitive actions (login, register, verification, password reset, contact, uploads, applications).
- Keep all secrets out of the repo: `DATABASE_URL`, `JWT_SECRET`, API keys, etc., live only in the host environment.

---

## Testing & Quality Gates

Before opening a PR and before any deploy:

1. **Build** succeeds.
2. **Lint** passes.
3. **Tests** pass.
4. **Manual smoke** of the affected flows.

For data changes, also run `prisma validate` and review the migration.

---

## Deployment Discipline

We follow the deployment pattern proven on Malir Cantt Bazaar → [reference/malir-cantt-bazaar/deployment.md](reference/malir-cantt-bazaar/deployment.md).

**Backend changes**
1. Merge to `main`
2. Redeploy (e.g. Railway)
3. Run `prisma migrate deploy` if migrations exist
4. Test API health
5. Test auth / core / admin flows

**Frontend changes**
1. Merge to `main`
2. Redeploy (e.g. Vercel)
3. Test the live site on desktop and mobile

**Database changes**
1. Migration reviewed
2. Additive where possible
3. `prisma validate`
4. `prisma migrate deploy` on production
5. Confirm the app still works

**Production safety rules**
- No fake production data.
- No direct production database edits without approval.
- Never casually delete real user/business data.
- Always run build/lint/tests before deploying.

**Post-deploy:** run the project's smoke test (homepage, auth, core flows, admin, mobile layout).

---

## Project Setup & Tracking

- New projects start from [projects/future-project-template.md](projects/future-project-template.md).
- Active projects each have a file under `projects/` (e.g. [projects/malir-cantt-bazaar.md](projects/malir-cantt-bazaar.md)).
- Significant technical or product decisions are logged in [DECISIONS.md](DECISIONS.md).

---

## Spec → Build → Verify Loop

Every meaningful project task should follow this loop:

1. Understand the task
2. Read relevant docs/files
3. Check `SECURITY.md`
4. Check `SKILLS.md`
5. Decide whether subagents/perspectives are needed
6. Create or confirm a spec
7. Ask clarifying questions if anything is unclear
8. Implement the smallest safe change
9. Verify the result
10. Report what changed, what passed, and what remains

## Subagent / Perspective Planning

Use multiple perspectives when the task affects multiple areas.

Examples:

### Website Build

Use 4 perspectives:

* Product/spec perspective
* UI/UX perspective
* Technical implementation perspective
* QA/browser verification perspective

### Security Audit

Use 4 perspectives:

* Auth/access control perspective
* Data/privacy perspective
* Infrastructure/config perspective
* Abuse/edge-case perspective

### Client Proposal

Use 3 perspectives:

* Client/business perspective
* Scope/pricing perspective
* Risk/expectations perspective

### Documentation Cleanup

Use 2 perspectives:

* Structure/completeness perspective
* Consistency/security perspective

Small edits do not need subagents.

## Verification Standards

Before marking work as done:

* UI work should be visually checked.
* Website work should be checked in browser where possible.
* Mobile UI should be checked at common mobile widths.
* Backend work should have relevant tests/checks.
* Database work should have schema/migration validation.
* Security work should verify that the protection actually works.
* Documentation work should verify that referenced files exist and links are not hollow.

## Browser Verification Rule

When building or editing a website, Claude should use browser preview/inspection if available.

Check:

* page loads
* layout is not broken
* mobile responsiveness
* forms still work
* console errors if available
* key flows still work

If browser verification is not available, Claude must say so and provide manual checks for Daniyal/Affan.

## Documentation Update Rule

After meaningful changes, update relevant docs.

Examples:

* New service/process → update `SERVICES.md`, `CLIENT_WORKFLOW.md`, or templates.
* New technical rule → update `TECH_STACK.md`, `SECURITY.md`, or `PROJECT_WORKFLOW.md`.
* New Claude workflow → update `CLAUDE.md`, `PROMPTS.md`, or `SKILLS.md`.
* New project decision → update `DECISIONS.md`.
* New client/project reference → update `projects/` or `reference/`.

Do not silently change docs without explaining why.

## Agency Automation Decision Filter

For each agency process, decide:

1. Should we manually do it?
2. Should AI augment it?
3. Should we automate it?

Use these rules:

* Taste-heavy work should be augmented, not fully automated.
* Strategy-heavy work should be augmented, not fully automated.
* Repetitive work with stable rules can be automated.
* If AI output is consistently 80% good and easy to review, consider automation.
* Anything involving legal risk, client money, secrets, private data, or security must keep human approval.


## End-of-Session Rule

At the end of each session, report:
- **Files changed**
- **What was added/updated**
- **What still needs work**
- **Suggested next steps**
