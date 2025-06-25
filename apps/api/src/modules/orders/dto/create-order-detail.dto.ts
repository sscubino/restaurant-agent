import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateOrderDetailDto {
  @ApiProperty({
    description: 'The ID of the menu item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  menuItemId: string;

  @ApiProperty({
    description: 'The quantity of the menu item',
    example: 2,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({
    description: 'Special instructions or details for this item',
    example: 'No onions, extra cheese',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  detail?: string;
}
