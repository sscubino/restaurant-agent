import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { createOrderDto } from './dto/create-order-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Request() req,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    const offsetNumber = offset ? parseInt(offset, 10) : 0;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.orderService.findAll(req.user.id, offsetNumber, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDto: createOrderDto, @Request() req) {
    return this.orderService.create(createDto, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: any) {
    return this.orderService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.orderService.remove(id);
  }
}
