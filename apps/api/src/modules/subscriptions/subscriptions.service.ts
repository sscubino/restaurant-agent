import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Polar } from '@polar-sh/sdk';
import { Repository } from 'typeorm';

import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';

import { PolarConfiguration } from './entities/polar-configuration.entity';
import { PolarCustomer } from './entities/polar-customer.entity';

@Injectable()
export class SubscriptionsService {
  private readonly polar: Polar;
  private readonly isIntegrationEnabled: boolean;
  private productId: string | null = null;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PolarCustomer)
    private readonly polarCustomerRepository: Repository<PolarCustomer>,
    @InjectRepository(PolarConfiguration)
    private readonly polarConfigurationRepository: Repository<PolarConfiguration>,
    private readonly usersService: UsersService,
  ) {
    const environment = this.configService.get<string>('NODE_ENV');
    const accessToken = this.configService.get<string>('POLAR_ACCESS_TOKEN');
    const integrationEnabled =
      this.configService.get<string>('POLAR_ENABLED') === 'true';

    this.isIntegrationEnabled = integrationEnabled;

    this.polar = new Polar({
      server: environment === 'production' ? 'production' : 'sandbox',
      accessToken,
    });

    if (integrationEnabled) {
      if (!accessToken) {
        throw new Error('POLAR_ACCESS_TOKEN is not set');
      }
      void this.setUpPolarProductAndWebhook();
    }
  }

  async createPolarCustomer(user: User) {
    if (!this.isIntegrationEnabled) {
      return;
    }

    const { firstName, lastName, email } = user;

    const customer = await this.polar.customers.create({
      email,
      name: `${firstName} ${lastName}`,
      externalId: user.id,
    });

    const polarCustomer = this.polarCustomerRepository.create({
      id: customer.id,
      user,
    });

    return this.polarCustomerRepository.save(polarCustomer);
  }

  async createCheckoutUrl(userId: string) {
    if (!this.isIntegrationEnabled) {
      return;
    }

    const productId = await this.getProductId();

    if (!productId) {
      throw new Error('Polar product not found');
    }

    let customer = await this.polarCustomerRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!customer) {
      const user = await this.usersService.findOne(userId);
      customer = (await this.createPolarCustomer(user)) as PolarCustomer;
    }

    const checkout = await this.polar.checkouts.create({
      products: [productId],
      customerId: customer.id,
      successUrl: `${this.configService.getOrThrow<string>('FRONTEND_URL')}/checkout-success`,
      metadata: {
        userId,
      },
    });

    return checkout.url;
  }

  async registerPhoneCallEvent(
    userId: string,
    from: string,
    to: string,
    at: Date,
    duration: number,
  ) {
    await this.polar.events.ingest({
      events: [
        {
          name: 'phone_call',
          externalCustomerId: userId,
          metadata: {
            from,
            to,
            at: at.toISOString(),
            duration,
          },
        },
      ],
    });
  }

  async createCustomerPortalUrl(userId: string) {
    if (!this.isIntegrationEnabled) {
      return;
    }

    const customer = await this.getOrCreatePolarCustomer(userId);

    const customerPortal = await this.polar.customerSessions.create({
      customerId: customer.id,
    });

    return customerPortal.customerPortalUrl;
  }

  private async getOrCreatePolarCustomer(userId: string) {
    let customer = await this.polarCustomerRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!customer) {
      const user = await this.usersService.findOne(userId);
      customer = (await this.createPolarCustomer(user)) as PolarCustomer;
    }

    return customer;
  }

  private async setUpPolarProductAndWebhook() {
    const productId = await this.getProductId();

    if (productId) {
      return;
    }

    const meter = await this.createMeter();
    const product = await this.createProduct(meter.id);
    console.log('PRODUCT CREATED IN POLAR', product.id);

    const webhook = await this.setUpWebhook();
    console.log('WEBHOOK CREATED IN POLAR', webhook.id);

    await this.polarConfigurationRepository.save({
      productId: product.id,
      webhookId: webhook.id,
      meterId: meter.id,
      isSandbox: this.configService.get<string>('NODE_ENV'),
    });
  }

  private async createMeter() {
    return this.polar.meters.create({
      name: 'Phone Calls',
      aggregation: {
        func: 'sum',
        property: 'duration',
      },
      filter: {
        conjunction: 'and',
        clauses: [
          {
            property: 'name',
            operator: 'eq',
            value: 'phone-call',
          },
        ],
      },
    });
  }

  private async createProduct(meterId: string) {
    return this.polar.products.create({
      name: 'Test Product',
      description: 'Test Description',
      prices: [
        {
          amountType: 'fixed',
          priceAmount: 1000,
          priceCurrency: 'usd',
        },
        {
          amountType: 'metered_unit',
          meterId,
          unitAmount: 40,
          priceCurrency: 'usd',
        },
      ],
      recurringInterval: 'month',
    });
  }

  private async setUpWebhook() {
    const hostUrl = this.configService.getOrThrow<string>('HOST_BASE_URL');
    if (hostUrl.startsWith('http://')) {
      throw new Error(
        `HOST_BASE_URL must be https to setup webhooks: ${hostUrl}`,
      );
    }
    return this.polar.webhooks.createWebhookEndpoint({
      url: `${hostUrl}/api/subscriptions/webhook`,
      secret: this.configService.getOrThrow<string>('POLAR_WEBHOOK_SECRET'),
      events: [
        'subscription.created',
        'subscription.updated',
        'subscription.canceled',
        'subscription.active',
        'subscription.revoked',
        'subscription.uncanceled',
      ],
      format: 'raw',
    });
  }

  private async getProductId() {
    if (this.productId) {
      return this.productId;
    }

    const configuration = await this.polarConfigurationRepository.findOne({
      where: {
        environment: this.configService.get<string>('NODE_ENV'),
      },
    });

    this.productId = configuration?.productId ?? null;
    return this.productId;
  }
}
