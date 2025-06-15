import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCallDto } from './dto/calls-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TwilioCall } from './entities/calls.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(TwilioCall)
    private readonly callsRepository: Repository<TwilioCall>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCall(data: CreateCallDto) {
    try {
      if (!data) {
        throw new BadRequestException('error creating call');
      }
      console.log(data.to.split('+')[1]);

      const userToCall = await this.userRepository.findOne({
        where: { phoneWithCountry: data.to.split('+')[1] },
      });
      console.log(userToCall);

      if (!userToCall) {
        console.log('no hay user con ese numero');

        throw new BadRequestException('Error, user "to" does not exist');
      }

      const newCall = this.callsRepository.create({
        accountSid: data.accountSid,
        callSid: data.callSid,
        callStatus: data.callStatus,
        direction: data.direction,
        duration: data.duration,
        from: data.from,
        fromCountry: data.fromCountry,
        timestamp: data.timestamp,
        to: data.to,
        toCountry: data.toCountry,
        user: userToCall,
      });

      await this.callsRepository.save(newCall);

      return {
        ok: true,
        message: 'Call created successfully',
      };
    } catch (error) {
      console.error('Error creating call:', error);
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: 'error creating call',
        error: 'Bad Request',
      });
    }
  }

  async findAll(userId: number, offset: number, limit: number) {
    try {
      const totalItems = await this.callsRepository.count({
        where: { user: { id: userId } },
      });

      const allCalls = await this.callsRepository.find({
        where: { user: { id: userId } },
        take: limit,
        skip: offset,
        order: { id: 'DESC' },
      });

      return {
        ok: true,
        data: allCalls,
        offset,
        limit,
        totalItems: totalItems,
      };
    } catch (error) {
      console.error('Error getting all calls:', error);
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: 'error get all calls',
        error: 'Bad Request',
      });
    }
  }
}
