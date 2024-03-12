import { server } from "./server";
import { getUserByIdRoute } from "./usecases/get-user-by-id/get-user-by-id.route";

const router = { ...getUserByIdRoute(server) };

export type Router = typeof router;
