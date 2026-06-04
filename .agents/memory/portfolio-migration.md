---
name: Portfolio Builder migration
description: Key decisions from migrating a Lovable.dev/Supabase portfolio builder to Replit pnpm workspace stack
---

## Supabase shim pattern
The original app used `supabase.from(table).*` throughout. Rather than rewriting all pages, `artifacts/portfolio-builder/src/integrations/supabase/client.ts` was replaced with a compatibility shim that routes all calls to `/api/*` REST endpoints. Admin editor pages still import from the shim — this is intentional.

**Why:** Less risky than rewriting ~10 complex editor pages; shim is transparent to the frontend.

**How to apply:** If new pages use `supabase.from(...)`, they still work via the shim. Only write direct fetch calls for new code.

## snake_case camelCase serialization
Drizzle returns camelCase field names, but the original Supabase frontend expects snake_case. `toSnake()` is applied to all API responses; `toCamel()` on all request bodies. Both in `artifacts/api-server/src/routes/portfolio.ts`.

**Why:** All 13 DB tables use Drizzle camelCase but the frontend references fields like `image_url`, `subtitle_bn`, `is_published`, etc.

**How to apply:** Any new API endpoint must call `sj(res, data)` instead of `res.json(data)`.

## Clerk auth integration
Frontend: ClerkProvider in App.tsx, AdminGuardInner uses useUser(). Backend: clerkMiddleware in app.ts, getAuth(req).userId in routes. useAuth.ts uses useUser() + useClerk() from @clerk/react. Sign-in/up at /sign-in and /sign-up. Old /admin/login redirects to /sign-in.

## Object Storage
Provisioned via setupObjectStorage(). Presigned URL: POST /api/upload/request-url. Serving: GET /api/objects/:objectPath. ObjectStorageService copied from skill templates. GCS libraries installed on api-server.

## Translation
Supabase edge function replaced with MyMemory free API. Endpoint: POST /api/translate (requires auth). TranslateButton.tsx calls this directly.

## Express 5 wildcard routes
Express 5 with path-to-regexp v8 does NOT support * or (*) in route patterns. Use :paramName instead (e.g., /objects/:objectPath not /objects/*).
