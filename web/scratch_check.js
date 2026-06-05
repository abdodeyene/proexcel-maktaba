const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const settings = await prisma.setting.findMany()
  console.log('--- SETTINGS ---')
  console.log(JSON.stringify(settings.filter(s => s.key.includes('address') || s.key.includes('hour') || s.key.includes('store') || s.key.includes('about')), null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
