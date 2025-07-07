import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    void this.initializeSuperUser();
  }

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
        polarCustomer: {
          subscriptions: true,
        },
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

  private async initializeSuperUser() {
    const email = this.configService.get<string>('SUPER_USER_EMAIL');
    const password = this.configService.get<string>('SUPER_USER_PASSWORD_HASH');
    const names =
      this.configService.get<string>('SUPER_USER_FULL_NAME')?.split(' ') ?? [];
    const firstName = names.shift();
    const lastName = names.pop();

    if (!email || !password || !firstName) {
      console.log('Super user not configured');
      return;
    }

    const user = await this.findByEmail(email);

    await this.usersRepository.save({
      id: user?.id,
      email,
      password,
      firstName,
      lastName,
      isSuperUser: true,
    });

    if (!user) {
      console.log(`Super user created ${email}`);
    }
  }

  async verifyEmail(userId: string, email: string) {
    const user = await this.findOne(userId);
    if (user.email !== email) {
      throw new UnauthorizedException(
        'User email does not match the verification email',
      );
    }
    await this.usersRepository.update(userId, { isVerified: true });
  }
}
