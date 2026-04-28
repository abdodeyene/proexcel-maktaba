import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  author: string;

  @Column('real')
  price: number;

  @Column('real', { nullable: true })
  compareAtPrice: number;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true, default: '#1a237e' })
  g1: string;

  @Column({ nullable: true, default: '#3949ab' })
  g2: string;

  @Column({ nullable: true, default: '📦' })
  emoji: string;

  @Column('integer', { default: 0 })
  stock: number;

  @Column('real', { default: 4.5 })
  rating: number;

  @Column('integer', { default: 0 })
  reviewCount: number;

  @Column('boolean', { default: false })
  isPromo: boolean;

  @Column('boolean', { default: false })
  isBestOffer: boolean;

  @Column('boolean', { default: false })
  isNew: boolean;

  @Column('text', { nullable: true })
  description: string;

  // JSON arrays stored as text
  @Column('simple-json', { nullable: true })
  variants: { label: string; price: number }[];

  @Column('simple-json', { nullable: true })
  media: { type: string; src: string }[];

  @Column('simple-json', { nullable: true })
  reviews: { name: string; rating: number; comment: string; date: string }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
