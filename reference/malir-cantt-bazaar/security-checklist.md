# Malir Cantt Bazaar — Full Security Checklist & Test Plan

A comprehensive list of security checks and tests to run before and during the beta, mapped to the real stack: **React/Vite → Node/Express → Neon Postgres (Prisma) → JWT auth → Cloudinary uploads → Resend email → Vercel + Railway**.

Each item lists **what to check**, **how to test**, and **why it matters**. Work top-to-bottom; the sections marked 🔴 are beta-blocking.

Legend: 🔴 critical / beta-blocker · 🟠 high · 🟡 medium · 🟢 hardening

---

## 1. Authentication 🔴

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 1.1 | **Passwords are hashed with bcrypt/argon2** (never plaintext, never fast hashes like MD5/SHA1) | Inspect a user row in the DB; confirm the stored value is a bcrypt/argon2 hash. Register and check the DB write. | Plaintext or weak hashes mean a single DB leak exposes every user's password — and people reuse passwords. |
| 1.2 | **Password hash never leaves the backend** | Call `/me`, login response, admin user endpoints; inspect JSON for a `password`/`passwordHash` field. Grep API responses in the network tab. | Even a hash in an API response lets an attacker crack offline and is a serious leak. |
| 1.3 | **JWT_SECRET exists, is long/random, and is not hardcoded** | Confirm the app refuses to boot in production without `JWT_SECRET`. Grep the repo for any fallback/default secret. | A guessable or committed secret lets anyone forge admin tokens and take over the platform. |
| 1.4 | **JWTs are signed and verified on every protected request** | Tamper with a token payload (flip `role` to `admin`), resend, expect 401. Change one signature char, expect 401. | If the server trusts an unverified/tampered token, any user can escalate to admin. |
| 1.5 | **Token expiry is enforced** and reasonably short | Use an expired token, expect 401. Confirm `exp` claim is set. | Non-expiring tokens can't be revoked and stay valid forever if stolen. |
| 1.6 | **`alg: none` and algorithm-confusion are rejected** | Send a token with `"alg":"none"` and with HS256 signed by the public key; expect rejection. | Classic JWT bypass that forges valid-looking tokens without the secret. |
| 1.7 | **Login is not vulnerable to user enumeration** | Login with a real email + wrong password vs. a nonexistent email. Responses and timing should be identical ("invalid email or password"). | Distinct messages/timings let attackers harvest which emails are registered. |
| 1.8 | **Password policy enforced server-side** (min length, not trivially weak) | Try registering with `123`, empty, 1-char passwords via API directly. | Weak passwords make brute-force/credential-stuffing trivial. |
| 1.9 | **Login/register brute-force protection** (rate limit + lockout/backoff) | Fire 50 rapid login attempts for one account from a script; expect throttling. | Without it, attackers brute-force passwords or spray common ones. |
| 1.10 | **Logout invalidates the session client-side; token isn't left in a readable place** | Log out, confirm token cleared; check where token is stored (see 1.11). | Lingering tokens allow session reuse after "logout." |
| 1.11 | **Token storage: prefer httpOnly cookie over localStorage** | Inspect where the JWT lives in the browser. | localStorage is readable by any XSS payload; httpOnly cookies are not. If using cookies, see CSRF (§4). |
| 1.12 | **No hardcoded/backdoor admin accounts or test creds** | Grep for seeded admin emails/passwords, `admin@`, `test123`, etc. | Backdoor accounts are the fastest route to full compromise. |

---

## 2. Email Verification & Password Reset 🔴

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 2.1 | **Verification tokens are cryptographically random and single-use** | Verify once, replay the same link, expect failure. Inspect token entropy. | Guessable/reusable tokens let attackers verify accounts they don't own. |
| 2.2 | **Verification/reset tokens expire** | Wait past expiry (or edit DB timestamp), use link, expect failure. | Old links found in inboxes/logs shouldn't stay valid indefinitely. |
| 2.3 | **Password-reset token is single-use and invalidates on password change** | Use a reset link twice; second must fail. Old sessions ideally invalidated. | Reused reset tokens allow re-hijacking an account. |
| 2.4 | **Reset does not reveal whether an email exists** | Request reset for unknown email — respond "if an account exists, we sent a link." | Prevents enumeration via the reset flow. |
| 2.5 | **Resend-verification and reset are rate-limited per email/IP** | Hammer the resend/reset endpoints; expect throttling. | Prevents email-bombing a victim and abusing your Resend quota/reputation. |
| 2.6 | **Unverified accounts cannot perform privileged actions** (post listings, apply as business) | Register, skip verification, try to create a listing via API. | If verification is cosmetic, spam/fake accounts flood the marketplace. |
| 2.7 | **Verification links can't be tampered to verify a different user** | Swap the user id/email param in the link, expect failure. | IDOR on verification = account takeover. |
| 2.8 | **No open redirect in email links** (e.g., `?redirect=` params) | Set redirect to `evil.com`, confirm it's blocked/allow-listed. | Open redirects power phishing that looks like it came from your domain. |

---

## 3. Authorization & Access Control 🔴

This is the highest-risk area for a marketplace. Test every one of these by calling the **API directly** (Postman/curl), not just through the UI — the UI hiding a button is not a control.

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 3.1 | **Admin routes require admin role — enforced on the backend** | Log in as a normal user, call every `/admin/*` endpoint directly with that token. Expect 403. | Frontend can be bypassed trivially; the API is the real boundary. |
| 3.2 | **Business routes require an *approved* business account** | As a personal user (and as a *pending* business), call business-listing/shop endpoints. Expect 403. | Otherwise unverified sellers post business listings and bypass verification. |
| 3.3 | **Users can only edit/delete their own listings** (IDOR) | As user A, PATCH/DELETE user B's listing by id. Expect 403/404. | IDOR lets anyone vandalize or hijack others' listings. |
| 3.4 | **Users can only edit their own profile / shop** | Attempt to update another user's profile or another business's shop by id. | Same IDOR class — protects seller reputation and data. |
| 3.5 | **Approval state is backend-authoritative** | Flip a frontend flag (React state / localStorage) to "approved" and retry a business action. Must still be blocked. | Gotcha called out in CLAUDE.md: frontend approval must never be the source of truth. |
| 3.6 | **Users cannot self-approve their own business or listing** | As the applicant, call the approve endpoint targeting your own record. | Self-approval defeats moderation entirely. |
| 3.7 | **Role cannot be set/escalated via mass-assignment** | On register/profile-update, POST extra fields `{"role":"admin","isApproved":true}`. Confirm they're ignored. | Prisma `create`/`update` with spread of `req.body` is a classic privilege-escalation hole. |
| 3.8 | **Listing status can't be forced by the client** | Create a listing with `status:"approved"` or `featured:true` in the body. Must be forced server-side to `pending`. | Bypasses moderation and steals paid/limited featured slots. |
| 3.9 | **Object ownership checked on every mutation, not just on read** | For each write endpoint, attempt cross-user access. | Auth is often added to GET but forgotten on PATCH/DELETE. |
| 3.10 | **Enumerable integer IDs vs. hard-to-guess IDs** | Note whether listing/user IDs are sequential; if so, ensure authz compensates. | Sequential IDs make IDOR and scraping trivial; authz must be airtight. |
| 3.11 | **Admin-only fields are stripped from public/user responses** | As a normal user, fetch a listing/business and look for admin notes, rejection reasons, internal flags. | Prevents leaking moderation internals. |

---

## 4. Session, CSRF & CORS 🟠

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 4.1 | **CORS allow-list is restricted to `CLIENT_ORIGIN`** (no `*` with credentials) | Send a request with `Origin: https://evil.com`; confirm it's not reflected/allowed. Check `Access-Control-Allow-Origin`. | Wildcard CORS + credentials lets any site call your API as the logged-in user. |
| 4.2 | **CSRF protection if using cookie-based auth** | If cookies: attempt a cross-site POST without a CSRF token / with wrong SameSite. | Cookie auth without CSRF defense allows forged state-changing requests. |
| 4.3 | **Cookies (if used) are `httpOnly`, `Secure`, `SameSite=Lax/Strict`** | Inspect Set-Cookie headers. | Prevents XSS theft, MITM, and cross-site sending of the session cookie. |
| 4.4 | **Preflight (OPTIONS) doesn't leak that credentials are allowed to arbitrary origins** | Send OPTIONS with foreign origin. | Same class as 4.1. |
| 4.5 | **No sensitive tokens in URLs** (they land in logs, referrers, history) | Check that JWTs/reset tokens aren't passed as query strings on normal navigation. | URL tokens leak via server logs, browser history, and `Referer`. |

---

## 5. Input Validation & Injection 🟠

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 5.1 | **All queries go through Prisma; no raw SQL with string concatenation** | Grep for `$queryRawUnsafe`, `$executeRawUnsafe`, template-literal SQL with user input. | Concatenated SQL = SQL injection. Prisma parameterizes by default; the unsafe variants don't. |
| 5.2 | **SQL injection probes on all inputs** | Submit `' OR 1=1--`, `"; DROP TABLE`, etc. in search, filters, login, listing fields. Expect no anomalous behavior. | Confirms the ORM boundary holds even on edge inputs. |
| 5.3 | **Prisma filter/orderBy injection via query params** | Pass unexpected `sort`, `orderBy`, `where`-shaped params; confirm only allow-listed values accepted. | Passing raw client objects into Prisma `where`/`orderBy` can leak or reorder data. |
| 5.4 | **Enum allow-listing** for category, status, role, listingType, sort | Send `category=<script>`, `status=approved`, invalid enums; expect rejection. | Prevents invalid states, moderation bypass, and injection via "free text" enums. |
| 5.5 | **Server-side validation of every field** (length, type, format, required) | Send oversized strings (1MB title), wrong types, missing required fields directly to the API. | Client validation is bypassable; unvalidated input causes crashes, storage abuse, and injection. |
| 5.6 | **Numeric/price fields validated** (no negatives, no NaN, sane max) | Set price to `-1`, `1e309`, `"abc"`. | Prevents display bugs, sorting exploits, and logic abuse. |
| 5.7 | **NoSQL/object-injection & prototype pollution** | POST `{"__proto__":{"admin":true}}` and nested objects to endpoints. | Prototype pollution can silently flip auth flags in JS. |
| 5.8 | **Mass-assignment guard** (explicit field selection, not `...req.body`) | Covered in 3.7/3.8 — verify writes pick fields explicitly. | Prevents privilege/status escalation through extra JSON fields. |
| 5.9 | **Phone/WhatsApp/email format validation** | Submit malformed numbers, script in phone field. | These are shown to buyers and used in `tel:`/`wa.me` links — bad data enables scams/XSS. |

---

## 6. XSS & Output Encoding 🟠

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 6.1 | **Stored XSS in listing title/description/shop bio** | Create a listing with `<img src=x onerror=alert(1)>` and `<script>`; view it as another user. | User-generated content is the #1 XSS vector; a stored payload can steal every viewer's session. |
| 6.2 | **No `dangerouslySetInnerHTML` on user content** | Grep the frontend for `dangerouslySetInnerHTML`; audit each use. | React auto-escapes JSX, but this API bypasses that protection. |
| 6.3 | **Reflected XSS in search / query params** | Put a payload in the search box / URL and see if it renders unescaped. | Reflected XSS phishes users via crafted links. |
| 6.4 | **`javascript:` / `data:` URIs blocked in link fields** (website, WhatsApp) | Set a shop website to `javascript:alert(1)`; confirm sanitized. | Malicious hrefs execute script on click. |
| 6.5 | **Content-Security-Policy header set** (restrict script/img/connect sources) | Check response headers for a strong CSP. | CSP is defense-in-depth that neuters many XSS payloads. |
| 6.6 | **User content in emails is escaped** (contact form, notifications) | Submit HTML/script via contact form; inspect the received email. | Email-client XSS / header injection can hit the admin inbox. |
| 6.7 | **Filename/alt-text from uploads is sanitized before render** | Upload a file named `<script>.jpg`. | Filenames are user input too. |

---

## 7. File Upload Security 🔴

Covers listing images **and** business verification/CNIC documents.

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 7.1 | **Only images accepted — validated by content, not just extension/MIME** | Upload `shell.php` renamed to `.jpg`; upload a real PHP/HTML file; upload SVG with embedded script. Expect rejection. | Client-supplied MIME/extension is forgeable; content sniffing prevents malicious files. |
| 7.2 | **Max file size enforced server-side** | Upload a 50MB file and a 0-byte file. Both should be rejected cleanly. | Prevents storage exhaustion (DoS) and empty/broken records. |
| 7.3 | **Empty files rejected** | Upload a 0-byte "image." | Reference security.md explicitly requires this; avoids broken listings. |
| 7.4 | **Failed upload blocks the operation with a clear error** | Simulate a Cloudinary failure (bad key / network); confirm listing isn't created and error is specific. | CLAUDE.md gotcha: silent upload failure = broken listings and confused users. |
| 7.5 | **No base64 image data stored in the DB — only Cloudinary secure URLs** | Inspect a listing row; confirm URL, not blob. | Bloats DB, breaks the intended pipeline, and can bypass validation. |
| 7.6 | **Cloudinary response validated before saving** | Confirm code checks the returned `secure_url`/status before DB write. | Prevents saving garbage/placeholder URLs. |
| 7.7 | **SVG uploads are blocked or sanitized** | Upload an SVG containing `<script>`. | SVGs are XSS vectors when served inline. |
| 7.8 | **Image-bomb / decompression bomb handling** | Upload a small file that expands hugely (pixel-flood PNG). | Can crash image processing / exhaust memory. |
| 7.9 | **Upload rate-limited per user** | Script many uploads rapidly. | Prevents storage/quota abuse and cost blowup on Cloudinary. |
| 7.10 | **EXIF/metadata stripped (esp. GPS) from listing images** | Upload a photo with GPS EXIF; check the served image. | Protects sellers from leaking home/shop location. |
| 7.11 | **Cloudinary folders/permissions correct** (`malir/listings` public-ish; `malir/business-verification` NOT publicly enumerable) | Try to guess/enumerate verification doc URLs; confirm access control (see §8). | Verification docs must never be publicly reachable. |

---

## 8. Business Verification & Document Privacy 🔴

The most sensitive data on the platform: CNIC, NTN, address proofs.

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 8.1 | **Verification/CNIC/NTN documents are admin-only** | As a normal user and as the applicant, try to fetch the verification doc URL/endpoint directly. Expect denial. | Legal-grade PII; a leak is a serious privacy and reputational incident. |
| 8.2 | **Verification doc URLs are not guessable / not publicly listed** | Attempt to enumerate Cloudinary URLs or API responses containing doc links. | Public marketplace pages must never expose these (per security.md). |
| 8.3 | **Signed/expiring URLs (or access-controlled delivery) for verification docs** | Copy an admin-viewed doc URL and open it logged-out/incognito. | If the raw Cloudinary URL is permanent and public, sharing = leak. |
| 8.4 | **Admin notes, rejection reasons, internal approval data never in public/user responses** | Inspect all listing/business responses as a non-admin. | Prevents leaking moderation internals and defamation risk. |
| 8.5 | **CNIC/NTN not logged in plaintext logs** | Grep server logs / log statements for these fields. | Logs are a common accidental PII leak path. |
| 8.6 | **Deleting a business/application removes or de-links its documents** | Delete a test application; confirm doc handling. | Orphaned PII lingering in Cloudinary is a compliance risk. |

---

## 9. Business Logic & Abuse Prevention 🟠

Marketplace-specific rules that attackers will probe.

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 9.1 | **Listing limits enforced server-side** (personal: 2; business: 6 active/pending; pending counts) | Create up to and beyond the limit via API; race two creates concurrently. | CLAUDE.md forbids weakening limits; races can exceed them (see 9.2). |
| 9.2 | **Limit checks are race-safe** (transaction / unique constraint) | Fire N concurrent create requests when at limit-1. | Check-then-insert without a transaction lets users exceed limits by racing. |
| 9.3 | **Featured slots enforced** (3 per business, 14-day duration, can't self-feature) | Try to set `featured` directly; exceed 3 slots; extend duration via API. | Featured slots are a scarce/paid resource; bypass = revenue and fairness loss. |
| 9.4 | **Status transitions are valid** (can't jump pending→approved yourself; can't un-sell arbitrarily) | Attempt illegal transitions via API. | Prevents moderation bypass and inconsistent data. |
| 9.5 | **Business waiver/settlement status can't be self-modified** | As applicant, try to set waived/settled. | Financial/beta-approval integrity. |
| 9.6 | **Spam/flood protection on listing creation** | Script rapid listing creation. | Keeps the marketplace usable and protects DB/costs. |
| 9.7 | **Contact form abuse protection** (rate limit, no arbitrary recipient) | Try to set the `to` address; flood the form. | Prevents your domain being used as an open relay / spam cannon → Resend blacklisting. |
| 9.8 | **A personal user can hold a business account without cross-privilege leaks** | Verify one account acting as both doesn't gain admin or cross-user access. | The dual-role model is core; test its edges. |

---

## 10. Rate Limiting, DoS & Cost Abuse 🟠

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 10.1 | **Rate limiting on all sensitive endpoints** (login, register, verify, resend, reset, contact, listing create, uploads, business apply) | Script bursts against each; expect 429/backoff. | Explicitly required by security.md; prevents brute-force, spam, and cost blowup. |
| 10.2 | **Rate limiting keyed correctly** (per IP *and* per account; behind Railway's proxy uses real client IP) | Confirm `X-Forwarded-For`/trust-proxy is set so limits aren't bypassed or globally shared. | Misconfigured proxy trust makes rate limits useless or self-DoS. |
| 10.3 | **Pagination / max page size on list endpoints** | Request `?limit=1000000`; expect a capped result. | Unbounded queries exhaust DB/memory and enable scraping. |
| 10.4 | **Request body size limit** (Express `json`/`urlencoded` limit) | POST a 100MB JSON body. | Prevents memory-exhaustion DoS. |
| 10.5 | **Cloudinary/Resend usage caps & alerts** | Confirm quotas/billing alerts exist. | An abuse spike shouldn't produce a surprise bill or outage. |
| 10.6 | **Expensive search/filter queries are indexed & bounded** | Run heavy search/sort combos. | Prevents slow-query DoS on Neon. |

---

## 11. API & Data Exposure 🟠

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 11.1 | **No sensitive fields in API responses** (password hash, email of other users, phone unless intended, tokens, internal flags) | Audit each endpoint's JSON as different roles. | Over-fetching with Prisma `include`/default-select leaks PII. |
| 11.2 | **User PII minimized in public listing views** | View a public listing logged-out; confirm only intended contact info shows. | Sellers' emails/personal data shouldn't be scrapeable. |
| 11.3 | **No debug/verbose errors in production** (stack traces, Prisma error details, SQL) | Trigger a 500 in prod; inspect the response body. | Stack traces reveal structure, versions, and sometimes secrets. |
| 11.4 | **No source maps / secrets in the frontend bundle** | Inspect the Vercel-built JS bundle for API keys, admin URLs, comments, `.map` files. | Frontend bundles are fully public; anything shipped is exposed. |
| 11.5 | **`VITE_*` env vars contain no secrets** | List every `VITE_` var; confirm only public config (API base URL). | All `VITE_` vars are embedded in the client bundle. |
| 11.6 | **No admin/internal endpoints discoverable & unguarded** | Probe `/admin`, `/debug`, `/metrics`, `/.env`, `/api/docs`. | Forgotten debug routes are common breach entry points. |
| 11.7 | **GraphQL/introspection off if applicable** (N/A if REST-only) | — | Only relevant if a GraphQL layer exists. |

---

## 12. Secrets & Configuration 🔴

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 12.1 | **No secrets committed to git history** | Run `git log -p`/gitleaks/trufflehog across history for `JWT_SECRET`, `DATABASE_URL`, `CLOUDINARY_URL`, `RESEND_API_KEY`. | A secret in *any* past commit is compromised even if later removed. |
| 12.2 | **`.env` is gitignored and not tracked** | `git ls-files | grep env`; confirm only `.env.example` with placeholders. | Prevents the most common catastrophic leak. |
| 12.3 | **Secrets live only in Railway/Vercel/Neon env settings** | Confirm no real values in repo/docs. | Matches SECURITY.md; central rotation and least exposure. |
| 12.4 | **`NODE_ENV=production` in prod** | Check Railway env. | Disables dev error verbosity and enables framework hardening. |
| 12.5 | **Rotation plan if any secret ever leaked** | Confirm you can rotate JWT_SECRET, DB creds, Cloudinary, Resend keys. | Incident readiness; JWT_SECRET rotation invalidates forged tokens. |
| 12.6 | **Cloudinary API secret not exposed** (unsigned uploads restricted) | If using unsigned presets, confirm they're locked down. | Leaked Cloudinary creds allow arbitrary uploads/deletes on your account. |
| 12.7 | **Separate secrets for any staging vs. production** | — | Prevents a staging leak from compromising prod. |

---

## 13. Transport & Network Security 🟠

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 13.1 | **HTTPS enforced everywhere; HTTP redirects to HTTPS** | Hit `http://` and the Railway API over http. | Plaintext transport exposes tokens/passwords to MITM. |
| 13.2 | **HSTS header set** | Check response headers. | Forces browsers to use HTTPS, preventing downgrade attacks. |
| 13.3 | **Security headers present** (`X-Content-Type-Options: nosniff`, `X-Frame-Options`/frame-ancestors, `Referrer-Policy`, CSP) | Scan with securityheaders.com or curl -I. | Cheap defense-in-depth against clickjacking, sniffing, referrer leaks. |
| 13.4 | **Clickjacking protection** (frame-ancestors / X-Frame-Options DENY) | Try to iframe the site. | Prevents UI-redress attacks on admin/approval actions. |
| 13.5 | **TLS config is modern** (valid cert, no TLS 1.0/1.1) | SSL Labs scan on both domains. | Weak TLS undermines all transport security. |
| 13.6 | **`www` and apex both secured and consistent** | Test both `malircanttbazaar.com` and `www.`. | Misconfig can serve one over insecure/no cert. |
| 13.7 | **DNS hardening** (Porkbun: registrar lock, strong DNS creds, consider CAA/DNSSEC) | Review Porkbun settings. | DNS hijack = full domain takeover and phishing. |

---

## 14. Admin Dashboard Hardening 🟠

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 14.1 | **Every admin action re-checks admin role server-side** | Call each admin endpoint with a non-admin token. | The admin panel is a high-value target; UI gating is not enough. |
| 14.2 | **Admin actions are audit-logged** (who approved/rejected/blocked, when) | Confirm an audit trail exists. | Accountability and incident forensics. |
| 14.3 | **Viewing a verification doc doesn't expose a permanent public URL** | See 8.3. | Prevents admin-view URLs from being reshared. |
| 14.4 | **Admin can't be locked out / bootstrapped insecurely** | Review how the first admin is created. | Insecure bootstrap = backdoor; lockout = operational risk. |
| 14.5 | **Bulk/moderation actions validate each target's ownership/state** | Attempt bulk-approve on invalid IDs. | Prevents mass mis-moderation. |
| 14.6 | **Consider MFA / IP allow-list for admin login** | — | Admin compromise is catastrophic; extra factor is warranted. |

---

## 15. Dependencies & Supply Chain 🟡

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 15.1 | **`npm audit` clean (no high/critical) on frontend and backend** | Run `npm audit` in both. | Known CVEs in deps are the easiest exploit path. |
| 15.2 | **Lockfiles committed; deps pinned** | Confirm `package-lock.json` present. | Prevents silent malicious version drift. |
| 15.3 | **No abandoned/typo-squatted packages** | Review `package.json` for odd/unmaintained deps. | Supply-chain compromise vector. |
| 15.4 | **Prisma, Express, jsonwebtoken, multer, etc. on patched versions** | Check versions against known advisories. | These handle auth/uploads/DB — high-impact if vulnerable. |
| 15.5 | **Automated dependency scanning enabled** (Dependabot/Snyk) | Confirm in GitHub. | Ongoing coverage, not a one-time check. |

---

## 16. Logging, Monitoring & Incident Readiness 🟡

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 16.1 | **No secrets/PII/passwords/tokens in logs** | Grep log output and log statements. | Logs are frequently over-shared and breached. |
| 16.2 | **Failed-login / abuse events are logged** | Trigger failures; confirm they're recorded. | Enables detecting attacks in progress. |
| 16.3 | **Error monitoring/alerting exists** (Railway logs + optional Sentry) | Confirm you'd notice a spike. | You can't respond to what you can't see. |
| 16.4 | **Database backups enabled & restorable** (Neon PITR) | Confirm backup settings; do a test restore. | Ransomware/accidental deletion recovery. |
| 16.5 | **A written incident/rotation runbook exists** | Confirm the steps in SECURITY.md are actionable. | Speed matters during a live incident. |

---

## 17. Privacy, Legal & Compliance 🟡

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 17.1 | **Terms of Service & Privacy Policy pages exist and load** | Load both pages on desktop/mobile. | Required per features.md; legal baseline for a data-collecting platform. |
| 17.2 | **Privacy policy discloses what PII is collected** (email, phone, CNIC/NTN, images) and how it's used | Review copy. | Handling CNIC/national ID data carries real obligations. |
| 17.3 | **Clear statement that the platform connects buyers/sellers but doesn't guarantee transactions** | Check site copy. | Limits liability for off-platform scams/disputes. |
| 17.4 | **User data deletion/account-removal path** | Confirm a user can request deletion. | Privacy best practice and trust. |
| 17.5 | **Data-retention policy for verification docs** | Confirm docs aren't kept forever unnecessarily. | Minimizes breach blast radius. |
| 17.6 | **Community/safety guidelines to deter fraud/prohibited items** | Review copy. | Marketplace safety and moderation basis. |

---

## 18. Email / Anti-Abuse (Resend) 🟡

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 18.1 | **SPF, DKIM, DMARC configured for the sending domain** | Check DNS + Resend domain status; send a test to Gmail and view headers. | Prevents spoofing of your domain and keeps mail out of spam. |
| 18.2 | **No email header/content injection via user fields** | Put newlines/`Bcc:` into name/email in the contact form. | Header injection turns your app into a spam relay. |
| 18.3 | **Contact-form recipient is fixed server-side** (`CONTACT_TO_EMAIL`) | Try to override the recipient via the request. | Prevents arbitrary-recipient abuse. |
| 18.4 | **Bounce/complaint handling & rate caps** | Confirm Resend limits/alerts. | Protects sender reputation from abuse spikes. |

---

## 19. Frontend-Specific 🟡

| # | Check | How to test | Why it matters |
|---|-------|-------------|----------------|
| 19.1 | **No trust in client-side validation** | Bypass every client check by calling the API directly (covered throughout). | The UI is advisory; the server is the control. |
| 19.2 | **Sensitive routes/components don't render for unauthorized users** *and* their data isn't fetched | As a normal user, load the admin route directly. | Even if the API blocks it, leaking the admin UI/structure aids attackers. |
| 19.3 | **No secrets, internal URLs, or debug flags in the bundle** | Search the built JS. | See 11.4/11.5. |
| 19.4 | **Third-party scripts (analytics/maps) are trusted & CSP-constrained** | Review external scripts. | Supply-chain XSS via third-party JS. |
| 19.5 | **`target="_blank"` links use `rel="noopener noreferrer"`** | Audit outbound/WhatsApp links. | Prevents reverse-tabnabbing. |

---

## How to Run This (suggested order)

1. **Static pass first:** secrets in git history (§12), dependency audit (§15), grep for `dangerouslySetInnerHTML`, `$queryRawUnsafe`, `...req.body`, default JWT secrets.
2. **Auth & authz by API:** §1–§3 with curl/Postman using two normal users + one admin — this is where the worst bugs live.
3. **Uploads & document privacy:** §7–§8 (beta-blocking, most sensitive data).
4. **Business logic/limits:** §9 including concurrency/race tests.
5. **Headers/transport/CORS:** §4, §11, §13 (fast wins via `curl -I` and a securityheaders.com scan).
6. **Rate limiting & abuse:** §10, §18.
7. **Legal/monitoring:** §16–§17.

### Recommended tooling
- **API testing:** Postman/Insomnia or curl scripts (for authz/IDOR/mass-assignment).
- **Secret scanning:** `gitleaks` or `trufflehog` on full history.
- **Dependency scanning:** `npm audit`, Dependabot/Snyk.
- **Header/TLS scanning:** securityheaders.com, SSL Labs.
- **Automated web scan (staging only, with permission):** OWASP ZAP baseline scan.
- **Manual XSS/IDOR:** the payloads listed above, run by hand — automated scanners miss business-logic and authz flaws.

> ⚠️ Run active/aggressive scanning (ZAP, brute-force, fuzzing) against a **staging copy**, not live production, to avoid disrupting real users or corrupting production data. Get explicit approval before any test that writes to or stresses production (per SECURITY.md).
