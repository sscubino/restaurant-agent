import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { TwilioService } from './twilo.service';
import { twiml } from 'twilio';
import { Response } from 'express';
import { ChatGptThreadsService } from 'src/chatGptThreads/chatGptThreads.service';
import { UserService } from 'src/user/user.service';
import { DishService } from 'src/dish/dish.service';
import { TableService } from 'src/table/table.service';
import * as twilio from 'twilio';
import { CallsService } from 'src/calls/calls.service';

@Controller('twilio')
export class TwiloController {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly chatGptThreead: ChatGptThreadsService,
    private readonly userService: UserService,
    private readonly dishService: DishService,
    private readonly tablesServices: TableService,
    private readonly CallService: CallsService,
  ) {}

  @Post('/incomingCalls')
  async handleIncomingCall(@Body() body: any, @Res() res: Response) {
    const { From, To, CallSid } = body;

    const respData = await this.userService.getUserIdByPhone(To.slice(1));

    if (respData?.userId === undefined || respData?.companyName === undefined) {
      throw new Error('No se encontró un usuario con ese número de teléfono.');
    }

    const dishesText = await this.dishService.getFormatedText(respData.userId);
    const tablesText = await this.tablesServices.getFormatedText(
      respData.userId,
    );
    const now = new Date().getDate();
    const dishesAndTables =
      `Current_Time: ${now} \n` + dishesText + '\n' + tablesText;

    const voiceResponse = new twilio.twiml.VoiceResponse();

    const websocketUrl =
      process.env.DOMAIN?.replace('https', 'wss') + `media-stream`;

    voiceResponse.say(
      {
        voice: 'Polly.Joanna',
        language: 'en-US',
      },
      `¡Hello!, This is ${respData.companyName}, How can i help you?`,
    );

    try {
      const connect = voiceResponse.connect();
      const stream = connect.stream({ url: websocketUrl });
      stream.parameter({ name: 'userId', value: respData.userId.toString() });
      stream.parameter({ name: 'dataRestaurant', value: dishesAndTables });
    } catch (error) {
      console.log('error en conexion con ws', error);
    }

    res.type('text/xml');
    res.send(voiceResponse.toString());
  }

  @Post('/finishCalls')
  async finishCall(@Body() body: any, @Res() res: Response) {
    const call = await this.CallService.createCall({
      accountSid: body.AccountSid ?? '',
      callSid: body.CallSid ?? '',
      callStatus: body.CallStatus ?? '',
      direction: body.Direction ?? '',
      duration: body.Duration ?? '',
      from: body.From ?? '',
      fromCountry: body.FromCountry ?? '',
      timestamp: body.Timestamp ?? '',
      to: body.To ?? '',
      toCountry: body.ToCountry ?? '',
    });

    if (call.ok) {
      console.log('se creo la llamada');
      return {
        ok: true,
        message: 'Call completed successfully',
      };
    }

    return {
      ok: false,
      message: 'There was an error ending the call.',
    };
  }

  @Post('/makeCall')
  makeCall() {
    return this.twilioService.makeCall();
  }

  @Post('/simulateMessage')
  async simulateMessage(@Body() data: { message: string }) {
    const dishesText = await this.dishService.getFormatedText(28);
    const tablesText = await this.tablesServices.getFormatedText(28);
    const dishesAndTable = dishesText + '\n' + tablesText;
    return this.userService.simulateMessage(data.message, dishesAndTable);
  }
}
