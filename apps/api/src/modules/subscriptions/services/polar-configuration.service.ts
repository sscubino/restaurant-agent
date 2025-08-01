import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Polar } from '@polar-sh/sdk';
import { Repository } from 'typeorm';

import { PolarConfiguration } from '../entities';

const DEFAULT_PRODUCT_NAME = 'Restaurant Assistant';
const DEFAULT_PRODUCT_DESCRIPTION = 'A virtual assistant for your restaurant';
const DEFAULT_PRODUCT_PRICE_AMOUNT = 1000;
const DEFAULT_PRODUCT_PRICE_CURRENCY = 'usd';
const DEFAULT_PRODUCT_PRICE_AMOUNT_METRED_UNIT = 40;
const DEFAULT_PRODUCT_PRICE_CURRENCY_METRED_UNIT = 'usd';

@Injectable()
export class PolarConfigurationService {
  private readonly polar: Polar;
  private readonly isIntegrationEnabled: boolean;
  private productId: string | null = null;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PolarConfiguration)
    private readonly polarConfigurationRepository: Repository<PolarConfiguration>,
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

  getPolarInstance(): Polar {
    return this.polar;
  }

  getIsIntegrationEnabled(): boolean {
    return this.isIntegrationEnabled;
  }

  async getProductId(): Promise<string | null> {
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
      name: DEFAULT_PRODUCT_NAME,
      description: DEFAULT_PRODUCT_DESCRIPTION,
      prices: [
        {
          amountType: 'fixed',
          priceAmount: DEFAULT_PRODUCT_PRICE_AMOUNT,
          priceCurrency: DEFAULT_PRODUCT_PRICE_CURRENCY,
        },
        {
          amountType: 'metered_unit',
          meterId,
          unitAmount: DEFAULT_PRODUCT_PRICE_AMOUNT_METRED_UNIT,
          priceCurrency: DEFAULT_PRODUCT_PRICE_CURRENCY_METRED_UNIT,
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
        'customer.created',
        'customer.updated',
        'customer.deleted',
        'subscription.created',
        'subscription.updated',
      ],
      format: 'raw',
    });
  }
}
