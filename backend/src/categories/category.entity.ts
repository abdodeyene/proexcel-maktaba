import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, default: '📚' })
  emoji: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  glow: string;

  @Column({ nullable: true })
  image: string;

  @Column('integer', { default: 0 })
  count: number;
}
