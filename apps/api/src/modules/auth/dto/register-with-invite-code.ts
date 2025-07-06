import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

import { RegisterDto } from './register.dto';

export class RegisterWithInviteCodeDto extends RegisterDto {
  @ApiProperty({
    description: 'The invite code (optional)',
    example: 'INVITE123',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  inviteCode?: string;
}
