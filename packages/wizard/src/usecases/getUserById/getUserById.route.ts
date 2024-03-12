// src/usecases/getUserById/getUserById.route.ts
import { createRoute } from "@http-wizard/core";
import { z } from "zod";

import type { Server } from "../../server";
import { User } from "../../models/user/user.model";
// import { setupGetUserByIdUseCase } from "./getUserById.usecase";
import { setupGetUserByIdUseCase } from "./getUserById.usecase";

export const getUserByIdRoute = (server: Server) => {
  const getUserByIdUseCase = setupGetUserByIdUseCase(); // Set up the use case

  return createRoute("/user/:id", {
    method: "POST",
    schema: {
      body: z.object({
        id: z.string(),
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
      handler: async (req, res) => {
        try {
          const user = getUserByIdUseCase.execute(req.body.id);
          return res.status(200).send(user);
        } catch (_) {
          await res.status(404).send({ message: "User not found" });
        }
      },
    });
  });
};
