import { env } from "env";

import { db } from "@seegull/db";
import { listen } from "@seegull/wizard";

// await startServer({ port: env.SERVER_PORT, host: "0.0.0.0" });

listen({ port: env.SERVER_PORT, host: "0.0.0.0" }, (err, address) => {
  console.log(err ?? `Server listening at ${address}`);
});
