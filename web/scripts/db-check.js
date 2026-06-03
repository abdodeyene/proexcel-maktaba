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
    console.log('--- Checking HeroSlide Table ---');
    const heroSlides = await prisma.heroSlide.findMany();
    for (const slide of heroSlides) {
      console.log(`Slide ${slide.id}: "${slide.title}" / "${slide.subtitle}" / "${slide.subtitleAr}"`);
      if (
        (slide.subtitle && slide.subtitle.includes('599')) ||
        (slide.subtitleAr && slide.subtitleAr.includes('599')) ||
        (slide.title && slide.title.includes('599')) ||
        (slide.titleAr && slide.titleAr.includes('599'))
      ) {
        console.log(`FOUND 599 in Slide ${slide.id}!`);
      }
    }

    console.log('--- Checking Settings ---');
    const settings = await prisma.setting.findMany();
    for (const s of settings) {
      if (s.value && s.value.includes('599')) {
        console.log(`FOUND 599 in setting ${s.key}: "${s.value}"`);
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
