import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { get } from '@vercel/edge-config'
import { type NextRequest, NextResponse } from 'next/server'

import { defaultLocale, locales, type Locale } from '~/i18n/config'

function getLocaleFromRequest(req: NextRequest): Locale {
  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value as
    | Locale
    | undefined
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }
  const acceptLanguage = req.headers.get('accept-language') ?? ''
  const preferred = acceptLanguage
    .split(',')[0]
    ?.split('-')[0]
    ?.toLowerCase() as Locale | undefined
  if (preferred && locales.includes(preferred)) {
    return preferred
  }
  return defaultLocale
}

import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import countries from '~/lib/countries.json'
import { getIP } from '~/lib/ip'
import { redis } from '~/lib/redis'

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

const isPublicRoute = createRouteMatcher([
  '/',
  '/studio(.*)',
  '/api(.*)',
  '/blog(.*)',
  '/confirm(.*)',
  '/projects',
  '/profile',
  '/guestbook',
  '/newsletters(.*)',
  '/about',
  '/rss',
  '/feed',
  '/ama',
  '/daynight-sounds',
  '/daynight-sounds/privacy-policy',
  '/91',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { nextUrl } = req
  const isApi = nextUrl.pathname.startsWith('/api/')

  if (process.env.EDGE_CONFIG) {
    const blockedIPs = await get<string[]>('blocked_ips')
    const ip = getIP(req)

    if (blockedIPs?.includes(ip)) {
      if (isApi) {
        return NextResponse.json(
          { error: 'You have been blocked.' },
          { status: 403 }
        )
      }

      nextUrl.pathname = '/blocked'
      return NextResponse.rewrite(nextUrl)
    }

    if (nextUrl.pathname === '/blocked') {
      nextUrl.pathname = '/'
      return NextResponse.redirect(nextUrl)
    }
  }

  const geoCountry = req.headers.get('x-vercel-ip-country')
  const geoCity = req.headers.get('x-vercel-ip-city')

  if (geoCountry && !isApi && env.VERCEL_ENV === 'production') {
    const countryInfo = countries.find((x) => x.cca2 === geoCountry)
    if (countryInfo) {
      const flag = countryInfo.flag
      await redis.set(kvKeys.currentVisitor, {
        country: geoCountry,
        city: geoCity,
        flag,
      })
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  // Persist detected locale in cookie so server components can read it
  const locale = getLocaleFromRequest(req)
  const response = NextResponse.next()
  if (!req.cookies.get('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }
  return response
}, {
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
})
