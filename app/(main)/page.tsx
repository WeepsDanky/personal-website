import { BlogPosts } from '~/app/(main)/blog/BlogPosts'
import { Headline } from '~/app/(main)/Headline'
import { Container } from '~/components/ui/Container'

export default function HomePage() {
  return (
    <Container className="mt-10 pb-8">
      <Headline />
      <div className="mt-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Writing
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <BlogPosts limit={40} />
        </div>
      </div>
    </Container>
  )
}

export const revalidate = 60
