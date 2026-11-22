-- =============================================================================
-- 003_reviewer_rls_audit.sql
--
-- Not yet applied. Additive and idempotent. Depends on 002_product_schema.sql
-- (catalogue ids are TEXT slugs there, so reviewer-side FKs here are TEXT too).
-- 001 and 002 are not modified.
--
-- Contents:
--   1. reviewer_memberships  (who may act as a reviewer, and at what role)
--   2. review_events         (append-only reviewer audit log)
--   3. reviewer_role_rank(), is_reviewer(min_role)  helpers
--   4. RLS on reviewer_memberships (publishers read only; no client writes)
--   5. Catalogue RLS: public reads published rows only; editors insert/update;
--      published rows are immutable; transition to published needs publisher.
--   6. publish_rule_version(): the only path to 'published' for a rule version.
-- =============================================================================

-- Assumption: 002 has no human_verified_at column. Added here (nullable, additive)
-- so publish_rule_version can check it. NULL means not human-verified.
alter table public.source_records add column if not exists human_verified_at timestamptz;

-- ---------------------------------------------------------------------------
-- 1. Reviewer memberships
-- ---------------------------------------------------------------------------

create table if not exists public.reviewer_memberships (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('viewer', 'editor', 'publisher')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Review events (append-only)
-- ---------------------------------------------------------------------------

create table if not exists public.review_events (
  id uuid primary key default gen_random_uuid(),
  scheme_id text not null references public.schemes (id) on delete restrict,
  rule_version_id text references public.rule_versions (id) on delete restrict,
  action text not null check (char_length(action) > 0),
  reviewer_id uuid default auth.uid() references auth.users (id) on delete set null,
  reason text,
  content_hash text,
  created_at timestamptz not null default now()
);

create index if not exists review_events_scheme_idx on public.review_events (scheme_id);
create index if not exists review_events_rule_version_idx on public.review_events (rule_version_id);
create index if not exists review_events_reviewer_idx on public.review_events (reviewer_id);

-- ---------------------------------------------------------------------------
-- 3. Helpers
-- ---------------------------------------------------------------------------

create or replace function public.reviewer_role_rank(r text)
returns integer
language sql
immutable
set search_path = public
as $$
  select case r
    when 'viewer' then 1
    when 'editor' then 2
    when 'publisher' then 3
    else 0
  end
$$;

create or replace function public.is_reviewer(min_role text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  -- Unknown min_role ranks 0; refuse rather than grant everyone.
  if public.reviewer_role_rank(min_role) = 0 then
    return false;
  end if;
  return exists (
    select 1
    from public.reviewer_memberships m
    where m.user_id = auth.uid()
      and m.active = true
      and public.reviewer_role_rank(m.role) >= public.reviewer_role_rank(min_role)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. RLS: reviewer_memberships and review_events
-- ---------------------------------------------------------------------------

alter table public.reviewer_memberships enable row level security;
alter table public.review_events enable row level security;

-- Membership rows are managed out-of-band (service role). Clients cannot write them.
revoke insert, update, delete on public.reviewer_memberships from public, anon, authenticated;

drop policy if exists "reviewer_rls publisher select reviewer_memberships" on public.reviewer_memberships;
create policy "reviewer_rls publisher select reviewer_memberships"
  on public.reviewer_memberships for select
  using (public.is_reviewer('publisher'));

-- review_events: immutable. Insert and select only, via policy. No update or delete.
revoke update, delete, truncate on public.review_events from public, anon, authenticated;
grant insert, select on public.review_events to authenticated;

drop policy if exists "reviewer_rls editor insert review_events" on public.review_events;
create policy "reviewer_rls editor insert review_events"
  on public.review_events for insert
  with check (reviewer_id = auth.uid() and public.is_reviewer('editor'));

drop policy if exists "reviewer_rls viewer select review_events" on public.review_events;
create policy "reviewer_rls viewer select review_events"
  on public.review_events for select
  using (public.is_reviewer('viewer'));

create or replace function public.reviewer_events_immutable()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  raise exception 'review_events is append-only';
end;
$$;

drop trigger if exists reviewer_events_no_update_delete on public.review_events;
create trigger reviewer_events_no_update_delete
  before update or delete on public.review_events
  for each row execute function public.reviewer_events_immutable();

-- ---------------------------------------------------------------------------
-- 5. Catalogue RLS
-- ---------------------------------------------------------------------------

-- Replace the 002 public-read policies, which also admitted 'reviewed' rows.
-- Public (anon/authenticated) now sees only 'published' rows.
drop policy if exists "public read reviewed or published source_records" on public.source_records;
drop policy if exists "public read reviewed or published schemes" on public.schemes;
drop policy if exists "public read scheme_source_links of published schemes" on public.scheme_source_links;
drop policy if exists "public read scheme_documents of published schemes" on public.scheme_documents;
drop policy if exists "public read scheme_steps of published schemes" on public.scheme_steps;
drop policy if exists "public read scheme_deadlines of published schemes" on public.scheme_deadlines;
drop policy if exists "public read reviewed or published rule_versions" on public.rule_versions;
drop policy if exists "public read rule_version_source_links of published rule_versions" on public.rule_version_source_links;
drop policy if exists "public read rules of reviewed or published rule_versions" on public.rules;

drop policy if exists "reviewer_rls public read published source_records" on public.source_records;
create policy "reviewer_rls public read published source_records"
  on public.source_records for select
  using (publication_status = 'published');

drop policy if exists "reviewer_rls public read published schemes" on public.schemes;
create policy "reviewer_rls public read published schemes"
  on public.schemes for select
  using (publication_status = 'published');

drop policy if exists "reviewer_rls public read published scheme_source_links" on public.scheme_source_links;
create policy "reviewer_rls public read published scheme_source_links"
  on public.scheme_source_links for select
  using (exists (
    select 1 from public.schemes s
    where s.id = scheme_source_links.scheme_id and s.publication_status = 'published'
  ));

drop policy if exists "reviewer_rls public read published scheme_documents" on public.scheme_documents;
create policy "reviewer_rls public read published scheme_documents"
  on public.scheme_documents for select
  using (exists (
    select 1 from public.schemes s
    where s.id = scheme_documents.scheme_id and s.publication_status = 'published'
  ));

drop policy if exists "reviewer_rls public read published scheme_steps" on public.scheme_steps;
create policy "reviewer_rls public read published scheme_steps"
  on public.scheme_steps for select
  using (exists (
    select 1 from public.schemes s
    where s.id = scheme_steps.scheme_id and s.publication_status = 'published'
  ));

drop policy if exists "reviewer_rls public read published scheme_deadlines" on public.scheme_deadlines;
create policy "reviewer_rls public read published scheme_deadlines"
  on public.scheme_deadlines for select
  using (exists (
    select 1 from public.schemes s
    where s.id = scheme_deadlines.scheme_id and s.publication_status = 'published'
  ));

drop policy if exists "reviewer_rls public read published rule_versions" on public.rule_versions;
create policy "reviewer_rls public read published rule_versions"
  on public.rule_versions for select
  using (publication_status = 'published');

drop policy if exists "reviewer_rls public read published rule_version_source_links" on public.rule_version_source_links;
create policy "reviewer_rls public read published rule_version_source_links"
  on public.rule_version_source_links for select
  using (exists (
    select 1 from public.rule_versions rv
    where rv.id = rule_version_source_links.rule_version_id and rv.publication_status = 'published'
  ));

drop policy if exists "reviewer_rls public read published rules" on public.rules;
create policy "reviewer_rls public read published rules"
  on public.rules for select
  using (exists (
    select 1 from public.rule_versions rv
    where rv.id = rules.rule_version_id and rv.publication_status = 'published'
  ));

-- Reviewer read and editor write on every catalogue table.
-- Editors need viewer SELECT too: UPDATE only touches rows the role can see.
do $$
declare
  t text;
begin
  foreach t in array array[
    'source_records', 'schemes', 'scheme_source_links', 'scheme_documents',
    'scheme_steps', 'scheme_deadlines', 'rule_versions',
    'rule_version_source_links', 'rules'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists %I on public.%I', 'reviewer_rls viewer select ' || t, t);
    execute format(
      'create policy %I on public.%I for select using (public.is_reviewer(''viewer''))',
      'reviewer_rls viewer select ' || t, t);

    execute format('drop policy if exists %I on public.%I', 'reviewer_rls editor insert ' || t, t);
    execute format(
      'create policy %I on public.%I for insert with check (public.is_reviewer(''editor''))',
      'reviewer_rls editor insert ' || t, t);

    execute format('drop policy if exists %I on public.%I', 'reviewer_rls editor update ' || t, t);
    execute format(
      'create policy %I on public.%I for update using (public.is_reviewer(''editor'')) with check (public.is_reviewer(''editor''))',
      'reviewer_rls editor update ' || t, t);
  end loop;
end $$;

-- Immutability: a published scheme or rule version cannot be updated.
-- Moving a row to 'published' requires the publisher role.
create or replace function public.reviewer_guard_publication()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and old.publication_status = 'published' then
    raise exception 'published % is immutable', tg_table_name;
  end if;
  if new.publication_status = 'published'
     and (tg_op = 'INSERT' or old.publication_status is distinct from 'published') then
    if not public.is_reviewer('publisher') then
      raise exception 'publisher role required to publish';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists reviewer_guard_schemes_publication on public.schemes;
create trigger reviewer_guard_schemes_publication
  before insert or update on public.schemes
  for each row execute function public.reviewer_guard_publication();

drop trigger if exists reviewer_guard_rule_versions_publication on public.rule_versions;
create trigger reviewer_guard_rule_versions_publication
  before insert or update on public.rule_versions
  for each row execute function public.reviewer_guard_publication();

-- Rules belong to a rule version. Once that version is published, its rules are frozen.
create or replace function public.reviewer_guard_rules_of_published()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_status text;
begin
  if tg_op in ('UPDATE', 'DELETE') then
    select rv.publication_status into v_status
      from public.rule_versions rv where rv.id = old.rule_version_id;
    if v_status = 'published' then
      raise exception 'rules of a published rule version are immutable';
    end if;
  end if;
  if tg_op in ('INSERT', 'UPDATE') then
    select rv.publication_status into v_status
      from public.rule_versions rv where rv.id = new.rule_version_id;
    if v_status = 'published' then
      raise exception 'rules of a published rule version are immutable';
    end if;
    return new;
  end if;
  return old;
end;
$$;

drop trigger if exists reviewer_guard_rules_of_published on public.rules;
create trigger reviewer_guard_rules_of_published
  before insert or update or delete on public.rules
  for each row execute function public.reviewer_guard_rules_of_published();

-- ---------------------------------------------------------------------------
-- 6. publish_rule_version
-- ---------------------------------------------------------------------------

create or replace function public.publish_rule_version(p_version_id text, p_reason text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_scheme_id text;
  v_status text;
begin
  if not public.is_reviewer('publisher') then
    raise exception 'publisher role required' using errcode = '42501';
  end if;

  if p_reason is null or char_length(btrim(p_reason)) = 0 then
    raise exception 'reason required';
  end if;

  select rv.scheme_id, rv.publication_status
    into v_scheme_id, v_status
    from public.rule_versions rv
    where rv.id = p_version_id
    for update;

  if not found then
    raise exception 'rule version not found';
  end if;

  if v_status = 'published' then
    raise exception 'rule version already published';
  end if;

  if not exists (
    select 1
    from public.rule_version_source_links l
    join public.source_records s on s.id = l.source_record_id
    where l.rule_version_id = p_version_id
      and s.human_verified_at is not null
  ) then
    raise exception 'source not human-verified';
  end if;

  update public.rule_versions
    set publication_status = 'published', updated_at = now()
    where id = p_version_id;

  insert into public.review_events (scheme_id, rule_version_id, action, reviewer_id, reason)
    values (v_scheme_id, p_version_id, 'publish_rule_version', auth.uid(), p_reason);
end;
$$;

revoke execute on function public.publish_rule_version(text, text) from public, anon;
grant execute on function public.publish_rule_version(text, text) to authenticated;
