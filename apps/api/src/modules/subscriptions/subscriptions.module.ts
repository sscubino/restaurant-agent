import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/modules/users/users.module';

import {
  PolarConfiguration,
  PolarCustomer,
  PolarSubscription,
} from './entities';
import { PolarConfigurationService } from './services/polar-configuration.service';
import { PolarWebhookService } from './services/polar-webhook.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PolarCustomer,
      PolarSubscription,
      PolarConfiguration,
    ]),
    UsersModule,
  ],
  providers: [
    SubscriptionsService,
    PolarWebhookService,
    PolarConfigurationService,
  ],
  exports: [SubscriptionsService],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
