import { Module } from '@nestjs/common';
import { TwiloController } from './twilo.controller';
import { TwilioService } from './twilo.service';
import { ChatGptThreadsModule } from 'src/chatGptThreads/chatGptThreads.module';
import { UserModule } from 'src/user/user.module';
import { DishModule } from 'src/dish/dish.module';
import { TableModule } from 'src/table/table.module';
import { CallsModule } from 'src/calls/calls.module';

@Module({
  imports: [
    ChatGptThreadsModule,
    UserModule,
    DishModule,
    TableModule,
    CallsModule,
  ],
  controllers: [TwiloController],
  providers: [TwilioService],
  exports: [TwilioService],
})
export class TwiloModule {}
