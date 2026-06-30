# Malir Cantt Bazaar — Features

## Core User Features

- User registration
- Email verification
- Login/logout
- Profile page
- Personal listings
- Business account application
- Business account approval
- Shop profiles
- Shops directory
- Listing detail pages
- Contact seller through phone/WhatsApp
- Recently viewed listings
- Featured listings

## Listing System

Users can create listings for categories such as:

- Cars
- Electronics
- Property
- Furniture
- Jobs
- Services
- Gym
- Shoes

Listings support:
- title
- description
- category
- location
- price where relevant
- contact information
- images
- personal/business listing type
- pending/approved/sold/inactive statuses

## Image Uploads

Listing images are uploaded through multipart/form-data and stored on Cloudinary.

Important:
- no base64 JSON uploads for listings
- image-only upload
- max file size limits
- Cloudinary secure URLs stored in database
- failed image upload should block listing creation

## Business System

One account can be both a personal user and an approved business user.

Business application includes:
- business name
- business phone/WhatsApp
- business address
- verification document photo
- optional CNIC photo during beta
- optional NTN/business number during beta

Business verification documents are admin-only and must never appear publicly.

## Shop System

Approved businesses can create/manage a shop profile.

Shop profiles are permanent business pages and are separate from temporary listings.

## Listing Limits

Beta limits:

- personal users: 2 active/pending personal listings
- approved businesses: 6 active/pending business listings
- approved businesses: 3 active featured slots
- featured duration: 14 days
- pending listings count toward limits

## Admin Features

Admins can:
- approve/reject listings
- approve/reject business accounts
- waive/settle beta business approval
- view business verification documents
- moderate listings
- manage shops
- block/suspend users if implemented
- view pending listings and images

## Legal/Safety Features Needed

The website should include:
- Terms of Service
- Privacy Policy
- Contact link
- safety/community guidelines if possible

The platform should clearly state that it connects buyers and sellers but does not guarantee transactions.
