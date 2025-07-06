import { SubscriptionStatus } from '@polar-sh/sdk/models/components/subscriptionstatus';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PolarCustomer } from './polar-customer.entity';

@Entity()
export class PolarSubscription {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'status' })
  status: SubscriptionStatus;

  @Column({ name: 'current_period_start' })
  currentPeriodStart: Date;

  @Column({ name: 'current_period_end', nullable: true, type: 'timestamptz' })
  currentPeriodEnd: Date | null;

  @Column({ name: 'canceled_at', nullable: true, type: 'timestamptz' })
  canceledAt: Date | null;

  @Column({ name: 'cancel_at_period_end', default: false })
  cancelAtPeriodEnd: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(
    () => PolarCustomer,
    (polarCustomer) => polarCustomer.subscriptions,
  )
  @JoinColumn({ name: 'polar_customer_id' })
  polarCustomer: PolarCustomer;
}
