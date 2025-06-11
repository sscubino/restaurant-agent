import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async find(id: number) {
    const table = await this.tableRepository.findOne({ where: { id } });
    return {
      ok: true,
      data: table,
    };
  }

  async getFormatedText(userId: number) {
    try {
      const allTables = await this.tableRepository.find({
        where: { user: { id: userId }, availability: true },
      });
      let formatedText = '\n Tables availables:\n';

      allTables.map((table, index) => {
        const text = `
            ${index + 1}:
            name:${table.name}
            capacity:${table.capacity}
            id: ${table.id}
            `;
        formatedText += text;
      });
      console.log('tables avaiable');

      if (allTables.length > 0) {
        return formatedText;
      } else {
        return 'No hay mesas disponible';
      }
    } catch (error) {
      console.log('error');
    }
  }

  async findAllForUser(userId: number) {
    try {
      const table = await this.tableRepository.find({
        where: { user: { id: userId } },
      });

      return {
        ok: true,
        data: table,
      };
    } catch (error) {
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: error?.message || 'Error finding all tables for user',
        error: 'Bad Request',
      });
    }
  }

  async Create(userId, createTable: CreateTableDto) {
    try {
      const existUser = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (
        !createTable.availability ||
        !createTable.capacity ||
        !createTable.name
      ) {
        throw new BadRequestException(
          'Please enter: capacity, availability and table name',
        );
      }

      if (!existUser) {
        throw new BadRequestException('There is no user with those ids');
      }

      const newTable = await this.tableRepository.create({
        availability: createTable.availability,
        capacity: createTable.capacity,
        name: createTable.name,
        user: existUser,
      });

      await this.tableRepository.save(newTable);

      return {
        ok: true,
        data: newTable,
      };
    } catch (error) {
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: error?.message || 'Error creating tables for user',
        error: 'Bad Request',
      });
    }
  }

  async update(idTable: number, data: Partial<CreateTableDto>) {
    try {
      const tableExist = await this.tableRepository.findOne({
        where: { id: idTable },
      });

      if (!tableExist) {
        throw new BadRequestException('There is no table with that id');
      }

      Object.assign(tableExist, data);
      await this.tableRepository.save(tableExist);

      return {
        ok: true,
        message: 'table updated successfully',
        data: tableExist,
      };
    } catch (error) {
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: error?.message || 'Error updating tables for user',
        error: 'Bad Request',
      });
    }
  }

  async delete(id: number) {
    try {
      const existTable = await this.tableRepository.findOne({ where: { id } });

      if (!existTable) {
        throw new BadRequestException('There is no table with that id');
      }

      const res = await this.tableRepository.delete(existTable);

      if (res.affected && res.affected > 0) {
        return { ok: true, message: 'Table deleted succesfully' };
      }
    } catch (error) {
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: error?.message || 'Error deleting tables r',
        error: 'Bad Request',
      });
    }
  }
}
