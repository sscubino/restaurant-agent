import { Injectable } from '@nestjs/common';

import { AssistantService } from '@/modules/assistant/assistant.service';
import { PhoneCallsService } from '@/modules/phone-calls/phone-calls.service';
import { RestaurantsService } from '@/modules/restaurants/restaurants.service';
import { TwilioEndCallDto } from '@/modules/twilio/dto/twilio-end-call.dto';

@Injectable()
export class RestaurantTwilioCallsService {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly assistantService: AssistantService,
    private readonly phoneCallsService: PhoneCallsService,
  ) {}

  async handleIncomingCall(phoneNumber: string) {
    const restaurant =
      await this.restaurantsService.findByPhoneNumber(phoneNumber);

    if (!restaurant) {
      console.error(`Restaurant with phone number ${phoneNumber} not found`);
      return {
        say: {
          attributes: {
            voice: 'Polly.Joanna',
            language: 'en-US',
          },
          message:
            'I am sorry, but the business you are trying to reach is not available at the moment. Please try again later.',
        },
      } as const;
    }

    const websocket =
      await this.assistantService.getAssistantUrlAndParametersFor(restaurant);

    const say = {
      attributes: {
        voice: 'Polly.Joanna',
        language: 'en-US',
      },
      message: `¡Hello!, This is ${restaurant.name}, How may I help you?`,
    } as const;

    return { say, websocket };
  }

  async handleCallStatusChange(twilioEndCallDto: TwilioEndCallDto) {
    const restaurant = await this.restaurantsService.findByPhoneNumber(
      twilioEndCallDto.To,
    );

    if (!restaurant) {
      return;
    }

    return this.phoneCallsService.savePhoneCall({
      accountSid: twilioEndCallDto.AccountSid,
      callSid: twilioEndCallDto.CallSid,
      callStatus: twilioEndCallDto.CallStatus,
      direction: twilioEndCallDto.Direction || '',
      duration: twilioEndCallDto.Duration,
      from: twilioEndCallDto.From || '',
      fromCountry: twilioEndCallDto.FromCountry || '',
      restaurantId: restaurant.id,
      timestamp: twilioEndCallDto.Timestamp || '',
      to: twilioEndCallDto.To,
      toCountry: twilioEndCallDto.ToCountry,
    });
  }
}
