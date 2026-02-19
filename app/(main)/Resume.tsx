import Image, { type StaticImageData } from 'next/image'
import { getTranslations } from 'next-intl/server'

import { BriefcaseIcon } from '~/assets'
import DifyLogo from '~/assets/company/dify-logo.png'
import MiraclePlusLogo from '~/assets/company/MiraclePlusLogo.jpg'
import ImperialLogo from '~/assets/company/Shield_of_Imperial_College_London.svg'

const logos: Record<string, StaticImageData> = {
  imperial: ImperialLogo,
  miracleplus: MiraclePlusLogo,
  dify: DifyLogo,
}

const entryKeys = ['imperial', 'miracleplus', 'dify'] as const

export async function Resume() {
  const t = await getTranslations('resume')

  const entries = entryKeys.map((key) => ({
    key,
    logo: logos[key],
    company: t(`entries.${key}.company` as any),
    title: t(`entries.${key}.title` as any),
    start: t(`entries.${key}.start` as any),
    end: t(`entries.${key}.end` as any),
  }))

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="h-5 w-5 flex-none" />
        <span className="ml-2">{t('heading')}</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {entries.map(({ key, logo, company, title, start, end }) => (
          <li key={key} className="flex gap-4">
            <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
              <Image
                src={logo}
                alt={company}
                className="h-8 w-8 rounded-full"
                unoptimized
              />
            </div>
            <dl className="flex flex-auto flex-wrap gap-x-2">
              <dt className="sr-only">{t('srCompany')}</dt>
              <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {company}
              </dd>
              <dt className="sr-only">{t('srRole')}</dt>
              <dd className="text-xs text-zinc-500 dark:text-zinc-400">
                {title}
              </dd>
              <dt className="sr-only">{t('srDate')}</dt>
              <dd
                className="ml-auto text-xs text-zinc-500/80 dark:text-zinc-400/80"
                aria-label={`${start} ${t('dateTo')} ${end}`}
              >
                <time>{start}</time>
                {' '}
                <span aria-hidden="true">—</span>
                {' '}
                <time>{end}</time>
              </dd>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  )
}
