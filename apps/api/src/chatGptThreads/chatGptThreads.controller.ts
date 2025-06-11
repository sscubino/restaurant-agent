import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
} from '@nestjs/common';
import { ChatGptThreadsService } from './chatGptThreads.service';

@Controller('/threads')
export class ChatGptThreadsController {
  constructor(private readonly chatGptThreadsService: ChatGptThreadsService) {}

  @Post()
  handleCreateThreads(@Body() data) {
    return this.chatGptThreadsService.createThread(data);
  }

  @Put(':threadId')
  handleUpdateThreadStatus(
    @Param('threadId') threadId: string,
    @Req() request: Request,
  ) {
    const timeZone = request['timeZone'];
    return this.chatGptThreadsService.updateThreadStatus(threadId, timeZone);
  }
}
