import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private repo: Repository<Order>) {}

  findAll(query?: {
    status?: OrderStatus;
    search?: string;
    city?: string;
    sort?: string;
  }): Promise<Order[]> {
    let qb = this.repo.createQueryBuilder('o');
    if (query?.status) qb = qb.where('o.status = :status', { status: query.status });
    if (query?.city) qb = qb.andWhere('o.city = :city', { city: query.city });
    if (query?.search) {
      qb = qb.andWhere(
        '(o.name LIKE :q OR o.orderNum LIKE :q OR o.city LIKE :q)',
        { q: `%${query.search}%` },
      );
    }
    switch (query?.sort) {
      case 'date-asc': qb = qb.orderBy('o.date', 'ASC'); break;
      case 'amount-desc': qb = qb.orderBy('o.total', 'DESC'); break;
      case 'amount-asc': qb = qb.orderBy('o.total', 'ASC'); break;
      default: qb = qb.orderBy('o.date', 'DESC');
    }
    return qb.getMany();
  }

  async findOne(id: number): Promise<Order> {
    const o = await this.repo.findOne({ where: { id } });
    if (!o) throw new NotFoundException(`Commande #${id} introuvable`);
    return o;
  }

  async findByOrderNum(orderNum: string): Promise<Order> {
    const o = await this.repo.findOne({ where: { orderNum } });
    if (!o) throw new NotFoundException(`Commande ${orderNum} introuvable`);
    return o;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const orderNum = 'PE' + Date.now().toString().slice(-6);
    const order = this.repo.create({ ...dto, orderNum, status: 'pending' });
    return this.repo.save(order);
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.repo.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.repo.remove(order);
  }

  async removeByOrderNum(orderNum: string): Promise<void> {
    const order = await this.findByOrderNum(orderNum);
    await this.repo.remove(order);
  }

  async getStats() {
    const all = await this.repo.find();
    const revenue = all
      .filter(o => o.status !== 'cancelled')
      .reduce((s, o) => s + o.total, 0);
    const uniqueClients = new Set(all.map(o => o.phone)).size;
    const statusCounts = {
      pending: all.filter(o => o.status === 'pending').length,
      processing: all.filter(o => o.status === 'processing').length,
      shipped: all.filter(o => o.status === 'shipped').length,
      completed: all.filter(o => o.status === 'completed').length,
      cancelled: all.filter(o => o.status === 'cancelled').length,
    };
    return { total: all.length, revenue, uniqueClients, statusCounts };
  }
}
