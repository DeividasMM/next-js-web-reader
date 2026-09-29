import { createClient } from "@libsql/client";
import { getDatabaseConfig } from "./db-config.mjs";

let client;

// Created on first query, not at import time: `next build` imports every route
// while collecting page data, when the local database may not exist yet.
function getClient() {
  client ??= createClient(getDatabaseConfig());
  return client;
}

// Falls back to a local SQLite file when TURSO_DATABASE_URL is not set.
// Run `npm run db:migrate` (done automatically by `npm run dev`) to create it.
export const turso = {
  execute: (stmt) => getClient().execute(stmt),
  batch: (stmts, mode) => getClient().batch(stmts, mode),
};
