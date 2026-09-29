import { createClient } from "@libsql/client";
import { getDatabaseConfig } from "./db-config.mjs";

// Falls back to a local SQLite file when TURSO_DATABASE_URL is not set.
// Run `npm run db:migrate` (done automatically by `npm run dev`) to create it.
export const turso = createClient(getDatabaseConfig());
