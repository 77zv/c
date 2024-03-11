import { getUserRoute, server } from "@seegull/wizard";

const router = {
  ...getUserRoute(server),
};

export type Router = typeof router;
