import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RestaurantOwnerGuard } from '@/modules/auth/guards/restaurant-owner.guard';

import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TablesService } from './tables.service';

@ApiTags('Tables')
@Controller('tables')
@UseGuards(JwtAuthGuard, RestaurantOwnerGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth('JWT-auth')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new table' })
  @ApiBody({ type: CreateTableDto })
  @ApiResponse({
    status: 201,
    description: 'The table has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have a restaurant.',
  })
  async create(@Body() createTableDto: CreateTableDto, @Req() req: Request) {
    return this.tablesService.create(createTableDto, req.user!.restaurant!.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tables for the authenticated restaurant',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all tables for the restaurant.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have a restaurant.',
  })
  async findAll(@Req() req: Request) {
    return this.tablesService.findAllByRestaurant(req.user!.restaurant!.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a table by ID' })
  @ApiParam({ name: 'id', description: 'Table ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the table.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have a restaurant.',
  })
  @ApiResponse({ status: 404, description: 'Table not found.' })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return this.tablesService.findOneByRestaurant(id, req.user!.restaurant!.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a table' })
  @ApiParam({ name: 'id', description: 'Table ID' })
  @ApiBody({ type: UpdateTableDto })
  @ApiResponse({
    status: 200,
    description: 'The table has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have a restaurant.',
  })
  @ApiResponse({ status: 404, description: 'Table not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
    @Req() req: Request,
  ) {
    return this.tablesService.update(
      id,
      updateTableDto,
      req.user!.restaurant!.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a table (soft delete)' })
  @ApiParam({ name: 'id', description: 'Table ID' })
  @ApiResponse({
    status: 200,
    description: 'The table has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have a restaurant.',
  })
  @ApiResponse({ status: 404, description: 'Table not found.' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    return this.tablesService.remove(id, req.user!.restaurant!.id);
  }
}
