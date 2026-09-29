// Usage: npm run db:migrate
// Applies pending migrations to the database configured in .env.local
// (TURSO_DATABASE_URL), or to the local file database when it is not set.

import { mkdir } from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import { createClient } from "@libsql/client";
import { getDatabaseConfig } from "../src/lib/db-config.mjs";
import { migrate } from "../db/migrate.mjs";

nextEnv.loadEnvConfig(process.cwd());

const config = getDatabaseConfig();

if (config.url.startsWith("file:")) {
  const filePath = config.url.slice("file:".length).split("?")[0];
  await mkdir(path.dirname(path.resolve(filePath)), { recursive: true });
}

const client = createClient(config);
const target = config.url.startsWith("file:") ? config.url : "remote database";

try {
  const ran = await migrate(client);
  if (ran.length) {
    console.log(`[db] Applied ${ran.length} migration(s) to ${target}:`);
    for (const name of ran) console.log(`  - ${name}`);
  } else {
    console.log(`[db] ${target} is up to date.`);
  }
} catch (error) {
  console.error(`[db] ${error.message}`);
  process.exitCode = 1;
} finally {
  client.close();
}
