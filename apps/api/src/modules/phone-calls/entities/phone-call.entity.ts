import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Restaurant } from '@/modules/restaurants/entities/restaurant.entity';

@Entity('phone_call')
export class PhoneCall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'call_sid' })
  callSid: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  direction: string;

  @Column()
  callStatus: string;

  @Column({ nullable: true })
  duration: string;

  @Column()
  fromCountry: string;

  @Column()
  toCountry: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column()
  accountSid: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.phoneCalls, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;
}
