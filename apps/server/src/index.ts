import { db } from "@seegull/db";
import { env } from "@seegull/env";
import { listen } from "@seegull/wizard";

listen({ port: env.SERVER_PORT, host: "0.0.0.0" }, (err, address) => {
  console.log(err ?? `Server listening at ${address}`);
});
