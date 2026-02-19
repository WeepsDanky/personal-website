import { fileURLToPath } from 'url'
import path from 'path'
import createNextIntlPlugin from 'next-intl/plugin'

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./env.mjs'))

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
      }
    ],
  },

  experimental: {
    taint: true,
  },

  redirects() {
    return [
      {
        "source": "/twitter",
        "destination": "https://x.com/marksun111",
        "permanent": true
      },
      {
        "source": "/x",
        "destination": "https://x.com/marksun111",
        "permanent": true
      },
      {
        "source": "/youtube",
        "destination": "https://youtube.com/@markpineaple",
        "permanent": true
      },
      {
        "source": "/tg",
        "destination": "https://t.me/weepsdanky",
        "permanent": true
      },
      {
        "source": "/linkedin",
        "destination": "https://www.linkedin.com/in/xiaoyisun-xs522/",
        "permanent": true
      },
      {
        "source": "/github",
        "destination": "https://github.com/WeepsDanky",
        "permanent": true
      },
      {
        "source": "/bilibili",
        "destination": "https://space.bilibili.com/351590373",
        "permanent": true
      },
      {
        "source": "/blog",
        "destination": "/",
        "permanent": true
      }
    ]
  },

  rewrites() {
    return [
      {
        source: '/feed',
        destination: '/feed.xml',
      },
      {
        source: '/rss',
        destination: '/feed.xml',
      },
      {
        source: '/rss.xml',
        destination: '/feed.xml',
      },
    ]
  },
}

export default withNextIntl(nextConfig)
