import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatGptThreads } from './entities/chatGpThreads.entity';
import * as moment from 'moment-timezone';
import { OpenAIService } from 'src/openai/openai.service';

interface IDataThread {
  numberPhoneFrom: string;
  numberPhoneTo: string;
  dishesAndTables: string;
}

@Injectable()
export class ChatGptThreadsService {
  constructor(
    @InjectRepository(ChatGptThreads)
    private threadsRepository: Repository<ChatGptThreads>,
    private readonly OpenAIService: OpenAIService,
  ) {}

  async createThread(data: IDataThread) {
    try {
      if (!data) {
        throw new BadRequestException('debe de proveer la data correctamente');
      }
      const newTh = await this.OpenAIService.createThread(data.dishesAndTables);

      const newThreads = new ChatGptThreads();
      newThreads.numberPhoneFrom = data.numberPhoneFrom;
      newThreads.numberPhoneTo = data.numberPhoneTo;
      newThreads.threadId = newTh ?? '';
      newThreads.sesionStatus = true;

      await this.threadsRepository.save(newThreads);
      // now. send products and avaiable tables to thread

      return {
        ok: true,
        data: newTh,
        statusCode: 200,
      };
    } catch (error) {
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: error?.message,
        error: 'Bad Request',
      });
    }
  }

  async updateThreadStatus(threadId: string, timeZone: string) {
    try {
      const thread = await this.threadsRepository.findOne({
        where: { threadId },
      });

      if (!thread) {
        throw new BadRequestException('El hilo no fue encontrado.');
      }

      const result = await this.threadsRepository.update(thread.id, {
        last_update: moment.tz(timeZone),
      });

      if (result.affected === 0) {
        throw new BadRequestException('El hilo no se pudo actualizar');
      }

      return {
        ok: true,
        statusCode: 200,
        message: 'Estado del hilo actualizado exitosamente',
      };
    } catch (error) {
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: error?.message,
        error: 'Bad Request',
      });
    }
  }

  async deleteThread({
    phoneNumberFrom,
    phoneNumberTo,
  }: {
    phoneNumberFrom: string;
    phoneNumberTo: string;
  }) {
    try {
      if (!phoneNumberFrom || !phoneNumberTo) {
        throw new BadRequestException(
          'Debe especificar tanto el número de teléfono de origen como el de destino.',
        );
      }

      const resp = await this.threadsRepository.delete({
        numberPhoneFrom: phoneNumberFrom,
        numberPhoneTo: phoneNumberTo,
      });

      if (resp) {
        return {
          ok: true,
          statusCode: 200,
          message: 'thread borrado exitosamente',
        };
      }
    } catch (error) {
      throw new BadRequestException({
        ok: false,
        statusCode: 400,
        message: error?.message,
        error: 'Bad Request',
      });
    }
  }
}
