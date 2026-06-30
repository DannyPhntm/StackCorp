# SECURITY.md — Agency Security & Safety Rules

This file applies to all agency projects, client projects, and internal products.

Claude, Daniyal, and Affan must follow these rules unless Daniyal explicitly approves an exception.

## Highest Priority Rules

- Do not expose secrets.
- Do not commit `.env` files.
- Do not print API keys, JWT secrets, database URLs, tokens, passwords, or private credentials.
- Do not rewrite entire files unless explicitly requested or absolutely necessary.
- Do not delete, overwrite, or restructure important existing code without explaining why.
- Do not merge pull requests automatically unless Daniyal explicitly says to merge.
- Do not push directly to `main` unless explicitly approved.
- Do not make destructive production data changes unless explicitly approved.
- Do not weaken validation, authentication, authorization, or admin protections.
- Do not remove existing working features while fixing another issue.

## File Editing Rules

Claude must preserve existing work.

Before editing:
1. Inspect the relevant files.
2. Understand the current behavior.
3. Identify the smallest safe change.
4. Explain the plan if the task is large or risky.

When editing:
- Prefer targeted edits.
- Preserve existing functions, imports, styles, and logic where possible.
- Do not replace a full file just because it is easier.
- Do not remove code unless it is proven unused, broken, or explicitly requested.
- Do not rename fields/routes/components casually.
- Do not change database schema without explaining migration impact.
- Do not change public API shapes unless necessary and documented.

If a full-file rewrite is needed:
- Ask for confirmation first.
- Explain why partial editing is not safe.
- Confirm what behavior will be preserved.
- Run tests/build after.

## Git / GitHub Rules

- Work on a branch per task.
- Use clear branch names:
  - `feat/...`
  - `fix/...`
  - `chore/...`
  - `docs/...`
- Open a PR to `main`.
- Do not merge without explicit approval.
- Do not auto-merge because tests passed.
- Before merge, report:
  - changed files
  - tests run
  - migration status
  - deployment steps
  - risks/blockers
- If multiple PRs touch the same files, verify merge order first.
- If conflicts exist, resolve carefully and re-run checks.
- Never hide merge conflicts or pretend a PR is clean.

## Production Data Rules

Do not directly edit production data unless explicitly approved.

Forbidden without explicit approval:
- deleting users
- deleting businesses
- deleting shops
- deleting listings
- changing admin roles
- changing verification status
- modifying payment/waiver status
- running destructive cleanup scripts
- editing production database manually

If a script may affect production:
- first run dry-run mode
- report exactly what would change
- wait for approval
- then run with destructive flags only if approved

## Secrets Rules

Never commit or print:

- `.env`
- Railway secrets
- Vercel env vars
- Neon database URLs
- Resend API keys
- Cloudinary URLs
- JWT secrets
- GitHub tokens
- OAuth/client secrets
- email passwords
- client credentials
- private customer data

Allowed:
- `.env.example` with placeholder values only
- documentation listing variable names only

Example safe documentation:

```text
DATABASE_URL=<your database url>
JWT_SECRET=<long random secret>



ls
