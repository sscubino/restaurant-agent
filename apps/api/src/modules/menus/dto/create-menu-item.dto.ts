import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({
    description: 'The name of the menu item',
    example: 'Margherita Pizza',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'The description of the menu item',
    example: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    required: false,
    maxLength: 511,
  })
  @IsOptional()
  @IsString()
  @MaxLength(511)
  description?: string;

  @ApiProperty({
    description: 'The price of the menu item',
    example: 12.99,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Whether the menu item is available',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
