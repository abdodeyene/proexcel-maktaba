import { prisma } from '@/lib/prisma'
import LoginClient from './LoginClient'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  let bgImage = ''
  let siteLogo = '/logo.png'

  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ['login_bg_image', 'site_logo'] } }
    })
    bgImage = settings.find((s: { key: string; value: string | null }) => s.key === 'login_bg_image')?.value ?? ''
    siteLogo = settings.find((s: { key: string; value: string | null }) => s.key === 'site_logo')?.value ?? '/logo.png'
  } catch {
    // DB not reachable — use defaults
  }

  return <LoginClient initialBgImage={bgImage} initialLogoSrc={siteLogo} />
}

