import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';

@Module({
  imports: [],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
