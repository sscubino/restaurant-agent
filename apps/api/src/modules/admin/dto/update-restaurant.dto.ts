import { OmitType, PartialType } from '@nestjs/swagger';

import { RegisterRestaurantDto } from './register-restaurant.dto';

export class UpdateRestaurantDto extends PartialType(
  OmitType(RegisterRestaurantDto, ['password']),
) {}
