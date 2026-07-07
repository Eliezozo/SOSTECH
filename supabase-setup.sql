-- ============================================================
-- Sostech Systems — Supabase schema
-- Run this in your Supabase project: SQL Editor → New query → Run
-- ============================================================

-- 1) PROJECTS (videos / images shown on the Projects page)
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title_en    text not null default '',
  title_fr    text not null default '',
  desc_en     text not null default '',
  desc_fr     text not null default '',
  media_url   text,                         -- storage path or full URL
  media_type  text not null default 'video' check (media_type in ('video','image')),
  contact     text default '',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- 2) GALLERY (photos of completed work)
create table if not exists public.gallery (
  id          uuid primary key default gen_random_uuid(),
  title       text default '',
  image_url   text not null,                -- storage path or full URL
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- 3) SITE CONTENT (editable text overrides, keyed by i18n key)
create table if not exists public.site_content (
  key         text primary key,            -- e.g. "contact.info.addressValue"
  value_en    text default '',
  value_fr    text default '',
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- Row Level Security: public can READ, only logged-in admins WRITE
-- ============================================================
alter table public.projects     enable row level security;
alter table public.gallery      enable row level security;
alter table public.site_content enable row level security;

-- Public read
create policy "public read projects"     on public.projects     for select using (true);
create policy "public read gallery"       on public.gallery      for select using (true);
create policy "public read site_content"  on public.site_content for select using (true);

-- Authenticated write (insert / update / delete)
create policy "admin write projects"     on public.projects
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write gallery"       on public.gallery
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write site_content"  on public.site_content
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE: create a PUBLIC bucket named "media" in the dashboard
--   Storage → New bucket → name: media → Public: ON
-- Then run the policies below so admins can upload/delete.
-- ============================================================
create policy "public read media"
  on storage.objects for select
  using ( bucket_id = 'media' );

create policy "admin upload media"
  on storage.objects for insert to authenticated
  with check ( bucket_id = 'media' );

create policy "admin update media"
  on storage.objects for update to authenticated
  using ( bucket_id = 'media' );

create policy "admin delete media"
  on storage.objects for delete to authenticated
  using ( bucket_id = 'media' );

-- ============================================================
-- ADMIN USER
-- Create your admin login in the dashboard:
--   Authentication → Users → Add user → enter email + password
-- (Disable "Enable email confirmations" in Authentication → Providers
--  if you want the account active immediately.)
-- ============================================================
