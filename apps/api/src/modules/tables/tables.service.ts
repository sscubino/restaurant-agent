import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from './entities/table.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
  ) {}

  async create(
    createTableDto: CreateTableDto,
    restaurantId: string,
  ): Promise<Table> {
    const table = this.tablesRepository.create({
      ...createTableDto,
      restaurantId,
    });

    return this.tablesRepository.save(table);
  }

  async findAllByRestaurant(restaurantId: string): Promise<Table[]> {
    return this.tablesRepository.find({
      where: { restaurantId },
      relations: ['restaurant'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneByRestaurant(id: string, restaurantId: string): Promise<Table> {
    const table = await this.tablesRepository.findOne({
      where: { id, restaurantId },
      relations: ['restaurant'],
    });

    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    return table;
  }

  async update(
    id: string,
    updateTableDto: UpdateTableDto,
    restaurantId: string,
  ): Promise<Table> {
    const table = await this.findOneByRestaurant(id, restaurantId);

    Object.assign(table, updateTableDto);
    return this.tablesRepository.save(table);
  }

  async remove(id: string, restaurantId: string): Promise<void> {
    const table = await this.findOneByRestaurant(id, restaurantId);
    await this.tablesRepository.softRemove(table);
  }
}
