import { server } from "./server";
import { getUserByIdRoute } from "./usecases/getUserById/getUserById.route";

const router = { ...getUserByIdRoute(server) };

export type Router = typeof router;
