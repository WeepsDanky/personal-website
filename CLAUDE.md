# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start dev server (localhost:3000)
pnpm dev:turbo        # Dev with Turbo for faster builds
pnpm dev:email        # Email preview server (localhost:3333)
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm db:generate      # Generate Drizzle migrations from schema
pnpm db:push          # Push migrations to Neon PostgreSQL
```

No test suite is configured.

## Architecture

This is a Next.js 16 App Router personal blog/portfolio site (marksun.co.uk).

### Route Structure

- `app/(main)/` — All public-facing pages grouped under the main layout
  - `blog/[slug]/` — Individual blog posts rendered from Sanity CMS
  - `guestbook/` — Visitor guestbook (requires auth)
  - `newsletters/` — Newsletter archives
  - `(auth)/` — Clerk sign-in/sign-up pages
  - `(products)/` — Product showcase pages (daynight-sounds, 91)
- `app/admin/` — Admin dashboard for managing comments, newsletters, subscribers
- `app/studio/` — Sanity CMS Studio mounted at `/studio`
- `app/api/` — API routes (link-preview, favicon)

### Content Layer (Sanity)

Blog posts and projects are managed in Sanity CMS. Content is fetched via GROQ queries defined in `sanity/queries.ts`. The Sanity client is in `sanity/lib/client.ts`. Schema types (post, category, project, settings) live in `sanity/schemas/`. Rich text content uses Portable Text, rendered by components in `components/portable-text/`.

### Database Layer (Drizzle + Neon)

PostgreSQL via Neon serverless. Schema is defined in `db/schema.ts` with four tables: `subscribers`, `newsletters`, `comments`, `guestbook`. Prepared queries are in `db/queries/`. DTOs in `db/dto/` handle comment and guestbook data shapes.

### Authentication (Clerk)

Clerk v6 handles auth throughout. Chinese localizations use `@clerk/localizations` (`zhCN` imported in `app/layout.tsx`). The proxy file (`proxy.ts`) controls which routes are public using `clerkMiddleware` + `createRouteMatcher`.

### Key Libraries

- **Styling:** Tailwind CSS with dark mode, custom theme colors, and typography plugin
- **Animations:** Framer Motion
- **State:** Valtio (local), React Query (server state)
- **Email:** React Email templates + Resend for delivery (`lib/mail.ts`)
- **Rate limiting/caching:** Upstash Redis (`lib/redis.ts`)
- **Validation:** Zod schemas in `lib/validation.ts`

### URL Redirects

Defined in `next.config.mjs`: `/twitter`, `/youtube`, `/tg`, `/linkedin`, `/github`, `/bilibili` redirect to external social profiles. `/feed`, `/rss`, `/rss.xml` rewrite to `/feed.xml`.

## Key Conventions

**Next.js 16 async params:** Dynamic route params and searchParams are Promises. Always `await params` before using:
```ts
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}
```

**Tailwind CSS v4:** Uses CSS-first config (`app/globals.css`). Use `@reference "tailwindcss"` in standalone CSS files. No `tailwind.config.js` — themes and plugins are configured via `@theme` / `@plugin` in CSS.

**ESLint:** Flat config (`eslint.config.js`). The project uses ESLint v10 with `eslint-config-next/core-web-vitals`, `@typescript-eslint`, `simple-import-sort`, and `unused-imports`.

**IP detection:** Use `getIP(req)` from `~/lib/ip` (not `req.ip`) in API routes for rate limiting.

**`revalidate` exports:** Must be a numeric literal, not a computed expression: `export const revalidate = 3600` not `60 * 60`.

**`tsconfig.json`:** Uses `"moduleResolution": "bundler"` (required for `next-sanity` v12 package exports).
