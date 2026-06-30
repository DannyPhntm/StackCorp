# Malir Cantt Bazaar — Security Reference

## Security Philosophy

Malir Cantt Bazaar should be safe enough for a private beta and future local business use.

Security is important because the platform handles:
- user accounts
- emails
- phone numbers
- listing images
- business verification documents
- optional CNIC/NTN information
- admin approvals

## Database Security

Rules:
- Use Prisma ORM.
- Do not use raw SQL unless absolutely necessary.
- Do not concatenate user input into SQL.
- Validate all input before database writes.
- Use allow-listed enum values for statuses, categories, roles, listing types, and sorting.

SQL injection audit status:
- no raw SQL found in audit
- Prisma ORM used for database queries
- user input should not be concatenated into SQL

## Auth Security

Rules:
- passwords must be hashed
- password hashes must never be returned to frontend
- admin routes must require admin role
- business routes must require approved business account
- users can only edit/delete their own listings unless admin
- admin is the only role that can approve businesses/listings
- JWT secret must exist in production

## Business Verification Privacy

Business verification documents are private.

Admin-only data includes:
- verification document URL
- CNIC document URL if uploaded
- NTN/business number if considered private
- admin notes
- rejection reasons if private

Public pages must never expose:
- verification documents
- CNIC images
- private admin notes
- raw internal approval data

## Upload Security

Listing and verification uploads should:
- use multipart/form-data
- accept images only
- have size limits
- reject empty files
- reject non-image files
- upload to Cloudinary
- validate Cloudinary response
- not store base64 image data in the database

Recommended Cloudinary folders:
- malir/listings
- malir/business-verification

## Rate Limiting

Rate limit sensitive actions:
- login
- register
- email verification
- resend verification
- password reset
- contact form
- listing creation
- image uploads
- business application

## Secrets

Never commit:
- .env files
- JWT secrets
- database URLs
- Railway secrets
- Vercel environment variables
- Resend API keys
- Cloudinary URLs
- Neon credentials

## Production Safety Rules

- no fake production data
- no direct production database edits without approval
- no deleting real user/business/shop data casually
- migrations should be additive where possible
- run build/lint/tests before deployment
- Railway redeploy for backend changes
- Vercel redeploy for frontend changes
- prisma migrate deploy when migrations exist
