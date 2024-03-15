import type { FastifyListenOptions } from "fastify";

import { server } from "./server";
import { createUserRoute } from "./usecases/create-user/create-user.route";
import { getUserRoute } from "./usecases/get-user-by-id/get-user-by-id.route";
import { promptModelRoute } from "./usecases/prompt-model/prompt-model.route";

const router = {
  ...getUserRoute(server),
  ...createUserRoute(server),
  ...promptModelRoute(server),
};

export const listen = (
  opts: FastifyListenOptions,
  callback: (err: Error | null, address: string) => void,
): void => server.listen(opts, callback);

export type Router = typeof router;
