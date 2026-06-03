const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const parts = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (parts) {
      const key = parts[1];
      let value = parts[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

async function main() {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || '';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const levels = await prisma.product.findMany({
      select: { niveau: true },
      distinct: ['niveau']
    });
    console.log('--- Unique Niveaux ---');
    console.log(levels.map(l => l.niveau));
  } catch (err) {
    console.error('Error running script:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
