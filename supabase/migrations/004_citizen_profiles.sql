-- Additive citizen profile rows for Auth users (Nagarakshak signup-trigger pattern, no wards).
-- Safe to apply after 001–003. Does not grant publication rights.

create table if not exists public.citizen_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  preferred_lang text not null default 'en' check (preferred_lang in ('en', 'hi')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.citizen_profiles enable row level security;

drop policy if exists citizen_profiles_select_own on public.citizen_profiles;
create policy citizen_profiles_select_own
  on public.citizen_profiles for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists citizen_profiles_insert_own on public.citizen_profiles;
create policy citizen_profiles_insert_own
  on public.citizen_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists citizen_profiles_update_own on public.citizen_profiles;
create policy citizen_profiles_update_own
  on public.citizen_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

revoke all on public.citizen_profiles from anon;
grant select, insert, update on public.citizen_profiles to authenticated;

create or replace function public.handle_new_citizen_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.citizen_profiles (user_id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email, 'citizen'), '@', 1))
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_citizen_profile on auth.users;
create trigger on_auth_user_created_citizen_profile
  after insert on auth.users
  for each row execute function public.handle_new_citizen_profile();
