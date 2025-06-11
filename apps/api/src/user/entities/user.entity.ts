import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Platillo } from '../../dish/entities/dish.entities';
import { ChatGptThreads } from 'src/chatGptThreads/entities/chatGpThreads.entity';
import { Table } from 'src/table/entities/table.entity';
import { TwilioCall } from 'src/calls/entities/calls.entity';
import { Order } from 'src/order/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  company_name: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  phoneValidated: boolean;

  @Column({ nullable: true })
  phoneWithCountry: string;

  @OneToMany(() => Platillo, (platillo) => platillo.user, {
    onDelete: 'CASCADE',
  })
  platillos: Platillo[];

  @OneToMany(() => ChatGptThreads, (thread) => thread.user, {
    onDelete: 'CASCADE',
  })
  chatGptThread: ChatGptThreads[];

  @OneToMany(() => Table, (table) => table.user, { onDelete: 'CASCADE' })
  table: Table[];

  @OneToMany(() => TwilioCall, (twCall) => twCall.user, { onDelete: 'CASCADE' })
  twCall: TwilioCall[];

  @OneToMany(() => Order, (order) => order.user, { onDelete: 'CASCADE' })
  order: Order[];
}
