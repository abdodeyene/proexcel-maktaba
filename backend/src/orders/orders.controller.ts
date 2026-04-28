import {
  Body, Controller, Delete, Get, Param, ParseIntPipe,
  Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderStatus } from './order.entity';

@Controller('api/orders')
export class OrdersController {
  constructor(private service: OrdersService) {}

  // Admin only – list all orders
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('search') search?: string,
    @Query('city') city?: string,
    @Query('sort') sort?: string,
  ) {
    return this.service.findAll({ status, search, city, sort });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  stats() {
    return this.service.getStats();
  }

  @Get('by-num/:orderNum')
  @UseGuards(JwtAuthGuard)
  findByNum(@Param('orderNum') orderNum: string) {
    return this.service.findByOrderNum(orderNum);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // Public – checkout places order
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.service.create(dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus,
  ) {
    return this.service.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
