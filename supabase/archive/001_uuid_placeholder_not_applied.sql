-- PLACEHOLDER: not applied. Requires Supabase project credentials which are not configured.
-- This file is SQL only. It has not been executed against any database.
--
-- Access model:
--   * Catalogue tables (schemes, source_records, rule_versions, rules) are readable by anyone,
--     but only rows whose publication_status is 'reviewed' or 'published'.
--   * Personal tables (profiles, assessments, progress_events, reminders) are visible and
--     writable only by their owner (auth.uid() = owner_id).
--   * Reviewer writes: there is NO browser policy for writing catalogue or audit rows.
--     Writes require a verified server-side role. That role is not configured yet.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------

create table if not exists public.source_records (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  url text not null,
  publisher text not null,
  checked_at date,
  effective_from date,
  effective_to date,
  evidence_text text not null check (char_length(evidence_text) <= 300),
  status text not null check (status in ('verified', 'unverified')),
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'reviewed', 'published')),
  created_at timestamptz not null default now()
);

create table if not exists public.schemes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_hi text,
  department text not null,
  beneficiary_scope text not null check (beneficiary_scope in ('household', 'member')),
  application_channel text not null,
  deadline date,
  status text not null check (status in ('draft', 'published')),
  last_verified date,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'reviewed', 'published')),
  created_at timestamptz not null default now()
);

create table if not exists public.scheme_source_links (
  scheme_id uuid not null references public.schemes (id) on delete cascade,
  source_record_id uuid not null references public.source_records (id) on delete cascade,
  primary key (scheme_id, source_record_id)
);

create table if not exists public.scheme_documents (
  id uuid primary key default gen_random_uuid(),
  scheme_id uuid not null references public.schemes (id) on delete cascade,
  position integer not null check (position >= 0),
  label_en text not null,
  created_at timestamptz not null default now(),
  unique (scheme_id, position)
);

create table if not exists public.scheme_steps (
  id uuid primary key default gen_random_uuid(),
  scheme_id uuid not null references public.schemes (id) on delete cascade,
  position integer not null check (position >= 0),
  text_en text not null,
  created_at timestamptz not null default now(),
  unique (scheme_id, position)
);

create table if not exists public.scheme_deadlines (
  id uuid primary key default gen_random_uuid(),
  scheme_id uuid not null references public.schemes (id) on delete cascade,
  deadline_on date not null,
  source_record_id uuid references public.source_records (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.rule_versions (
  id uuid primary key default gen_random_uuid(),
  scheme_id uuid not null references public.schemes (id) on delete cascade,
  version integer not null check (version >= 1),
  effective_at date not null,
  reviewed_at date,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'reviewed', 'published')),
  created_at timestamptz not null default now(),
  unique (scheme_id, version)
);

create table if not exists public.rules (
  id uuid primary key default gen_random_uuid(),
  rule_version_id uuid not null references public.rule_versions (id) on delete cascade,
  rule_key text not null,
  fact_key text not null,
  operator text not null
    check (operator in ('equals', 'at_least', 'at_most', 'one_of', 'is_true', 'is_false')),
  value jsonb not null,
  description text not null,
  source_record_id uuid references public.source_records (id) on delete set null,
  rule_group text,
  exclusion boolean not null default false,
  created_at timestamptz not null default now(),
  unique (rule_version_id, rule_key)
);

-- ---------------------------------------------------------------------------
-- Personal data (owner only)
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  confirmed_facts jsonb not null default '{}'::jsonb,
  unknown_facts text[] not null default '{}',
  consent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  scheme_id uuid not null references public.schemes (id) on delete cascade,
  rule_version_id uuid references public.rule_versions (id) on delete set null,
  outcome text not null
    check (outcome in ('likely_fit', 'needs_information', 'likely_mismatch', 'source_review_needed')),
  passed text[] not null default '{}',
  failed text[] not null default '{}',
  unknown text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.progress_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  scheme_id uuid not null references public.schemes (id) on delete cascade,
  kind text not null,
  note text,
  at timestamptz not null,
  entered_by text not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  scheme_id uuid not null references public.schemes (id) on delete cascade,
  kind text not null check (kind in ('official_deadline', 'personal_follow_up')),
  due_at timestamptz not null,
  timezone text not null,
  status text not null check (status in ('upcoming', 'due', 'overdue')),
  created_at timestamptz not null default now()
);

-- Audit trail for reviewer actions. Rows are written only by a verified server-side role.
create table if not exists public.review_audit (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid references auth.users (id) on delete set null,
  action text not null,
  target_table text not null,
  target_id uuid,
  note text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes on owner and foreign-key columns
-- ---------------------------------------------------------------------------

create index if not exists profiles_owner_idx on public.profiles (owner_id);
create index if not exists assessments_owner_idx on public.assessments (owner_id);
create index if not exists progress_events_owner_idx on public.progress_events (owner_id);
create index if not exists reminders_owner_idx on public.reminders (owner_id);
create index if not exists review_audit_reviewer_idx on public.review_audit (reviewer_id);
create index if not exists rule_versions_scheme_idx on public.rule_versions (scheme_id);
create index if not exists rules_version_idx on public.rules (rule_version_id);
create index if not exists scheme_deadlines_scheme_idx on public.scheme_deadlines (scheme_id);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.source_records enable row level security;
alter table public.schemes enable row level security;
alter table public.rule_versions enable row level security;
alter table public.rules enable row level security;
alter table public.scheme_source_links enable row level security;
alter table public.scheme_documents enable row level security;
alter table public.scheme_steps enable row level security;
alter table public.scheme_deadlines enable row level security;
alter table public.profiles enable row level security;
alter table public.assessments enable row level security;
alter table public.progress_events enable row level security;
alter table public.reminders enable row level security;
alter table public.review_audit enable row level security;

-- Public read: only reviewed or published catalogue rows.
create policy "public read reviewed or published source_records"
  on public.source_records for select
  using (publication_status in ('reviewed', 'published'));

create policy "public read reviewed or published schemes"
  on public.schemes for select
  using (publication_status in ('reviewed', 'published'));

create policy "public read reviewed or published rule_versions"
  on public.rule_versions for select
  using (publication_status in ('reviewed', 'published'));

create policy "public read rules of reviewed or published rule_versions"
  on public.rules for select
  using (
    exists (
      select 1 from public.rule_versions rv
      where rv.id = rules.rule_version_id
        and rv.publication_status in ('reviewed', 'published')
    )
  );

-- Owner-only policies for personal tables.
create policy "owner select profiles" on public.profiles for select using (auth.uid() = owner_id);
create policy "owner insert profiles" on public.profiles for insert with check (auth.uid() = owner_id);
create policy "owner update profiles" on public.profiles for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner delete profiles" on public.profiles for delete using (auth.uid() = owner_id);

create policy "owner select assessments" on public.assessments for select using (auth.uid() = owner_id);
create policy "owner insert assessments" on public.assessments for insert with check (auth.uid() = owner_id);
create policy "owner update assessments" on public.assessments for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner delete assessments" on public.assessments for delete using (auth.uid() = owner_id);

create policy "owner select progress_events" on public.progress_events for select using (auth.uid() = owner_id);
create policy "owner insert progress_events" on public.progress_events for insert with check (auth.uid() = owner_id);
create policy "owner update progress_events" on public.progress_events for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner delete progress_events" on public.progress_events for delete using (auth.uid() = owner_id);

create policy "owner select reminders" on public.reminders for select using (auth.uid() = owner_id);
create policy "owner insert reminders" on public.reminders for insert with check (auth.uid() = owner_id);
create policy "owner update reminders" on public.reminders for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner delete reminders" on public.reminders for delete using (auth.uid() = owner_id);

-- No browser policies on scheme_source_links, scheme_documents, scheme_steps, scheme_deadlines
-- or review_audit. With RLS enabled and no policy, the browser role cannot read or write them.
-- Reviewer writes: NO browser policy. Writes require a verified server-side role, which is not
-- configured yet.
