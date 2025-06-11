import { BadRequestException, Injectable } from '@nestjs/common';
import { createProductOrderDto } from './dto/createProductOrder-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOrder } from './entities/ProductOrder.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Platillo } from 'src/dish/entities/dish.entities';

@Injectable()
export class ProductOrderService {
  constructor(
    @InjectRepository(ProductOrder)
    private productOrderRepository: Repository<ProductOrder>,
    @InjectRepository(Order)
    private orderrRepository: Repository<Order>,
    @InjectRepository(Platillo)
    private platilloRepository: Repository<Platillo>,
  ) {}

  findAll() {}

  findOne(id: string) {}

  async create(createDto: createProductOrderDto) {
    try {
      const existOrder = await this.orderrRepository.findOne({
        where: { id: createDto.orderId },
      });

      if (!existOrder) {
        throw new BadRequestException('There is no Order with that id');
      }

      const existDish = await this.platilloRepository.findOne({
        where: { id: createDto.dishId },
      });

      if (!existDish) {
        throw new BadRequestException('There is no Dish with that id');
      }

      const newProductOrder = await this.productOrderRepository.create({
        dish: existDish,
        order: existOrder,
        price: existDish.price,
        quantity: createDto.quantity,
        detail: createDto.detail,
      });

      await this.productOrderRepository.save(newProductOrder);

      return {
        ok: true,
        message: 'Product order created successfully',
      };
    } catch (error) {
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: error?.message || 'error creating product order',
        error: 'Bad Request',
      });
    }
  }

  update(id: string, updateDto: any) {}

  remove(id: string) {}
}
