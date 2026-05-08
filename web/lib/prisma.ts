import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

function makeClient() {
  // DIRECT_URL uses port 5432 (no pgbouncer) — avoids username-stripping issues
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL!
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 1,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || makeClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
