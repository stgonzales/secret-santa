import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    DB_FILE_NAME: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url().optional(),
    TURSO_DATABASE_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
    REPLICA_ENCRYPTION_KEY: z.uuidv4(),
    FEAT_WISHLIST: z.string().default("false").transform(v => v === "true" ? true : false),
    FEAT_DRAWN: z.string().default("false").transform(v => v === "true"),
    FEAT_CHILDRENS: z.string().default("false").transform(v => v === "true"),
    USER_ADMIN: z.string()
  },
  client: {},
  experimental__runtimeEnv: {}
});