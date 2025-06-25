import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import {
  ParameterAttributes,
  SayAttributes,
} from 'twilio/lib/twiml/VoiceResponse';

import { RestaurantTwilioCallsService } from '@/modules/restaurants/services/restaurant-twilio-calls.service';

import { TwilioEndCallDto } from './dto/twilio-end-call.dto';
import { TwilioVoiceWebhookDto } from './dto/twilio-incoming-call.dto';

@Injectable()
export class TwilioService {
  private readonly twilioClient: twilio.Twilio;
  private readonly INCOMING_CALL_WEBHOOK: string;
  private readonly END_CALL_WEBHOOK: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly twilioCallsService: RestaurantTwilioCallsService,
  ) {
    const accountSid = configService.getOrThrow<string>('TWILIO_ACCOUNT_SID');
    const authToken = configService.getOrThrow<string>('TWILIO_AUTH_TOKEN');
    const base_url = configService.getOrThrow<string>('HOST_BASE_URL');

    this.twilioClient = twilio(accountSid, authToken);
    this.INCOMING_CALL_WEBHOOK = `${base_url}/api/twilio/incoming-call`;
    this.END_CALL_WEBHOOK = `${base_url}/api/twilio/call-status-change`;
    console.log('this.INCOMING_CALL_WEBHOOK', this.INCOMING_CALL_WEBHOOK);
    console.log('this.END_CALL_WEBHOOK', this.END_CALL_WEBHOOK);
  }

  async handleIncomingCall(body: TwilioVoiceWebhookDto) {
    if (!body.To) {
      throw new BadRequestException('To is required');
    }

    const { say, websocket } = await this.twilioCallsService.handleIncomingCall(
      body.To,
    );

    const twiml = new twilio.twiml.VoiceResponse();

    if (say) {
      twiml.say(say.attributes, say.message);
    }

    if (websocket) {
      const stream = twiml.connect().stream({
        url: websocket.url,
      });
      websocket.params?.forEach((param) => {
        stream.parameter(param);
      });
    }

    console.log('twiml', twiml.toString());

    return twiml;
  }

  buildWebhookResponse({
    websocket,
    say,
  }: {
    websocket?: {
      url: string;
      params?: ParameterAttributes[];
    };
    say?: { attributes: SayAttributes; message: string };
  }) {
    const twiml = new twilio.twiml.VoiceResponse();

    if (say) {
      twiml.say(say.attributes, say.message);
    }

    if (websocket) {
      const stream = twiml.connect().stream({
        url: websocket.url,
      });
      websocket.params?.forEach((param) => {
        stream.parameter(param);
      });
    }

    return twiml;
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
    console.log('--------------------------------');
    console.log('--------------------------------');
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
