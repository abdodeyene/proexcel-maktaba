import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  findAll(query?: {
    search?: string;
    category?: string;
    isPromo?: boolean;
    isBestOffer?: boolean;
    isNew?: boolean;
    sort?: string;
  }): Promise<Product[]> {
    const where: FindOptionsWhere<Product> = {};
    if (query?.category) where.category = query.category;
    if (query?.isPromo !== undefined) where.isPromo = query.isPromo;
    if (query?.isBestOffer !== undefined) where.isBestOffer = query.isBestOffer;
    if (query?.isNew !== undefined) where.isNew = query.isNew;

    return this.repo.find({
      where,
      order: this.resolveOrder(query?.sort),
    });
  }

  private resolveOrder(sort?: string) {
    switch (sort) {
      case 'price-asc': return { price: 'ASC' as const };
      case 'price-desc': return { price: 'DESC' as const };
      case 'new': return { createdAt: 'DESC' as const };
      default: return { createdAt: 'DESC' as const };
    }
  }

  async findOne(id: number): Promise<Product> {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException(`Produit #${id} introuvable`);
    return p;
  }

  create(dto: CreateProductDto): Promise<Product> {
    const product = this.repo.create({
      ...dto,
      variants: dto.variants ?? [{ label: 'Standard', price: dto.price }],
      media: dto.media ?? [],
    });
    return this.repo.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.repo.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.repo.remove(product);
  }

  getLowStock(threshold = 8): Promise<Product[]> {
    return this.repo
      .createQueryBuilder('p')
      .where('p.stock <= :threshold', { threshold })
      .orderBy('p.stock', 'ASC')
      .getMany();
  }
}
