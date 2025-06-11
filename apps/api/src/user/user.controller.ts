import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { DishService } from 'src/dish/dish.service';
import { TableService } from 'src/table/table.service';

@Controller('api/user')
export class UserController {
  constructor(
    private userService: UserService,
    private dishService: DishService,
    private tableService: TableService,
  ) {}

  @Post()
  createUser() {
    return this.userService.create();
  }

  @Get(':id')
  getUser(@Param('UserId') UserId: number) {
    return this.userService.find(UserId);
  }

  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() userData: Partial<User>) {
    return this.userService.update(id, userData);
  }

  @Delete(':id')
  removeUser(@Param('UserId') UserId: number) {
    return this.userService.delete(UserId);
  }

  @Post('/simulateMessage')
  async simulateMessage(@Body() data: { message: string }) {
    const dishesText = await this.dishService.getFormatedText(28);
    const tablesText = await this.tableService.getFormatedText(28);
    const dishesAndTables = dishesText + '\n' + tablesText;
    return this.userService.simulateMessage(data.message, dishesAndTables);
  }
}
