-- Project E-READ: materials persistence (run in Supabase SQL Editor)
-- 1) Create table
-- 2) Storage bucket + policies
-- 3) Optional: leave table empty; the app can seed from local data on first GET

create extension if not exists "pgcrypto";

create table if not exists public.reading_materials (
  id text primary key,
  title text not null,
  description text not null,
  subject text not null,
  grade integer not null check (grade between 1 and 6),
  week integer not null check (week between 1 and 52),
  level integer not null check (level between 1 and 3),
  thumbnail text not null default 'phonics',
  cover_image_url text,
  download_url text,
  featured boolean not null default false,
  pages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reading_materials_grade_week_level_idx
  on public.reading_materials (grade, week, level);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reading_materials_set_updated_at on public.reading_materials;
create trigger reading_materials_set_updated_at
before update on public.reading_materials
for each row execute function public.set_updated_at();

-- Public read; writes go through Next.js API using the service role key.
alter table public.reading_materials enable row level security;

drop policy if exists "Public read materials" on public.reading_materials;
create policy "Public read materials"
  on public.reading_materials
  for select
  to anon, authenticated
  using (true);

-- Storage bucket for teacher uploads (images + PDFs)
insert into storage.buckets (id, name, public)
values ('reading-files', 'reading-files', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read reading files" on storage.objects;
create policy "Public read reading files"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'reading-files');

-- Uploads/deletes are done with the service role from Next.js API routes.
-- No public insert/update/delete policies on storage or the table.
