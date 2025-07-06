import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/modules/users/users.module';

import { PolarConfiguration } from './entities/polar-configuration.entity';
import { PolarCustomer } from './entities/polar-customer.entity';
import { PolarSubscription } from './entities/polar-subscription.entity';
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
  providers: [SubscriptionsService, PolarWebhookService],
  exports: [SubscriptionsService],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
