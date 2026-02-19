# Xiaohongshu-Style Redesign

Goal: simplify the site into an image-and-text feed optimised for reading. The homepage becomes the primary blog feed, unnecessary pages are retired, and the nav shrinks to three destinations. The existing design language (background, card style, typography, colours) is preserved — only the page structure and navigation are changed.

Browser-detected Chinese/English i18n is added throughout.

---

## 1. What Changes and Why

| Current | New |
|---|---|
| Nav: 首页 / 博客 / 项目 / 留言墙 | Nav: Home / Guestbook / Profile (language-aware) |
| Homepage: `Headline` intro + two-column blog/aside | Homepage: full-width multi-column post feed |
| `/blog` as a separate page | Removed — homepage IS the blog |
| `/projects` as a separate page | Removed from nav (page file can stay for old links) |
| Sidebar: newsletter signup + resume | Newsletter removed; resume moved to new `/profile` page |
| Monolingual Chinese | Chinese and English, detected from browser |

Everything else — the card design, background grid, decorative overlays, colour system, and existing components — stays exactly as is.

---

## 2. Add Internationalization (i18n)

The site currently has no i18n infrastructure — all text is hardcoded Chinese. This section sets up browser-detected Chinese/English using `next-intl`.

### 2.1 Overview

- **Library:** `next-intl` v4
- **Locales:** `zh` (default) and `en`
- **URL strategy:** No locale prefix — `/`, `/profile`, `/guestbook` look the same for both languages. The locale is detected from the browser's `Accept-Language` header on first visit and stored in a `NEXT_LOCALE` cookie. Subsequent visits read from the cookie.
- **Route structure:** No restructuring needed. Pages stay at `app/(main)/`. `next-intl` is used in "without i18n routing" mode — locale is resolved in `i18n/request.ts` and passed down via `NextIntlClientProvider` in the root layout.

### 2.2 Install

```bash
pnpm add next-intl
```

### 2.3 Create Translation Files

**`messages/zh.json`**
```json
{
  "nav": {
    "home": "首页",
    "guestbook": "留言墙",
    "profile": "个人主页"
  },
  "home": {
    "recentPosts": "近期文章"
  },
  "blog": {
    "readingTime": "{{minutes}}分钟阅读",
    "views": "{{count}}次"
  },
  "profile": {
    "title": "个人主页"
  },
  "guestbook": {
    "title": "留言墙"
  }
}
```

**`messages/en.json`**
```json
{
  "nav": {
    "home": "Home",
    "guestbook": "Guestbook",
    "profile": "Profile"
  },
  "home": {
    "recentPosts": "Recent Posts"
  },
  "blog": {
    "readingTime": "{{minutes}} min read",
    "views": "{{count}} views"
  },
  "profile": {
    "title": "Profile"
  },
  "guestbook": {
    "title": "Guestbook"
  }
}
```

Add more keys as you encounter hardcoded strings during implementation.

### 2.4 Create the i18n Config

**New file: `i18n/config.ts`**
```ts
export const locales = ['zh', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'zh'
```

**New file: `i18n/request.ts`**
```ts
import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { defaultLocale, locales, type Locale } from './config'

function detectLocale(): Locale {
  // 1. Check the NEXT_LOCALE cookie (set on previous visits)
  const cookieLocale = cookies().get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale
  }

  // 2. Fall back to Accept-Language header
  const acceptLanguage = headers().get('accept-language') ?? ''
  const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase()
  if (preferred && locales.includes(preferred as Locale)) {
    return preferred as Locale
  }

  return defaultLocale
}

export default getRequestConfig(async () => {
  const locale = detectLocale()
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

**`next.config.mjs` — add the plugin:**
```js
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig = {
  // ... existing config
}

export default withNextIntl(nextConfig)
```

### 2.5 Wire Up the Provider in the Root Layout

`NextIntlClientProvider` wraps the app in `app/layout.tsx`. No route restructuring is needed.

```tsx
// app/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

export default async function RootLayout({ children }) {
  const locale = await getLocale()
  const messages = await getMessages()
  const htmlLang = locale === 'zh' ? 'zh-CN' : 'en'

  return (
    <ClerkProvider localization={locale === 'zh' ? zhCN : undefined}>
      <html lang={htmlLang} ...>
        <body>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider ...>{children}</ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
```

### 2.6 Update Middleware to Handle Locale Routing

**File: `proxy.ts`**

The middleware currently only handles Clerk auth. Add locale detection that rewrites the request to the `[locale]` route internally while keeping clean URLs externally.

```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import { defaultLocale, locales, type Locale } from '~/i18n/config'

function getLocale(req: NextRequest): Locale {
  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale
  }

  const acceptLanguage = req.headers.get('accept-language') ?? ''
  const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase()
  if (preferred && locales.includes(preferred as Locale)) {
    return preferred as Locale
  }

  return defaultLocale
}

const isPublicRoute = createRouteMatcher([
  '/',
  '/blog(.*)',
  '/projects(.*)',
  '/guestbook(.*)',
  '/newsletters(.*)',
  '/profile(.*)',
  '/daynight-sounds(.*)',
  '/91(.*)',
  '/feed.xml',
])

export default clerkMiddleware((auth, req) => {
  const locale = getLocale(req)
  const pathname = req.nextUrl.pathname

  // Rewrite to [locale] route internally (URL stays clean)
  const rewriteUrl = req.nextUrl.clone()
  rewriteUrl.pathname = `/${locale}${pathname}`

  const response = NextResponse.rewrite(rewriteUrl)

  // Persist locale in cookie for future visits
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  })

  if (!isPublicRoute(req)) {
    auth().protect()
  }

  return response
})

export const config = {
  matcher: ['/((?!_next|studio|.*\\..*).*)'],
}
```

### 2.7 Update the Navigation Bar to Use Translations

**File: `config/nav.ts`** — store translation keys instead of hardcoded text:

```ts
// config/nav.ts
export const navigationItems = [
  { href: '/', key: 'home' },
  { href: '/guestbook', key: 'guestbook' },
  { href: '/profile', key: 'profile' },
] as const
```

**File: `app/(main)/NavigationBar.tsx`** — read translations in the `NavItem` and mobile nav:

```tsx
// Add at top of file:
import { useTranslations } from 'next-intl'

// Inside Desktop component, replace the ul:
function Desktop(...) {
  const t = useTranslations('nav')
  // ...
  <ul ...>
    {navigationItems.map(({ href, key }) => (
      <NavItem key={href} href={href}>
        {t(key)}
      </NavItem>
    ))}
  </ul>
}

// Inside Mobile component, replace the ul similarly:
function Mobile(...) {
  const t = useTranslations('nav')
  // ...
  {navigationItems.map(({ href, key }) => (
    <MobileNavItem key={href} href={href}>
      {t(key)}
    </MobileNavItem>
  ))}
}
```

### 2.8 Update the Root Layout `html` Tag

**File: `app/layout.tsx`**

The root layout has `lang="zh-CN"` hardcoded. Make it dynamic. Since the root layout wraps everything including the `[locale]` segment, pass the locale down:

```tsx
// app/layout.tsx — read locale from cookie for the html tag
import { cookies } from 'next/headers'
import { defaultLocale } from '~/i18n/config'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = cookies().get('NEXT_LOCALE')?.value ?? defaultLocale
  const htmlLang = locale === 'zh' ? 'zh-CN' : 'en'

  return (
    <ClerkProvider localization={locale === 'zh' ? zhCN : undefined}>
      <html lang={htmlLang} ...>
        ...
      </html>
    </ClerkProvider>
  )
}
```

When `localization` is `undefined`, Clerk defaults to English.

### 2.9 Add a Language Toggle (Optional)

Users may want to override the detected language. Add a simple toggle button to the `Header`:

**New file: `app/(main)/LocaleSwitcher.tsx`**
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()

  function toggle() {
    const next = locale === 'zh' ? 'en' : 'zh'
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      className="h-10 rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 text-sm font-medium shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10"
    >
      {locale === 'zh' ? 'EN' : '中'}
    </button>
  )
}
```

Add `<LocaleSwitcher />` alongside `<ThemeSwitcher />` in `Header.tsx`.

---

## 3. Simplify the Navigation

**File:** `config/nav.ts`

After the i18n setup in section 2, this file holds route paths and translation keys only — no hardcoded display text.

```ts
// config/nav.ts
export const navigationItems = [
  { href: '/', key: 'home' },
  { href: '/guestbook', key: 'guestbook' },
  { href: '/profile', key: 'profile' },
] as const
```

The profile nav label becomes **"个人主页"** (zh) / **"Profile"** (en) — friendlier than "我的简历".

---

## 4. Redesign the Homepage as a Multi-Column Feed

**File:** `app/(main)/page.tsx`

Remove `Headline`, `Newsletter`, and `Resume`. Replace the two-column layout with a full-width `BlogPosts` grid. Increase the post limit since this is now the primary destination.

```tsx
import { BlogPosts } from '~/app/(main)/blog/BlogPosts'
import { Container } from '~/components/ui/Container'

export default function HomePage() {
  return (
    <Container className="mt-10 pb-8">
      <BlogPosts limit={40} />
    </Container>
  )
}

export const revalidate = 60
```

The `Headline` component (personal intro with typing animation) moves to the new `/profile` page.

---

## 5. Update the Post Grid to Multiple Columns

**File:** `app/(main)/blog/BlogPosts.tsx`

The current grid uses at most two columns (`lg:grid-cols-2`). Increase to three on desktop and keep the existing 16:9 card image ratio unchanged.

```tsx
// Before:
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

// After:
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
```

- Mobile: 1 column
- Tablet (sm): 2 columns
- Desktop (lg): 3 columns

The `BlogPostCard` component and its `aspect-[240/135]` image are untouched.

---

## 6. Create the Profile Page

**New file:** `app/(main)/profile/page.tsx`

This page replaces the aside on the old homepage. It holds the personal intro (`Headline`) and the resume (`Resume`).

```tsx
import { useTranslations } from 'next-intl'
import { Headline } from '~/app/(main)/Headline'
import { Resume } from '~/app/(main)/Resume'
import { Container } from '~/components/ui/Container'

export default function ProfilePage() {
  return (
    <Container className="mt-16 sm:mt-24">
      <div className="max-w-2xl">
        <Headline />
        <div className="mt-12">
          <Resume />
        </div>
      </div>
    </Container>
  )
}
```

Add a `title` to the page metadata using `getTranslations`:

```tsx
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('profile')
  return { title: t('title') }
}
```

---

## 7. Remove the Newsletter from the Homepage

The `Newsletter` component is currently imported in `page.tsx`. Once removed in step 4, it no longer appears on the homepage.

- **Keep it in the `Footer`** — `Footer.tsx` already contains a newsletter signup. No further action needed.
- **Delete it entirely** — delete `app/(main)/Newsletter.tsx` and remove it from `Footer.tsx`. Do not delete `db/schema.ts` subscriber tables or API routes unless the newsletter feature is fully decommissioned.

---

## 8. Handle the Retired `/blog` and `/projects` Routes

**Option A — Redirect (recommended):**

```js
// next.config.mjs — add to the redirects array
{ source: '/blog', destination: '/', permanent: true },
```

The `/projects` page can stay on disk since it has no inbound nav links.

**Option B — Delete the pages** if no external links point to them.

---

## 9. Summary of File Changes

| File | Change |
|---|---|
| `messages/zh.json` | **New file.** Chinese translation strings |
| `messages/en.json` | **New file.** English translation strings |
| `i18n/config.ts` | **New file.** Locale constants |
| `i18n/request.ts` | **New file.** `getRequestConfig` — reads `NEXT_LOCALE` cookie, falls back to `Accept-Language` |
| `next.config.mjs` | Wrap with `createNextIntlPlugin`; add `/blog → /` redirect |
| `proxy.ts` | Detect locale, set `NEXT_LOCALE` cookie on first visit; add `/profile` to public routes |
| `app/layout.tsx` | `async` — call `getLocale()`/`getMessages()`; wrap body with `NextIntlClientProvider`; dynamic `lang` and Clerk locale |
| `config/nav.ts` | 3 items with `key` instead of `text` |
| `app/(main)/NavigationBar.tsx` | Use `useTranslations('nav')` in Desktop and Mobile components |
| `app/(main)/Footer.tsx` | `Links` becomes an async server component using `getTranslations('nav')` |
| `app/(main)/page.tsx` | Remove Headline/Newsletter/Resume; render 3-column `<BlogPosts>` grid |
| `app/(main)/profile/page.tsx` | **New file.** Headline + Resume |
| `app/(main)/LocaleSwitcher.tsx` | **New file.** Language toggle button (中 ↔ EN) |
| `app/(main)/Header.tsx` | Add `<LocaleSwitcher />` next to `<ThemeSwitcher />` |

---

## 10. Implementation Order

All steps have been implemented.

1. `pnpm add next-intl`
2. Create `messages/zh.json`, `messages/en.json`, `i18n/config.ts`, `i18n/request.ts`
3. Update `next.config.mjs` — plugin + `/blog → /` redirect
4. Update `proxy.ts` — locale cookie on first visit; add `/profile` to public routes
5. Update `app/layout.tsx` — async, `NextIntlClientProvider`, dynamic `lang`/Clerk locale
6. Update `config/nav.ts` — 3 items with `key`
7. Update `NavigationBar.tsx` — `useTranslations('nav')`
8. Update `Footer.tsx` — async `Links` with `getTranslations('nav')`
9. Update `app/(main)/page.tsx` — 3-column `BlogPosts` feed
10. Create `app/(main)/profile/page.tsx`
11. Create `app/(main)/LocaleSwitcher.tsx`
12. Update `app/(main)/Header.tsx` — add `<LocaleSwitcher />`
