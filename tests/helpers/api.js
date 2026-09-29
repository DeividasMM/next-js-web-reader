import { vi } from "vitest";

/**
 * Shared mocks for API route tests. Every test file that imports a route must
 * declare these two mocks (vi.mock calls are hoisted per file):
 *
 *   vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
 *   vi.mock("@/lib/turso", async () => {
 *     const { createTestDb } = await import("../helpers/db");
 *     return { turso: await createTestDb() };
 *   });
 */

export async function signInAs(userId) {
  const { auth } = await import("@clerk/nextjs/server");
  vi.mocked(auth).mockResolvedValue({ userId });
}

export async function signOut() {
  const { auth } = await import("@clerk/nextjs/server");
  vi.mocked(auth).mockResolvedValue({ userId: null });
}

export function jsonRequest(url, method, body) {
  return new Request(`http://localhost${url}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function getRequest(url, method = "GET") {
  return new Request(`http://localhost${url}`, { method });
}
