import { createClient } from "@libsql/client";
import { migrate } from "../../db/migrate.mjs";

/** Fresh in-memory libSQL database with every migration applied. */
export async function createTestDb() {
  const client = createClient({ url: ":memory:" });
  await migrate(client);
  return client;
}

export async function resetDb(client) {
  await client.executeMultiple(`
    DELETE FROM notes;
    DELETE FROM pdfs;
    DELETE FROM users;
  `);
}

export const SAMPLE_PDF = "data:application/pdf;base64,JVBERi0xLjQK";

export async function insertBook(client, overrides = {}) {
  const book = {
    user_id: "user_alice",
    title: "Meditations",
    author: "Marcus Aurelius",
    genre: "philosophy",
    pdf_file: SAMPLE_PDF,
    bookmark_page: null,
    ...overrides,
  };
  const result = await client.execute({
    sql: `INSERT INTO pdfs (user_id, title, author, genre, pdf_file, bookmark_page)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      book.user_id,
      book.title,
      book.author,
      book.genre,
      book.pdf_file,
      book.bookmark_page,
    ],
  });
  return Number(result.lastInsertRowid);
}

export async function insertNote(client, pdfId, overrides = {}) {
  const note = {
    content: "Waste no more time arguing what a good man should be.",
    isExtraction: 0,
    bookmark_page: 1,
    ...overrides,
  };
  const result = await client.execute({
    sql: `INSERT INTO notes (pdf_id, content, isExtraction, bookmark_page)
          VALUES (?, ?, ?, ?)`,
    args: [pdfId, note.content, note.isExtraction, note.bookmark_page],
  });
  return Number(result.lastInsertRowid);
}
