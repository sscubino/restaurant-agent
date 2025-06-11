import { BadRequestException, Injectable } from '@nestjs/common';
import { createOrderDto } from './dto/create-order-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ProductOrderService } from 'src/productOrder/productOrder.service';
import { Table } from 'src/table/entities/table.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly productOrderService: ProductOrderService,
  ) {}

  async findAll(userId: number, offset: number, limit: number) {
    try {
      const totalOrders = await this.orderRepository.count({
        where: { user: { id: userId } },
      });

      const allOrdersUser = await this.orderRepository.find({
        where: { user: { id: userId } },
        relations: ['productOrder', 'productOrder.dish'],
        take: limit,
        skip: offset,
        order: { id: 'DESC' },
      });

      const ordersWithTableData = await Promise.all(
        allOrdersUser.map(async (element) => {
          if (element.tableId) {
            const tableData = await this.tableRepository.findOne({
              where: { id: element.tableId },
            });
            return { ...element, tableId: tableData };
          }
          return element;
        }),
      );

      return {
        ok: true,
        data: ordersWithTableData,
        offset: offset,
        limit: limit,
        totalItems: totalOrders,
      };
    } catch (error) {
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: error?.message || 'error get all orders',
        error: 'Bad Request',
      });
    }
  }

  findOne(id: number) {}

  async create(createDto: createOrderDto, userId: any) {
    try {
      const userExist = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!userExist) {
        throw new BadRequestException(
          'There are not user with this id ',
          userId,
        );
      }

      const newOrder = await this.orderRepository.create({
        user: userExist,
        date: createDto.date,
        direction: createDto.direction,
        tableId: createDto.tableId,
        total: createDto.total,
        typeOrder: createDto.typeOrder,
      });

      if (createDto.tableId) {
        //disable table

        const tableExist = await this.tableRepository.findOne({
          where: { id: createDto.tableId },
        });

        if (!tableExist) {
          throw new BadRequestException('There are no tables with those id');
        }

        tableExist.availability = false;
        await this.tableRepository.save(tableExist);
      }

      await this.orderRepository.save(newOrder);

      if (createDto.productsIds && createDto.productsIds.length > 0)
        await Promise.all(
          createDto.productsIds?.map((element) =>
            this.productOrderService.create({
              dishId: element.productId,
              orderId: newOrder.id,
              quantity: element.cantidad,
              detail: element.detalle ?? 'No detail',
            }),
          ),
        );
      console.log('orden creada exitosamente');

      return {
        oK: true,
        message: 'Order created successfully',
      };
    } catch (error) {
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: error?.message || 'error creating order',
        error: 'Bad Request',
      });
    }
  }

  update(id: number, updateDto: any) {}

  async remove(orderId: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (!order) {
        throw new BadRequestException('Order does not exist');
      }

      await this.orderRepository.delete({ id: orderId });

      return {
        ok: true,
        message: 'Order deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: error?.message || 'error deleting order',
        error: 'Bad Request',
      });
    }
  }
}
