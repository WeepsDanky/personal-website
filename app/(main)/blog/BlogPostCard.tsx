import { parseDateTime } from '@zolplay/utils'
import Image from 'next/image'
import Link from 'next/link'

import { GeneratedCover } from '~/components/GeneratedCover'
import { type Post } from '~/sanity/schemas/post'

export function BlogPostCard({ post }: { post: Post; views: number }) {
  const { title, slug, mainImage, publishedAt, categories } = post
  const asset = mainImage?.asset

  return (
    <Link
      href={`/blog/${slug}`}
      prefetch={false}
      className="group flex flex-col overflow-hidden rounded-2xl transform-gpu transition-transform hover:-translate-y-0.5"
    >
      {asset?.url ? (
        <Image
          src={asset.url}
          alt={title}
          width={asset.dimensions?.width ?? 1200}
          height={asset.dimensions?.height ?? 630}
          className="w-full h-auto"
          placeholder={asset.lqip ? 'blur' : 'empty'}
          blurDataURL={asset.lqip}
          sizes="(max-width: 640px) 50vw, 33vw"
        />
      ) : (
        <GeneratedCover title={title} className="w-full" />
      )}
      <div className="flex flex-col gap-0.5 bg-zinc-100 px-3 py-2.5 dark:bg-zinc-900">
        <h2 className="text-xs font-semibold leading-snug text-zinc-800 line-clamp-2 dark:text-zinc-100">
          {title}
        </h2>
        <span className="text-[10px] text-zinc-500">
          {Array.isArray(categories) && categories.length > 0
            ? categories.join(' · ')
            : parseDateTime({ date: new Date(publishedAt) })?.format(
                'YYYY/MM/DD'
              )}
        </span>
      </div>
    </Link>
  )
}
