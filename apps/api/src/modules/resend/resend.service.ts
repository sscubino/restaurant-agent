import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

import { verificationEmailTemplate } from './templates/verifation-email.template';

@Injectable()
export class ResendService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>(
      'EMAIL_SERVICE_API_KEY',
    );
    this.resend = new Resend(apiKey);
  }

  async sendVerificationEmail(email: string, emailVerificationLink: string) {
    const { error } = await this.resend.emails.send({
      from: this.configService.get<string>(
        'EMAIL_SERVICE_FROM_EMAIL',
        'onboarding@resend.dev',
      ),
      to: email,
      subject: 'Confirm your email',
      html: verificationEmailTemplate(emailVerificationLink),
    });

    if (error) {
      console.error(`Error sending verification email for "${email}":`, error);
    }
  }
}
