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
