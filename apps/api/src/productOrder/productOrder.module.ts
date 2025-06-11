import { Module } from '@nestjs/common';
import { ProductOrderController } from './productOrder.controller';
import { ProductOrderService } from './productOrder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrder } from './entities/ProductOrder.entity';
import { Platillo } from 'src/dish/entities/dish.entities';
import { Order } from 'src/order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrder, Platillo, Order])],
  controllers: [ProductOrderController],
  providers: [ProductOrderService],
  exports: [ProductOrderService],
})
export class ProductOrderModule {}
