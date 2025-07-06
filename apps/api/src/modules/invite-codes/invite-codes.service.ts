import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { EntityManager, Repository } from 'typeorm';

import { CreateInviteCodeDto } from './dto/create-invite-code.dto';
import { InviteCode } from './entities/invite-code.entity';

@Injectable()
export class InviteCodesService {
  constructor(
    @InjectRepository(InviteCode)
    private inviteCodesRepository: Repository<InviteCode>,
  ) {}

  async create(createInviteCodeDto: CreateInviteCodeDto): Promise<InviteCode> {
    const code = createInviteCodeDto.code || this.generateCode();

    const existingCode = await this.inviteCodesRepository.findOne({
      where: { code },
    });

    if (existingCode) {
      throw new ConflictException('Invite code already exists');
    }

    const inviteCode = this.inviteCodesRepository.create({
      code,
      twilioPhoneNumber: createInviteCodeDto.twilioPhoneNumber,
    });

    return this.inviteCodesRepository.save(inviteCode);
  }

  async findAll(): Promise<InviteCode[]> {
    return this.inviteCodesRepository.find({
      relations: ['usedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<InviteCode> {
    const inviteCode = await this.inviteCodesRepository.findOne({
      where: { id },
      relations: ['usedBy'],
    });

    if (!inviteCode) {
      throw new NotFoundException('Invite code not found');
    }

    return inviteCode;
  }

  async findByCode(code: string): Promise<InviteCode> {
    const inviteCode = await this.inviteCodesRepository.findOne({
      where: { code },
      relations: ['usedBy'],
    });

    if (!inviteCode) {
      throw new NotFoundException('Invite code not found');
    }

    return inviteCode;
  }

  async remove(id: string): Promise<void> {
    const inviteCode = await this.findOne(id);
    await this.inviteCodesRepository.remove(inviteCode);
  }

  async claimCode(
    inviteCode: string,
    userId: string,
    entityManager?: EntityManager,
  ): Promise<InviteCode> {
    const invite = await this.findByCode(inviteCode);

    if (invite.isUsed) {
      throw new ConflictException('Invite code has already been used');
    }

    invite.isUsed = true;
    invite.usedById = userId;
    invite.usedAt = new Date();

    if (entityManager) {
      return entityManager.save(invite);
    }

    return this.inviteCodesRepository.save(invite);
  }

  async validateCode(code: string): Promise<boolean> {
    try {
      const inviteCode = await this.findByCode(code);
      return !inviteCode.isUsed;
    } catch {
      return false;
    }
  }

  private generateCode(): string {
    // Generate a random 8-character alphanumeric code
    return randomBytes(4).toString('hex').toUpperCase();
  }
}
