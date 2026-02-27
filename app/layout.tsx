import './globals.css'
import './clerk.css'
import './prism.css'

import { ClerkProvider } from '@clerk/nextjs'
import { zhCN } from '@clerk/localizations'
import { GoogleAnalytics } from '@next/third-parties/google'
import { type Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import Script from 'next/script'

import { ThemeProvider } from '~/app/(main)/ThemeProvider'
import { url } from '~/lib'
import { sansFont } from '~/lib/font'
import { seo } from '~/lib/seo'


export const metadata: Metadata = {
  metadataBase: seo.url,
  title: {
    template: '%s | 马克孙',
    default: seo.title,
  },
  description: seo.description,
  keywords: '马克孙,孙霄逸,物理,帝国理工,创始人,开发者',
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: {
      default: seo.title,
      template: '%s | 马克孙',
    },
    description: seo.description,
    siteName: '马克孙',
    locale: 'zh_CN',
    type: 'website',
    url: 'https://marksun.net',
  },
  twitter: {
    site: '@marksun111',
    creator: '@marksun111',
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  alternates: {
    canonical: url('/'),
    types: {
      'application/rss+xml': [{ url: 'rss', title: 'RSS 订阅' }],
    },
  },
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000212' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 0,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_TRACKING_ID = "G-YTGR38JKLX"
  const locale = await getLocale()
  const messages = await getMessages()
  const htmlLang = locale === 'zh' ? 'zh-CN' : 'en'

  return (
    <ClerkProvider
      localization={locale === 'zh' ? zhCN : undefined}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        layout: {
          socialButtonsPlacement: 'top',
          socialButtonsVariant: 'blockButton',
        },
      }}
    >
      <html
        lang={htmlLang}
        className={`${sansFont.variable} m-0 h-full p-0 font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <body className="flex h-full flex-col">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
        <GoogleAnalytics gaId="G-YTGR38JKLX" />
      </html>
    </ClerkProvider>
  )
}
