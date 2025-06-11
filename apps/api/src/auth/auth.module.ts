import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TwilioService } from 'src/twiloService/twilo.service';
import { OpenAIModule } from 'src/openai/openai.module';
import { EmailModule } from 'src/emailService/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '2h' },
    }),
    OpenAIModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TwilioService, UserService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
