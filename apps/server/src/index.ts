import { env } from "env";

import { server } from "@seegull/wizard";

server.listen({ port: 5000, host: "0.0.0.0" }, () => {
  console.log("server listening");
  // console.log(env.SERVER_PORT);
  console.log(env.SERVER_PORT);
});
