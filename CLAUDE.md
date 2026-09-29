# Read · Y — Project Constitution

This file is the source of truth for how this project is built and changed. It
binds every contributor, human or AI. If code and this file disagree, either fix
the code or update this file in the same PR — never leave them out of sync.

Open work lives in [task.md](task.md). Setup for humans is in [README.md](README.md).

---

## 1. What we are building

**Read · Y** is a personal PDF reading platform. A signed-in user can:

- upload PDFs (title, author, genre) into a private **library**;
- read them in the browser (`react-pdf`), page by page;
- **extract** selected text into annotations and write their own **notes**;
- **bookmark** the current page, switch dark/light mode, and read in **Zen mode**.

**Design identity: "neon antique".** Classical Greek statues and ornaments
(`public/assets/images/greek*.png`) set against saturated neon gradients
(magenta / pink / orange / cyan in `styles/main.scss`), glassmorphism panels
(`mixins.glassmorphism`), and the futuristic `Anta` font. The next milestone
keeps this identity but makes the experience **immersive, interactive and
cinematic**. The redesign and the functional overhaul are _not started_: they are
discussed with the team first (see task.md). Do not start redesigning or adding
features on your own initiative.

---

## 2. Non-negotiable rules

These are the articles of the constitution. Breaking one is a bug, even if
everything "works".

### 2.1 Security

1. **Every API route authenticates.** Start the handler with
   `const { userId } = await auth();` and return `401` when `userId` is missing.
   The middleware only calls `auth.protect()` for pages (`/upload`, `/library`,
   …), not for `/api/*`, so the route itself is the only guard.
2. **Every query on user data is scoped to the user.** Either
   `WHERE user_id = ?` on `pdfs`, or an ownership subquery for `notes`
   (`pdf_id IN (SELECT pdf_id FROM pdfs WHERE user_id = ?)`, or
   `INSERT … SELECT … FROM pdfs WHERE pdf_id = ? AND user_id = ?`).
   A resource owned by someone else answers `404`, the same as a missing one.
3. **Parameterized SQL only.** Values go in `args`. Never interpolate request data
   into SQL strings.
4. **Never trust identity from the client.** The user id comes from Clerk's
   `auth()`, never from the request body or query string.
5. **Secrets stay out of git.** `.env*` is ignored (except `.env.example`). Never
   print secrets in logs, tests or commits.

### 2.2 Quality gates

1. Nothing is merged unless **`npm run check`** (lint + format + tests) and
   **`npm run build`** pass. CI (`.github/workflows/ci.yml`) enforces this on every PR.
2. The pre-commit hook (Husky + lint-staged) must never be bypassed:
   **no `--no-verify`**. If the hook fails, fix the cause.
3. Never make checks green by weakening them: don't delete or skip tests, don't
   add `eslint-disable` or loosen rules without a written reason in the same line
   and agreement from the team.
4. Lint **errors** block commits. Lint **warnings** are tech debt: don't add new
   ones, and fix existing ones in any file you substantially touch.

### 2.3 Tests

1. **Every API route change ships with tests** in `tests/api/`, covering at least:
   `401` signed out, `400` invalid input, `404` for another user's resource, and
   the happy path with the resulting database state asserted.
2. **Bug fixes start with a failing test** that reproduces the bug.
3. Components with logic (state, handlers, conditional rendering) get tests in
   `tests/components/`. Pure presentational markup does not need them.
4. Tests hit a **real in-memory libSQL database** with the real migrations
   (`tests/helpers/db.js`), not a mocked DB. Only Clerk's `auth()` is mocked.

### 2.4 Database

1. Schema changes happen **only through a new migration file** in
   `db/migrations/`, named `NNNN_description.sql` (next free number).
2. **Never edit a migration that has been merged.** Write a new one.
3. Migrations must be safe to run on production data. Prefer additive changes.
   Destructive changes (dropping columns or tables) need team agreement first.

### 2.5 Scope and communication

1. Do what the task asks. Put unrelated problems you notice in **task.md** instead
   of fixing them in the same PR (security holes are the exception: fix them and
   add tests).
2. Talk to the team in **Lithuanian** (English is fine too). **Never use Russian.**
   Code, comments, commit messages, PRs and docs are written in **English**.
3. AI agents commit, push or open PRs **only when asked**.

---

## 3. Tech stack

| Area      | Choice                                            | Notes                                                     |
| --------- | ------------------------------------------------- | --------------------------------------------------------- |
| Framework | Next.js 15.5 (App Router), React 19               | JavaScript (no TypeScript), JSX lives in `.js` files      |
| Auth      | Clerk (`@clerk/nextjs` 6)                         | Keyless mode in dev when no keys are set                  |
| Database  | libSQL via `@libsql/client`                       | Local SQLite file in dev, Turso in production             |
| Styling   | SCSS (`sass`), global class names                 | `src/app/styles/main.scss` is imported by the root layout |
| PDF       | `react-pdf` 9 (pdf.js)                            | Worker loaded from unpkg (see task.md)                    |
| Upload    | `react-dropzone`                                  | PDFs are sent and stored as base64 data URLs              |
| Icons     | Font Awesome (`@fortawesome/react-fontawesome`)   |                                                           |
| Quality   | ESLint 9 (flat config), Prettier 3, Vitest 5, RTL | Husky + lint-staged pre-commit, GitHub Actions CI         |

Node **≥ 22.12** (CI uses 24).

---

## 4. Commands

| Command              | What it does                                                         |
| -------------------- | -------------------------------------------------------------------- |
| `npm install`        | Installs deps and the git hooks (`prepare` → husky)                  |
| `npm run dev`        | Applies pending DB migrations, then starts Next on :3000             |
| `npm run build`      | Production build (needs Clerk keys, see §7)                          |
| `npm start`          | Serves the production build                                          |
| `npm run check`      | Lint + format check + tests: the same gate as CI (minus build)       |
| `npm run lint`       | ESLint (`lint:fix` to autofix). Do not use `next lint` (deprecated). |
| `npm run format`     | Prettier write (`format:check` to verify only)                       |
| `npm test`           | Vitest, single run (`test:watch` for watch mode)                     |
| `npm run db:migrate` | Applies pending migrations to the configured database                |

Run a single test file: `npx vitest run tests/api/books.test.js`.

---

## 5. Project structure

```
db/
  migrations/NNNN_*.sql   Schema history (source of truth for the DB)
  migrate.mjs             Migration runner (used by the CLI script and tests)
scripts/db-migrate.mjs    `npm run db:migrate`
src/
  middleware.js           Clerk: protects pages, lazily inserts the users row
  lib/turso.js            The shared libSQL client (`turso`)
  lib/db-config.mjs       Resolves DB URL/token (shared with Node scripts)
  app/
    layout.js             Root layout: ClerkProvider, Navigation, Footer, SCSS
    page.js               Home (intro video)
    navigation.js footer.js card.js   Shared components (live in app/ for now)
    about/ upload/ library/ library/[id]/reading/   Pages
    api/<action>/route.js API routes (one verb-named folder per action)
    styles/               SCSS partials; main.scss @use's all of them
public/assets/            Images and video (the neon-antique art lives here)
tests/
  api/ components/ db/    Test suites
  helpers/                In-memory DB factory, request builders, auth mocks
.data/                    Local SQLite DB (git-ignored, created by db:migrate)
```

---

## 6. Architecture

### Request flow

```
Browser (client page, "use client")
   │ fetch("/api/…")  ← always relative URLs, never hardcoded hosts
   ▼
middleware.js (Node runtime)
   • auth.protect() for /upload, /library, /reading
   • inserts a `users` row the first time a signed-in user is seen
   ▼
app/api/<action>/route.js
   • auth() → userId (401 if missing)
   • validate input (400)
   • turso.execute({ sql, args }) scoped to userId (404 if not owned)
   ▼
libSQL: file:.data/local.db (dev) or libsql://… (Turso, prod)
```

- The middleware **must** keep `runtime: "nodejs"`. The Edge runtime cannot open
  the local file database and the middleware would crash.
- Pages are client components that fetch from the API routes. There are no
  server actions and no server-side data fetching yet.

### Data model (see `db/migrations/0001_init.sql`)

| Table   | Key                    | Columns                                                                                              |
| ------- | ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `users` | `clerk_user_id` (TEXT) | name, surname, email, user_type (`consumer`), created_at                                             |
| `pdfs`  | `pdf_id` (INTEGER)     | user_id (Clerk id, not a FK), title, author, genre (slug), pdf_file (base64 data URL), bookmark_page |
| `notes` | `note_id` (INTEGER)    | pdf_id → pdfs ON DELETE CASCADE, content, isExtraction (0/1), bookmark_page, created_at              |

- `isExtraction = 1` means text extracted from the PDF (shown yellow, not
  editable). `0` means the user's own note (grey, editable).
- libSQL returns `lastInsertRowid` as a `BigInt`. Convert it with `Number()`
  before putting it in JSON.

### API routes

| Route                | Method | Body / query                                       | Success           |
| -------------------- | ------ | -------------------------------------------------- | ----------------- |
| `/api/getLibrary`    | GET    | –                                                  | 200 array of pdfs |
| `/api/getBook`       | GET    | `?id=`                                             | 200 pdf + `notes` |
| `/api/postUpload`    | POST   | `{ pdf_file, title, author, genre }` (≤10MB)       | 200               |
| `/api/updateBook`    | PUT    | `{ id, title, author, genre }`                     | 200               |
| `/api/deleteBook`    | DELETE | `?id=`                                             | 200               |
| `/api/bookmark`      | PUT    | `{ pdf_id, page: number }`                         | 200               |
| `/api/postComment`   | POST   | `{ pdf_id, content, isExtraction, bookmark_page }` | 201               |
| `/api/updateComment` | PUT    | `{ note_id, content }`                             | 200               |
| `/api/deleteComment` | DELETE | `?note_id=`                                        | 200               |

Conventions for every handler: wrap in `try/catch`; errors are
`NextResponse.json({ error: "…" }, { status })`; log unexpected errors with
`console.error` and return `500` with a generic message. The verb-style names are
legacy. Don't rename routes opportunistically: an API cleanup is tracked in task.md.

---

## 7. Environment and services

Copy `.env.example` to `.env.local`.

| Variable                            | Dev                                | Prod     |
| ----------------------------------- | ---------------------------------- | -------- |
| `TURSO_DATABASE_URL`                | empty → `file:.data/local.db`      | required |
| `TURSO_AUTH_TOKEN`                  | empty                              | required |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | optional (keyless mode without it) | required |
| `CLERK_SECRET_KEY`                  | optional                           | required |

- **Clerk keyless mode:** with no keys, Clerk creates a temporary dev instance
  (stored in `.clerk/`, git-ignored) and prints a "claim your keys" link.
  In keyless mode the middleware callback only runs once the browser has Clerk's
  keyless cookie, so `curl` requests look signed out. Use a real browser.
- **Turso (production):** `turso db create <name>`, then
  `turso db show <name> --url` and `turso db tokens create <name>`. Put both
  values in the host's env vars and run `npm run db:migrate` with them set.
- `npm run build` fails at prerender without a well-formed Clerk publishable
  key. CI passes placeholder keys.

---

## 8. Conventions

### Code

- Prettier decides formatting (`trailingComma: es5`, LF line endings). Don't
  hand-format.
- ESLint: `next/core-web-vitals` + `eslint:recommended`. `console.log` is a
  warning; use `console.error`/`console.warn` for real diagnostics.
- Client fetches use **relative** URLs (`/api/...`). Never hardcode
  `localhost:3000`.
- Internal navigation uses `next/link`; external links use `<a target="_blank">`.
- Imports use the `@/` alias for `src/` (see `jsconfig.json`), except in `.mjs`
  files that plain Node also runs (`src/lib/db-config.mjs`, `db/`, `scripts/`).
- Genre values are slugs (`philosophy`, `science-fiction`, …). The lists in
  upload and reading currently disagree (see task.md). Don't add a third list.

### Styling

- One SCSS partial per page/component in `src/app/styles/`, registered in
  `main.scss`. Reuse `variables.scss` and `mixins.scss` instead of repeating
  values.
- Class names are global. Check for collisions before reusing generic names
  like `.container` or `.header-container`.

### Tests

- Location: `tests/<area>/<subject>.test.js(x)`. Component tests start with
  `// @vitest-environment jsdom`.
- API test boilerplate (copy it from an existing file): mock
  `@clerk/nextjs/server` and `@/lib/turso` (in-memory DB), `resetDb` in
  `beforeEach`, and switch users with `signInAs` / `signOut`.
- Assert database state after a mutation, not just the status code.

---

## 9. Git workflow

- **Branches:** `MonDD-HHh-ShortDescription` (e.g. `Sep29-16h-ProjectRevival`),
  branched from `pre-master`.
- **Flow:** feature branch → PR into **`pre-master`** → when stable, PR
  `pre-master` → **`master`**. Nobody pushes directly to `master` or `pre-master`.
- **Commits:** small, English, imperative ("Add bookmark tests"). The hook runs
  lint-staged (ESLint + Prettier on staged files) and the full test suite.
- **PR description:** what changed, why, how it was tested, and which task.md
  entry it closes.

---

## 10. task.md workflow

`task.md` holds **only open work**. Its rules are at the top of that file. In
short: one task = one branch = one PR; when you start a task, write your name
and branch next to it; **the PR that finishes a task deletes its entry**, so the
task disappears exactly when the work is merged. Completed work is recorded in
git history, not in task.md.

---

## 11. Definition of done

A change is done when all of these hold:

- [ ] It does what the task says, and nothing unrelated.
- [ ] Rules in §2 hold (auth, scoping, parameterized SQL, migrations).
- [ ] Tests were added or updated. `npm run check` passes and `npm run build` succeeds.
- [ ] It was tried in the browser with `npm run dev` for UI changes.
- [ ] No new lint warnings. No `console.log` left behind.
- [ ] CLAUDE.md, README or `.env.example` were updated if behavior, setup or
      conventions changed.
- [ ] The task's entry was removed from task.md, and any new findings were added to it.

---

## 12. Known pitfalls

- **Windows line endings:** `.gitattributes` forces LF. If an older checkout
  still has CRLF files and `format:check` flags them, run `npm run format`
  once. It only rewrites line endings, and git shows no content change.
- **JSX in `.js` files:** Next handles it. Vitest needs the `oxc` settings in
  `vitest.config.mjs` (don't remove them).
- **Stray lockfiles:** `next.config.mjs` pins `outputFileTracingRoot` because a
  `package-lock.json` in a parent folder confuses Next's root detection.
- **Base64 PDFs:** every `getBook` and `getLibrary` response carries whole files.
  Keep this in mind for performance work (see task.md).
- **`next lint` is deprecated** in Next 15.5 and removed in 16. Use `npm run lint`.
