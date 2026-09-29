import { beforeEach, describe, expect, it, vi } from "vitest";
import { turso } from "@/lib/turso";
import { POST as postComment } from "@/app/api/postComment/route";
import { PUT as updateComment } from "@/app/api/updateComment/route";
import { DELETE as deleteComment } from "@/app/api/deleteComment/route";
import { getRequest, jsonRequest, signInAs, signOut } from "../helpers/api";
import { insertBook, insertNote, resetDb } from "../helpers/db";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/turso", async () => {
  const { createTestDb } = await import("../helpers/db");
  return { turso: await createTestDb() };
});

const ALICE = "user_alice";
const BOB = "user_bob";

async function noteContents() {
  const { rows } = await turso.execute(
    "SELECT content FROM notes ORDER BY note_id"
  );
  return rows.map((r) => r.content);
}

beforeEach(async () => {
  await resetDb(turso);
  await signInAs(ALICE);
});

describe("POST /api/postComment", () => {
  it("returns 401 when signed out", async () => {
    await signOut();
    const res = await postComment(
      jsonRequest("/api/postComment", "POST", { pdf_id: 1, content: "x" })
    );
    expect(res.status).toBe(401);
  });

  it("returns 400 without content", async () => {
    const id = await insertBook(turso);
    const res = await postComment(
      jsonRequest("/api/postComment", "POST", { pdf_id: id, content: "" })
    );
    expect(res.status).toBe(400);
  });

  it("does not add a note to another user's book", async () => {
    const id = await insertBook(turso, { user_id: BOB });
    const res = await postComment(
      jsonRequest("/api/postComment", "POST", { pdf_id: id, content: "spam" })
    );
    expect(res.status).toBe(404);
    expect(await noteContents()).toEqual([]);
  });

  it("saves a note and an extraction", async () => {
    const id = await insertBook(turso);

    const note = await postComment(
      jsonRequest("/api/postComment", "POST", {
        pdf_id: id,
        content: "my thought",
        isExtraction: false,
        bookmark_page: 2,
      })
    );
    const extraction = await postComment(
      jsonRequest("/api/postComment", "POST", {
        pdf_id: id,
        content: "quoted text",
        isExtraction: true,
        bookmark_page: 5,
      })
    );

    expect(note.status).toBe(201);
    expect(extraction.status).toBe(201);

    const { rows } = await turso.execute(
      "SELECT content, isExtraction, bookmark_page FROM notes ORDER BY note_id"
    );
    expect(rows.map((r) => ({ ...r }))).toEqual([
      { content: "my thought", isExtraction: 0, bookmark_page: 2 },
      { content: "quoted text", isExtraction: 1, bookmark_page: 5 },
    ]);
  });
});

describe("PUT /api/updateComment", () => {
  it("returns 401 when signed out", async () => {
    await signOut();
    const res = await updateComment(
      jsonRequest("/api/updateComment", "PUT", { note_id: 1, content: "x" })
    );
    expect(res.status).toBe(401);
  });

  it("returns 400 without content", async () => {
    const res = await updateComment(
      jsonRequest("/api/updateComment", "PUT", { note_id: 1 })
    );
    expect(res.status).toBe(400);
  });

  it("does not edit a note on another user's book", async () => {
    const bookId = await insertBook(turso, { user_id: BOB });
    const noteId = await insertNote(turso, bookId, { content: "original" });

    const res = await updateComment(
      jsonRequest("/api/updateComment", "PUT", {
        note_id: noteId,
        content: "hacked",
      })
    );
    expect(res.status).toBe(404);
    expect(await noteContents()).toEqual(["original"]);
  });

  it("updates the user's note", async () => {
    const bookId = await insertBook(turso);
    const noteId = await insertNote(turso, bookId, { content: "draft" });

    const res = await updateComment(
      jsonRequest("/api/updateComment", "PUT", {
        note_id: noteId,
        content: "final",
      })
    );
    expect(res.status).toBe(200);
    expect(await noteContents()).toEqual(["final"]);
  });
});

describe("DELETE /api/deleteComment", () => {
  it("returns 401 when signed out", async () => {
    await signOut();
    const res = await deleteComment(
      getRequest("/api/deleteComment?note_id=1", "DELETE")
    );
    expect(res.status).toBe(401);
  });

  it("returns 400 without a note_id", async () => {
    const res = await deleteComment(getRequest("/api/deleteComment", "DELETE"));
    expect(res.status).toBe(400);
  });

  it("does not delete a note on another user's book", async () => {
    const bookId = await insertBook(turso, { user_id: BOB });
    const noteId = await insertNote(turso, bookId, { content: "keep me" });

    const res = await deleteComment(
      getRequest(`/api/deleteComment?note_id=${noteId}`, "DELETE")
    );
    expect(res.status).toBe(404);
    expect(await noteContents()).toEqual(["keep me"]);
  });

  it("deletes the user's note", async () => {
    const bookId = await insertBook(turso);
    const noteId = await insertNote(turso, bookId);

    const res = await deleteComment(
      getRequest(`/api/deleteComment?note_id=${noteId}`, "DELETE")
    );
    expect(res.status).toBe(200);
    expect(await noteContents()).toEqual([]);
  });
});
