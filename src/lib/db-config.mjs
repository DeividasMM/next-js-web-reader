// Shared by the Next.js app (src/lib/turso.js) and plain Node scripts
// (scripts/db-migrate.mjs), hence .mjs and no "@/" imports.

export const DEFAULT_DATABASE_URL = "file:.data/local.db";

export function getDatabaseConfig(env = process.env) {
  return {
    url: env.TURSO_DATABASE_URL || DEFAULT_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN || undefined,
  };
}
