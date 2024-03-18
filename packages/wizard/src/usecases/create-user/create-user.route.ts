import { createRoute } from "@http-wizard/core";
import { z } from "zod";

import type { Server } from "../../server";
import { User } from "../../types/user/user.types";

export const createUserRoute = (server: Server) => {
  return createRoute("/user/create", {
    method: "POST",
    schema: {
      body: z.object({
        id: z.string().min(1),
      }),
      response: {
        200: User,
        404: z.object({
          message: z.string(),
        }),
      },
    },
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_req, res) => {
        try {
          return res.status(200).send({ message: "User created" });
        } catch (_) {
          await res.status(404).send({ message: "User not found" });
        }
      },
    });
  });
};
