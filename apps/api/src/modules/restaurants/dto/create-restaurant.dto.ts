import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'The name of the restaurant',
    example: 'The Italian Corner',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The phone number of the restaurant',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  @Transform(({ value }: { value: string }) => value.replace(/[^0-9]/g, ''))
  phone: string;

  @ApiProperty({
    description: 'The ID of the user who owns this restaurant',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
