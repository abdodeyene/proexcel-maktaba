require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  const hash = await bcrypt.hash('proexcel2026@@', 10)
  const user = await prisma.user.upsert({
    where: { email: 'proexcel2026@gmail.com' },
    update: { password: hash },
    create: { email: 'proexcel2026@gmail.com', password: hash, role: 'admin' }
  })
  console.log('✅ Admin password reset for:', user.email)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
