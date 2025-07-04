import { getDatabaseConfig } from '@config/database.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/modules/auth/auth.module';
import { MenusModule } from '@/modules/menus/menus.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { PhoneCallsModule } from '@/modules/phone-calls/phone-calls.module';
import { RestaurantsModule } from '@/modules/restaurants/restaurants.module';
import { TablesModule } from '@/modules/tables/tables.module';
import { TwilioModule } from '@/modules/twilio/twilio.module';
import { UsersModule } from '@/modules/users/users.module';

import { AdminModule } from './modules/admin/admin.module';
import { AssistantModule } from './modules/assistant/assistant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    MenusModule,
    OrdersModule,
    TablesModule,
    AssistantModule,
    PhoneCallsModule,
    TwilioModule,
    AdminModule,
  ],
})
export class AppModule {}
