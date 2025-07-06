import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from '@polar-sh/sdk/models/components/subscription';
import {
  validateEvent,
  WebhookVerificationError,
} from '@polar-sh/sdk/webhooks';
import { IncomingHttpHeaders } from 'http';
import { Repository } from 'typeorm';

import { PolarSubscription } from '../entities/polar-subscription.entity';

@Injectable()
export class PolarWebhookService {
  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PolarSubscription)
    private readonly polarSubscriptionRepository: Repository<PolarSubscription>,
  ) {
    this.webhookSecret = this.configService.getOrThrow<string>(
      'POLAR_WEBHOOK_SECRET',
    );
  }

  async handleSubscriptionCreated(subscription: Subscription) {
    await this.polarSubscriptionRepository.upsert(
      {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        polarCustomer: { id: subscription.customerId },
      },
      {
        conflictPaths: ['id'],
        skipUpdateIfNoValuesChanged: true,
      },
    );
  }

  async handleSubscriptionUpdated(subscription: Subscription) {
    await this.polarSubscriptionRepository.update(subscription.id, {
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
    });
  }

  async handleSubscriptionCanceled(subscription: Subscription) {
    await this.polarSubscriptionRepository.update(subscription.id, {
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      canceledAt: subscription.canceledAt,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    });
  }

  async handleSubscriptionActive(subscription: Subscription) {
    await this.polarSubscriptionRepository.update(subscription.id, {
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
    });
  }

  async handleSubscriptionRevoked(subscription: Subscription) {
    await this.polarSubscriptionRepository.update(subscription.id, {
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
    });
  }

  async handleSubscriptionUncanceled(subscription: Subscription) {
    await this.polarSubscriptionRepository.update(subscription.id, {
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      canceledAt: null,
      cancelAtPeriodEnd: false,
    });
  }

  validateWebhookEvent(body: string | Buffer, headers: IncomingHttpHeaders) {
    try {
      return validateEvent(
        body,
        headers as Record<string, string>,
        this.webhookSecret,
      );
    } catch (error) {
      if (error instanceof WebhookVerificationError) {
        console.log('Invalid signature');
        throw new BadRequestException('Invalid signature');
      }
      throw error;
    }
  }
}
