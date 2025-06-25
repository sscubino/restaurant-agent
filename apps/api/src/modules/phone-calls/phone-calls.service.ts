import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationQueryDto } from '@/dto/pagination-query.dto';

import { PhoneCallDto } from './dto/phone-call.dto';
import { PhoneCall } from './entities/phone-call.entity';

@Injectable()
export class PhoneCallsService {
  constructor(
    @InjectRepository(PhoneCall)
    private readonly phoneCallsRepository: Repository<PhoneCall>,
  ) {}

  savePhoneCall(phoneCallDto: PhoneCallDto) {
    const phoneCall = this.phoneCallsRepository.create(phoneCallDto);
    return this.phoneCallsRepository.save(phoneCall);
  }

  async findAll(paginationQuery: PaginationQueryDto, restaurantId: string) {
    const { skip = 0, take = 10 } = paginationQuery;

    const [data, total] = await this.phoneCallsRepository.findAndCount({
      where: { restaurant: { id: restaurantId } },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return { data, total };
  }
}
