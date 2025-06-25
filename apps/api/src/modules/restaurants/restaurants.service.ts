import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantsRepository: Repository<Restaurant>,
  ) {}

  async create(
    createRestaurantDto: CreateRestaurantDto,
    entityManager?: EntityManager,
  ): Promise<Restaurant> {
    await this.validateNameNotInUse(createRestaurantDto.name, entityManager);

    const restaurantRepository = this.getRestaurantRepository(entityManager);

    const restaurant = restaurantRepository.create({
      ...createRestaurantDto,
      user: {
        id: createRestaurantDto.userId,
      },
    });
    return restaurantRepository.save(restaurant);
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return restaurant;
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
    entityManager?: EntityManager,
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    if (
      updateRestaurantDto.name &&
      updateRestaurantDto.name !== restaurant.name
    ) {
      await this.validateNameNotInUse(updateRestaurantDto.name, entityManager);
    }

    Object.assign(restaurant, updateRestaurantDto);
    return this.restaurantsRepository.save(restaurant);
  }

  async remove(id: string, entityManager?: EntityManager): Promise<void> {
    const restaurant = await this.findOne(id);
    await this.getRestaurantRepository(entityManager).remove(restaurant);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Restaurant | null> {
    return this.restaurantsRepository.findOne({
      where: { phone: phoneNumber.replace(/[^0-9]/g, '') },
    });
  }

  private async validateNameNotInUse(
    name: string,
    entityManager?: EntityManager,
  ) {
    const restaurantRepository = this.getRestaurantRepository(entityManager);
    const existingRestaurant = await restaurantRepository.findOne({
      where: { name },
    });
    if (existingRestaurant) {
      throw new ConflictException('Restaurant with this name already exists');
    }
  }

  private getRestaurantRepository(entityManager?: EntityManager) {
    return entityManager
      ? entityManager.getRepository(Restaurant)
      : this.restaurantsRepository;
  }
}
