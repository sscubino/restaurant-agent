import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { RequestNumberDTO } from './dto/request-number.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: CreateUserDTO) {
    return this.authService.register(
      body.firstName,
      body.lastName,
      body.email,
      body.password,
      body.phone,
      body.phone_country_code,
      body.company_name,
    );
  }

  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body.email, body.password);
  }

  @Post('sendRequestNumber')
  async requestNumber(@Body() body: RequestNumberDTO) {
    return this.authService.requestNumber(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-code')
  async verifyCode(@Body() body: { code: string }, @Req() req: Request) {
    console.log('Código recibido:', body.code, 'Usuario ID:', req.user.id);
    return this.authService.verifyAccount(body.code, req?.user?.id ?? '');
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-verify-code')
  async sendVerifyCode(@Request() req) {
    return this.authService.sendVerifyCode(req?.user?.id ?? '');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        console.error('JWT_SECRET no está definido');
        return res.redirect('');
      }

      const decoded = jwt.verify(token, jwtSecret) as unknown;

      if (
        typeof decoded === 'object' &&
        decoded !== null &&
        'userId' in decoded
      ) {
        const userId = (decoded as { userId: string }).userId;

        await this.authService.verifyUser(userId);

        return res.redirect(process.env.DOMAIN + '/successVerify');
      } else {
        throw new Error('Token inválido');
      }
    } catch (err) {
      console.error('Token inválido o expirado:', err);
    }
  }
}
