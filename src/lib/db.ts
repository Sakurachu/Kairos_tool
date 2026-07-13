import { neon } from "@neondatabase/serverless";

let client: ReturnType<typeof neon> | undefined;

export function getDb() {
  const connectionString =
    process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_URL;

  if (!connectionString) {
    throw new Error("Database is not configured.");
  }

  client ??= neon(connectionString);
  return client;
}
