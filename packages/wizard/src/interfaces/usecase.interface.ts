import type { SocketStream } from "@fastify/websocket";

export interface IUseCase<I, O> {
  execute(input: I): O | Promise<O>;
}

export interface IWebSocketUseCase<T = void> {
  handleConnection(connection: SocketStream, input?: T): void;
}
