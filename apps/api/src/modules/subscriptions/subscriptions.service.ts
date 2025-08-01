import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';

import { PolarCustomer } from './entities';
import { PolarConfigurationService } from './services/polar-configuration.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PolarCustomer)
    private readonly polarCustomerRepository: Repository<PolarCustomer>,
    private readonly polarConfigurationService: PolarConfigurationService,
    private readonly usersService: UsersService,
  ) {}

  async createPolarCustomer(user: User) {
    if (!this.polarConfigurationService.getIsIntegrationEnabled()) {
      return;
    }

    const { firstName, lastName, email } = user;

    const polar = this.polarConfigurationService.getPolarInstance();
    const customer = await polar.customers.create({
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
    if (!this.polarConfigurationService.getIsIntegrationEnabled()) {
      throw new InternalServerErrorException(
        'Polar integration is not enabled. Please contact support.',
      );
    }

    const productId = await this.polarConfigurationService.getProductId();

    if (!productId) {
      throw new Error('Polar product not found');
    }

    const customer = await this.findOrCreatePolarCustomer(userId);

    const polar = this.polarConfigurationService.getPolarInstance();
    const checkout = await polar.checkouts.create({
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
    if (!this.polarConfigurationService.getIsIntegrationEnabled()) {
      return;
    }

    const polar = this.polarConfigurationService.getPolarInstance();
    await polar.events.ingest({
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
    if (!this.polarConfigurationService.getIsIntegrationEnabled()) {
      throw new Error('Polar integration is disabled');
    }

    const customer = await this.findOrCreatePolarCustomer(userId);

    const polar = this.polarConfigurationService.getPolarInstance();
    const customerPortal = await polar.customerSessions.create({
      customerId: customer.id,
    });

    return customerPortal.customerPortalUrl;
  }

  private async findOrCreatePolarCustomer(userId: string) {
    const customer = await this.polarCustomerRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (customer) {
      return customer;
    }

    const user = await this.usersService.findOne(userId);
    const newCustomer = await this.createPolarCustomer(user);

    if (newCustomer) {
      return newCustomer;
    }

    throw new Error('Polar customer not created');
  }
}
