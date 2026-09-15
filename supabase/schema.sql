create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  location text not null,
  year integer not null,
  status text not null default 'draft' check (status in ('published', 'draft')),
  thumbnail text not null,
  hero_image text not null,
  area text not null default '-',
  description text not null default '',
  floor_plans jsonb not null default '[]'::jsonb,
  rooms jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  name text not null,
  count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'company-admin' check (role in ('super-admin', 'studio-manager', 'company-admin')),
  company_name text not null default 'Red Door Studio',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  hero_image text not null,
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.categories enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;

create policy "Public can read projects" on public.projects for select using (true);
create policy "Public can read categories" on public.categories for select using (true);
create policy "Public can read site settings" on public.site_settings for select using (true);

insert into public.categories (id, name, count) values
  ('villas', 'Villas', 0),
  ('kitchens', 'Kitchens', 0),
  ('bedrooms', 'Bedrooms', 0),
  ('reception', 'Reception', 0),
  ('bathrooms', 'Bathrooms', 0),
  ('pools', 'Swimming Pools', 0)
on conflict (id) do nothing;
