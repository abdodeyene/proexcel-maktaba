import { defineConfig, env } from 'prisma/config'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

// Prisma CLI doesn't auto-load .env files (unlike Next.js runtime).
// Load it manually so env() can resolve vars during prisma generate/db push/etc.
function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx < 0) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    // Production / CI env vars take precedence over .env file
    if (key && !process.env[key]) process.env[key] = val
  }
}

loadEnvFile()

// NOTE: Prisma 7 defineConfig does not support directUrl.
// We use DIRECT_URL (port 5432, bypasses PgBouncer) so that schema CLI
// commands (db push, migrate) can run DDL statements which PgBouncer blocks.
// The app runtime uses DATABASE_URL (pooler) via lib/prisma.ts — unaffected.
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_URL'),
  },
})
