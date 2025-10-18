import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '@/env';

export const client = createClient({ 
  url: process.env.NODE_ENV === "production" ? env.TURSO_DATABASE_URL : env.DB_FILE_NAME,
  authToken: env.TURSO_AUTH_TOKEN,
  ...(process.env.NODE_ENV === "development" && { 
    syncUrl:  env.TURSO_DATABASE_URL,
    syncInterval: 60,
    encryptionKey: env.REPLICA_ENCRYPTION_KEY 
  }),
});

export const db = drizzle({ client });