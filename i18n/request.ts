import { cookies, headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

import { defaultLocale, locales, type Locale } from './config'

async function detectLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as
    | Locale
    | undefined
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  const headerStore = await headers()
  const acceptLanguage = headerStore.get('accept-language') ?? ''
  const preferred = acceptLanguage
    .split(',')[0]
    ?.split('-')[0]
    ?.toLowerCase() as Locale | undefined

  if (preferred && locales.includes(preferred)) {
    return preferred
  }

  return defaultLocale
}

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale holds the [locale] URL segment value when using i18n routing.
  // Since we keep clean URLs (no /en/ prefix), it resolves to undefined and we
  // fall back to cookie / Accept-Language detection instead.
  let locale = (await requestLocale) as Locale | undefined

  if (!locale || !locales.includes(locale)) {
    locale = await detectLocale()
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
