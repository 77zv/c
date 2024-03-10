import { getUserRoute, server } from '@seegull/wizard';
import type {Server} from "@seegull/wizard";

const router = { getUserRoute(server as Server) };

export type Router = typeof router;

server.listen({ port: 5000, host: '0.0.0.0' }, () => {
  console.log('server listening');
});