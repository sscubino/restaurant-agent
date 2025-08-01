import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '@polar-sh/sdk/models/components/customer.js';
import { Subscription } from '@polar-sh/sdk/models/components/subscription';
import {
  validateEvent,
  WebhookVerificationError,
} from '@polar-sh/sdk/webhooks';
import { IncomingHttpHeaders } from 'http';
import { EntityNotFoundError, Repository } from 'typeorm';

import { UsersService } from '@/modules/users/users.service';

import { PolarCustomer, PolarSubscription } from '../entities';

@Injectable()
export class PolarWebhookService {
  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PolarCustomer)
    private readonly polarCustomerRepository: Repository<PolarCustomer>,
    @InjectRepository(PolarSubscription)
    private readonly polarSubscriptionRepository: Repository<PolarSubscription>,
    private readonly usersService: UsersService,
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
    try {
      await this.polarSubscriptionRepository.update(subscription.id, {
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        canceledAt: subscription.canceledAt,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          'A Subscription has been updated in Polar, but it does not exist in the database',
        );
      }
      throw error;
    }
  }

  async handleCustomerCreated(customer: Customer) {
    const userId = customer.externalId;
    if (!userId) return;

    const user = await this.usersService.findOne(userId);
    if (!user) return;

    await this.polarCustomerRepository.upsert(
      { id: customer.id, user },
      { conflictPaths: ['id'] },
    );
  }

  async handleCustomerUpdated(customer: Customer) {
    const userId = customer.externalId;
    if (!userId) return;

    const user = await this.usersService.findOne(userId);
    if (!user) return;

    await this.polarCustomerRepository.upsert(
      { id: customer.id, user },
      { conflictPaths: ['id'] },
    );
  }

  async handleCustomerDeleted(customer: Customer) {
    const userId = customer.externalId;
    if (!userId) return;

    try {
      await this.polarCustomerRepository.delete(customer.id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return;
      }
      throw error;
    }
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
