import {
  Controller,
  Get,
  Post,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PolarWebhookService } from './services/polar-webhook.service';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly polarWebhookService: PolarWebhookService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @ApiOperation({ summary: 'Handle Polar webhook' })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Post('webhook')
  async handlePolarWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const body = req.rawBody as string | Buffer;
    const headers = req.headers;
    const event = this.polarWebhookService.validateWebhookEvent(body, headers);

    switch (event.type) {
      case 'subscription.created':
        await this.polarWebhookService.handleSubscriptionCreated(event.data);
        break;
      case 'subscription.updated':
        await this.polarWebhookService.handleSubscriptionUpdated(event.data);
        break;
      case 'subscription.canceled':
        await this.polarWebhookService.handleSubscriptionCanceled(event.data);
        break;
      case 'subscription.active':
        await this.polarWebhookService.handleSubscriptionActive(event.data);
        break;
      case 'subscription.revoked':
        await this.polarWebhookService.handleSubscriptionRevoked(event.data);
        break;
      case 'subscription.uncanceled':
        await this.polarWebhookService.handleSubscriptionUncanceled(event.data);
        break;
    }

    res.status(200).send('OK');
  }

  @ApiOperation({ summary: 'Get checkout URL' })
  @ApiResponse({
    status: 200,
    description: 'Checkout URL',
    type: String,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('checkout')
  async getCheckout(@Req() req: Request) {
    const userId = req.user!.id;
    return this.subscriptionsService.createCheckoutUrl(userId);
  }

  @ApiOperation({ summary: 'Get customer portal URL' })
  @ApiResponse({
    status: 200,
    description: 'Customer portal URL',
    type: String,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('customer-portal')
  async getCustomerPortal(@Req() req: Request) {
    const userId = req.user!.id;
    return this.subscriptionsService.createCustomerPortalUrl(userId);
  }
}
