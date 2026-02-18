import { eq } from 'drizzle-orm'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

import { Container } from '~/components/ui/Container'
import { db } from '~/db'
import { newsletters } from '~/db/schema'

async function getNewsletter(id: string) {
  const [newsletter] = await db
    .select()
    .from(newsletters)
    .where(eq(newsletters.id, parseInt(id)))

  if (!newsletter || !newsletter.body) {
    notFound()
  }

  return newsletter
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const newsletter = await getNewsletter(id)

  const imageUrlRegex = /!\[[^\]]*\]\((.*?)\)/
  const match = newsletter.body?.match(imageUrlRegex)
  let imageUrl: string | undefined = undefined

  if (match) {
    imageUrl = match[1]
  }

  return {
    title: newsletter.subject,
    description: newsletter.subject,
    openGraph: {
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      title: newsletter.subject ?? '',
      description: newsletter.subject ?? '',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: newsletter.subject ?? '',
      description: newsletter.subject ?? '',
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      site: '@marksun111',
      creator: '@marksun111',
    },
  } satisfies Metadata
}

export default async function NewsletterRenderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const newsletter = await getNewsletter(id)

  if (!newsletter.body) {
    return null
  }

  return (
    <Container className="mt-16">
      <article className="prose mx-auto max-w-[500px] dark:prose-invert">
        <ReactMarkdown>{newsletter.body}</ReactMarkdown>
      </article>
    </Container>
  )
}

export const revalidate = 3600
