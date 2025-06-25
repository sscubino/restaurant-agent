import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth/auth.module';
import { RestaurantsModule } from '@/modules/restaurants/restaurants.module';

import { TwilioController } from './twilio.controller';
import { TwilioService } from './twilio.service';

@Module({
  imports: [RestaurantsModule, AuthModule],
  controllers: [TwilioController],
  providers: [TwilioService],
})
export class TwilioModule {}
