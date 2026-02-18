import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { get } from '@vercel/edge-config'
import { type NextRequest, NextResponse } from 'next/server'

import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import countries from '~/lib/countries.json'
import { getIP } from '~/lib/ip'
import { redis } from '~/lib/redis'

export const config = {
  matcher: ['/((?!_next|studio|.*\\..*).*)'],
}

const isPublicRoute = createRouteMatcher([
  '/',
  '/studio(.*)',
  '/api(.*)',
  '/blog(.*)',
  '/confirm(.*)',
  '/projects',
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
})
