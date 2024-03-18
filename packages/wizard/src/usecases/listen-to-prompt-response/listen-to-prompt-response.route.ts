import { createRoute } from "@http-wizard/core";
import WebSocket from "ws";
import { z } from "zod";

import { env } from "@seegull/env";

import type { Server } from "../../server";

export const listenToPromptResponseRoute = (server: Server) => {
  return createRoute("/test", {
    method: "GET",
    schema: {
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
      handler: async (req, reply) => {
        await reply
          .status(404)
          .send({ message: "HTTPS not supported. Please use WSS." });
      },
      wsHandler: (connection) => {
        connection.socket.onmessage = (event: MessageEvent<string>) => {
          const uri = `wss://api.elevenlabs.io/v1/text-to-speech/${env.ELEVEN_LABS_VOICE_ID}/stream-input?model_id=eleven_monolingual_v1`;
        };

        connection.socket.onopen = () => {
          connection.socket.send("__on open__");
        };
      },
    });
  });
};
