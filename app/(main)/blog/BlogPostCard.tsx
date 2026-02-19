import { parseDateTime } from '@zolplay/utils'
import Image from 'next/image'
import Link from 'next/link'

import { type Post } from '~/sanity/schemas/post'

export function BlogPostCard({ post }: { post: Post; views: number }) {
  const { title, slug, mainImage, publishedAt, categories } = post
  const { url, lqip, dimensions } = mainImage.asset

  return (
    <Link
      href={`/blog/${slug}`}
      prefetch={false}
      className="group mb-4 flex break-inside-avoid flex-col overflow-hidden rounded-2xl transform-gpu transition-transform hover:-translate-y-0.5"
    >
      <Image
        src={url}
        alt={title}
        width={dimensions?.width ?? 1200}
        height={dimensions?.height ?? 675}
        className="w-full h-auto"
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
        sizes="(max-width: 640px) 50vw, 33vw"
      />
      <div className="flex flex-col gap-0.5 bg-zinc-900 px-3 py-2.5">
        <h2 className="text-xs font-semibold leading-snug text-zinc-100 line-clamp-2">
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
