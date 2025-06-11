import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as FormData from 'form-data';
import fetch from 'node-fetch';
import { Readable } from 'stream';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async speechToText(audioBuffer: Buffer) {
    try {
      const formData = new FormData();
      formData.append('file', audioBuffer, {
        filename: 'audio.wav',
        contentType: 'audio/wav',
      });
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');
      formData.append('temperature', '0.0');

      const response = await fetch(
        'https://api.openai.com/v1/audio/transcriptions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            ...formData.getHeaders(),
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`error en la traducción: ${await response.text()}`);
      }

      const data: any = await response.json();

      console.log('dijo', data.text);

      return data?.text;
    } catch (error) {
      console.log('Error en speechToText:', error);
    }
  }

  async generateAudio(text: string): Promise<Buffer> {
    try {
      const mp3 = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: text,
      });

      return Buffer.from(await mp3.arrayBuffer());
    } catch (error) {
      throw new Error('Error generating audio: ' + error.message);
    }
  }

  async createThread(dishesAndTable) {
    try {
      const thread = await this.openai.beta.threads.create({
        messages: [{ role: 'assistant', content: dishesAndTable }],
      });
      console.log('Thread creado:', thread);
      return thread.id;
    } catch (error) {
      console.error('Error creando thread:', error);
    }
  }

  async sendMessageAndRun(threadId: string, message: string) {
    const TIMEOUT = 30000;
    const POLL_INTERVAL = 500;

    try {
      const [_, run] = await Promise.all([
        this.openai.beta.threads.messages.create(threadId, {
          role: 'user',
          content: message,
        }),
        this.openai.beta.threads.runs.create(threadId, {
          assistant_id: process.env.ASSISTANT_ID ?? '',
        }),
      ]);

      const startTime = Date.now();

      while (true) {
        const elapsed = Date.now() - startTime;
        if (elapsed > TIMEOUT) {
          throw new Error(
            'Tiempo de espera agotado para la respuesta del asistente',
          );
        }

        const runResult = await this.openai.beta.threads.runs.retrieve(
          threadId,
          run.id,
        );

        if (runResult.status === 'completed') {
          // Aquí solo consultamos una vez cuando la ejecución está completa
          const messagesResponse: any =
            await this.openai.beta.threads.messages.list(threadId, {
              limit: 1,
              order: 'desc',
            });

          const latestMessage = messagesResponse.data[0];
          if (
            latestMessage?.role === 'assistant' &&
            latestMessage.content[0]?.text
          ) {
            console.log(latestMessage.content[0]);

            const textResponse = latestMessage.content[0]?.text.value.trim();

            // Buscar solo el JSON en la respuesta
            const jsonMatch = textResponse.match(/\{.*\}$/s);

            if (!jsonMatch) {
              console.warn(
                '❌ No se encontró JSON en la respuesta. Respuesta:',
                textResponse,
              );
              return { ok: false, message: textResponse };
            }

            try {
              // Transformar JSON a objeto de JavaScript
              const jsonResponse = JSON.parse(jsonMatch[0]);
              console.log('✅ Respuesta JSON válida:', jsonResponse);

              // ✅ Retorna el objeto JSON listo para usar
              return jsonResponse;
            } catch (error) {
              console.error('❌ Error al parsear JSON:', jsonMatch[0]);
              return {
                ok: false,
                message: 'Error en la respuesta del asistente.',
              };
            }
          }

          throw new Error('Respuesta del asistente mal formada');
        }

        // Manejo de estado fallido del asistente
        if (runResult.status === 'failed') {
          console.error('❌ Ejecución fallida en el asistente');
          return { ok: false, message: 'Ejecución fallida en el asistente.' };
        }

        // Reducir el tiempo de espera entre verificaciones
        const remaining = TIMEOUT - elapsed;
        await new Promise((res) =>
          setTimeout(res, Math.min(POLL_INTERVAL, remaining)),
        );
      }
    } catch (error) {
      console.error('Error en sendMessageAndRun:', error);
      return {
        ok: false,
        message: error.message || 'Error desconocido en la ejecución',
      };
    }
  }

  cleanJSON = (jsonString: string) => {
    return jsonString
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/[\u2028\u2029]/g, '')
      .replace(/[“”]/g, '"')
      .trim();
  };
}
