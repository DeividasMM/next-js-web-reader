-- Initial schema, reconstructed from the queries in src/app/api/** and src/middleware.js.
-- The original Turso database ("freelancers") no longer exists.

CREATE TABLE IF NOT EXISTS users (
  clerk_user_id TEXT PRIMARY KEY,
  name          TEXT,
  surname       TEXT,
  email         TEXT,
  user_type     TEXT NOT NULL DEFAULT 'consumer',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- pdfs.user_id holds the Clerk user id. It is deliberately not a foreign key to
-- users: Clerk is the source of truth for identity and the users row is
-- written lazily by middleware.
CREATE TABLE IF NOT EXISTS pdfs (
  pdf_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       TEXT NOT NULL,
  title         TEXT NOT NULL,
  author        TEXT NOT NULL,
  genre         TEXT NOT NULL,
  pdf_file      TEXT NOT NULL, -- base64 data URL ("data:application/pdf;base64,...")
  bookmark_page INTEGER,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_pdfs_user_id ON pdfs (user_id);

CREATE TABLE IF NOT EXISTS notes (
  note_id       INTEGER PRIMARY KEY AUTOINCREMENT,
  pdf_id        INTEGER NOT NULL REFERENCES pdfs (pdf_id) ON DELETE CASCADE,
  content       TEXT NOT NULL,
  isExtraction  INTEGER NOT NULL DEFAULT 0, -- 1 = text extracted from the PDF, 0 = user note
  bookmark_page INTEGER,                    -- page the note was written on
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notes_pdf_id ON notes (pdf_id);
