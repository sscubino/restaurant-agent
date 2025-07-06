import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@/modules/users/entities/user.entity';

@Entity({ name: 'invite_code' })
export class InviteCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'twilio_phone_number', nullable: true })
  twilioPhoneNumber: string;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  @Column({ name: 'used_by', nullable: true })
  usedById?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'used_by', referencedColumnName: 'id' })
  usedBy?: User;

  @Column({ name: 'used_at', type: 'timestamptz', nullable: true })
  usedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
