import type { FastifyListenOptions } from "fastify";
import { createRoute } from "@http-wizard/core";
import { z } from "zod";

import { User } from "./models/user/user.model";
import { server } from "./server";
import { createUserRoute } from "./usecases/create-user/create-user.route";
import { getUserRoute } from "./usecases/get-user-by-id/get-user-by-id.route";
import { promptModelRoute } from "./usecases/prompt-model/prompt-model.route";

const router = {
  ...getUserRoute(server),
  ...createUserRoute(server),
  ...promptModelRoute(server),
};

export const startServer = (opts: FastifyListenOptions) => {
  server.listen(opts, () => {
    console.log(`server listening on ${opts.port}`);
  });
};

export type Router = typeof router;
