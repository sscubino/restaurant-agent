import { Injectable } from '@nestjs/common';

import { MenusService } from '@/modules/menus/menus.service';
import { Restaurant } from '@/modules/restaurants/entities/restaurant.entity';
import { TablesService } from '@/modules/tables/tables.service';

@Injectable()
export class ContextService {
  constructor(
    private readonly menusService: MenusService,
    private readonly tablesService: TablesService,
  ) {}

  async getRestaurantContext(restaurant: Restaurant) {
    const [timeContext, menuContext, tablesContext] = await Promise.all([
      this.getTimeContext(),
      this.getMenuContext(restaurant.id),
      this.getTablesContext(restaurant.id),
    ]);

    return [timeContext, menuContext, tablesContext].join('\n');
  }

  private getTimeContext() {
    return `Current_Time: ${new Date().toLocaleString()}`;
  }

  private async getMenuContext(restaurantId: string) {
    const menuItems =
      await this.menusService.findAllMenuItemsByRestaurant(restaurantId);

    let formattedText = 'Menu:\n';

    menuItems.map((menuItem) => {
      const text = `
        \n
        name:${menuItem.name}
        price:${menuItem.price}
        description:${menuItem.description}
        id: ${menuItem.id}
        \n
        `;
      formattedText += text;
    });

    return formattedText;
  }

  private async getTablesContext(restaurantId: string) {
    const tables = await this.tablesService.findAllByRestaurant(restaurantId);

    let formatedText = '\n Available tables for booking:\n';

    tables
      .filter((table) => table.isAvailable)
      .map((table, index) => {
        const text = `
            ${index + 1}:
            name:${table.name}
            capacity:${table.capacity}
            id: ${table.id}
            `;
        formatedText += text;
      });

    if (tables.length > 0) {
      return formatedText;
    } else {
      return 'Currently there is no availability for booking a table in this restaurant';
    }
  }
}
