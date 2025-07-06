import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateInviteCodeDto {
  @ApiProperty({
    description:
      'The invite code (optional, will be auto-generated if not provided)',
    example: 'INVITE123',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @ApiProperty({
    description: 'Twilio phone number created for the invite code',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  twilioPhoneNumber?: string;
}
