# Project Handoff — [Project Name]

Everything [Client Name] needs to operate and maintain the delivered system. **No passwords, secrets, or API keys appear in this document** — access is shared separately through a secure channel (see [SECURITY.md](../SECURITY.md)).

- **Client:** [Client Name]
- **Delivered by:** [Team member]
- **Handoff date:** [Date]

---

## 1. Project Overview
What was built and what it does, in plain language.

## 2. Live Links
- **Production site / app:** [URL]
- **Admin / dashboard:** [URL]
- **Other:** [staging, docs, status page]

## 3. Tech Stack
Built on our standard stack ([TECH_STACK.md](../TECH_STACK.md)) unless noted:
- Frontend:
- Backend:
- Database / ORM:
- Hosting:
- Images / email / other services:

## 4. Admin / Login Instructions (no passwords)
- **How to log in:** go to [admin URL], sign in with the admin account.
- **Admin account owner:** [Name / email — credential shared securely, not here]
- **What admins can do:** [approve/moderate, manage records, view reports...]
- **How to add/remove a user or admin:** [steps]
- Passwords and access are transferred through a secure channel, never in this file.

## 5. Deployment Notes
- **How the site updates:** [e.g. merge to main → auto-redeploy on Vercel/Railway]
- **Where each part is hosted:** [frontend / backend / database]
- **Migrations:** [how database changes are applied, if relevant]

## 6. Environment Variables (names only)
Real values live in the host platform's environment — never in the repo or this doc.
- `DATABASE_URL`
- `JWT_SECRET`
- `CLIENT_ORIGIN`
- `RESEND_API_KEY` (or client's email provider)
- `[other service keys — names only]`
- `VITE_API_URL` (frontend)

## 7. Maintenance Instructions
- Routine checks and upkeep → [maintenance-checklist.md](maintenance-checklist.md)
- How to report an issue: [contact / channel]
- Where backups live and how often they run: [detail]

## 8. Known Limitations
Honest list of what the system does and does not do, and any deferred items.
-
-

## 9. Support Plan
- **Current arrangement:** [warranty period / retainer tier / none]
- **What's covered vs. billed separately:**
- **Response expectations:**
- Options → [SERVICES.md](../SERVICES.md#8-maintenance--support)

## 10. Client Checklist
- [ ] Received access to all accounts (via secure channel)
- [ ] Can log in to the admin/dashboard
- [ ] Walked through the main flows
- [ ] Knows how to report issues and who to contact
- [ ] Understands what's included in support

## 11. Internal Checklist
- [ ] Production build/lint/tests pass
- [ ] Post-deploy smoke test done (desktop + mobile)
- [ ] No secrets in repo or history
- [ ] Env vars set in host environment
- [ ] Client accounts created; agency access removed or scoped down as agreed
- [ ] Decisions logged in [DECISIONS.md](../DECISIONS.md)
- [ ] Handoff walkthrough completed with client
