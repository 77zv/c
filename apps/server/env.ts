import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../../.env" });

export const env = createEnv({
  server: {
    // DATABASE_URL: z.string().url(),
    // OPEN_AI_API_KEY: z.string().min(1),
    SERVER_PORT: z
      .string()
      .length(4)
      .transform((val) => parseInt(val, 10)),
  },
  runtimeEnv: process.env,
});
