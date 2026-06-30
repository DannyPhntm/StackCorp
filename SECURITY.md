# Security Rules

Do not copy, commit, or share production secrets in this repo.

Never include:

- .env files
- Railway secrets
- Vercel environment variables
- Neon database URLs
- Resend API keys
- Cloudinary URLs
- JWT secrets
- client passwords
- production credentials
- private customer data

## Safe Documentation Rule

Only document what tools are used and who manages access.

Example:

- Vercel: used for frontend hosting
- Railway: used for backend hosting
- Neon: used for database
- Resend: used for email
- Cloudinary: used for image storage

Do not include actual secret values.

## Database Rules

* Use ORM methods wherever possible.
* For Malir Cantt Bazaar, use Prisma ORM only unless an exception is explicitly approved.
* Do not use raw SQL unless absolutely necessary.
* Never concatenate user input into SQL queries.
* If raw SQL is unavoidable, it must be parameterized and explained before use.
* Validate all user input before database writes.
* Use allow-listed enum values for roles, statuses, categories, listing types, business statuses, sort fields, and filters.
* Do not trust frontend values for sensitive fields such as role, account type, admin status, approval status, payment status, or verification status.
* Do not allow users to control `select`, `include`, `orderBy`, or sensitive query filters directly.
* Pagination values must be coerced to numbers and bounded.
* Migrations should be additive whenever possible.
* Explain every migration clearly before applying it.
* Run `prisma validate` before merging schema changes.
* Run `prisma migrate deploy` during production deployment when migrations exist.
* Do not directly edit production database rows unless Daniyal explicitly approves it.
* Do not delete users, businesses, shops, listings, or verification documents unless explicitly approved.
* For destructive scripts, always run dry-run first and report exactly what would change.

## Authentication & Authorization Rules

* Do not weaken authentication or authorization for convenience.
* Security must be enforced on the backend, not only on the frontend.
* Admin-only routes must require an admin role on the server.
* Users can only edit, delete, or manage their own content unless they are admin.
* Business-only actions must require an approved and verified business account.
* Admin approval is required for business verification and listing moderation.
* Users must not be able to approve themselves, change their own role, or fake business verification from the frontend.
* Blocked users must not be able to log in or perform protected actions.
* Existing tokens from blocked users must return a restricted-account error on protected routes.
* Passwords must be hashed.
* Password hashes must never be returned to the frontend.
* JWT secrets must exist in production and must never be printed or committed.
* Password reset and email verification codes must expire and should not be reusable.
* Sensitive account actions should have safe error messages that do not leak unnecessary details.
* Admin accounts should not be blockable by normal admin actions unless explicitly designed and protected.
* Do not expose private user data through public endpoints.

## Upload and Document Privacy Rules

* Uploads must be handled safely and validated on the backend.
* Accept images only unless another file type is explicitly required.
* Enforce file size limits.
* Reject empty files.
* Reject invalid MIME types.
* Do not store large base64 payloads in the database.
* Use approved storage such as Cloudinary for images/documents.
* Validate the storage provider response before saving URLs to the database.
* If upload fails, the related submission should not be saved as successful.
* Listing images may be public if the listing is public.
* Business verification documents are private and admin-only.
* CNIC images are private and admin-only.
* Verification document URLs must never appear on public shop pages, public listing pages, or public user profiles.
* NTN/business registration details should not be public unless explicitly approved.
* Admin notes, rejection notes, and internal moderation notes must not leak publicly.
* Do not log full image data, base64 strings, private document URLs, or sensitive upload metadata.
* Do not expose Cloudinary credentials or signed upload secrets.
* Public API responses must use explicit safe selects that exclude private document fields.

## Frontend Safety Rules

* Do not expose secrets in frontend code.
* Only `VITE_` public environment variables should be used in frontend builds, and they must not contain secrets.
* Do not rely on frontend checks for security.
* Backend must enforce all sensitive rules.
* Do not use `dangerouslySetInnerHTML` unless the content is sanitized and the reason is explained.
* Render user-generated content as text, not raw HTML.
* Do not store sensitive documents, tokens, verification documents, CNIC images, or private admin data in localStorage.
* Avoid unnecessary sensitive console logs.
* Remove debug logs before production if they expose private data.
* Keep forms clear and safe.
* Show helpful validation errors without exposing internal implementation details.
* Preserve mobile responsiveness.
* Do not redesign pages unless the task explicitly asks for redesign.
* Do not break existing user flows while improving UI.
* External links that open in a new tab should use `rel="noopener noreferrer"`.
* Admin UI is only a convenience layer; it must not be the only protection.

## Error Handling Rules

* Errors should be specific enough to help users but safe enough to avoid leaking internals.
* Do not show stack traces in production.
* Do not expose SQL errors, Prisma internals, JWT errors, API keys, server paths, or provider secrets to users.
* Prefer clear user-facing messages.

Good examples:

* “You already have 2 active personal listings. Mark one as sold or inactive before posting another.”
* “Your account has been restricted. Please contact support.”
* “Please upload a business verification document.”
* “Only approved business accounts can create business listings.”
* “Please check the highlighted fields and try again.”

Bad examples:

* “Validation failed” with no field explanation.

* Raw database errors.

* Full stack traces.

* Token/JWT details.

* Cloudinary/Resend/internal provider error dumps.

* Validation errors should return field-level details where possible.

* Limit errors should return clear messages and stable error codes.

* Blocked/restricted account errors should be clear and consistent.

* Admin-only errors should return 403 without leaking private data.

* Missing private resources should usually return 404 to unauthorized users.

* Logs may include safe debugging information, but must not include secrets, passwords, JWTs, verification codes, reset codes, or full private document URLs.

## Claude Session Rules

At the start of a Claude session:

* Run or confirm `git pull`.
* Check the current branch and repo status.
* Read `CLAUDE.md`.
* Read `SECURITY.md`.
* Read `SKILLS.md` if skill choice matters.
* Read the relevant project docs before editing.
* Do not edit files until the task and current context are understood.

During a Claude session:

* Make the smallest safe change that solves the task.
* Do not rewrite whole files unless explicitly approved or absolutely necessary.
* Do not delete working code unless the reason is clear.
* Do not touch production data unless explicitly approved.
* Do not print secrets.
* Do not auto-merge pull requests.
* Use skills only when they clearly improve the task.
* Preserve existing design and functionality unless asked to change them.
* Ask before risky migrations, destructive scripts, major rewrites, or merge conflict resolutions.

At the end of a Claude session, Claude must report:

* files changed
* what changed
* tests/checks run
* whether changes are committed
* whether changes are pushed
* PR link if opened
* deployment steps
* migration steps if any
* risks or blockers
* next recommended task

## Client Project Rules

* Treat every client project as private by default.
* Do not expose client data, passwords, credentials, documents, or business information.
* Do not commit client `.env` files.
* Do not reuse one client’s private assets, code, or data in another client project without permission.
* Do not promise legal, financial, medical, cybersecurity, or guaranteed business outcomes unless reviewed by a qualified professional.
* Keep scope clear before starting work.
* Document what is included and excluded.
* Use branches and pull requests for client projects.
* Keep a handoff document for each client.
* Include deployment notes, maintenance notes, and known limitations.
* Use secure defaults for auth, forms, uploads, admin dashboards, and databases.
* Do not give clients access to production admin tools unless permissions are intentional.
* Keep communication professional and clear.
* If a client asks for a risky feature, explain the risk and suggest a safer alternative.
* For AI systems, clearly document what the AI can and cannot do.
* Do not hide known bugs or limitations from the client.

## Malir Cantt Bazaar Special Rules

Malir Cantt Bazaar is a live beta product and the agency’s first case study. Treat it carefully.

Do not:

* add fake production data
* expose secrets
* expose business verification documents
* expose CNIC documents
* remove listing limits
* remove security hardening
* break image uploads
* break email verification
* break login/register
* break business approval
* break Manage Shop
* break Add Listing
* break admin moderation
* merge automatically without Daniyal’s approval
* directly edit production data without explicit approval
* delete real users, businesses, shops, listings, or verification documents unless explicitly approved

Core product rules:

* Personal users can have 2 active/pending listings during beta.
* Approved businesses can have 6 active/pending business listings during beta.
* Approved businesses can have 3 active featured slots during beta.
* Featured duration is 14 days.
* Pending listings count toward limits.
* Business applications require verification proof during beta.
* CNIC and NTN are optional during beta unless policy changes.
* Business verification documents are admin-only.
* Admin approval/waiver is required for businessVerified status.
* Blocked users cannot perform protected actions.
* Public pages must not expose private verification fields.

Before sharing the beta link or visiting businesses, test:

* homepage loads
* register/login/email verification
* personal listing creation with images
* 3rd personal listing is blocked with a clear message
* business application with verification document
* admin can view verification document
* admin can approve/waive business
* approved business can Manage Shop
* approved business can create Business Listing
* admin can reject with reason
* contact form works
* mobile spacing is acceptable
* terms/privacy pages load if implemented
* blocked user flow works if implemented
* no fake data or secrets are present


