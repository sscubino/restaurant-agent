import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItem } from './entities/menu-item.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemsRepository: Repository<MenuItem>,
  ) {}

  async createMenuItem(
    createMenuItemDto: CreateMenuItemDto,
    restaurantId: string,
  ): Promise<MenuItem> {
    const menuItem = this.menuItemsRepository.create({
      ...createMenuItemDto,
      restaurantId,
    });

    return this.menuItemsRepository.save(menuItem);
  }

  async findAllMenuItemsByRestaurant(
    restaurantId: string,
  ): Promise<MenuItem[]> {
    return this.menuItemsRepository.find({
      where: { restaurantId },
      relations: ['restaurant'],
      order: { createdAt: 'DESC' },
    });
  }

  async findMenuItemByRestaurant(
    id: string,
    restaurantId: string,
  ): Promise<MenuItem> {
    const menuItem = await this.menuItemsRepository.findOne({
      where: { id, restaurantId },
      relations: ['restaurant'],
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return menuItem;
  }

  async updateMenuItem(
    id: string,
    updateMenuItemDto: UpdateMenuItemDto,
    restaurantId: string,
  ): Promise<MenuItem> {
    const menuItem = await this.findMenuItemByRestaurant(id, restaurantId);

    Object.assign(menuItem, updateMenuItemDto);
    return this.menuItemsRepository.save(menuItem);
  }

  async removeMenuItem(id: string, restaurantId: string): Promise<void> {
    const menuItem = await this.findMenuItemByRestaurant(id, restaurantId);
    await this.menuItemsRepository.softRemove(menuItem);
  }

  async getPrice(id: string, restaurantId: string): Promise<number> {
    const menuItem = await this.findMenuItemByRestaurant(id, restaurantId);
    return menuItem.price;
  }
}
