import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class RestaurantOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const hasRestaurant = !!request.user?.restaurant;

    if (!hasRestaurant) {
      throw new ForbiddenException(
        'Forbidden - User does not have a restaurant.',
      );
    }

    return true;
  }
}
