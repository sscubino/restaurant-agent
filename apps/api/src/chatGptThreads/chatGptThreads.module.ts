import { Module } from '@nestjs/common';
import { ChatGptThreadsController } from './chatGptThreads.controller';
import { ChatGptThreadsService } from './chatGptThreads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGptThreads } from './entities/chatGpThreads.entity';
import { User } from 'src/user/entities/user.entity';
import { OpenAIModule } from 'src/openai/openai.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatGptThreads, User]), OpenAIModule],
  controllers: [ChatGptThreadsController],
  providers: [ChatGptThreadsService],
  exports: [ChatGptThreadsService],
})
export class ChatGptThreadsModule {}
