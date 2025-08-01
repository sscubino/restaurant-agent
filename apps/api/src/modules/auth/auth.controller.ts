import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto, RegisterWithInviteCodeDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns access token.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('admin-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Admin login successful. Returns access token.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterWithInviteCodeDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Registration is disabled.' })
  register(@Body() registerDto: RegisterWithInviteCodeDto) {
    if (registerDto.inviteCode) {
      return this.authService.registerWithInviteCode(
        registerDto,
        registerDto.inviteCode,
      );
    }

    if (this.configService.get('ARE_INVITE_CODES_REQUIRED_FOR_REGISTRATION')) {
      throw new BadRequestException('Invite code is required');
    }

    return this.authService.register(registerDto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Returns the current user profile.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    return this.authService.getProfile(req.user!.id);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({
    status: 401,
    description: 'Invalid email verification token.',
  })
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
    try {
      await this.authService.verifyEmail(token);
    } catch {
      return res.redirect(frontendUrl + '/errorVerify');
    }
    return res.redirect(frontendUrl + '/successVerify');
  }

  @Get('resend-verification-email')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({ status: 200, description: 'Verification email resent.' })
  @ApiResponse({
    status: 400,
    description: 'User is already verified.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  resendVerificationEmail(@Req() req: Request) {
    if (req.user!.isVerified) {
      throw new BadRequestException('User is already verified');
    }
    return this.authService.sendVerificationEmail(req.user!);
  }
}
