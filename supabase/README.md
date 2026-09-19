# Supabase + Prisma setup (Project E-READ)

## 1. Fill env files
Set the same values in **both**:
- `.env.local` (Next.js app)
- `.env` (Prisma CLI)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

DATABASE_URL="postgresql://postgres.fwsmplpoheppqldsredk:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.fwsmplpoheppqldsredk:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

Replace `[YOUR-PASSWORD]` with your database password from Supabase → **Project Settings → Database**.

## 2. Push the Prisma schema
```
npx prisma db push
npx prisma generate
```

(Or run [`schema.sql`](./schema.sql) in the SQL Editor — Prisma model matches that table.)

## 3. Storage bucket (for teacher file uploads)
Still needed for images/PDFs. Run the storage section of `schema.sql`, or create a public bucket named `reading-files` in Supabase Storage.

## 4. Restart
```
npm run dev
```

Teacher page should show **Cloud sync on** when `DATABASE_URL` is set (without the password placeholder).

## Useful commands
- `npm run db:push` — sync schema to Supabase
- `npm run db:studio` — browse rows in Prisma Studio
- `npm run db:generate` — regenerate Prisma Client
