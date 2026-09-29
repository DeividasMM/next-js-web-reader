# Read · Y

A personal PDF reading platform: upload books into a private library, read them
in the browser, extract passages into annotations, write notes and bookmark
pages. The look is "neon antique": Greek statues, neon gradients, glass.

Built with Next.js 15, React 19, Clerk, libSQL/Turso and SCSS.

## Quick start

Requires Node.js 22.12 or newer.

```bash
npm install     # also installs the git hooks
npm run dev     # creates/migrates the local database, then starts Next.js
```

Open http://localhost:3000.

You don't need any accounts or keys for local development:

- **Database:** without `TURSO_DATABASE_URL`, the app uses a local SQLite file at
  `.data/local.db`. `npm run dev` creates it and applies migrations.
- **Auth:** without Clerk keys, Clerk runs in _keyless mode_. It creates a
  temporary dev instance and prints a link to claim it.

To use your own Clerk instance or a Turso database, copy `.env.example` to
`.env.local` and fill it in.

## Scripts

| Command              | Description                                   |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Migrate the DB and start the dev server       |
| `npm run build`      | Production build                              |
| `npm run check`      | Lint + format check + unit tests (same as CI) |
| `npm test`           | Unit tests (Vitest)                           |
| `npm run lint`       | ESLint                                        |
| `npm run format`     | Prettier                                      |
| `npm run db:migrate` | Apply pending migrations to the configured DB |

Every commit runs ESLint and Prettier on the staged files, plus the full test
suite. A commit with errors is rejected. CI repeats these checks and runs a
production build on every PR.

## Contributing

- **[CLAUDE.md](CLAUDE.md)** is the project constitution: architecture, rules,
  conventions and the git workflow. Read it before your first change.
- **[task.md](task.md)** lists open work. Pick a task, branch from `pre-master`,
  and open a PR back into `pre-master`. The PR deletes the task's entry from task.md.
