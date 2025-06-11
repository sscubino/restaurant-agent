import { ProductOrder } from 'src/productOrder/entities/ProductOrder.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'aproved' | 'finished';

  @Column()
  typeOrder: string;

  @Column({ nullable: true })
  direction: string;

  @Column({ nullable: true })
  tableId: number;

  @Column({ nullable: true })
  total: number;

  @OneToMany(() => ProductOrder, (prodorder) => prodorder.order)
  productOrder: ProductOrder[];

  @ManyToOne(() => User, (user) => user.order)
  user: User;
}
