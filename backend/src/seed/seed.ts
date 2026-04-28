import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });

import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Category } from '../categories/category.entity';
import { Setting } from '../settings/setting.entity';
import { Order } from '../orders/order.entity';

const ds = new DataSource({
  type: 'better-sqlite3',
  database: process.env.DB_PATH || './proexcel.sqlite',
  entities: [User, Product, Category, Order, Setting],
  synchronize: true,
});

async function seed() {
  await ds.initialize();

  // ── Admin user ──────────────────────────────────────────────────────────────
  const userRepo = ds.getRepository(User);
  const email = process.env.ADMIN_EMAIL || 'proexcel2026@gmail.com';
  let admin = await userRepo.findOne({ where: { email } });
  if (!admin) {
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'proexcel2026@@', 10);
    admin = userRepo.create({ email, password, role: 'admin' });
    await userRepo.save(admin);
    console.log('✅ Admin user created:', email);
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // ── Categories ───────────────────────────────────────────────────────────────
  const catRepo = ds.getRepository(Category);
  const cats = [
    { name: 'Scolaire', emoji: '📚', color: '#6c63ff', glow: 'rgba(108,99,255,0.35)' },
    { name: 'Islamique', emoji: '🕌', color: '#f59e0b', glow: 'rgba(245,158,11,0.35)' },
    { name: 'Roman', emoji: '📖', color: '#10b981', glow: 'rgba(16,185,129,0.35)' },
    { name: 'Sciences', emoji: '🔬', color: '#3b82f6', glow: 'rgba(59,130,246,0.35)' },
    { name: 'Enfants', emoji: '🎨', color: '#ec4899', glow: 'rgba(236,72,153,0.35)' },
    { name: 'Histoire', emoji: '🏛️', color: '#8b5cf6', glow: 'rgba(139,92,246,0.35)' },
  ];
  for (const c of cats) {
    const exists = await catRepo.findOne({ where: { name: c.name } });
    if (!exists) {
      await catRepo.save(catRepo.create(c));
      console.log('✅ Category:', c.name);
    }
  }

  // ── Products ─────────────────────────────────────────────────────────────────
  const prodRepo = ds.getRepository(Product);
  const count = await prodRepo.count();
  if (count === 0) {
    const products = [
      {
        title: 'Mathématiques 3ème Année Collège',
        description: 'Manuel complet de mathématiques pour la 3ème année collège conforme au programme marocain.',
        category: 'Scolaire',
        price: 45,
        compareAtPrice: 55,
        stock: 50,
        badge: 'Bestseller',
        rating: 4.8,
        reviewCount: 124,
        variants: [{ label: 'Arabe', price: 45 }, { label: 'Français', price: 45 }],
        media: [],
        reviews: [],
      },
      {
        title: 'Le Saint Coran — Tajwid Couleur',
        description: 'Mushaf avec règles du tajwid colorées pour faciliter la mémorisation et la récitation.',
        category: 'Islamique',
        price: 85,
        compareAtPrice: 100,
        stock: 30,
        badge: 'Nouveau',
        rating: 5.0,
        reviewCount: 89,
        variants: [{ label: 'Grand format', price: 85 }, { label: 'Poche', price: 60 }],
        media: [],
        reviews: [],
      },
      {
        title: 'Atlas du Monde — Édition 2025',
        description: 'Atlas géographique complet avec cartes détaillées de tous les pays du monde.',
        category: 'Sciences',
        price: 120,
        compareAtPrice: 150,
        stock: 15,
        badge: 'Nouveau',
        rating: 4.6,
        reviewCount: 42,
        variants: [{ label: 'Relié', price: 120 }, { label: 'Broché', price: 95 }],
        media: [],
        reviews: [],
      },
      {
        title: 'Contes des 1001 Nuits — Enfants',
        description: 'Recueil illustré des contes des Mille et Une Nuits adapté aux enfants de 6 à 12 ans.',
        category: 'Enfants',
        price: 65,
        compareAtPrice: 75,
        stock: 25,
        badge: '',
        rating: 4.9,
        reviewCount: 63,
        variants: [{ label: 'Arabe', price: 65 }, { label: 'Français', price: 65 }],
        media: [],
        reviews: [],
      },
      {
        title: 'Histoire du Maroc — Ibn Khaldoun',
        description: 'Ouvrage de référence sur l\'histoire du Maroc à travers les siècles.',
        category: 'Histoire',
        price: 95,
        compareAtPrice: 0,
        stock: 8,
        badge: 'Stock limité',
        rating: 4.7,
        reviewCount: 38,
        variants: [{ label: 'Arabe', price: 95 }],
        media: [],
        reviews: [],
      },
      {
        title: 'Roman Phare — Naguib Mahfouz',
        description: 'L\'un des romans les plus célèbres du Prix Nobel de littérature arabe.',
        category: 'Roman',
        price: 55,
        compareAtPrice: 65,
        stock: 20,
        badge: '',
        rating: 4.5,
        reviewCount: 91,
        variants: [{ label: 'Arabe', price: 55 }, { label: 'Français', price: 60 }],
        media: [],
        reviews: [],
      },
    ];
    for (const p of products) {
      await prodRepo.save(prodRepo.create(p));
    }
    console.log(`✅ ${products.length} products seeded`);
  } else {
    console.log(`ℹ️  Products already exist (${count})`);
  }

  // ── Default settings ──────────────────────────────────────────────────────────
  const settingRepo = ds.getRepository(Setting);
  const defaults: Record<string, string> = {
    storeName: 'ProExcel Maktaba',
    storePhone: '+212 600-000000',
    storeEmail: 'contact@proexcel.ma',
    storeAddress: 'Casablanca, Maroc',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    whatsapp: '+212600000000',
    sliders: JSON.stringify([]),
    logoUrl: '',
    currency: 'MAD',
    deliveryFee: '30',
    freeDeliveryAbove: '200',
  };
  for (const [key, value] of Object.entries(defaults)) {
    const exists = await settingRepo.findOne({ where: { key } });
    if (!exists) {
      await settingRepo.save(settingRepo.create({ key, value }));
    }
  }
  console.log('✅ Default settings applied');

  await ds.destroy();
  console.log('\n🎉 Seed complete!');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
