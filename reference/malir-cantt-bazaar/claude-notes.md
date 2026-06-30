# Malir Cantt Bazaar — Claude Notes

## Important Context

Malir Cantt Bazaar is not just a demo. It is a real live product and the agency's first case study.

Treat changes carefully because the platform may be shared with family, friends, and local businesses.

## Core Product Architecture

One user account can:
- post personal listings
- apply for business access
- become an approved business
- create/manage a shop
- create business listings

## Listing Types

Personal listing:
- for normal residents
- max 2 active/pending listings during beta
- not eligible for free featured slots

Business listing:
- requires approved business account
- max 6 active/pending listings during beta
- eligible for 3 featured slots
- featured duration is 14 days

## Business Verification

For beta, business applications require:
- business name
- business phone/WhatsApp
- business address
- verification document photo

Accepted proof examples:
- utility bill
- sales receipt
- business card with address
- shop/rent document
- address proof
- any reasonable proof showing business identity/address

Optional during beta:
- CNIC photo
- NTN/business registration number

Verification documents are admin-only and must not be public.

## Admin Rules

Admin can:
- approve/reject listings
- approve/reject business accounts
- waive/settle business approval for beta
- view business verification proof
- moderate misuse
- block/suspend users if implemented

Admin approval should not be bypassed by frontend changes.

## Development Rules

- Do not redesign unless asked.
- Do not weaken validation.
- Do not remove backend enforcement.
- Use Prisma ORM only.
- No raw SQL unless justified and safe.
- Do not expose secrets.
- Do not touch production data unless explicitly asked.
- Do not merge automatically unless Daniyal explicitly approves.
- Always report changed files, tests, deployment steps, and risks.

## Current Beta Priorities

Before sharing widely:
- image uploads must work
- listing limits must work
- business verification documents must work
- admin approval must work
- terms/privacy pages should exist
- mobile spacing should look polished
- contact form must work
- no fake production data
- no secrets in repo

## Agency Use

This project should be used as a case study showing that the agency can build:
- real web applications
- production deployments
- admin dashboards
- authentication systems
- business verification flows
- upload systems
- security-aware platforms
