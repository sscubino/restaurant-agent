import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ProductOrder } from 'src/productOrder/entities/ProductOrder.entity';

@Entity()
export class Platillo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  desc: string;

  @Column({ default: true })
  availability: boolean;

  @Column({ nullable: false })
  price: number;

  @ManyToOne(() => User, (user) => user.platillos, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => ProductOrder, (prodorder) => prodorder.dish, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  productOrder: ProductOrder[];
}
