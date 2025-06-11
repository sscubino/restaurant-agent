import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDishDTO } from './dto/create-dish.dto';
import { UpdateDishDTO } from './dto/update-dish.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  create(@Request() req, @Body() body: CreateDishDTO) {
    return this.dishService.create(
      req.user.id,
      body.name,
      body.desc,
      body.price,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.dishService.findAllByUser(req.user.id);
  }

  @Get('/formatedText')
  getFormatedText(@Request() req) {
    return this.dishService.getFormatedText(req.user.id);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: number, @Body() body: UpdateDishDTO) {
    return this.dishService.update(
      req.user.id,
      id,
      body.available,
      body.name,
      body.desc,
      body.price,
    );
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: number) {
    return this.dishService.delete(req.user.id, id);
  }
}
