/* eslint-disable @typescript-eslint/no-base-to-string */
import { ConfigService } from '@nestjs/config';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Twilio } from 'twilio';
import { Server, WebSocket } from 'ws';

import { CreateOrderDto } from '@/modules/orders/dto';

import { AssistantService } from './assistant.service';
import { INSTRUCTIONS } from './constants/instructions';

type WebSocketMessage = StartMessage | MediaMessage | MarkMessage;

interface StartMessage {
  streamSid: string;
  event: 'start';
  start: {
    callSid: string;
    customParameters: {
      restaurantId: string;
      dataRestaurant: string;
    };
  };
}

interface MediaMessage {
  streamSid: string;
  event: 'media';
  media: {
    timestamp: number;
    payload: string;
  };
}

interface MarkMessage {
  streamSid: string;
  event: 'mark';
  mark: {
    name: string;
  };
}

interface OpenAIMessage {
  type: string;
  delta?: string;
  item_id?: string;
  response: {
    status: string;
    status_details?: {
      type: string;
      error?: unknown;
    };
    output?: {
      status: string;
      content: {
        type: string;
        text: string;
        transcript: string;
      }[];
    }[];
  };
  error?: unknown;
}

@WebSocketGateway({
  path: '/api/assistant/connect',
})
export class AssistantGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly configService: ConfigService,
    private readonly assistantService: AssistantService,
  ) {}

  @WebSocketServer()
  server: Server;

  private sessionData: {
    [streamSid: string]: {
      callSid?: string;
      restaurantId: string;
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

  handleConnection(client: WebSocket) {
    console.log('Cliente conectado por WebSocket');

    client.on('message', (data: string) => {
      const message = JSON.parse(data) as WebSocketMessage;
      const { streamSid, event } = message;

      if (event === 'start') {
        const { start } = message;
        const restaurantId = start.customParameters?.restaurantId;
        const dataRestaurant = start.customParameters?.dataRestaurant;
        const callSid = start.callSid;

        if (callSid && restaurantId) {
          this.sessionData[streamSid] = {
            callSid,
            restaurantId,
            latestMediaTimestamp: 0,
            responseStartTimestamp: null,
            markQueue: [],
            lastAssistantItem: null,
            hasResponded: false,
            accumulatedAudio: Buffer.alloc(0),
            isProcessing: false,
            dataRestaurant: dataRestaurant,
          };

          client['streamSid'] = streamSid;
          this.connectToOpenAIRealtime(streamSid, client);
        }
      }

      if (event === 'media' && message.media) {
        const { media } = message;
        if (this.sessionData[streamSid]) {
          this.sessionData[streamSid].latestMediaTimestamp = media.timestamp;
        }
        const ws = this.openAIConnections[streamSid];
        if (ws && ws.readyState === WebSocket.OPEN) {
          const audioAppend = {
            type: 'input_audio_buffer.append',
            audio: media.payload,
          };
          ws.send(JSON.stringify(audioAppend));
        }
      }

      if (event === 'mark') {
        if (this.sessionData[streamSid]?.markQueue.length) {
          this.sessionData[streamSid].markQueue.shift();
        }
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

  private connectToOpenAIRealtime(streamSid: string, client: WebSocket) {
    try {
      const openAiWsUrl = this.configService.getOrThrow<string>(
        'OPENAI_REALTIME_URL',
      );
      const openAiWs = new WebSocket(openAiWsUrl, {
        headers: {
          Authorization:
            'Bearer ' + this.configService.getOrThrow('OPENAI_API_KEY'),
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
            instructions: `Dishes and tables availables:\n${data}\n${INSTRUCTIONS}\n`,
            modalities: ['text', 'audio'],
            temperature: 0.6,
          },
        };
        openAiWs.send(JSON.stringify(sessionUpdate));
      });

      try {
        openAiWs.on('message', (data) => {
          const messageStr = typeof data === 'string' ? data : data.toString();
          let parsedMessage: OpenAIMessage;

          try {
            parsedMessage = JSON.parse(messageStr) as OpenAIMessage;
          } catch (error) {
            console.error('Error parsing OpenAI WebSocket Message:', error);
            return;
          }

          console.log('event', parsedMessage.type);
          console.log('status', parsedMessage.response?.status);

          try {
            if (parsedMessage.type === 'response.done') {
              if (parsedMessage.response.status === 'failed') {
                console.error('OpenAI Response Failed');
                console.error(parsedMessage.response.status_details?.error);
                return;
              }

              const responseOutputStatus =
                parsedMessage.response.output?.[0]?.status;

              if (responseOutputStatus === 'completed') {
                const responseOutputContent =
                  parsedMessage.response.output?.[0]?.content?.[0];

                let orderData:
                  | (CreateOrderDto & { ok: boolean })
                  | { ok: false };

                let jsonResponse = '';

                if (responseOutputContent?.type === 'text') {
                  jsonResponse = responseOutputContent.text;
                  console.log('text', jsonResponse);
                }

                if (responseOutputContent?.type === 'audio') {
                  jsonResponse = responseOutputContent.transcript;
                  console.log('transcript', jsonResponse);
                }

                if (jsonResponse && jsonResponse.startsWith('{')) {
                  const formattedJson = jsonResponse.replace(/"\s*"/g, 'null');

                  try {
                    orderData = JSON.parse(formattedJson) as CreateOrderDto & {
                      ok: boolean;
                    };
                  } catch (error) {
                    orderData = { ok: false };
                    console.error('Error parsing JSON:', error);
                  }

                  if (orderData.ok === true) {
                    const restaurantId =
                      this.sessionData[streamSid]?.restaurantId;
                    console.log('creating new order', orderData);
                    void this.assistantService.createNewOrder(
                      orderData,
                      restaurantId,
                    );

                    this.closeOpenAIConnection(streamSid);

                    void this.endTwilioCall(streamSid);
                  }
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
        console.log('error received from openai:', err);
        console.error(
          `Error en el WebSocket de OpenAI para stream ${streamSid}:`,
          err,
        );
      });

      openAiWs.on('close', () => {
        console.log('openai client closed');
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
        this.configService.getOrThrow('TWILIO_ACCOUNT_SID'),
        this.configService.getOrThrow('TWILIO_AUTH_TOKEN'),
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

  private sendMark(client: WebSocket, streamSid: string) {
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

  private handleSpeechStartedEvent(client: WebSocket, streamSid: string) {
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

  handleDisconnect(client: WebSocket & { streamSid: string }) {
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
