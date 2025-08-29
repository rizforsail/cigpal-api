create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  first_name text,
  zip text,
  source text default 'landing',
  created_at timestamptz default now()
);
alter table public.leads enable row level security;
create policy "leads_insert_only" on public.leads for insert to anon with check (true);
create policy "leads_no_select"  on public.leads for select using (false);
