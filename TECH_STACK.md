# TECH_STACK.md — Standard Stack

**StackCorp's** default, opinionated technology stack — chosen for speed, reliability, and security, and **proven in production by [Malir Cantt Bazaar](https://malircanttbazaar.com)**.

We default to this stack so we move fast and reuse what we know works. We deviate only when a project genuinely needs something different — never by accident.

---

## Why This Stack

- **Proven in production.** Every layer below runs live in Malir Cantt Bazaar, our flagship case study.
- **Fast to build, fast to ship.** Modern tooling and managed hosting keep us focused on the product.
- **Secure by default.** ORM-based data access, managed Postgres, and secrets kept in the host environment.
- **Affordable to operate.** Managed platforms with sensible free/low tiers for small businesses.

---

## The Standard Stack

| Layer | Choice | Role |
|-------|--------|------|
| Frontend | **React + Vite** | Fast, modern SPA UI |
| Backend | **Node + Express** | API and business logic |
| Database | **Neon Postgres** | Managed relational database |
| ORM | **Prisma** | Type-safe data access + migrations |
| Frontend hosting | **Vercel** | Deploy + CDN for the frontend |
| Backend hosting | **Railway** | Deploy + run the API |
| Images | **Cloudinary** | Image upload, storage, secure URLs |
| Email | **Resend** | Transactional + notification email |
| Domain / DNS | **Porkbun** | Domain registration and DNS |

---

## Layer Details

### Frontend — React + Vite
- Component-based UI, responsive for desktop and mobile (see [DESIGN.md](DESIGN.md)).
- Talks to the backend via a single configured API base URL (`VITE_API_URL`).
- Built and deployed to Vercel.

### Backend — Node + Express
- REST API handling auth, listings, business/shop logic, admin, and uploads.
- Role-based route guards (admin routes require admin; business routes require approved business).
- Input validated before any database write; allow-listed enum values for statuses, categories, roles, and sorting.

### Database — Neon Postgres + Prisma
- Managed Postgres on Neon.
- **Prisma ORM** for all queries — no raw SQL unless absolutely necessary, never user input concatenated into SQL.
- Migrations are reviewed and **additive where possible**; run with `prisma migrate deploy` on production.

### Hosting — Vercel + Railway
- **Vercel:** frontend deploys and CDN.
- **Railway:** backend API hosting and redeploys.
- Deployment discipline and smoke tests live in [PROJECT_WORKFLOW.md](PROJECT_WORKFLOW.md) and the [Malir Cantt Bazaar deployment reference](reference/malir-cantt-bazaar/deployment.md).

### Images — Cloudinary
- Uploads use `multipart/form-data`, **images only**, with size limits.
- A failed upload **blocks** the operation rather than passing silently.
- Store Cloudinary **secure URLs** in the database — never base64 image data.
- Suggested folder convention: `malir/listings`, `malir/business-verification` (adapt per project).

### Email — Resend
- Transactional email: verification, notifications, contact-form delivery.
- Configured via `RESEND_API_KEY`, `MAIL_FROM`, and a contact destination address.

### Domain / DNS — Porkbun
- Domain registration and DNS management (e.g. `malircanttbazaar.com`).

---

## AI Layer

For AI features and custom AI workflows, **default to the latest, most capable models**, integrated through the backend so keys and prompts stay server-side.

- Keep AI provider keys in the host environment — never in the repo or frontend.
- Add guardrails for privacy, input validation, and responsible use.
- Choose the model to fit the task; don't over-spend capability where a smaller model suffices.

See [SERVICES.md](SERVICES.md#7-custom-ai-workflows) for how this maps to client work.

---

## Environment Variables

**Never store real values in this repo.** Secrets live only in the host platform's environment settings.

**Backend (typical)**
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `CLIENT_ORIGIN`
- `RESEND_API_KEY`
- `MAIL_FROM`
- `CONTACT_TO_EMAIL`
- `CLOUDINARY_URL`
- `NODE_ENV=production`

**Frontend (typical)**
- `VITE_API_URL`

> Never commit `.env` files, JWT secrets, database URLs, API keys, or platform credentials. See [SECURITY.md](SECURITY.md).

---

## Security Baseline (Stack-Level)

- Passwords hashed; hashes never returned to the frontend.
- `JWT_SECRET` must exist in production.
- Private data (verification docs, CNIC/NTN, admin notes) is **admin-only** and never exposed on public pages.
- Rate-limit sensitive actions (login, register, verification, password reset, contact, uploads, applications).
- Validate all input; rely on Prisma to avoid SQL injection.

Full rules: [reference/malir-cantt-bazaar/security.md](reference/malir-cantt-bazaar/security.md) and [SECURITY.md](SECURITY.md).

---

## When to Deviate

This stack is the default, not a mandate. Choose differently when a project has a real, specific need — for example:

- A static brochure site may not need a backend or database at all.
- A heavy data/analytics need may justify a different database or service.
- An existing client system may require integrating with their stack instead.

When we deviate, we document **why** in the project file and, if it's a lasting choice, in [DECISIONS.md](DECISIONS.md).

---

## Proven By

**Malir Cantt Bazaar** — a verified local marketplace built on this exact stack: authentication, email verification, listings, image uploads, business verification, shops directory, admin moderation, listing limits, featured slots, security hardening, and production deployment. See [`reference/malir-cantt-bazaar/`](reference/malir-cantt-bazaar/).
