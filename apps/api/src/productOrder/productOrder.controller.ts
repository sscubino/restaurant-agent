import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProductOrderService } from './productOrder.service';
import { createProductOrderDto } from './dto/createProductOrder-dto';

@Controller('api/productOrder')
export class ProductOrderController {
  constructor(private readonly productOrderService: ProductOrderService) {}

  @Get()
  findAll() {
    return this.productOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productOrderService.findOne(id);
  }

  @Post()
  create(@Body() createDto: createProductOrderDto) {
    return this.productOrderService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.productOrderService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productOrderService.remove(id);
  }
}
