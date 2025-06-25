import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PhoneCall } from './entities/phone-call.entity';
import { PhoneCallsController } from './phone-calls.controller';
import { PhoneCallsService } from './phone-calls.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhoneCall])],
  providers: [PhoneCallsService],
  controllers: [PhoneCallsController],
  exports: [PhoneCallsService],
})
export class PhoneCallsModule {}
