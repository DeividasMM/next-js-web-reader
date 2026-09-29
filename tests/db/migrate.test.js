import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createClient } from "@libsql/client";
import { describe, expect, it } from "vitest";
import { migrate } from "../../db/migrate.mjs";
import {
  DEFAULT_DATABASE_URL,
  getDatabaseConfig,
} from "../../src/lib/db-config.mjs";

async function tableNames(client) {
  const { rows } = await client.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  );
  return rows.map((r) => r.name);
}

describe("migrate", () => {
  it("creates the schema on an empty database", async () => {
    const client = createClient({ url: ":memory:" });
    const ran = await migrate(client);

    expect(ran).toContain("0001_init.sql");
    expect(await tableNames(client)).toEqual([
      "_migrations",
      "notes",
      "pdfs",
      "users",
    ]);
  });

  it("is idempotent", async () => {
    const client = createClient({ url: ":memory:" });
    await migrate(client);
    expect(await migrate(client)).toEqual([]);
  });

  it("rolls back a failing migration and does not record it", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "migrations-"));
    await writeFile(
      path.join(dir, "0001_ok.sql"),
      "CREATE TABLE a (id INTEGER);"
    );
    await writeFile(
      path.join(dir, "0002_broken.sql"),
      "CREATE TABLE b (id INTEGER); THIS IS NOT SQL;"
    );

    const client = createClient({ url: ":memory:" });
    await expect(migrate(client, dir)).rejects.toThrow(/0002_broken\.sql/);

    expect(await tableNames(client)).toEqual(["_migrations", "a"]);
    const { rows } = await client.execute("SELECT name FROM _migrations");
    expect(rows.map((r) => r.name)).toEqual(["0001_ok.sql"]);
  });

  it("rejects badly named migration files", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "migrations-"));
    await writeFile(path.join(dir, "add-stuff.sql"), "SELECT 1;");

    const client = createClient({ url: ":memory:" });
    await expect(migrate(client, dir)).rejects.toThrow(/Invalid migration/);
  });
});

describe("getDatabaseConfig", () => {
  it("falls back to the local file database", () => {
    expect(getDatabaseConfig({})).toEqual({
      url: DEFAULT_DATABASE_URL,
      authToken: undefined,
    });
  });

  it("uses Turso credentials from the environment", () => {
    expect(
      getDatabaseConfig({
        TURSO_DATABASE_URL: "libsql://reader.turso.io",
        TURSO_AUTH_TOKEN: "token",
      })
    ).toEqual({ url: "libsql://reader.turso.io", authToken: "token" });
  });
});
