import { createRoute } from "@http-wizard/core";
import { z } from "zod";

import type { Server } from "../../server";
import { PromptModelSchema } from "../../types/user/openai.types";
import { setupPromptAiModelUseCase } from "./prompt-model.usecase";

export const promptModelRoute = (server: Server) => {
  const getAiModelUseCase = setupPromptAiModelUseCase();

  return createRoute("/prompt-model", {
    method: "POST",
    schema: {
      body: PromptModelSchema,
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
      // todo: create firebase jwt auth prehandler
      // preHandler: async (req, res) => {},
      handler: async (req, res) => {
        try {
          const response = await getAiModelUseCase.execute(req.body);

          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta.content;

            console.log(content);
          }

          return res.status(200).send({ response: "Prompt created" });
        } catch (_) {
          await res.status(404).send({ message: "Prompt not found" });
        }
      },
    });
  });
};
