import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderNum: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column('real')
  total: number;

  @Column({ default: 'pending' })
  status: OrderStatus;

  @Column('simple-json')
  cart: {
    key: string;
    productId: number;
    title: string;
    variant: string;
    qty: number;
    price: number;
  }[];

  @CreateDateColumn()
  date: Date;
}
