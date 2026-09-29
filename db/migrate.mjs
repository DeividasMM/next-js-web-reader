import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const MIGRATIONS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "migrations"
);

const MIGRATION_NAME = /^\d{4}_[\w-]+\.sql$/;

/**
 * Applies every db/migrations/*.sql file that is not yet recorded in the
 * _migrations table, in filename order. Each file runs in its own transaction.
 * Returns the names of the migrations that were applied.
 */
export async function migrate(client, dir = MIGRATIONS_DIR) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name       TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const { rows } = await client.execute("SELECT name FROM _migrations");
  const applied = new Set(rows.map((row) => row.name));

  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  const ran = [];

  for (const file of files) {
    if (applied.has(file)) continue;
    if (!MIGRATION_NAME.test(file)) {
      throw new Error(
        `Invalid migration filename "${file}" (expected NNNN_description.sql)`
      );
    }

    const sql = await readFile(path.join(dir, file), "utf8");
    try {
      await client.executeMultiple(
        `BEGIN;\n${sql}\n;INSERT INTO _migrations (name) VALUES ('${file}');\nCOMMIT;`
      );
    } catch (error) {
      await client.execute("ROLLBACK").catch(() => {});
      throw new Error(`Migration ${file} failed: ${error.message}`, {
        cause: error,
      });
    }
    ran.push(file);
  }

  return ran;
}
