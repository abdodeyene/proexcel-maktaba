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
    console.log('--- Checking Categories for "CARTALBES" ---');
    const categories = await prisma.category.findMany();
    for (const c of categories) {
      if (c.name.toUpperCase().includes('CARTALBES')) {
        console.log(`FOUND category: ${c.name}`);
        const newName = c.name.replace(/CARTALBES/gi, 'CARTABLES');
        console.log(`Updating category from "${c.name}" to "${newName}"`);
        await prisma.category.update({
          where: { id: c.id },
          data: { name: newName }
        });
      }
    }

    console.log('--- Checking Products for "CARTALBES" ---');
    const products = await prisma.product.findMany();
    for (const p of products) {
      if (p.category && p.category.toUpperCase().includes('CARTALBES')) {
        console.log(`FOUND product category in Product ${p.id}: "${p.title}" (category: "${p.category}")`);
        const newCat = p.category.replace(/CARTALBES/gi, 'CARTABLES');
        console.log(`Updating product category to "${newCat}"`);
        await prisma.product.update({
          where: { id: p.id },
          data: { category: newCat }
        });
      }
    }
  } catch (err) {
    console.error('Error running script:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
