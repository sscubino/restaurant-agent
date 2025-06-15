const VoiceResponse = require('twilio').twiml.VoiceResponse;
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OpenAIService } from 'src/openai/openai.service';
import { Twilio } from 'twilio';
import { RawData, WebSocket } from 'ws';
import { instructions } from './instructions';
import { OrderService } from 'src/order/order.service';

@WebSocketGateway({
  path: '/media-stream',
})
export class MediaStreamGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly openAiService: OpenAIService,
    private readonly orderService: OrderService,
  ) {}

  @WebSocketServer()
  server: any;

  private sessionData: {
    [streamSid: string]: {
      callSid?: string;
      userId: string;
      latestMediaTimestamp: number;
      responseStartTimestamp: number | null;
      markQueue: any[];
      lastAssistantItem: string | null;
      hasResponded: boolean;
      accumulatedAudio: Buffer;
      isProcessing: boolean;
      dataRestaurant: string;
    };
  } = {};

  private openAIConnections: { [streamSid: string]: WebSocket } = {};

  private readonly ORIGINAL_SAMPLE_RATE = 8000;
  private readonly TARGET_SAMPLE_RATE = 16000;

  handleConnection(client: any) {
    console.log('Cliente conectado por WebSocket');

    client.on('message', async (data: string) => {
      try {
        const message = JSON.parse(data);
        const { streamSid } = message;

        if (message.event === 'start') {
          const userId = message.start.customParameters?.userId;
          const dataRestaurant = message.start.customParameters?.dataRestaurant;
          const callSid = message.start.callSid;

          if (callSid && userId) {
            this.sessionData[streamSid] = {
              callSid,
              userId,
              latestMediaTimestamp: 0,
              responseStartTimestamp: null,
              markQueue: [],
              lastAssistantItem: null,
              hasResponded: false,
              accumulatedAudio: Buffer.alloc(0),
              isProcessing: false,
              dataRestaurant: dataRestaurant,
            };

            client.streamSid = streamSid;
            await this.connectToOpenAIRealtime(streamSid, client);
          } else {
            console.warn(
              'No se recibió callSid o userId en el evento start:',
              message,
            );
          }
        }

        if (message.event === 'media' && message.media) {
          if (this.sessionData[streamSid]) {
            this.sessionData[streamSid].latestMediaTimestamp =
              message.media.timestamp;
          }
          const ws = this.openAIConnections[streamSid];
          if (ws && ws.readyState === WebSocket.OPEN) {
            const audioAppend = {
              type: 'input_audio_buffer.append',
              audio: message.media.payload,
            };
            ws.send(JSON.stringify(audioAppend));
          }
        }

        if (message.event === 'mark') {
          if (this.sessionData[streamSid]?.markQueue.length) {
            this.sessionData[streamSid].markQueue.shift();
          }
        }
      } catch (err) {
        console.error('Error procesando el mensaje del cliente:', err);
      }
    });

    client.on('close', () => {
      for (const sid in this.openAIConnections) {
        this.openAIConnections[sid]?.close();
        delete this.openAIConnections[sid];
      }
    });
  }

  private sendClearAudioBufferEvent(streamSid: string) {
    const openAiWs = this.openAIConnections[streamSid];
    if (openAiWs && openAiWs.readyState === WebSocket.OPEN) {
      const clearEvent = {
        type: 'input_audio_buffer.clear',
        event_id: this.generateEventId(),
      };
      openAiWs.send(JSON.stringify(clearEvent));
      console.log(
        `Evento input_audio_buffer.clear enviado para stream ${streamSid}`,
      );
    } else {
      console.warn(
        `No se pudo enviar input_audio_buffer.clear: WebSocket no está abierto para stream ${streamSid}`,
      );
    }
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  async connectToOpenAIRealtime(streamSid: string, client: any) {
    try {
      const wsUrl =
        'wss://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview-2024-12-17';
      const openAiWs = new WebSocket(wsUrl, {
        headers: {
          Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
          'OpenAI-Beta': 'realtime=v1',
        },
      });

      openAiWs.on('open', () => {
        const data = this.sessionData[streamSid].dataRestaurant;
        const sessionUpdate = {
          type: 'session.update',
          session: {
            turn_detection: {
              type: 'server_vad',
              silence_duration_ms: 300,
              threshold: 0.5,
              prefix_padding_ms: 300,
            },
            input_audio_format: 'g711_ulaw',
            output_audio_format: 'g711_ulaw',
            voice: 'alloy',
            instructions:
              `\n Dishes and tables availables: \n ${data} \n ` + instructions,
            modalities: ['text', 'audio'],
            temperature: 0.6,
          },
        };
        openAiWs.send(JSON.stringify(sessionUpdate));
      });

      try {
        openAiWs.on('message', async (data: RawData) => {
          const messageStr = typeof data === 'string' ? data : data.toString();
          try {
            const parsedMessage = JSON.parse(messageStr);

            if (parsedMessage.type === 'response.done') {
              if (parsedMessage.response.status === 'failed') {
                return;
              }

              const jsonResponseCompleted =
                parsedMessage.response.output[0]?.status;

              if (jsonResponseCompleted === 'completed') {
                console.log(parsedMessage.response.output[0].content[0]);

                const jsonResponse =
                  parsedMessage.response.output[0].content[0].transcript;

                const formattedJson = jsonResponse.replace(/"\s*"/g, 'null');

                try {
                  const parsedData = JSON.parse(formattedJson);
                  if (parsedData.ok === true) {
                    await this.orderService.create(
                      {
                        productsIds: parsedData.productsIds,
                        total: parsedData.total,
                        typeOrder: parsedData.typeOrder,
                        date: parsedData.date ?? new Date(),
                        direction: parsedData?.direction ?? undefined,
                        tableId: parsedData.tableId ?? undefined,
                      },
                      parseInt(this.sessionData[streamSid].userId),
                    );

                    this.closeOpenAIConnection(streamSid);

                    await this.endTwilioCall(streamSid);
                  }
                } catch (error) {
                  console.log('error es', error);
                }
              }
            }

            if (
              parsedMessage.type === 'response.text.delta' &&
              parsedMessage.delta
            ) {
              console.log('entro aqui');
            }

            if (
              parsedMessage.type === 'response.audio.delta' &&
              parsedMessage.delta
            ) {
              const audioDelta = {
                event: 'media',
                streamSid,
                media: { payload: parsedMessage.delta },
              };
              client.send(JSON.stringify(audioDelta));

              const session = this.sessionData[streamSid];
              if (session) {
                if (!session.responseStartTimestamp) {
                  session.responseStartTimestamp = session.latestMediaTimestamp;
                }
                const deltaBuffer = Buffer.from(parsedMessage.delta, 'base64');
                session.accumulatedAudio = Buffer.concat([
                  session.accumulatedAudio,
                  deltaBuffer,
                ]);

                if (parsedMessage.item_id) {
                  session.lastAssistantItem = parsedMessage.item_id;
                }
                this.sendMark(client, streamSid);
              }
            }

            if (parsedMessage.type === 'input_audio_buffer.speech_started') {
              console.log('limpiar');

              this.sendClearAudioBufferEvent(streamSid);
              this.handleSpeechStartedEvent(client, streamSid);
            }
          } catch (err) {
            console.log('Hubo un error', err);
          }
        });
      } catch (error) {
        console.log(error);
      }

      openAiWs.on('error', (err: Error) => {
        console.error(
          `Error en el WebSocket de OpenAI para stream ${streamSid}:`,
          err,
        );
      });

      openAiWs.on('close', () => {
        delete this.openAIConnections[streamSid];
      });
      this.openAIConnections[streamSid] = openAiWs;
    } catch (error) {
      console.error('Error al conectar con OpenAI:', error);
    }
  }

  private async endTwilioCall(streamSid: string) {
    const session = this.sessionData[streamSid];
    if (!session?.callSid) {
      return;
    }

    try {
      const clientTwilio = new Twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );

      await clientTwilio.calls(session.callSid).update({ status: 'completed' });
      this.cleanupSession(streamSid);
    } catch (err) {
      console.error(
        `Error al finalizar la llamada de Twilio para callSid ${session.callSid}:`,
        err,
      );
    }
  }

  private cleanupSession(streamSid: string) {
    this.closeOpenAIConnection(streamSid);
    delete this.sessionData[streamSid];
  }

  private sendMark(client: any, streamSid: string) {
    if (streamSid) {
      const markEvent = {
        event: 'mark',
        streamSid,
        mark: { name: 'responsePart' },
      };
      client.send(JSON.stringify(markEvent));
      if (this.sessionData[streamSid]) {
        this.sessionData[streamSid].markQueue.push('responsePart');
      }
    }
  }

  private closeOpenAIConnection(streamSid: string) {
    const openAiWs = this.openAIConnections[streamSid];
    if (openAiWs && openAiWs.readyState === WebSocket.OPEN) {
      openAiWs.close();
      delete this.openAIConnections[streamSid];
      console.log(`Conexión de OpenAI cerrada para stream ${streamSid}`);
    } else {
      console.warn(
        `No se pudo cerrar la conexión de OpenAI: WebSocket no está abierto para stream ${streamSid}`,
      );
    }
  }

  private handleSpeechStartedEvent(client: any, streamSid: string) {
    const session = this.sessionData[streamSid];
    if (session) {
      session.markQueue = [];
      session.lastAssistantItem = null;
      session.responseStartTimestamp = null;
      session.hasResponded = false;
      session.isProcessing = false;

      client.send(JSON.stringify({ event: 'clear', streamSid }));

      if (
        session.responseStartTimestamp !== null &&
        session.lastAssistantItem
      ) {
        const elapsedTime =
          session.latestMediaTimestamp - session.responseStartTimestamp;
        const truncateEvent = {
          type: 'conversation.item.truncate',
          item_id: session.lastAssistantItem,
          content_index: 0,
          audio_end_ms: elapsedTime,
        };
        const openAiWs = this.openAIConnections[streamSid];
        if (openAiWs && openAiWs.readyState === WebSocket.OPEN) {
          openAiWs.send(JSON.stringify(truncateEvent));
        }
      }
    }
  }

  handleDisconnect(client: any) {
    const streamSid = client.streamSid;

    if (streamSid) {
      this.openAIConnections[streamSid]?.close();
      delete this.openAIConnections[streamSid];

      delete this.sessionData[streamSid];
      console.log(`Sesión y conexión limpiadas para stream ${streamSid}`);
    } else {
      console.warn(
        'No se encontró streamSid para el cliente que se desconectó',
      );
    }
  }
}
