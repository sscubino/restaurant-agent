import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsControllerr } from './calls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioCall } from './entities/calls.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TwilioCall, User])],
  controllers: [CallsControllerr],
  providers: [CallsService],
  exports: [CallsService],
})
export class CallsModule {}
