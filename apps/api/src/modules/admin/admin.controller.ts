import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { SuperUserGuard } from '@/modules/auth/guards/super-user.guard';

import { AdminService } from './admin.service';
import { RegisterRestaurantDto } from './dto/register-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, SuperUserGuard)
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
@ApiResponse({
  status: 403,
  description: 'Forbidden - Super user privileges required',
})
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('restaurant-user')
  @ApiOperation({ summary: 'Register a new restaurant with owner user' })
  @ApiResponse({
    status: 201,
    description: 'Restaurant and user created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 409,
    description: 'User or restaurant already exists',
  })
  async registerRestaurant(
    @Body() registerRestaurantDto: RegisterRestaurantDto,
  ) {
    return this.adminService.registerRestaurant(registerRestaurantDto);
  }

  @Get('restaurant-user')
  @ApiOperation({ summary: 'Get all restaurants with their owners' })
  @ApiResponse({
    status: 200,
    description: 'List of all restaurants',
  })
  async findAllRestaurants() {
    return this.adminService.findAllRestaurants();
  }

  @Delete('restaurant-user/:id')
  @ApiOperation({ summary: 'Delete a restaurant and its owner user' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant and user deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async deleteRestaurant(@Param('id') id: string) {
    return this.adminService.deleteRestaurant(id);
  }

  @Put('restaurant-user/:id')
  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @ApiResponse({ status: 409, description: 'Restaurant name already exists' })
  async updateRestaurant(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.adminService.updateRestaurant(id, updateRestaurantDto);
  }
}
