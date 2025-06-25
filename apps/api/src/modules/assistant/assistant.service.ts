import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateOrderDto } from '@/modules/orders/dto';
import { OrdersService } from '@/modules/orders/orders.service';
import { Restaurant } from '@/modules/restaurants/entities/restaurant.entity';

import { ContextService } from './context/context.service';

@Injectable()
export class AssistantService {
  private readonly websocketUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly orderService: OrdersService,
    private readonly restaurantContextService: ContextService,
  ) {
    const base_url = this.configService.getOrThrow<string>('HOST_BASE_URL');
    this.websocketUrl = `${base_url.replace(/^https?:\/\//, 'wss://')}/api/assistant/connect`;
  }

  async getAssistantUrlAndParametersFor(restaurant: Restaurant) {
    const context =
      await this.restaurantContextService.getRestaurantContext(restaurant);

    const websocket = {
      url: this.websocketUrl,
      params: [
        { name: 'restaurantId', value: restaurant.id },
        { name: 'dataRestaurant', value: context },
      ],
    };

    return websocket;
  }

  async createNewOrder(createOrderDto: CreateOrderDto, restaurantId: string) {
    await this.orderService.create(createOrderDto, restaurantId);
  }
}
