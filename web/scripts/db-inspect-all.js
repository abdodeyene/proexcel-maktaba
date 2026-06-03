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
    const count = await prisma.product.count();
    console.log(`Total Products: ${count}`);

    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: true
    });
    console.log('Categories:', categories);

    const levels = await prisma.product.groupBy({
      by: ['niveau'],
      _count: true
    });
    console.log('Niveaux:', levels);

    const subjects = await prisma.product.groupBy({
      by: ['subject'],
      _count: true
    });
    console.log('Subjects:', subjects);

  } catch (err) {
    console.error('Error running script:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
