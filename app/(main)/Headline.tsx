'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Balancer from 'react-wrap-balancer'

import { SocialLink } from '~/components/links/SocialLink'

export function Headline() {
  const t = useTranslations('headline')

  return (
    <div className="max-w-2xl">
      <motion.h1
        className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 100,
          duration: 0.3,
        }}
      >
        {t('title')}
      </motion.h1>
      <motion.p
        className="mt-6 text-base text-zinc-600 dark:text-zinc-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 85,
          duration: 0.3,
          delay: 0.1,
        }}
      >
        <Balancer>
          {t('description')}
        </Balancer>
      </motion.p>
      <motion.div
        className="mt-6 flex gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 50,
          stiffness: 90,
          duration: 0.35,
          delay: 0.25,
        }}
      >
        <SocialLink
          href="https://marksun.net/twitter"
          aria-label="Twitter"
          platform="twitter"
        />
        <SocialLink
          href="https://marksun.net/bilibili"
          aria-label="Bilibili"
          platform="bilibili"
        />
        <SocialLink
          href="https://marksun.net/github"
          aria-label="GitHub"
          platform="github"
        />
        <SocialLink
          href="https://marksun.net/tg"
          aria-label="Telegram"
          platform="telegram"
        />
        <SocialLink
          href="https://www.xiaohongshu.com/user/profile/62b84b350000000019022dc5"
          aria-label="小红书"
          platform="xiaohongshu"
        />
        <SocialLink
          href="mailto:sxy.hj156@gmail.com"
          aria-label="Email"
          platform="mail"
        />
      </motion.div>
    </div>
  )
}
