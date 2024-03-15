import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../../.env" });

export const env = createEnv({
  server: {
    DB_HOST: z.string().min(1),
    DB_NAME: z.string().min(1),
    DB_USERNAME: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    SERVER_PORT: z
      .string()
      .length(4)
      .transform((val) => parseInt(val, 10)),
    OPEN_AI_API_KEY: z.string().min(1),
    ELEVEN_LABS_API_KEY: z.string().min(1),
    // DATABASE_URL: z.string().url(),
  },
  runtimeEnv: process.env,
});
