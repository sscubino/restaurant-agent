import { Module } from '@nestjs/common';

import { MenusModule } from '@/modules/menus/menus.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { TablesModule } from '@/modules/tables/tables.module';

import { AssistantGateway } from './assistant.gateway';
import { AssistantService } from './assistant.service';
import { ContextService } from './context/context.service';

@Module({
  imports: [MenusModule, TablesModule, OrdersModule],
  providers: [AssistantService, ContextService, AssistantGateway],
  exports: [AssistantService, AssistantGateway],
})
export class AssistantModule {}
