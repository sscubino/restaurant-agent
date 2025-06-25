import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { OrderType } from '../entities/order.entity';
import { CreateOrderDetailDto } from './create-order-detail.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The type of the order',
    example: OrderType.DINE_IN,
    enum: OrderType,
  })
  @IsNotEmpty()
  @IsEnum(OrderType)
  type: OrderType;

  @ApiProperty({
    description: 'Array of order details (items)',
    type: [CreateOrderDetailDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  @IsOptional()
  orderDetails: CreateOrderDetailDto[];

  @ApiPropertyOptional({
    description: 'Delivery address (required for delivery orders)',
    example: '123 Main St, City, State 12345',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({
    description: 'Table identifier (for dine-in orders)',
    example: 'Table 5',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  table?: string;

  @ApiPropertyOptional({
    description: 'Reservation date and time (for dine-in orders)',
    example: '2024-03-15T18:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
