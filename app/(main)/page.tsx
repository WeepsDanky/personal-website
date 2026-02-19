import { BlogPosts } from '~/app/(main)/blog/BlogPosts'
import { Container } from '~/components/ui/Container'

export default function HomePage() {
  return (
    <Container className="mt-10 pb-8">
      <div className="columns-2 gap-4 sm:columns-3">
        <BlogPosts limit={40} />
      </div>
    </Container>
  )
}

export const revalidate = 60
