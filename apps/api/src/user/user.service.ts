import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { OpenAIService } from 'src/openai/openai.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly openAI: OpenAIService,
  ) {}

  async getUserIdByPhone(phoneTo: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { phoneWithCountry: phoneTo },
      });

      return {
        userId: user?.id,
        companyName: user?.company_name,
      };
    } catch (error) {
      console.log(error);
    }
  }

  create() {
    return 'crear';
  }

  find(userId: number) {
    return 'encontrar';
  }

  async findAll() {
    return await this.userRepository.find();
  }

  update(userId: number, userData: Partial<User>) {
    return this.userRepository.update(userId, userData);
  }

  delete(userId: number) {
    return 'eliminar';
  }

  async simulateMessage(data, dishesAndTable) {
    try {
      console.log(data);
      console.log(dishesAndTable);

      const threadId = await this.openAI.createThread(dishesAndTable);

      if (threadId) {
        this.openAI.sendMessageAndRun(threadId, data);
      }

      console.log('termie');

      return 'OK';
    } catch (error) {
      console.log('error', error);
    }
  }
}
