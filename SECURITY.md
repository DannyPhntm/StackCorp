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
DIRECT_URL=<your direct database url>
JWT_SECRET=<long random secret>
CLIENT_ORIGIN=<frontend origin url>
RESEND_API_KEY=<resend api key>
MAIL_FROM=<from email address>
CONTACT_TO_EMAIL=<support inbox address>
CLOUDINARY_URL=<cloudinary url>
VITE_API_URL=<backend api base url>
```

Secrets live only in the host platform's environment (Railway, Vercel, Neon). If a secret is ever committed or printed, treat it as an incident: rotate the credential immediately and scrub it from history.

## Database Rules

- Use the ORM (Prisma) for all queries.
- Do not use raw SQL unless absolutely necessary and justified.
- Never concatenate user input into SQL.
- Validate all input before any database write.
- Use allow-listed enum values for statuses, categories, roles, listing types, and sorting.
- Do not change the schema without explaining migration impact.
- Migrations must be reviewed and additive where possible.
- Run `prisma validate` before applying migrations; run `prisma migrate deploy` on production.
- Never run destructive migrations or cleanup scripts on production data without explicit approval.

## Authentication & Authorization Rules

- Passwords must be hashed. Never store or transmit plaintext passwords.
- Password hashes must never be returned to the frontend.
- `JWT_SECRET` must exist in production; never hardcode it.
- Admin routes must require an admin role.
- Business routes must require an approved business account.
- Users may edit or delete only their own data unless they are admin.
- Only admins may approve/reject businesses and listings, or change verification status.
- Do not weaken, bypass, or remove auth, authorization, or admin guards.
- Backend enforcement is the source of truth; a frontend change must never be able to bypass an approval or a role check.

## Upload & Document Privacy Rules

Uploads (listing images, verification documents):

- Use `multipart/form-data`.
- Accept images only; reject empty files and non-image files.
- Enforce maximum file size limits.
- Upload to Cloudinary and validate the Cloudinary response.
- Store the Cloudinary secure URL in the database — never base64 image data.
- A failed upload must block the operation and surface a clear error, not pass silently.

Private / admin-only data — never exposed on public pages:

- verification document URLs
- CNIC document URLs
- NTN / business registration numbers considered private
- admin notes and private rejection reasons
- raw internal approval data

## Frontend Safety Rules

- Never expose secrets, API keys, or private credentials in frontend code or bundles.
- Keep AI provider keys and prompts server-side; the frontend calls the backend, not the AI provider directly.
- Never render private/admin-only data in public views or in client-side responses to non-admin users.
- Do not trust the client: every validation and permission check must also exist on the backend.
- The frontend talks to the backend through a single configured base URL (`VITE_API_URL`), not hardcoded hosts.

## Error Handling Rules

- Handle errors explicitly; failures must be visible, not silent.
- A blocking failure (e.g. a failed image upload) must stop the operation and report a clear, specific error.
- Do not leak stack traces, secrets, database URLs, or internal details in error messages returned to users.
- Log enough to debug server-side without exposing sensitive data client-side.
- Never swallow an exception to make a flow "pass."

## Claude Session Rules

- Inspect relevant files and understand current behavior before editing.
- Make the smallest safe change; prefer targeted edits over full-file rewrites.
- Explain the plan first when a task is large or risky, and ask before any full-file rewrite.
- Do not invent secrets, env values, or fake data.
- Do not merge PRs or push to `main` unless Daniyal explicitly approves.
- At the end of each session, report: files changed, what was added/updated, tests/checks run, what still needs work, and suggested next steps.
- If a change touches auth, production data, schema, or secrets, flag it explicitly before proceeding.

## Client Project Rules

- Apply this entire security baseline to every client project, not just internal work.
- Never store client secrets, passwords, API keys, or private customer data in any repo or doc.
- Share access and credentials with clients only through secure channels — never in this repo, never in markdown.
- Document variable names only; real values live in the client's host environment.
- Get explicit approval before any production deploy, destructive change, or data migration on a client system.
- Respect the existing client codebase: match its conventions, preserve working features, and do not restructure without a documented reason.

## Malir Cantt Bazaar Special Rules

Malir Cantt Bazaar is a real, live product that may be shared with family, friends, and local businesses. Treat every change with extra care.

- Do not redesign unless explicitly asked.
- Do not weaken validation or remove backend enforcement.
- Do not remove listing limits (personal: 2 active/pending; business: 6 active/pending; 3 featured slots; 14-day featured duration; pending counts toward limits).
- Business verification documents (and CNIC/NTN if uploaded) are admin-only and must never appear publicly.
- Admin approval must not be bypassable by frontend changes.
- Use Prisma ORM only; no raw SQL unless justified and safe.
- No fake production data; no direct production database edits without approval.
- Do not send or widen the beta link until: critical security fixes are deployed, image uploads work live, listing limits work, business verification works, admin moderation works, terms/privacy pages exist, and mobile layout is acceptable.

Full project reference: [reference/malir-cantt-bazaar/security.md](reference/malir-cantt-bazaar/security.md).
