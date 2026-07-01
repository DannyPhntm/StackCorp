# CLAUDE.md — Agency Operating System

This repo is the operating system for **StackCorp** ([stackcorp.org](https://stackcorp.org)) — our AI services, web development, AI consultancy, audits, automation, and custom systems agency.

StackCorp is the agency brand. Malir Cantt Bazaar is StackCorp's first live product and case study. Production secrets and client credentials must never be stored in this repo.

## Important Context

This is not the main Malir Cantt Bazaar app repo.

Malir Cantt Bazaar is referenced here as our first live product and case study. Reference files are stored in:

`reference/malir-cantt-bazaar/`

Do not assume the full marketplace codebase exists in this repo unless it has been explicitly copied here.

## Default Work Protocol

Before starting any meaningful task, Claude must do the following:

1. Read the relevant project files.
2. Check `SECURITY.md`.
3. Check `SKILLS.md` and decide whether any skill applies.
4. State the intended approach.
5. State how the work will be verified before making changes.
6. Ask clarifying questions if the task is ambiguous or if assumptions could affect the outcome.

Claude must not assume important product, business, design, pricing, security, or workflow details without asking.

## Spec Before Build Rule

For any significant build task, Claude must create or confirm a proper spec before implementation.

A proper spec should include:

* goal
* users affected
* required behavior
* non-goals
* UI requirements if applicable
* backend/data requirements if applicable
* security/privacy requirements
* edge cases
* verification plan
* files likely affected
* rollout/deployment notes

If the task is unclear, Claude should ask questions before building.

## Verification Before Done Rule

Before saying a task is complete, Claude must run the relevant verification.

Examples:

* For websites/UI: open or preview the page in a browser when available.
* For frontend changes: run lint/build and inspect affected screens.
* For backend changes: run tests/checks and verify API behavior.
* For database changes: run schema validation and migration checks.
* For docs changes: check links, headings, consistency, and whether referenced files exist.
* For security changes: verify the protection actually applies and report what was tested.

Claude must report:

* verification plan stated before work
* verification actually performed after work
* commands/checks run
* browser/manual checks performed if applicable
* what passed
* what failed or could not be verified

Do not claim something is done unless verification supports it.

## Subagent Rule

For larger tasks, Claude should use subagents or separate perspectives to improve quality.

Claude should decide the number of subagents based on task complexity.

Suggested guide:

* 0 subagents: tiny copy edits, simple one-file fixes, small documentation updates
* 2 subagents: medium tasks needing review from two angles
* 3 subagents: product/design/backend/security work
* 4–5 subagents: major build, audit, launch, or client strategy work

Example perspectives:

* Product/spec reviewer
* UI/UX reviewer
* Backend/security reviewer
* QA/testing reviewer
* Client/business reviewer
* Documentation reviewer

Claude should not use subagents for every small task. Use them when they reduce risk or improve judgment.

## Skills Rule

Before starting a task, Claude must check `SKILLS.md`.

Claude should decide:

1. Does any skill apply?
2. Which single skill is most useful?
3. Would using the skill create risk of over-editing?
4. Is this task better handled without a skill?

Use skills only when helpful. Do not fire many skills at once.

If a task is repetitive and likely to happen often, Claude should suggest creating or updating a reusable skill/process and then update `SKILLS.md` only after approval.

## Gotchas Rule

Claude should maintain awareness of repeated mistakes and avoid them.

Common gotchas:

* Do not rewrite entire files unless approved.
* Do not merge automatically.
* Do not push directly to main unless approved.
* Do not touch production data without explicit approval.
* Do not leave blank files linked from other docs.
* Do not claim a PR is merged if later commits were pushed after merge.
* Do not show generic “Validation failed” if a specific error exists.
* Do not assume a frontend approval state is the backend source of truth.
* Do not expose business verification documents publicly.
* Do not add features that conflict with beta simplicity.
* Do not overuse skills or subagents for tiny tasks.

## Agency Automation Filter

For agency/client work, use this decision filter:

* If a process requires taste, judgment, or strategic thinking, augment it with AI but keep human review.
* If a process produces 80% good output repeatedly and follows clear rules, automate it.
* If a process is high-risk, client-facing, legal, security-related, or involves money/data/privacy, keep human approval in the loop.
* If automation could cause reputational damage, require manual review.

Use loops where useful:

* draft → review → improve
* build → verify → fix
* audit → prioritize → implement
* client input → proposal → review → send


## Agency Goals

We help businesses modernize through:
- websites
- AI audits
- AI consultancy
- automations
- internal dashboards
- lead capture systems
- custom AI workflows
- maintenance and support

## Working Rules

- Do not expose secrets.
- Do not commit `.env` files.
- Do not put client passwords or API keys in docs.
- Do not overbuild.
- Keep docs clear and practical.
- Use markdown files as the source of truth.
- When asked to update project knowledge, update the relevant `.md` files.
- For code projects, use branches and pull requests.
- Do not merge automatically unless explicitly told.

## Malir Cantt Bazaar Reference

Use Malir Cantt Bazaar as the agency's first case study.

Key idea:
We built and launched a verified local marketplace for Malir Cantt residents and businesses, including authentication, listings, admin moderation, image uploads, business verification, email systems, security checks, and deployment.

## End-of-Session Rule

At the end of each session, report:
- files changed
- what was added/updated
- what still needs work
- suggested next steps
