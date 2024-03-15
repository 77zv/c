import { env } from "env";

import { db } from "@seegull/db";
import { startServer } from "@seegull/wizard";

await startServer({ port: env.SERVER_PORT, host: "0.0.0.0" });
