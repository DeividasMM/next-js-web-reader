import { afterEach, describe, expect, it, vi } from "vitest";

// Uses the real src/lib/turso.js (no vi.mock in this file).
describe("turso client", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("does not open the database at import time", async () => {
    // `next build` imports every route while collecting page data, before
    // any migration has created the local database folder.
    vi.stubEnv("TURSO_DATABASE_URL", "file:missing-folder/nested/local.db");

    await expect(import("@/lib/turso")).resolves.toHaveProperty("turso");
  });

  it("connects on first query", async () => {
    vi.stubEnv("TURSO_DATABASE_URL", ":memory:");
    const { turso } = await import("@/lib/turso");

    const { rows } = await turso.execute("SELECT 1 AS one");
    expect(rows[0].one).toBe(1);
  });
});
