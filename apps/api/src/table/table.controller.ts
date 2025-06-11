import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get(':id')
  find(@Param('id') id: number) {
    return this.tableService.find(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.tableService.findAllForUser(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() body: CreateTableDto) {
    return this.tableService.Create(req.user.id, body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: CreateTableDto) {
    return this.tableService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.tableService.delete(id);
  }
}
