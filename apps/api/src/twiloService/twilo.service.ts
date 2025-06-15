import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  private client: twilio.Twilio;
  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    this.client = twilio(accountSid, authToken);
  }

  async makeCall() {
    const from = '+1 857 380 5818';
    const to = '+1 828 721 5073';

    try {
      const call = await this.client.calls.create({
        to,
        from,
        url: process.env.DOMAIN + '/incomingCalls',
      });
      return call;
    } catch (error) {
      throw new Error('Error al realizar la llamada: ' + error.message);
    }
  }

  async sendVerificationCode(phoneNumber: string) {
    try {
      console.log(process.env.TWILIO_SERVICE_SID ?? '');

      const verification = await this.client.verify.v2
        .services(process.env.TWILIO_SERVICE_SID ?? '')
        .verifications.create({ to: phoneNumber, channel: 'sms' });
      return verification;
    } catch (error) {
      console.log(error);
      throw new Error('Error sending verification code, contact support ');
    }
  }

  async setWebhooksForNumber(
    phoneNumber: string,
    webhooks: { incomingCallWebhook: string; callStatusWebhook: string },
  ) {
    try {
      const incomingNumber = await this.client.incomingPhoneNumbers
        .list({ phoneNumber })
        .then((numbers) => numbers[0]);

      if (!incomingNumber) {
        throw new Error(`Phone number ${phoneNumber} not found in Twilio`);
      }

      await this.client.incomingPhoneNumbers(incomingNumber.sid).update({
        voiceUrl: webhooks.incomingCallWebhook,
        statusCallback: webhooks.callStatusWebhook,
      });
    } catch (error) {
      console.error('Error setting Twilio webhooks:', error);
      throw new Error('Failed to configure Twilio webhooks');
    }
  }

  async existNumberInTwilio(number) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID ?? '';
      const authToken = process.env.TWILIO_AUTH_TOKEN ?? '';

      const { data } = await axios.get(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json?PhoneNumber=%+${number}`,
        {
          auth: {
            username: accountSid,
            password: authToken,
          },
          params: {
            PhoneNumber: '+' + number,
          },
        },
      );

      if (data.incoming_phone_numbers.length > 0) {
        return true;
      }

      return false;
    } catch (error) {
      console.log('ocurrio un error', error.response.data.message);
      return false;
    }
  }

  async verifyCode(phoneNumber: string, code: string) {
    try {
      const verificationCheck = await this.client.verify.v2
        .services(process.env.TWILIO_SERVICE_SID ?? '')
        .verificationChecks.create({ to: phoneNumber, code: code });
      return verificationCheck?.valid;
    } catch (error) {
      throw new Error('Invalid verification code');
    }
  }
}
