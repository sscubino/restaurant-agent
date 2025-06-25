import { IsString } from 'class-validator';

export class TwilioEndCallDto {
  @IsString()
  AccountSid: string;

  @IsString()
  CallSid: string;

  @IsString()
  CallStatus: string;

  @IsString()
  Direction?: string;

  @IsString()
  Duration?: string;

  @IsString()
  From?: string;

  @IsString()
  FromCountry?: string;

  @IsString()
  Timestamp?: string;

  @IsString()
  To: string;

  @IsString()
  ToCountry: string;
}
