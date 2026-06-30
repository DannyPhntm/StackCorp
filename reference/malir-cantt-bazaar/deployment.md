# Malir Cantt Bazaar — Deployment Reference

## Live URLs

Frontend:
- https://malircanttbazaar.com
- https://www.malircanttbazaar.com

Backend:
- Railway API
- Base API URL used by frontend through VITE_API_URL

## Hosting Stack

- Frontend: Vercel
- Backend: Railway
- Database: Neon Postgres
- ORM: Prisma
- Email: Resend
- Images: Cloudinary
- Domain/DNS: Porkbun

## Environment Variables

Do not store real values in this repo.

Backend variables include:
- DATABASE_URL
- DIRECT_URL
- JWT_SECRET
- CLIENT_ORIGIN
- RESEND_API_KEY
- MAIL_FROM
- CONTACT_TO_EMAIL
- CLOUDINARY_URL
- NODE_ENV=production

Frontend variables include:
- VITE_API_URL

## Deployment Rules

Backend changes:
1. merge to main
2. Railway redeploy
3. run prisma migrate deploy if migrations exist
4. test API health
5. test auth/listing/admin flows

Frontend changes:
1. merge to main
2. Vercel redeploy
3. test live site on desktop and mobile

Database changes:
1. migration must be reviewed
2. migration must be additive where possible
3. run prisma validate
4. run prisma migrate deploy on production
5. confirm app still works

## Post-Deploy Smoke Test

After deployment, test:

- homepage loads
- register/login works
- email verification works
- create listing with images
- admin sees pending listing/images
- approve listing
- public listing appears
- business application with verification document
- admin can view verification document
- admin approves/waives business
- approved business can manage shop
- approved business can create business listing
- personal listing limit blocks third listing
- contact form sends support email
- terms/privacy pages load
- mobile layout has proper spacing

## Beta Deployment Rule

Do not send beta link until:
- critical security fixes are deployed
- image upload works live
- listing limits work
- business approval flow works
- verification document flow works
- admin can moderate
- mobile layout is acceptable
