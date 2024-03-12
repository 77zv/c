import { createRoute } from "@http-wizard/core";
import { z } from "zod";

import type { Server } from "../../server";
import { setupPromptAiModelUseCase } from "./prompt-model.usecase";

export const promptModel = (server: Server) => {
  const getAiModelUseCase = setupPromptAiModelUseCase();

  return createRoute("/prompt-model", {
    method: "POST",
    schema: {
      body: z.object({
        prompt: z.string().min(1),
      }),
      response: {
        200: z.object({
          response: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
    },
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (req, res) => {
        try {
          const response = getAiModelUseCase.execute(req.body.prompt);
          return res.status(200).send({ response });
        } catch (_) {
          await res.status(404).send({ message: "Prompt not found" });
        }
      },
    });
  });
};
