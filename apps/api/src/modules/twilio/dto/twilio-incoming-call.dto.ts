import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TwilioVoiceWebhookDto {
  @IsString()
  @ApiProperty({
    description: 'The SID of the call',
    example: 'CA1234567890',
  })
  CallSid: string;

  @IsString()
  @ApiProperty({
    description: 'The phone number that called',
    example: '+1234567890',
  })
  From?: string;

  @IsString()
  @ApiProperty({
    description: 'The phone number that is being called',
    example: '+1234567890',
  })
  To: string;
}
