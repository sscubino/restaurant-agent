import { Platillo } from 'src/dish/entities/dish.entities';
import { Order } from 'src/order/entities/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class ProductOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Platillo, (product) => product.productOrder, {
    onDelete: 'SET NULL',
  })
  dish: Platillo;

  @ManyToOne(() => Order, (order) => order.productOrder, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ nullable: true })
  detail: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;
}
