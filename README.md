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

### Admin sign-in

`/admin` picks its sign-in from the Worker's settings (`src/lib/auth.ts`):

| Where | How you sign in |
| --- | --- |
| Production | **Cloudflare Access**: enter your email, get a one-time code. Needs `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` in `wrangler.jsonc`. Every admin request's Access token is verified in the app, and `ADMIN_EMAILS` (optional, comma-separated) narrows it further. |
| Production, fallback | An `ADMIN_PASSWORD` Worker secret, if Access isn't set up. With neither, admin is locked. |
| Branch previews, `npm run dev` | Demo password `sunbeam-demo` (previews set `DEMO_ADMIN=1`; for `npm run preview` put it in `.dev.vars`). |

Setting up Access (once): Zero Trust > Access > Applications > Add an application > Self-hosted. Domain `sunbeam-arthouse.alex-blanton.workers.dev`, path `admin`. Add an Allow policy for your email. Then copy the team domain (Zero Trust > Settings) and the app's Application Audience (AUD) Tag into `wrangler.jsonc` `vars`.

`npm test` checks the Access token verification.

## Deploy to Cloudflare

The Worker is `sunbeam-arthouse` (connected to this repo through Workers Builds) and the database is `sunbeam-db` (both in `wrangler.jsonc`). The live database already has the schema and starting events applied.

```bash
npx wrangler login
npm run deploy             # build + upload; preview URL is sunbeam-arthouse.<account>.workers.dev
npm run db:migrate         # only when a new file is added under migrations/ (production database)
npm run db:migrate:preview # same, for the preview database (sunbeam-db-preview) used by PR branch previews
```

Changing `wrangler.jsonc` bindings: rerun `npm run cf-typegen`.

## Stack

Next.js 15 (App Router, server actions) on Cloudflare Workers via OpenNext, D1 (SQLite), plain CSS. Full plan: the "Cloudflare Build Plan" doc in the project.
