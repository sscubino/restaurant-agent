import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    entityManager?: EntityManager,
  ): Promise<User> {
    await this.validateEmailNotInUse(createUserDto.email, entityManager);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const userRepository = this.getUserRepository(entityManager);

    const user = userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
      relations: {
        restaurant: true,
      },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        restaurant: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    entityManager?: EntityManager,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.validateEmailNotInUse(updateUserDto.email, entityManager);
    }

    Object.assign(user, updateUserDto);
    return this.getUserRepository(entityManager).save(user);
  }

  async remove(id: string, entityManager?: EntityManager): Promise<void> {
    const userRepository = entityManager
      ? entityManager.getRepository(User)
      : this.usersRepository;

    const user = await this.findOne(id);
    await userRepository.remove(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, {
      lastLogin: new Date(),
    });
  }

  private async validateEmailNotInUse(
    email: string,
    entityManager?: EntityManager,
  ) {
    const userRepository = this.getUserRepository(entityManager);
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
  }

  private getUserRepository(entityManager?: EntityManager) {
    return entityManager
      ? entityManager.getRepository(User)
      : this.usersRepository;
  }
}
