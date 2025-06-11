import { Module } from '@nestjs/common';
import { MediaStreamGateway } from './websocket.gateway';
import { OpenAIModule } from 'src/openai/openai.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [OpenAIModule, OrderModule],
  providers: [MediaStreamGateway],
  exports: [MediaStreamGateway],
})
export class WebSocketModule {}
