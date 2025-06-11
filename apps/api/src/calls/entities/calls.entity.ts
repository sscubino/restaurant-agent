import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('twilio_calls')
export class TwilioCall {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @Column({ unique: true })
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

  @ManyToOne(() => User, (user) => user.twCall)
  user: User;
}
