import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { SuperUserGuard } from '@/modules/auth/guards/super-user.guard';

import { CreateInviteCodeDto } from './dto';
import { InviteCodesService } from './invite-codes.service';

@ApiTags('Invite Codes')
@Controller('invite-codes')
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
export class InviteCodesController {
  constructor(private readonly inviteCodesService: InviteCodesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invite code' })
  @ApiResponse({
    status: 201,
    description: 'Invite code created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 409,
    description: 'Invite code already exists',
  })
  @ApiBody({ type: CreateInviteCodeDto })
  async create(@Body() createInviteCodeDto: CreateInviteCodeDto) {
    return this.inviteCodesService.create(createInviteCodeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invite codes' })
  @ApiResponse({
    status: 200,
    description: 'List of all invite codes',
  })
  async findAll() {
    return this.inviteCodesService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an invite code' })
  @ApiResponse({
    status: 200,
    description: 'Invite code deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Invite code not found' })
  async remove(@Param('id') id: string) {
    return this.inviteCodesService.remove(id);
  }
}
