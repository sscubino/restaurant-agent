import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, EntityManager } from 'typeorm';

import { InviteCodesService } from '@/modules/invite-codes/invite-codes.service';
import { ResendService } from '@/modules/resend/resend.service';
import { RestaurantsService } from '@/modules/restaurants/restaurants.service';
import { SubscriptionsService } from '@/modules/subscriptions/subscriptions.service';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';

import { LoginDto, RegisterDto, RegisterWithInviteCodeDto } from './dto';
import { JwtPayload } from './strategies/jwt.strategy';

export interface AuthResponse {
  access_token: string;
  user: User;
}

interface EmailVerificationPayload {
  verify: string;
  for: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private restaurantsService: RestaurantsService,
    private jwtService: JwtService,
    private inviteCodesService: InviteCodesService,
    private subscriptionsService: SubscriptionsService,
    private resendService: ResendService,
    private configService: ConfigService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(user.id);

    return this.getAuthResponsePayload(user);
  }

  async registerWithInviteCode(
    registerDto: RegisterWithInviteCodeDto,
    inviteCode: string,
  ): Promise<AuthResponse> {
    const validInviteCode = await this.validateInviteCode(inviteCode);
    registerDto.companyPhone =
      validInviteCode.twilioPhoneNumber ?? registerDto.companyPhone;
    return this.register(registerDto, inviteCode);
  }

  async register(
    registerDto: RegisterDto,
    inviteCode?: string,
  ): Promise<AuthResponse> {
    const user = await this.dataSource.transaction(async (entityManager) => {
      const user = await this.createUser(registerDto, entityManager);

      const restaurant = await this.createRestaurant(
        registerDto,
        user,
        entityManager,
      );

      if (inviteCode) {
        await this.inviteCodesService.claimCode(
          inviteCode,
          user.id,
          entityManager,
        );
      }

      return { ...user, restaurant };
    });

    this.subscriptionsService.createPolarCustomer(user).catch((error) => {
      console.error(`Failed to create customer in Polar: ${error}`);
    });

    void this.sendVerificationEmail(user);

    return this.getAuthResponsePayload(user);
  }

  async getProfile(userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  async sendVerificationEmail(user: User) {
    const payload: EmailVerificationPayload = {
      verify: user.email,
      for: user.id,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '2h' });
    await this.resendService.sendVerificationEmail(
      user.email,
      `${this.configService.getOrThrow<string>('HOST_BASE_URL')}/api/auth/verify-email?token=${token}`,
    );
  }

  async verifyEmail(token: string) {
    const payload = this.jwtService.verify<EmailVerificationPayload>(token);
    await this.usersService.verifyEmail(payload.for, payload.verify);
  }

  private getAuthResponsePayload(user: User): AuthResponse {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  private async validateInviteCode(inviteCode: string) {
    const invite = await this.inviteCodesService.findByCode(inviteCode);

    if (invite.isUsed) {
      throw new BadRequestException('Invite code has already been used');
    }

    return invite;
  }

  private async createUser(
    registerDto: RegisterDto,
    entityManager: EntityManager,
  ) {
    return this.usersService.create(
      {
        ...registerDto,
        isSuperUser: false,
      },
      entityManager,
    );
  }

  private async createRestaurant(
    registerDto: RegisterDto,
    user: User,
    entityManager: EntityManager,
  ) {
    if (!registerDto.companyName) {
      return undefined;
    }

    return this.restaurantsService.create(
      {
        name: registerDto.companyName,
        phone: registerDto.companyPhone ?? '',
        userId: user.id,
      },
      entityManager,
    );
  }
}
