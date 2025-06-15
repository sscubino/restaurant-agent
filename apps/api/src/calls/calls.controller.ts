import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CallsService } from './calls.service';
import { CreateCallDto } from './dto/calls-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Req() req: Request,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    const offsetNumber = offset ? parseInt(offset, 10) : 0;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return await this.callsService.findAll(
      Number(req.user?.id),
      offsetNumber,
      limitNumber,
    );
  }

  @Post()
  async createCall(@Body() data: CreateCallDto) {
    return await this.callsService.createCall(data);
  }
}
