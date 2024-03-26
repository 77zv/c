import type { SocketStream } from "@fastify/websocket";

import type { IWebSocketUseCase } from "../../interfaces/usecase.interface";
import { server, websocketClients } from "../../server";
import { AudioDataSchema } from "../../types/user/elevenlabs.types";

export class ListenToPromptResponseUseCase
  implements IWebSocketUseCase<string>
{
  handleConnection(connection: SocketStream, clientId: string): void {
    websocketClients.set(clientId, connection);

    connection.socket.onmessage = (event: MessageEvent<string>) => {
      // server.log.info(`WS message from server => ${clientId}: ${event.data}`);

      const parsedData = AudioDataSchema.parse(JSON.parse(event.data));

      // if (parsedData.isFinal) {
      //   connection.socket.close();
      // }
    };
  }
}

export const setupListenToPromptResponseUseCase = () => {
  return new ListenToPromptResponseUseCase();
};
