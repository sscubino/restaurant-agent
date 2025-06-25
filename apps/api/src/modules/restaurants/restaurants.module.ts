import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssistantModule } from '@/modules/assistant/assistant.module';
import { PhoneCallsModule } from '@/modules/phone-calls/phone-calls.module';

import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsService } from './restaurants.service';
import { RestaurantTwilioCallsService } from './services/restaurant-twilio-calls.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant]),
    PhoneCallsModule,
    AssistantModule,
  ],
  providers: [RestaurantsService, RestaurantTwilioCallsService],
  exports: [RestaurantsService, RestaurantTwilioCallsService],
})
export class RestaurantsModule {}
