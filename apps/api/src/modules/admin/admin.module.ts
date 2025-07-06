import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth/auth.module';
import { RestaurantsModule } from '@/modules/restaurants/restaurants.module';
import { UsersModule } from '@/modules/users/users.module';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [UsersModule, RestaurantsModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
