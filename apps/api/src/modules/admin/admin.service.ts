import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AuthService } from '@/modules/auth/auth.service';
import { RestaurantsService } from '@/modules/restaurants/restaurants.service';
import { UsersService } from '@/modules/users/users.service';

import { RegisterRestaurantDto, UpdateRestaurantDto } from './dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private usersService: UsersService,
    private restaurantsService: RestaurantsService,
    private authService: AuthService,
  ) {}

  async registerRestaurant(registerRestaurantDto: RegisterRestaurantDto) {
    return this.authService.register(registerRestaurantDto);
  }

  async findAllRestaurants() {
    return this.restaurantsService.findAll();
  }

  async deleteRestaurant(id: string) {
    const restaurant = await this.restaurantsService.findOne(id);
    await this.usersService.remove(restaurant.user.id);
  }

  async updateRestaurant(id: string, updateDto: UpdateRestaurantDto) {
    const { companyName, companyPhone, ...userDto } = updateDto;
    const restaurantDto = { name: companyName, phone: companyPhone };

    await this.dataSource.transaction(async (entityManager) => {
      await this.restaurantsService.update(id, restaurantDto, entityManager);
      await this.usersService.update(id, userDto, entityManager);
    });
  }
}
