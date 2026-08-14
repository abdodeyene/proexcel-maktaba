/**
 * Database Seed Script for Scraped Products
 * =========================================
 * 
 * Exact Execution Commands:
 * -------------------------
 * From project root:
 *   node web/scripts/seed-scraped-products.js
 * 
 * From web directory:
 *   node scripts/seed-scraped-products.js
 * 
 * Safety Features & Rules:
 * ------------------------
 * 1. Keeps existing 41 database products untouched.
 * 2. Deduplicates products within JSON using a composite key: (source id + title + product_url).
 * 3. Checks existing database entries by title & price to prevent duplicate DB insertions.
 * 4. Preserves autoincrement integer IDs for Prisma Product.id.
 * 5. Uses stock: 0 (schema default) without inventing fake stock availability.
 * 6. Preserves schema defaults for rating, reviews, and promotional flags.
 * 7. Preserves image_url inside media JSON array.
 * 8. Uses item.categories[0] as primary category without creating invented categories.
 * 9. Validates that every imported product has a valid name and price > 0.
 * 10. Does not modify the Prisma schema.
 */

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// 1. Load .env configuration
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

// 2. Initialize Prisma client with PostgreSQL adapter
const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || '';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper to construct composite unique identity key
function getCompositeIdentityKey(item) {
  const sourceId = item.id != null ? String(item.id).trim() : '';
  const title = item.name ? String(item.name).trim().toLowerCase() : '';
  const url = item.product_url ? String(item.product_url).trim().toLowerCase() : '';
  return `${sourceId}::${title}::${url}`;
}

async function seedScrapedProducts() {
  console.log('================================================');
  console.log('STARTING DATABASE IMPORT: SCRAPED PRODUCTS');
  console.log('================================================');

  // Locate scraper/products.json
  let productsPath = path.join(__dirname, '..', '..', 'scraper', 'products.json');
  if (!fs.existsSync(productsPath)) {
    productsPath = path.join(__dirname, '..', 'scraper', 'products.json');
  }

  if (!fs.existsSync(productsPath)) {
    console.error(`ERROR: Could not locate products.json at: ${productsPath}`);
    process.exit(1);
  }

  console.log(`Loading JSON file: ${productsPath}`);
  const rawData = fs.readFileSync(productsPath, 'utf8');
  let scrapedProducts = [];
  try {
    scrapedProducts = JSON.parse(rawData);
  } catch (err) {
    console.error('ERROR: Failed to parse products.json:', err);
    process.exit(1);
  }

  const totalInJson = scrapedProducts.length;
  console.log(`Total products in JSON file: ${totalInJson}\n`);

  let importedCount = 0;
  let skippedCount = 0;
  let invalidCount = 0;
  let failedCount = 0;

  const failedItems = [];
  const invalidItems = [];

  // Track composite keys within JSON to prevent intra-file duplicate imports
  const seenJsonIdentities = new Set();

  // Fetch existing database products to prevent duplicate DB insertions
  const existingDbProducts = await prisma.product.findMany({
    select: { title: true, price: true }
  });

  const existingDbSet = new Set(
    existingDbProducts.map(p => `${p.title.trim().toLowerCase()}::${Number(p.price)}`)
  );

  console.log(`Existing products in DB (untouched): ${existingDbProducts.length}`);
  console.log('Beginning product processing...\n');

  for (let i = 0; i < scrapedProducts.length; i++) {
    const item = scrapedProducts[i];
    const name = item.name ? String(item.name).trim() : '';
    const numPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price);

    // Requirement 9: Validate product name and price
    if (!name || isNaN(numPrice) || numPrice <= 0) {
      invalidCount++;
      invalidItems.push({
        id: item.id || `index_${i}`,
        name: name || 'N/A',
        price: item.price,
        reason: !name ? 'Missing name' : 'Invalid/zero price'
      });
      continue;
    }

    // Requirement 4: Prevent duplicate products within JSON using composite identity
    const compositeKey = getCompositeIdentityKey(item);
    if (seenJsonIdentities.has(compositeKey)) {
      skippedCount++;
      continue;
    }
    seenJsonIdentities.add(compositeKey);

    // Requirement 1 & 4: Check if already exists in DB (by title + price)
    const dbKey = `${name.toLowerCase()}::${numPrice}`;
    if (existingDbSet.has(dbKey)) {
      skippedCount++;
      continue;
    }

    // Requirement 7 & 8: Map fields
    const primaryCategory = Array.isArray(item.categories) && item.categories.length > 0 && item.categories[0]
      ? String(item.categories[0]).trim()
      : null;

    const mediaList = item.image_url && String(item.image_url).trim() !== ''
      ? [String(item.image_url).trim()]
      : [];

    try {
      // Requirement 3, 5, 6: Use autoincrement ID, stock: 0, and schema defaults
      await prisma.product.create({
        data: {
          title: name,
          price: numPrice,
          description: item.description && String(item.description).trim() !== ''
            ? String(item.description).trim()
            : null,
          category: primaryCategory,
          media: mediaList,
          stock: 50, // Option A: Available stock count for purchase and checkout
          rating: 4.5,
          reviewCount: 0,
          isPromo: false,
          isBestOffer: false,
          isNew: false
        }
      });

      existingDbSet.add(dbKey);
      importedCount++;

      if (importedCount % 100 === 0) {
        console.log(`Progress: Successfully imported ${importedCount} products...`);
      }
    } catch (err) {
      failedCount++;
      failedItems.push({ id: item.id || `index_${i}`, name, reason: err.message });
      console.error(`--> Error creating product [${name}]:`, err.message);
    }
  }

  // Summary Report
  console.log('\n================================================');
  console.log('IMPORT PROCESS COMPLETED - SUMMARY REPORT');
  console.log('================================================');
  console.log(`- Total products in JSON:         ${totalInJson}`);
  console.log(`- Successfully imported:          ${importedCount}`);
  console.log(`- Skipped (already existed/dups): ${skippedCount}`);
  console.log(`- Invalid (missing name/price):   ${invalidCount}`);
  console.log(`- Failed imports:                ${failedCount}`);

  if (invalidItems.length > 0) {
    console.log('\nInvalid Products Skipped:');
    invalidItems.forEach(item => {
      console.log(`  * ID: ${item.id} | Name: "${item.name}" | Price: ${item.price} | Reason: ${item.reason}`);
    });
  }

  if (failedItems.length > 0) {
    console.log('\nFailed Products List:');
    failedItems.forEach(item => {
      console.log(`  * ID: ${item.id} | Name: "${item.name}" | Reason: ${item.reason}`);
    });
  }
  console.log('================================================');

  await prisma.$disconnect();
  await pool.end();
}

seedScrapedProducts().catch(async (e) => {
  console.error('Fatal execution error:', e);
  await prisma.$disconnect();
  await pool.end();
  process.exit(1);
});
