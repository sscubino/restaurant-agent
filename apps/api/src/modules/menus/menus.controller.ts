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

import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenusService } from './menus.service';

@ApiTags('Menus')
@Controller('menus')
@UseGuards(JwtAuthGuard, RestaurantOwnerGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth('JWT-auth')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiBody({ type: CreateMenuItemDto })
  @ApiResponse({
    status: 201,
    description: 'The menu item has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have a restaurant.',
  })
  async create(
    @Body() createMenuItemDto: CreateMenuItemDto,
    @Req() req: Request,
  ) {
    return this.menusService.createMenuItem(
      createMenuItemDto,
      req.user!.restaurant!.id,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all menu items for the authenticated restaurant',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all menu items for the restaurant.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have a restaurant.',
  })
  async findAll(@Req() req: Request) {
    return this.menusService.findAllMenuItemsByRestaurant(
      req.user!.restaurant!.id,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a menu item by ID' })
  @ApiParam({ name: 'id', description: 'Menu item ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the menu item.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have a restaurant.',
  })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return this.menusService.findMenuItemByRestaurant(
      id,
      req.user!.restaurant!.id,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a menu item' })
  @ApiParam({ name: 'id', description: 'Menu item ID' })
  @ApiBody({ type: UpdateMenuItemDto })
  @ApiResponse({
    status: 200,
    description: 'The menu item has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have a restaurant.',
  })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
    @Req() req: Request,
  ) {
    return this.menusService.updateMenuItem(
      id,
      updateMenuItemDto,
      req.user!.restaurant!.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a menu item (soft delete)' })
  @ApiParam({ name: 'id', description: 'Menu item ID' })
  @ApiResponse({
    status: 200,
    description: 'The menu item has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have a restaurant.',
  })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    return this.menusService.removeMenuItem(id, req.user!.restaurant!.id);
  }
}
