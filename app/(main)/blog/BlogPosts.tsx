import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import { redis } from '~/lib/redis'
import { getLatestBlogPosts } from '~/sanity/queries'

import { BlogPostCard } from './BlogPostCard'

function splitIntoColumns<T>(items: T[], numCols: number): T[][] {
  return Array.from({ length: numCols }, (_, col) =>
    items.filter((_, idx) => idx % numCols === col)
  )
}

export async function BlogPosts({ limit = 5 }) {
  const posts = await getLatestBlogPosts({ limit, forDisplay: true }) || []
  const postIdKeys = posts.map(({ _id }) => kvKeys.postViews(_id))

  let views: number[] = []
  if (env.VERCEL_ENV === 'development') {
    views = posts.map(() => Math.floor(Math.random() * 1000))
  } else {
    if (postIdKeys.length > 0) {
      views = await redis.mget<number[]>(...postIdKeys)
    }
  }

  const viewMap = new Map(posts.map((post, idx) => [post._id, views[idx] ?? 0]))

  const cols2 = splitIntoColumns(posts, 2)
  const cols3 = splitIntoColumns(posts, 3)

  const renderColumns = (cols: typeof posts[]) => (
    cols.map((col, colIdx) => (
      <div key={colIdx} className="flex flex-1 flex-col gap-4">
        {col.map((post) => (
          <BlogPostCard post={post} views={viewMap.get(post._id) ?? 0} key={post._id} />
        ))}
      </div>
    ))
  )

  return (
    <>
      <div className="flex gap-4 sm:hidden">
        {renderColumns(cols2)}
      </div>
      <div className="hidden sm:flex gap-4">
        {renderColumns(cols3)}
      </div>
    </>
  )
}
