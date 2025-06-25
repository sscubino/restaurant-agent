import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiQuery } from '@nestjs/swagger';
import type { Request } from 'express';

import { PaginationQueryDto } from '@/dto/pagination-query.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RestaurantOwnerGuard } from '@/modules/auth/guards/restaurant-owner.guard';

import { PhoneCallsService } from './phone-calls.service';

@ApiTags('Phone Calls')
@Controller('phone-calls')
@UseGuards(JwtAuthGuard, RestaurantOwnerGuard)
@ApiBearerAuth('JWT-auth')
export class PhoneCallsController {
  constructor(private readonly phoneCallsService: PhoneCallsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get all phone call records for the authenticated restaurant with pagination',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of items to skip (default: 0)',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of items to take (default: 10, max: 100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Return paginated phone call records for the restaurant.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have a restaurant.',
  })
  findAll(@Query() paginationQuery: PaginationQueryDto, @Req() req: Request) {
    return this.phoneCallsService.findAll(
      paginationQuery,
      req.user!.restaurant!.id,
    );
  }
}
