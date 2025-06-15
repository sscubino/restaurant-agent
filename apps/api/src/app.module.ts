import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platillo } from './dish/entities/dish.entities';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { DishModule } from './dish/dish.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ChatGptThreads } from './chatGptThreads/entities/chatGpThreads.entity';
import { TwiloModule } from './twiloService/twilo.module';
import { TableModule } from './table/table.module';
import { Table } from './table/entities/table.entity';
import { WebSocketModule } from './websocket/websocket.module';
import { TwilioCall } from './calls/entities/calls.entity';
import { CallsModule } from './calls/calls.module';
import { OrderModule } from './order/order.module';
import { ProductOrderModule } from './productOrder/productOrder.module';
import { Order } from './order/entities/order.entity';
import { ProductOrder } from './productOrder/entities/ProductOrder.entity';
import { EmailModule } from './emailService/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) ?? 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        Platillo,
        User,
        Table,
        ChatGptThreads,
        TwilioCall,
        Order,
        ProductOrder,
      ],
      synchronize: true,
    }),
    UserModule,
    DishModule,
    AuthModule,
    ChatGptThreads,
    TwiloModule,
    TableModule,
    WebSocketModule,
    OrderModule,
    ProductOrderModule,
    CallsModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
