import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class SuperUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const isSuperUser = request.user?.isSuperUser;

    if (!isSuperUser) {
      throw new ForbiddenException('Super user privileges required');
    }

    return true;
  }
}
