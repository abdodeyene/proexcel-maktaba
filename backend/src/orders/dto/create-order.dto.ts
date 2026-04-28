import { IsString, IsNumber, IsArray, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
  @IsString()
  key: string;

  @IsNumber()
  productId: number;

  @IsString()
  title: string;

  @IsString()
  variant: string;

  @IsNumber()
  @Min(1)
  qty: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  total: number;

  @IsArray()
  cart: CartItemDto[];
}
