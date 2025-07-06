import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@/modules/users/entities/user.entity';

import { PolarSubscription } from './polar-subscription.entity';

@Entity()
export class PolarCustomer {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.polarCustomer)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => PolarSubscription,
    (subscription) => subscription.polarCustomer,
  )
  subscriptions: PolarSubscription[];
}
