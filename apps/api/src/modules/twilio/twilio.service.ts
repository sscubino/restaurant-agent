import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Twilio, validateRequest } from 'twilio';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

import { RestaurantTwilioCallsService } from '@/modules/restaurants/services/restaurant-twilio-calls.service';

import { TwilioEndCallDto } from './dto/twilio-end-call.dto';
import { TwilioVoiceWebhookDto } from './dto/twilio-incoming-call.dto';

@Injectable()
export class TwilioService {
  private readonly twilioClient: Twilio;
  private readonly INCOMING_CALL_WEBHOOK: string;
  private readonly END_CALL_WEBHOOK: string;
  private readonly TWILIO_AUTH_TOKEN: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly twilioCallsService: RestaurantTwilioCallsService,
  ) {
    const accountSid = configService.getOrThrow<string>('TWILIO_ACCOUNT_SID');
    const authToken = configService.getOrThrow<string>('TWILIO_AUTH_TOKEN');
    const base_url = configService.getOrThrow<string>('HOST_BASE_URL');

    this.twilioClient = new Twilio(accountSid, authToken);
    this.INCOMING_CALL_WEBHOOK = `${base_url}/api/twilio/incoming-call`;
    this.END_CALL_WEBHOOK = `${base_url}/api/twilio/call-status-change`;
    this.TWILIO_AUTH_TOKEN = authToken;
  }

  async handleIncomingCall(body: TwilioVoiceWebhookDto) {
    if (!body.To) {
      throw new BadRequestException('To is required');
    }

    const { say, websocket } = await this.twilioCallsService.handleIncomingCall(
      body.To,
    );

    const response = new VoiceResponse();

    if (say) {
      response.say(say.attributes, say.message);
    }

    if (websocket) {
      const stream = response.connect().stream({
        url: websocket.url,
      });
      websocket.params?.forEach((param) => {
        stream.parameter(param);
      });
    }

    console.log('twiml', response.toString());

    return response;
  }

  async makeCall(from: string, to: string) {
    const incomingCallWebhook = `${this.INCOMING_CALL_WEBHOOK}`;
    const endCallWebhook = `${this.END_CALL_WEBHOOK}`;

    console.log('--------------------------------');
    console.log('from', from);
    console.log('to', to);
    console.log('INCOMING_CALL_WEBHOOK', incomingCallWebhook);
    console.log('END_CALL_WEBHOOK', endCallWebhook);
    console.log('--------------------------------');
    try {
      return this.twilioClient.calls.create({
        to,
        from,
        url: incomingCallWebhook,
        statusCallback: endCallWebhook,
      });
    } catch (error) {
      console.error('Error making the call:', error);
      throw new InternalServerErrorException('Error making the call');
    }
  }

  async findTwilioPhoneNumber(
    phoneNumber: string,
  ): Promise<{ sid: string } | undefined> {
    const incomingNumber = await this.twilioClient.incomingPhoneNumbers
      .list({ phoneNumber })
      .then((numbers) => numbers[0]);

    return incomingNumber;
  }

  async phoneNumberExistsInTwilio(phoneNumber: string) {
    const phoneNumberExists = await this.findTwilioPhoneNumber(phoneNumber);
    return Boolean(phoneNumberExists);
  }

  async setWebhooksForNumber(phoneNumber: string) {
    const getTwilioPhoneNumber = await this.findTwilioPhoneNumber(phoneNumber);

    if (!getTwilioPhoneNumber) {
      throw new Error(`Phone number ${phoneNumber} not found in Twilio`);
    }

    await this.twilioClient
      .incomingPhoneNumbers(getTwilioPhoneNumber.sid)
      .update({
        voiceUrl: this.INCOMING_CALL_WEBHOOK,
        statusCallback: this.END_CALL_WEBHOOK,
      });
  }

  validateRequest(req: Request) {
    const signature = req.headers['x-twilio-signature'] as string;
    return validateRequest(
      this.TWILIO_AUTH_TOKEN,
      signature,
      `${this.configService.getOrThrow<string>('HOST_BASE_URL')}${req.url}`,
      req.body as Record<string, unknown>,
    );
  }

  // Phone number verification currently not used

  async sendVerificationCode(phoneNumber: string) {
    try {
      const verification = await this.twilioClient.verify.v2
        .services(this.configService.getOrThrow<string>('TWILIO_SERVICE_SID'))
        .verifications.create({ to: phoneNumber, channel: 'sms' });
      return verification;
    } catch (error) {
      console.log(error);
      throw new Error('Error sending verification code, contact support ');
    }
  }

  async verifyCode(phoneNumber: string, code: string) {
    const verificationCheck = await this.twilioClient.verify.v2
      .services(this.configService.getOrThrow<string>('TWILIO_SERVICE_SID'))
      .verificationChecks.create({ to: phoneNumber, code: code });
    return verificationCheck?.valid;
  }

  async registerFinishedPhoneCall(twilioEndCallDto: TwilioEndCallDto) {
    if (!twilioEndCallDto.CallSid) {
      return;
    }

    return this.twilioCallsService.handleCallStatusChange(twilioEndCallDto);
  }
}
