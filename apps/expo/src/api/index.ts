import type { ZodTypeProvider } from "@http-wizard/core";
import { createQueryClient } from "@http-wizard/react-query";
import axios from "axios";

import type { Router } from "@seegull/wizard";

export const api = createQueryClient<Router, ZodTypeProvider>({
  instance: axios.create({
    baseURL: "http://192.168.2.34:3000",
  }),
});
