alter table public.site_settings add column if not exists about_paragraphs jsonb not null default '[]'::jsonb;
alter table public.site_settings add column if not exists projects_completed text not null default '60+';
alter table public.site_settings add column if not exists years_experience text not null default '8';
alter table public.site_settings add column if not exists email text not null default 'reddoorstudio25@gmail.com';
alter table public.site_settings add column if not exists phone text not null default '+20 11 18324473';
