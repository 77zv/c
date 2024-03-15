import type { Config } from "drizzle-kit";

import { env } from "@seegull/env";

const uri = [
  "mysql://",
  env.DB_USERNAME,
  ":",
  env.DB_PASSWORD,
  "@",
  env.DB_HOST,
  ":3306/",
  env.DB_NAME,
  '?ssl={"rejectUnauthorized":true}',
].join("");

export default {
  schema: "./src/schema",
  driver: "mysql2",
  dbCredentials: { uri },
  tablesFilter: ["t3turbo_*"],
} satisfies Config;
