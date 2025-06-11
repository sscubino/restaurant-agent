import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { User } from 'src/user/entities/user.entity';
import { Table } from './entities/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Table, User])],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
