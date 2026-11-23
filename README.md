# Sunbeam Art House website

New site for Sunbeam Art House: promote camps and events, take registrations and payments directly.

This is the **first demo**. It runs on Cloudflare Workers with a D1 database, and uses a demo checkout.

## What works today

- Public pages: Home, Camps & Events (with filters), Art Parties, About, Contact
- Step-by-step registration (camper, parent and pickup, waiver, review) with sibling discount and an SMS opt-in checkbox
- Contact and party request forms
- Admin at `/admin`: add and edit camps, registrations roster with refund, request inbox, reminders overview

## What is still a stand-in

| Area | Demo behavior | Planned |
| --- | --- | --- |
| Payment | "Paid (demo)", no card is charged | Stripe Checkout |
| Reminder emails | Listed, not sent | Resend or Postmark, hourly scheduled job |
| Prices, ages, waiver, founder bio | Sample values and `[PLACEHOLDERS]` | Real details from Sunbeam |
| Photo upload in admin | Pick from existing photos | R2 upload |

## Run it locally

```bash
npm install
npm run db:migrate:local   # creates the local D1 database from migrations/
npm run preview            # builds for Workers and runs it in workerd at http://localhost:8787
```

`npm run dev` also works for quick UI edits (D1 is available through the Cloudflare dev bindings).

Admin password: set `ADMIN_PASSWORD` (a Worker secret in production, `.dev.vars` locally). The demo falls back to `sunbeam-demo`. Phase 3 replaces this with Cloudflare Access.

## Deploy to Cloudflare

The Worker is `sunbeamart` and the database is `sunbeam-db` (both in `wrangler.jsonc`). The live database already has the schema and starting events applied.

```bash
npx wrangler login
npx wrangler secret put ADMIN_PASSWORD
npm run deploy             # build + upload; preview URL is sunbeamart.<account>.workers.dev
npm run db:migrate         # only when a new file is added under migrations/
```

Changing `wrangler.jsonc` bindings: rerun `npm run cf-typegen`.

## Stack

Next.js 15 (App Router, server actions) on Cloudflare Workers via OpenNext, D1 (SQLite), plain CSS. Full plan: the "Cloudflare Build Plan" doc in the project.
