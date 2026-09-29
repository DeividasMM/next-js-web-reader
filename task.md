# Tasks

Open work for Read · Y. The rules (also in CLAUDE.md §10):

1. **Only open work lives here.** Finished work is recorded in git history.
2. **One task = one branch = one PR** into `pre-master`.
3. **Starting a task:** add `— @name, branch` after its title.
4. **Finishing a task:** the PR that completes it **deletes the entry**. The task
   leaves this file exactly when its work is merged. Never delete an entry whose
   work isn't merged.
5. **New findings:** add them to the right section with enough context (files,
   symptoms) that someone else can pick them up without asking.
6. Items marked **(discuss)** need a team decision before any code is written.

---

## Setup & infrastructure

- [ ] **Claim Clerk keys and share them with the team.** Dev currently runs in
      keyless mode (temporary instance). Claim it via the link printed by
      `npm run dev`, put the keys in `.env.local`, and share them privately.
- [ ] **Add user details to the Clerk session token.** `middleware.js` reads
      `sessionClaims.email`, `firstName` and `lastName`, but the default token
      has none of them, so every `users` row stores `NO-NAME` /
      `NO-VERIFIED@example.com`. Configure the custom session claims in the
      Clerk dashboard (or read the user from `clerkClient`).
- [ ] **Production database and hosting (discuss).** Pick a host, create a Turso
      database, set `TURSO_*` and Clerk env vars there, and run
      `npm run db:migrate` against it.
- [ ] **Upgrade to Next.js 16 and Clerk Core 3.** `middleware.js` becomes
      `proxy.js` and `next lint` is removed. `@clerk/clerk-react` (a transitive
      dependency) is deprecated. Also remove `overrides.next.postcss` from
      `package.json`: it forces Next 15's pinned `postcss@8.4.31` up to a
      patched 8.5.x, and Next 16 already ships a fixed version.
- [ ] **TypeScript migration (discuss).** Decide before the redesign starts,
      because migrating afterwards costs more.

## Bugs

- [ ] **Genre slugs disagree between pages.** Upload saves `business`, `health`,
      `science`, but the reading page's edit dropdown uses `business-finance`,
      `health-wellness`, `science-technology`. Editing a book shows an empty
      selection for those genres. Create one shared `GENRES` list and migrate
      the existing rows.
- [ ] **New annotations can't be edited or deleted until reload.**
      `postComment` doesn't return the new `note_id`, so the reading page keeps
      notes without an id. Delete only drops them locally and edit sends
      `note_id: undefined`. Return `Number(result.lastInsertRowid)` and store it
      on the client.
- [ ] **Library downloads every PDF.** `getLibrary` runs `SELECT *`, so the
      library page receives the full base64 of every book. Select only the
      card fields.

## Tech debt

- [ ] **Move user sync out of middleware.** It runs two DB queries on every page
      and API request. Use a Clerk `user.created` webhook, or upsert lazily.
- [ ] **Stop storing PDFs as base64 in the database.** This adds about 33%
      overhead and a 10MB cap, and the whole file is sent on every open. Move
      files to object storage (e.g. Vercel Blob, S3 or R2) and keep only a key
      in `pdfs`.
- [ ] **Bundle the pdf.js worker** instead of loading it from unpkg at runtime
      (`library/[id]/reading/page.js`).
- [ ] **Clear the lint warnings** (`npm run lint`). Replace `console.log`
      debugging and `alert()` with real UI feedback. Replace `<img>` with
      `next/image` (probably as part of the redesign).
- [ ] **API cleanup (discuss).** Consolidate the verb routes (`getBook`,
      `postComment`, …) into resource routes (`/api/books/[id]`,
      `/api/books/[id]/notes`), together with the functionality overhaul.
- [ ] **End-to-end tests** (Playwright) for sign-in → upload → read → annotate,
      once the redesign settles.

## Design (discuss)

- [ ] **Redesign: from "neon antique" to immersive and cinematic.** Keep the
      identity (Greek statues, neon gradients, glass, the Anta font) and make it
      immersive, interactive and cinematic. Needs a design discussion and
      direction first. Include responsive layout (the reader is fixed at
      1000px) and loading and empty states.

## Features (discuss)

- [ ] **Functionality overhaul.** Collect and prioritise the feature list
      (e.g. the reading goals and progress tracking promised on the About page).
