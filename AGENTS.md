# AGENTS.md — Averi Digital (Base44 dev environment)

## What this is
Pure frontend Next.js 16 (App Router) + React 19 + Tailwind CSS v4 app.
A PPOB (topup & bill payment) UI with a 4-step checkout wizard. **No backend, no database, no API.**
All data is in-memory (`src/data/catalog.ts`) or localStorage (`src/lib/orderStore.ts`).

## Running it
```
docker compose -f docker-compose.base44.yml up -d
```
- Dev server (Next.js Turbopack) listens on container port **3010**, mapped to host **3000**.
- Dependencies install on container startup via `npm install` (node:22-slim base image).
- Source is bind-mounted; edits hot-reload via Turbopack.
- Healthcheck: `GET /` on port 3010.

## Environment variables
All optional — defaults exist in `src/lib/config.ts`:
- `NEXT_PUBLIC_CS_WHATSAPP` (default: `6281234567890`)
- `NEXT_PUBLIC_MERCHANT_NAME` (default: `TOPUPIN DIGITAL`)
- `BASE44_PUBLIC_HOST_SUFFIX` — used by `next.config.ts` `allowedDevOrigins` to allow the preview origin.

No external credentials are required to boot.

## Verifying it works
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → `200`
- Homepage renders the hero, marketplace, and support band.
- `/checkout` renders the 4-step wizard (supports `?service=`, `?prov=`, `?nom=` query params for prefill).
