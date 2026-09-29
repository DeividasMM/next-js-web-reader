import { beforeEach, describe, expect, it, vi } from "vitest";
import { turso } from "@/lib/turso";
import { GET as getLibrary } from "@/app/api/getLibrary/route";
import { GET as getBook } from "@/app/api/getBook/route";
import { POST as postUpload } from "@/app/api/postUpload/route";
import { PUT as updateBook } from "@/app/api/updateBook/route";
import { DELETE as deleteBook } from "@/app/api/deleteBook/route";
import { PUT as bookmark } from "@/app/api/bookmark/route";
import { getRequest, jsonRequest, signInAs, signOut } from "../helpers/api";
import { insertBook, insertNote, resetDb, SAMPLE_PDF } from "../helpers/db";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/turso", async () => {
  const { createTestDb } = await import("../helpers/db");
  return { turso: await createTestDb() };
});

const ALICE = "user_alice";
const BOB = "user_bob";

beforeEach(async () => {
  await resetDb(turso);
  await signInAs(ALICE);
});

describe("GET /api/getLibrary", () => {
  it("returns 401 when signed out", async () => {
    await signOut();
    const res = await getLibrary();
    expect(res.status).toBe(401);
  });

  it("returns only the signed-in user's books", async () => {
    await insertBook(turso, { user_id: ALICE, title: "Mine" });
    await insertBook(turso, { user_id: BOB, title: "Not mine" });

    const res = await getLibrary();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.map((b) => b.title)).toEqual(["Mine"]);
  });
});

describe("GET /api/getBook", () => {
  it("returns 401 when signed out", async () => {
    await signOut();
    const res = await getBook(getRequest("/api/getBook?id=1"));
    expect(res.status).toBe(401);
  });

  it("returns 400 without an id", async () => {
    const res = await getBook(getRequest("/api/getBook"));
    expect(res.status).toBe(400);
  });

  it("returns 404 for another user's book", async () => {
    const id = await insertBook(turso, { user_id: BOB });
    const res = await getBook(getRequest(`/api/getBook?id=${id}`));
    expect(res.status).toBe(404);
  });

  it("returns the book with its notes in creation order", async () => {
    const id = await insertBook(turso, { bookmark_page: 7 });
    await insertNote(turso, id, { content: "first" });
    await insertNote(turso, id, { content: "second", isExtraction: 1 });

    const res = await getBook(getRequest(`/api/getBook?id=${id}`));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({
      title: "Meditations",
      author: "Marcus Aurelius",
      genre: "philosophy",
      pdf_file: SAMPLE_PDF,
      bookmark_page: 7,
    });
    expect(body.notes.map((n) => [n.content, n.isExtraction])).toEqual([
      ["first", 0],
      ["second", 1],
    ]);
  });
});

describe("POST /api/postUpload", () => {
  const valid = {
    pdf_file: SAMPLE_PDF,
    title: "The Republic",
    author: "Plato",
    genre: "philosophy",
  };

  it("returns 401 when signed out", async () => {
    await signOut();
    const res = await postUpload(jsonRequest("/api/postUpload", "POST", valid));
    expect(res.status).toBe(401);

    const { rows } = await turso.execute("SELECT COUNT(*) AS n FROM pdfs");
    expect(rows[0].n).toBe(0);
  });

  it.each(["pdf_file", "title", "author", "genre"])(
    "returns 400 when %s is missing",
    async (field) => {
      const res = await postUpload(
        jsonRequest("/api/postUpload", "POST", { ...valid, [field]: "" })
      );
      expect(res.status).toBe(400);
    }
  );

  it("rejects files that are not base64 PDF data URLs", async () => {
    const res = await postUpload(
      jsonRequest("/api/postUpload", "POST", {
        ...valid,
        pdf_file: "data:image/png;base64,AAAA",
      })
    );
    expect(res.status).toBe(400);
  });

  it("rejects files over the 10MB limit", async () => {
    const huge = SAMPLE_PDF + "A".repeat(14 * 1024 * 1024);
    const res = await postUpload(
      jsonRequest("/api/postUpload", "POST", { ...valid, pdf_file: huge })
    );
    expect(res.status).toBe(400);
  });

  it("stores the book for the signed-in user", async () => {
    const res = await postUpload(jsonRequest("/api/postUpload", "POST", valid));
    expect(res.status).toBe(200);

    const { rows } = await turso.execute("SELECT * FROM pdfs");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ ...valid, user_id: ALICE });
  });
});

describe("PUT /api/updateBook", () => {
  const changes = { title: "New", author: "Someone", genre: "history" };

  it("returns 401 when signed out", async () => {
    await signOut();
    const res = await updateBook(
      jsonRequest("/api/updateBook", "PUT", { id: 1, ...changes })
    );
    expect(res.status).toBe(401);
  });

  it("returns 400 when fields are missing", async () => {
    const id = await insertBook(turso);
    const res = await updateBook(
      jsonRequest("/api/updateBook", "PUT", { id, title: "Only title" })
    );
    expect(res.status).toBe(400);
  });

  it("does not update another user's book", async () => {
    const id = await insertBook(turso, { user_id: BOB, title: "Bob's" });
    const res = await updateBook(
      jsonRequest("/api/updateBook", "PUT", { id, ...changes })
    );
    expect(res.status).toBe(404);

    const { rows } = await turso.execute("SELECT title FROM pdfs");
    expect(rows[0].title).toBe("Bob's");
  });

  it("updates the user's book", async () => {
    const id = await insertBook(turso);
    const res = await updateBook(
      jsonRequest("/api/updateBook", "PUT", { id, ...changes })
    );
    expect(res.status).toBe(200);

    const { rows } = await turso.execute(
      "SELECT title, author, genre FROM pdfs"
    );
    expect(rows[0]).toMatchObject(changes);
  });
});

describe("DELETE /api/deleteBook", () => {
  it("returns 401 when signed out", async () => {
    await signOut();
    const res = await deleteBook(getRequest("/api/deleteBook?id=1", "DELETE"));
    expect(res.status).toBe(401);
  });

  it("returns 400 without an id", async () => {
    const res = await deleteBook(getRequest("/api/deleteBook", "DELETE"));
    expect(res.status).toBe(400);
  });

  it("does not delete another user's book", async () => {
    const id = await insertBook(turso, { user_id: BOB });
    const res = await deleteBook(
      getRequest(`/api/deleteBook?id=${id}`, "DELETE")
    );
    expect(res.status).toBe(404);

    const { rows } = await turso.execute("SELECT COUNT(*) AS n FROM pdfs");
    expect(rows[0].n).toBe(1);
  });

  it("deletes the book and its notes", async () => {
    const id = await insertBook(turso);
    await insertNote(turso, id);

    const res = await deleteBook(
      getRequest(`/api/deleteBook?id=${id}`, "DELETE")
    );
    expect(res.status).toBe(200);

    const pdfs = await turso.execute("SELECT COUNT(*) AS n FROM pdfs");
    const notes = await turso.execute("SELECT COUNT(*) AS n FROM notes");
    expect(pdfs.rows[0].n).toBe(0);
    expect(notes.rows[0].n).toBe(0);
  });
});

describe("PUT /api/bookmark", () => {
  it("returns 401 when signed out", async () => {
    await signOut();
    const res = await bookmark(
      jsonRequest("/api/bookmark", "PUT", { pdf_id: 1, page: 3 })
    );
    expect(res.status).toBe(401);
  });

  it("returns 400 when page is not a number", async () => {
    const id = await insertBook(turso);
    const res = await bookmark(
      jsonRequest("/api/bookmark", "PUT", { pdf_id: id, page: "3" })
    );
    expect(res.status).toBe(400);
  });

  it("does not bookmark another user's book", async () => {
    const id = await insertBook(turso, { user_id: BOB });
    const res = await bookmark(
      jsonRequest("/api/bookmark", "PUT", { pdf_id: id, page: 3 })
    );
    expect(res.status).toBe(404);
  });

  it("saves the bookmark page", async () => {
    const id = await insertBook(turso);
    const res = await bookmark(
      jsonRequest("/api/bookmark", "PUT", { pdf_id: id, page: 42 })
    );
    expect(res.status).toBe(200);

    const { rows } = await turso.execute("SELECT bookmark_page FROM pdfs");
    expect(rows[0].bookmark_page).toBe(42);
  });
});
