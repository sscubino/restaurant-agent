import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { TwilioService } from 'src/twiloService/twilo.service';
import { EmailService } from 'src/emailService/email.service';
import { RequestNumberDTO } from './dto/request-number.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private twilioService: TwilioService,
    private emailService: EmailService,
  ) {}

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: number,
    phone_country_code: number,
    company_name: string,
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      if (!phone || !phone_country_code) {
        throw new BadRequestException('Invalid phone or country code');
      }

      const usreExists = await this.userRepository.findOne({
        where: { email: email },
      });
      if (usreExists?.id) {
        throw new BadRequestException('Email already use');
      }

      const phoneFinal = phone_country_code.toString() + phone.toString();
      const user = this.userRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isActive: false,
        phoneWithCountry: phoneFinal,
        company_name: company_name,
      });

      const existNumberInTwilio = await this.twilioService.existNumberInTwilio(
        user.phoneWithCountry,
      );

      const webhookUrl = process.env.DOMAIN;
      await this.twilioService.setWebhooksForNumber(phoneFinal, {
        incomingCallWebhook: `${webhookUrl}/twilio/incomingCalls`,
        callStatusWebhook: `${webhookUrl}/twilio/finishCalls`,
      });

      if (existNumberInTwilio) {
        await this.userRepository.save(user);
      } else {
        throw new BadRequestException('The number does not exist in twilio');
      }
      const res = await this.emailService.sendVerificationEmail(
        user.email,
        user.id,
      );

      if (res.success) {
        return {
          message: 'We have sent an email to verify your account.',
          ok: true,
        };
      } else {
        return { message: res.error, ok: false };
      }
    } catch (error) {
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: error?.message || 'error register user',
        error: 'Bad Request',
      });
    }
  }

  async verifyAccount(code: string, userId: number) {
    if (!code || !userId) {
      throw new BadRequestException('Invalid phone or country code');
    }

    const usreExists = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!usreExists) {
      throw new BadRequestException('Email already use');
    }
    const userValid = await this.twilioService.verifyCode(
      `+${usreExists.phoneWithCountry}`,
      code,
    );
    if (userValid) {
      usreExists.phoneValidated = true;
      this.userRepository.save(usreExists);
      return { message: 'Phone validated' };
    } else {
      throw new BadRequestException('Invalid phone code');
    }
  }

  async sendVerifyCode(userId: number) {
    if (!userId) {
      throw new BadRequestException('Invalid phone or country code');
    }

    const usreExists = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!usreExists) {
      throw new BadRequestException('Email already use');
    }
    await this.twilioService.sendVerificationCode(
      `+${usreExists.phoneWithCountry}`,
    );
    return { message: 'Code sended!' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Please check your email to verify your account.',
      );
    }
    const payload = { id: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'secretKey',
      }),
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phoneWithCountry',
        'phoneValidated',
        'company_name',
      ],
    });
    return {
      ok: true,
      user,
    };
  }

  async verifyUser(userId: number) {
    try {
      const userExist = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (userExist) {
        userExist.isActive = true;

        await this.userRepository.save(userExist);

        return {
          ok: true,
          message: 'User verify successfully',
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async requestNumber(data: RequestNumberDTO) {
    try {
      const resp = await this.emailService.sendRequestNumber(data);

      if (resp.ok === true) {
        return {
          ok: true,
          message: 'Email sent successfully!',
        };
      } else {
        return {
          ok: false,
          message: 'An error occurred while sending the email',
        };
      }
    } catch (error) {
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: error?.message || 'error sending email',
        error: 'Bad Request',
      });
    }
  }
}
