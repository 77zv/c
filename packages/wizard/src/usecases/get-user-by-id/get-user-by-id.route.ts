import { createRoute } from "@http-wizard/core";
import { z } from "zod";

import type { Server } from "../../server";
import { User } from "../../types/user/user.types";
import { setupGetUserByIdUseCase } from "./get-user-by-id.usecase";

export const getUserRoute = (server: Server) => {
  const getUserByIdUseCase = setupGetUserByIdUseCase(); // Set up the use case

  return createRoute("/user/:id", {
    method: "GET",
    schema: {
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
          const user = getUserByIdUseCase.execute(
            (req.params as { id: string }).id,
          );
          return res.status(200).send(user);
        } catch (_) {
          await res.status(404).send({ message: "User not found" });
        }
      },
    });
  });
};
