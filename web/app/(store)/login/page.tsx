import { prisma } from '@/lib/prisma'
import LoginClient from './LoginClient'

export const revalidate = 60 // optional revalidation

export default async function LoginPage() {
  const settings = await prisma.setting.findMany({
    where: { key: { in: ['login_bg_image', 'site_logo'] } }
  })
  
  const bgImage = settings.find(s => s.key === 'login_bg_image')?.value || ''
  const siteLogo = settings.find(s => s.key === 'site_logo')?.value || '/logo.png'

  return <LoginClient initialBgImage={bgImage} initialLogoSrc={siteLogo} />
}
