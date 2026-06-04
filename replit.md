# Portfolio Builder

A full-stack bilingual (Bengali + English) portfolio builder, migrated from Lovable.dev / Supabase to Replit pnpm workspace stack.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/portfolio-builder run dev` — run the frontend dev server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite 7, Tailwind CSS v3, react-router-dom v6
- API: Express 5
- Auth: Clerk (replaces Supabase auth) — `@clerk/react` frontend, `@clerk/express` backend
- DB: PostgreSQL + Drizzle ORM (13 tables)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Storage: Replit Object Storage (GCS-backed) — replaces Supabase storage
- Translation: MyMemory free translation API (replaces Supabase edge function)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/portfolio-builder/` — React + Vite frontend
- `artifacts/api-server/` — Express API server
- `lib/db/src/schema/portfolio.ts` — all 13 Drizzle DB table definitions
- `artifacts/api-server/src/routes/portfolio.ts` — all CRUD API routes
- `artifacts/portfolio-builder/src/integrations/supabase/client.ts` — Supabase compatibility shim (routes to /api/*)
- `artifacts/portfolio-builder/src/hooks/useAuth.ts` — auth hook (uses Clerk)
- `artifacts/portfolio-builder/src/hooks/useSiteContent.ts` — data fetching hooks (direct fetch)
- `artifacts/portfolio-builder/src/App.tsx` — root with Clerk provider + routes

## Architecture decisions

- **Supabase shim**: The original code heavily used `supabase.from(table).*` — instead of rewriting all pages, a compatibility shim in `client.ts` maps those calls to REST API routes.
- **snake_case ↔ camelCase**: Drizzle returns camelCase, frontend expects snake_case (original Supabase convention). API routes use `toSnake()` on responses and `toCamel()` on request bodies.
- **Clerk auth**: Supabase auth replaced with Clerk. Auth guard moved to App.tsx (`AdminGuardInner`), sign-in/sign-up use Clerk's hosted components at `/sign-in` and `/sign-up`.
- **Object Storage**: Image uploads use Replit Object Storage presigned URLs. Upload flow: frontend requests presigned URL → uploads directly to GCS → stores `/api/objects/<id>` path.
- **Translation**: Supabase edge function replaced with MyMemory free translation API via `/api/translate`.

## Product

- Users sign up/sign in, set a username, then build their portfolio through an admin panel
- Admin panel has editors for: hero, about, stats, services, portfolio, testimonials, blog, contact, social links, site settings
- Each portfolio is publicly viewable at `/<username>`
- Supports bilingual content (Bengali + English) with auto-translate button
- Supports image uploads, dynamic theming, custom fonts

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The Supabase shim's `UpdateMatcher.eq()` only tracks the `id` filter. The API PATCH endpoints use Clerk userId for ownership check (not the shim's filter chain).
- All API responses go through `toSnake()` — any new Drizzle field names (camelCase) are auto-converted to snake_case for the frontend.
- The admin editors still import `supabase` from the shim — this is intentional (shim routes to API). Don't replace these with direct fetch unless refactoring that file.
- Object Storage path format: GCS presigned URL → normalized to `/objects/<uuid>` → served at `/api/objects/<uuid>`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
