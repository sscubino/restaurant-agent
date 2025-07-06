import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PolarConfiguration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'webhook_id' })
  webhookId: string;

  @Column({ name: 'meter_id' })
  meterId: string;

  @Column({ name: 'environment', default: 'development' })
  environment: string;
}
