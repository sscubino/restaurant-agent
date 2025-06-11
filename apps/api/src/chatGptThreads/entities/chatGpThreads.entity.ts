import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

@Entity('chatGptThreads')
export class ChatGptThreads extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  numberPhoneFrom: string;

  @Column({ type: 'bigint' })
  numberPhoneTo: string;

  @Column()
  threadId: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  last_update: Date;

  @Column({ default: false })
  sesionStatus: boolean;

  @ManyToOne(() => User, (user) => user.chatGptThread)
  user: User;
}
