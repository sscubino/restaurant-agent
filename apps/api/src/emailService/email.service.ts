import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';
import * as jwt from 'jsonwebtoken';
import { RequestNumberDTO } from 'src/auth/dto/request-number.dto';

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.EMAIL_SERVICE_API_KEY);
  }

  async sendVerificationEmail(email: string, userId: number) {
    try {
      const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '1h' },
      );
      console.log('Token generado:', token);

      const verificationLink =
        process.env.DOMAIN + `api/auth/verify?token=${token}`;

      // solo se puede enviar al correo verificado hasta que tengamos dominio, por eso usamos <onboarding@resend.dev>
      const { data, error } = await this.resend.emails.send({
        from: 'noreply@laniakeadev.com',
        // to: [email] (cambiar cuando se tenga dominio)
        to: [email],
        subject: 'Verify your account',
        html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 500px; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin: auto;">
                        <h2 style="color: #333;">Verify Your Account!</h2>
                        <p style="color: #555;">Click the button below to verify your account and access ProjectRestaurant.</p>
                        <a href="${verificationLink}" 
                        style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; 
                                color: #fff; background-color: #ff6600; text-decoration: none; 
                                border-radius: 5px; font-weight: bold; box-shadow: 0 3px 6px rgba(0,0,0,0.16);">
                        Verify Account
                        </a>
                        <p style="font-size: 12px; color: #777;">If you did not request this verification, please ignore this message.</p>
                    </div>
                </div>

                `,
      });

      if (error) {
        console.error('Error de Resend:', error);
        return { success: false, error };
      }

      console.log('Email sent successfully:', data);
      return { success: true, data };
    } catch (err) {
      console.error('Error inesperado:', err);
      return { success: false, error: 'Failed to send email' };
    }
  }

  async sendConfirmationOrder() {}

  async sendRequestNumber(info: RequestNumberDTO) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'noreply@laniakeadev.com',
        to: ['rsmaximiliano@gmail.com'],
        replyTo: info.email,
        subject: 'New request for a twilio number',
        html: `
                        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                            <h2 style="color: #333; text-align: center;">Twilio Number Request</h2>
                            <p style="font-size: 16px; color: #555;">
                                <strong>${info.name} ${info.lastName}</strong> (<a href="tel:${info.phoneNumber}" style="color: #007BFF; text-decoration: none;">${info.phoneNumber}</a>) is requesting a Twilio number.
                            </p>
                            <p>Email: ${info.email}</p>
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-top: 10px;">
                                <p style="margin: 0; font-weight: bold; color: #333;">Message:</p>
                                <p style="margin: 5px 0; color: #555;">${info.message || 'No additional message provided.'}</p>
                            </div>
                            <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
                                Sent automatically from the contact request form.
                            </p>
                        </div>
                `,
      });

      if (error) {
        console.error('Error de Resend:', error);
        return { ok: false, error };
      }

      console.log('Email sent successfully:', data);
      return { ok: true, data };
    } catch (error) {
      console.error('Unexpected error sending email:', error);
      throw new InternalServerErrorException({
        ok: false,
        statusCode: 500,
        message: 'Failed to send email',
        error: 'Internal Server Error',
      });
    }
  }
}
