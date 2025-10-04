# Library API (Prisma)

This project is a small Express + TypeScript API using Prisma ORM.

Quick setup:

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client and run initial migration (creates SQLite `dev.db`):

```bash
npx prisma generate
npx prisma migrate dev --name init
```

3. Start dev server:

```bash
npm run dev
```

API endpoints:
- POST /books
- GET /books
- POST /genres
- GET /genres
- POST /authors
- GET /authors

Notes:
- The schema uses SQLite by default (see `.env`). Change `DATABASE_URL` in `.env` to use another provider.
- If you already have a database, skip migrate and run `npx prisma db pull` then `npx prisma generate`.
