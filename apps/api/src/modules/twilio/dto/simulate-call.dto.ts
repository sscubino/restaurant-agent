import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SimulateCallDto {
  @IsNotEmpty()
  @IsString()
  // @IsPhoneNumber()
  @ApiProperty({
    description: 'The phone number doing the call',
    example: '+1234567890',
  })
  from: string;

  @IsNotEmpty()
  @IsString()
  // @IsPhoneNumber()
  @ApiProperty({
    description: 'The phone number to call',
    example: '+1234567890',
  })
  to: string;
}
