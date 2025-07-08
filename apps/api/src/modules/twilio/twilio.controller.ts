import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { SuperUserGuard } from '@/modules/auth/guards/super-user.guard';

import { SimulateCallDto } from './dto/simulate-call.dto';
import { TwilioEndCallDto } from './dto/twilio-end-call.dto';
import { TwilioVoiceWebhookDto } from './dto/twilio-incoming-call.dto';
import { TwilioService } from './twilio.service';

@Controller('twilio')
@ApiTags('Twilio')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('incoming-call')
  @ApiOperation({
    summary: 'Incoming call webhook',
    description: 'Handles incoming calls from Twilio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Incoming call handled successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid Twilio request',
  })
  async handleIncomingCall(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: TwilioVoiceWebhookDto,
  ) {
    if (!this.twilioService.validateRequest(req)) {
      throw new UnauthorizedException('Invalid Twilio request');
    }

    console.log('=== Twilio Voice Webhook Called ===');
    console.log('Body:', {
      CallSid: body.CallSid,
      From: body.From,
      To: body.To,
    });
    console.log('===================================');

    const twiml = await this.twilioService.handleIncomingCall(body);

    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());
  }

  @Post('call-status-change')
  @ApiOperation({
    summary: 'Call status change webhook',
    description: 'Handles call status changes from Twilio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Call status change handled successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid Twilio request',
  })
  async finishCall(@Req() req: Request, @Body() body: TwilioEndCallDto) {
    if (!this.twilioService.validateRequest(req)) {
      throw new UnauthorizedException('Invalid Twilio request');
    }

    console.log('=== Twilio End Call Called ===');
    console.log('Body:', {
      CallSid: body.CallSid,
      CallStatus: body.CallStatus,
      From: body.From,
      FromCountry: body.FromCountry,
      To: body.To,
      ToCountry: body.ToCountry,
    });
    console.log('==============================');

    await this.twilioService.registerFinishedPhoneCall(body);
  }

  @Get('simulate-phone-call')
  @UseGuards(JwtAuthGuard, SuperUserGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Simulate a phone call',
    description:
      'Simulates a phone call using Twilio. Requires super-user privileges.',
  })
  @ApiResponse({
    status: 200,
    description: 'Phone call simulation initiated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Super user privileges required',
  })
  async simulatePhoneCall(@Query() query: SimulateCallDto) {
    await this.twilioService.makeCall(query.from, query.to);
  }
}
