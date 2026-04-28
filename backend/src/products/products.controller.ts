import {
  Body, Controller, Delete, Get, Param, ParseIntPipe,
  Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  // Public – boutique
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('isPromo') isPromo?: string,
    @Query('isBestOffer') isBestOffer?: string,
    @Query('isNew') isNew?: string,
    @Query('sort') sort?: string,
  ) {
    return this.service.findAll({
      search,
      category,
      isPromo: isPromo === 'true' ? true : undefined,
      isBestOffer: isBestOffer === 'true' ? true : undefined,
      isNew: isNew === 'true' ? true : undefined,
      sort,
    });
  }

  @Get('low-stock')
  @UseGuards(JwtAuthGuard)
  lowStock(@Query('threshold') threshold?: string) {
    return this.service.getLowStock(threshold ? parseInt(threshold) : 8);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // Admin only
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
