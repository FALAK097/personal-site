# Upstash to Cloudflare D1 Migration

This project previously used `@upstash/redis` for three server-side features:

- unique visitor tracking in `src/actions/unique-visitors.js`
- AI answer caching in `src/actions/ask-ai.js`
- contact form rate limiting in `src/actions/send-email.js`

The replacement uses Cloudflare D1 through the Cloudflare REST API. This keeps the site on Cloudflare-owned infrastructure without adding another managed data service.

## Why D1 Instead of KV

Cloudflare KV is optimized for read-heavy, highly cacheable data. Cloudflare documents that KV reads are eventually consistent, writes may take 60 seconds or more to become visible globally, and KV is not ideal when atomic operations or read-write transactions are required.

That does not fit the current Redis usage well:

- unique visitors need a uniqueness constraint before counting
- contact rate limiting needs an atomic increment inside a fixed window
- AI cache entries need TTL-style expiry

D1 gives us primary-key uniqueness, `COUNT(*)`, cache expiry columns, and transactional batches for rate limiting while staying within Cloudflare.

## Required Cloudflare Setup

Create a D1 database:

```bash
wrangler d1 create personal-site
```

Apply the schema:

```bash
wrangler d1 execute personal-site --remote --file docs/cloudflare/d1-schema.sql
```

Create a Cloudflare API token with D1 read and write access scoped to this account/database.

Set these environment variables locally before running the one-time visitor migration:

```env
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_D1_DATABASE_ID=your-d1-database-id
CLOUDFLARE_D1_API_TOKEN=your-d1-api-token
UPSTASH_REDIS_REST_URL=your-current-upstash-rest-url
UPSTASH_REDIS_REST_TOKEN=your-current-upstash-rest-token
```

Migrate the existing production visitor IDs from Upstash into D1:

```bash
pnpm migrate:visitors
```

If the Redis set key ever changes, override it with:

```bash
UPSTASH_UNIQUE_VISITORS_KEY=site:unique_visitors pnpm migrate:visitors
```

AI response cache entries and contact form rate-limit windows are not migrated because they are short-lived operational data.

Add these production environment variables to your hosting provider:

```env
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_D1_DATABASE_ID=your-d1-database-id
CLOUDFLARE_D1_API_TOKEN=your-d1-api-token
```

Remove these old Upstash variables only after the D1-backed deployment is verified:

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Verification

Run the build locally:

```bash
pnpm build
```

After deploying with the new environment variables:

- load the site footer and confirm the visitor count renders
- refresh with the same browser and confirm the count does not increase repeatedly
- ask the AI widget the same question twice and confirm the second response still works
- submit the contact form more than three times in one minute with the same email and confirm the rate-limit message appears

For a direct D1 check, run:

```bash
wrangler d1 execute personal-site --remote --command "SELECT COUNT(*) AS count FROM unique_visitors;"
wrangler d1 execute personal-site --remote --command "SELECT key, expires_at FROM kv_cache ORDER BY updated_at DESC LIMIT 5;"
wrangler d1 execute personal-site --remote --command "SELECT key, attempts, window_expires_at FROM rate_limits ORDER BY created_at DESC LIMIT 5;"
```
