import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationQueryDto } from '@/dto/pagination-query.dto';
import { MenusService } from '@/modules/menus/menus.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
    private menusService: MenusService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    restaurantId: string,
  ): Promise<Order> {
    const orderDetailsWithPrice = await Promise.all(
      createOrderDto.orderDetails.map((detail) =>
        this.getOrderDetailWithCurrentPrice(detail, restaurantId),
      ),
    );

    const total = orderDetailsWithPrice.reduce(
      (sum, detail) => sum + detail.price * detail.quantity,
      0,
    );

    const order = this.ordersRepository.create({
      type: createOrderDto.type,
      total,
      address: createOrderDto.address,
      table: createOrderDto.table,
      date: createOrderDto.date ? new Date(createOrderDto.date) : undefined,
      restaurantId,
    });

    order.orderDetails = orderDetailsWithPrice.map((detail) =>
      this.orderDetailsRepository.create(detail),
    );

    const savedOrder = await this.ordersRepository.save(order, {
      transaction: true,
    });

    return savedOrder;
  }

  async findAllByRestaurant(
    restaurantId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<{ data: Order[]; total: number }> {
    const { skip = 0, take = 10 } = paginationQuery;

    const [data, total] = await this.ordersRepository.findAndCount({
      where: { restaurantId },
      relations: {
        orderDetails: {
          menuItem: true,
        },
      },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return { data, total };
  }

  async findOneByRestaurant(id: string, restaurantId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id, restaurantId },
      relations: {
        orderDetails: {
          menuItem: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    restaurantId: string,
  ): Promise<Order> {
    const order = await this.findOneByRestaurant(id, restaurantId);

    Object.assign(order, updateOrderDto);
    return this.ordersRepository.save(order);
  }

  private async getOrderDetailWithCurrentPrice(
    orderDetail: CreateOrderDetailDto,
    restaurantId: string,
  ): Promise<CreateOrderDetailDto & { price: number }> {
    const price = await this.menusService.getPrice(
      orderDetail.menuItemId,
      restaurantId,
    );
    return { ...orderDetail, price };
  }
}
