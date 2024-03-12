import { getUserRoute } from "./routes/getUser.route";
import { server } from "./server";

const router = { ...getUserRoute(server) };

export type Router = typeof router;
