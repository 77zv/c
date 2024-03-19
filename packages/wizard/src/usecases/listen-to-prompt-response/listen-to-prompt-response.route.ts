import { createRoute } from "@http-wizard/core";
import WebSocket from "ws";
import { z } from "zod";

import { env } from "@seegull/env";

import type { Server } from "../../server";
import { websocketClients } from "../../server";
import { AudioData, AudioDataSchema } from "../../types/user/elevenlabs.types";
import { setupListenToPromptResponseUseCase } from "./listen-to-prompt-response.usecase";

export const listenToPromptResponseRoute = (server: Server) => {
  const listenToPromptResponseUseCase = setupListenToPromptResponseUseCase();

  return createRoute("/listen-to-prompt-response/:id", {
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
      handler: async (_req, res) => {
        await res
          .status(404)
          .send({ message: "HTTPS not supported. Please use WSS." });
      },
      wsHandler: (connection, req) => {
        const clientId = req.url?.split("/").pop() ?? "";
        listenToPromptResponseUseCase.handleConnection(connection, clientId);
      },
    });
  });
};
