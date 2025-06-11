import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { OpenAIModule } from 'src/openai/openai.module';
import { DishModule } from 'src/dish/dish.module';
import { TableModule } from 'src/table/table.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    OpenAIModule,
    DishModule,
    TableModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
