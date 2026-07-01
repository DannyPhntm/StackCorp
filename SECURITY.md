# SECURITY.md — Security Baseline

Non-negotiable security rules for every project, client, and contributor. Security is **baseline, not an upsell** — it applies to all work, internal and client-facing.

This is the agency-wide policy. The proven, project-level reference lives in [reference/malir-cantt-bazaar/security.md](reference/malir-cantt-bazaar/security.md). Engineering enforcement lives in [PROJECT_WORKFLOW.md](PROJECT_WORKFLOW.md).

---

## The Absolute Rules

These are never broken. No exceptions, no "just this once."

1. **Never commit `.env` files.**
2. **Never commit secrets** — API keys, tokens, JWT secrets, database URLs, platform credentials.
3. **Never put client passwords or API keys in docs, markdown, code, or commit messages.**
4. **Never expose secrets to the frontend.**
5. **Never return password hashes to the client.**
6. **Never expose private/admin-only data on public pages.**
7. **Never use real production data for testing, and never edit the production database casually.**

If any of these has already happened, treat it as an incident — see [If a Secret Leaks](#if-a-secret-leaks).

---

## Secrets & API Keys

### Where secrets live
- **Only** in the host platform's environment settings (Vercel, Railway, etc.).
- Never in the repo, never in markdown, never in client-facing documents.

### Never include in this repo
- `.env` files
- Railway secrets
- Vercel environment variables
- Neon database URLs
- Resend API keys
- Cloudinary URLs
- JWT secrets
- Client passwords
- Production credentials
- Private customer data

### Repo hygiene
- `.env` and `.env.*` must be in `.gitignore` on every code project.
- Provide a committed `.env.example` with **key names only** and no values.
- Scan diffs for accidental secrets before every PR.

### Sharing secrets with the team or client
- Use a secure channel (a password manager or the platform's own access controls).
- Never share secrets over plain email, chat, or in a doc in this repo.
- Track which accounts exist — but not their secrets — in [docs/tool-accounts.md](docs/tool-accounts.md).

### Safe documentation rule
Only document **what** tools are used and **who** manages access — never the secret values.

> Example: "Vercel: frontend hosting · Railway: backend hosting · Neon: database · Resend: email · Cloudinary: image storage." No values, ever.

---

## Authentication & Authorization

- **Hash all passwords.** Never store or transmit plaintext. Never return hashes to the frontend.
- **`JWT_SECRET` must exist in production** and be strong and unique per environment.
- **Guard routes by role:**
  - Admin routes require the admin role.
  - Business routes require an approved business account.
- **Ownership checks:** users may edit/delete only their own data unless they are admin.
- **Admin-only actions:** only admins approve businesses/listings or view private documents.

---

## Data Privacy

Some data is private and must **never** appear on public pages or in API responses to non-admins:

- Business verification documents
- CNIC / NTN or equivalent identity documents
- Admin notes and internal approval data
- Private rejection reasons

**Rule:** private data is admin-only by default. Public endpoints return only public fields.

---

## Input Validation & Database Safety

- **Validate all input** before any database write.
- **Use allow-listed enum values** for statuses, categories, roles, listing types, and sorting.
- **Use the ORM (Prisma).** Avoid raw SQL; never concatenate user input into SQL.
- Reject malformed, oversized, or unexpected input early.

---

## Upload Security

For all file uploads (listings, verification documents, etc.):

- Use `multipart/form-data`.
- **Accept images only**; reject non-image and empty files.
- Enforce **size limits**.
- Upload to the storage provider (Cloudinary) and **validate the response**.
- Store **secure URLs** in the database — never base64 image data.
- A failed upload must **block** the operation, not pass silently.

---

## Rate Limiting

Rate-limit all sensitive actions to resist abuse and brute force:

- Login, register, logout
- Email verification and resend
- Password reset
- Contact form
- Listing creation
- Image uploads
- Business application

---

## Deployment Readiness Checklist

A build is **not** ready for production until every box is checked.

- [ ] No secrets, `.env` files, or credentials in the repo or history
- [ ] `.env.example` present with key names only
- [ ] All required production env vars set in the host platform
- [ ] `JWT_SECRET` set and strong in production
- [ ] Passwords hashed; hashes never returned to frontend
- [ ] Admin and business routes guarded by role
- [ ] Ownership checks enforced on edit/delete
- [ ] Private data (verification docs, CNIC/NTN, admin notes) confirmed admin-only
- [ ] All input validated; allow-listed enums used
- [ ] No raw SQL / no user input concatenated into SQL
- [ ] Uploads: images only, size-limited, validated, secure URLs stored
- [ ] Rate limiting on sensitive actions
- [ ] Build, lint, and tests pass
- [ ] Migrations reviewed and additive where possible
- [ ] Post-deploy smoke test passed (auth, core flows, admin, mobile)

The full deploy procedure and smoke test: [reference/malir-cantt-bazaar/deployment.md](reference/malir-cantt-bazaar/deployment.md).

---

## Production Safety Rules

- No fake production data.
- No direct production database edits without explicit approval.
- Never casually delete real user, business, or shop data.
- Migrations additive where possible; run `prisma validate` then `prisma migrate deploy`.
- Always run build/lint/tests before deploying.
- Confirm the app still works after every deploy.

---

## Beta / Launch Gate

Do not send a beta or launch link until:

- Critical security fixes are deployed
- Core flows (auth, uploads, limits, approvals, verification, admin moderation) work live
- Private data is confirmed protected
- Mobile layout is acceptable

---

## If a Secret Leaks

Treat any committed secret as compromised. Immediately:

1. **Rotate** the secret at its source (regenerate the key/token, change the password).
2. **Update** the new value in the host environment only.
3. **Remove** the secret from the repo and, if needed, from git history.
4. **Verify** the old secret no longer works.
5. **Record** the incident and follow-ups in [DECISIONS.md](DECISIONS.md).

Rotating beats merely deleting — assume anything pushed was captured.

---

## Responsibilities

- **Every contributor** owns these rules on every change.
- Security checks are part of the [PR checklist](PROJECT_WORKFLOW.md#pull-requests), not a separate phase.
- When in doubt, choose the more conservative, more private option.
