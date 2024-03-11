import { server } from '@seegull/wizard';

server.listen({ port: 5000, host: "0.0.0.0" }, () => {
  console.log("server listening");
});
