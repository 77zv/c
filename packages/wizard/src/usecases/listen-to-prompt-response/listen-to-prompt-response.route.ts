import { createRoute } from "@http-wizard/core";
import WebSocket from "ws";
import { z } from "zod";

import { env } from "@seegull/env";

import type { Server } from "../../server";
import { websocketClients } from "../../server";
import { AudioData, AudioDataSchema } from "../../types/user/elevenlabs.types";

export const listenToPromptResponseRoute = (server: Server) => {
  // dynamic route with :id
  return createRoute("/listen-to-prompt-response/:client-id", {
    method: "POST",
    schema: {
      body: z.union([AudioDataSchema, z.undefined()]),
      params: z.object({
        "client-id": z.string().uuid(),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
    },
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_req, res) => {
        await res
          .status(404)
          .send({ message: "HTTPS not supported. Please use WSS." });
      },
      wsHandler: (connection, req) => {
        const clientId = req.params["client-id"];
        websocketClients.set(clientId, connection);

        connection.socket.onmessage = (event: MessageEvent<string>) => {
          if (AudioDataSchema.safeParse(JSON.parse(event.data)).success) {
            server.log.info(
              `WS message from client => ${clientId}: ${event.data}`,
            );
          }
          server.log.info(
            `WS message from server => ${clientId}: ${event.data}`,
          );
        };

        connection.socket.onopen = () => {
          websocketClients.delete(clientId);
        };
      },
    });
  });
};
