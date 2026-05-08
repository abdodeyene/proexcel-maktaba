import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrisma() {
  // Parse URL manually to avoid pg driver dropping the project-ref from the username
  // (postgres.PROJECT_REF gets incorrectly parsed to just "postgres")
  const rawUrl = process.env.DIRECT_URL || process.env.DATABASE_URL!
  const url = new URL(rawUrl)

  const pool = new Pool({
    host: url.hostname,
    port: Number(url.port) || 5432,
    database: url.pathname.replace(/^\//, ''),
    user: url.username,       // preserves full "postgres.nquytawxdoxxltwcwamy"
    password: url.password,   // URL() auto-decodes %40 → @
    ssl: { rejectUnauthorized: false },
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])
}

export const prisma = globalForPrisma.prisma || createPrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
