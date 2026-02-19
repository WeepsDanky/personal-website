import { getTranslations } from 'next-intl/server'

import { Headline } from '~/app/(main)/Headline'
import { Resume } from '~/app/(main)/Resume'
import { Container } from '~/components/ui/Container'

export async function generateMetadata() {
  const t = await getTranslations('profile')
  return { title: t('title') }
}

export default function ProfilePage() {
  return (
    <Container className="mt-16 sm:mt-24">
      <div className="max-w-2xl">
        <Headline />
        <div className="mt-12">
          <Resume />
        </div>
      </div>
    </Container>
  )
}
