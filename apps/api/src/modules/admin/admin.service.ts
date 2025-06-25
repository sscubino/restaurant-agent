import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { RestaurantsService } from '@/modules/restaurants/restaurants.service';
import { UsersService } from '@/modules/users/users.service';

import { RegisterRestaurantDto } from './dto/register-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private usersService: UsersService,
    private restaurantsService: RestaurantsService,
  ) {}

  async registerRestaurant(registerRestaurantDto: RegisterRestaurantDto) {
    const { companyName, companyPhone, ...userDto } = registerRestaurantDto;

    const userAndRestaurant = await this.dataSource.transaction(
      async (entityManager) => {
        const user = await this.usersService.create(userDto, entityManager);

        const restaurant = await this.restaurantsService.create(
          {
            name: companyName,
            phone: companyPhone,
            userId: user.id,
          },
          entityManager,
        );

        return {
          user: {
            ...user,
            restaurant,
          },
        };
      },
    );

    return userAndRestaurant;
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
