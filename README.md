# Sunbeam Art House website

New site for Sunbeam Art House: promote camps and events, take registrations and payments directly.

This is the **first demo**. It runs end to end, but uses an in-memory store and a demo checkout.

## What works today

- Public pages: Home, Camps & Events (with filters), Art Parties, About, Contact
- Step-by-step registration (camper, parent and pickup, waiver, review) with sibling discount and an SMS opt-in checkbox
- Contact and party request forms
- Admin at `/admin`: add and edit camps, registrations roster with refund, request inbox, reminders overview

## What is still a stand-in

| Area | Demo behavior | Planned |
| --- | --- | --- |
| Data | In memory, resets on restart (`src/lib/store.ts`) | Supabase |
| Payment | "Paid (demo)", no card is charged | Stripe Checkout |
| Reminder emails | Listed, not sent | Resend or Postmark, hourly scheduled job |
| Prices, ages, waiver, founder bio | Sample values and `[PLACEHOLDERS]` | Real details from Sunbeam |
| Photo upload in admin | Pick from existing photos | Supabase storage |

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Admin password: set `ADMIN_PASSWORD`. The demo falls back to `sunbeam-demo`, so set a real one before sharing the site.

## Stack

Next.js (App Router, server actions), TypeScript, plain CSS.
