-- =============================================================================
-- 002_product_schema.sql
--
-- Not yet applied. Apply via Supabase SQL editor or `supabase db push`.
--
-- This file is SQL only. It has not been executed against any database.
-- It is written to be applied to a project where 001_initial.sql has NOT been
-- applied (001 is a placeholder). 001_initial.sql is left unchanged.
--
-- -----------------------------------------------------------------------------
-- DECISIONS (review these)
-- -----------------------------------------------------------------------------
-- D1. Id types. Catalogue ids are TEXT slugs (schemes.id = 'synthetic-scheme').
--     Rule version ids are TEXT too, because schemeRepository.ts:42 fabricates
--     "<schemeId>:no-rules" as a rule version id, which is not a uuid. Source
--     record and rule ids are TEXT to match the app's string ids. Per-user rows
--     (profiles, assessments, progress_events, reminders) use UUID.
-- D2. One lifecycle column. Catalogue tables use publication_status
--     ('draft' | 'reviewed' | 'published'). The app's Scheme.status
--     ('draft' | 'published') is represented by this column; there is no second
--     status column. source_records keeps verification_status
--     ('verified' | 'unverified'), which is a fact-check flag, not a lifecycle.
-- D3. Scheme deadline lives in ONE place: scheme_deadlines. schemes has no
--     deadline column. A scheme may have several official dates. Each row must
--     cite a source (source_record_id NOT NULL).
-- D4. source_records.checked_at is a nullable date. The app's sentinel
--     "not-yet-checked" becomes NULL. Unchecked leads are draft rows.
-- D5. rules.source_record_id is NOT NULL (ON DELETE RESTRICT). A rule with no
--     source cannot be published.
-- D6. RuleVersion.sourceIds is a link table (rule_version_source_links), not an
--     array column, so the foreign keys hold.
-- D7. Scheme.sourceIds is a link table (scheme_source_links).
-- D8. Documents, steps and deadlines are child tables with composite primary keys
--     (scheme_id, position). Deadlines use a uuid id because a scheme may have
--     several rows with the same date.
-- D9. Child catalogue rows (documents, steps, deadlines, links) get public SELECT
--     when their parent scheme or rule version is reviewed or published. The app
--     displays them, so the 001 "no browser policy" choice is reversed here.
--     Catalogue writes have NO browser policy.
-- D10. profiles: one row per owner (UNIQUE owner_id). A CHECK limits
--      confirmed_facts keys to the four fact keys the app uses (tribalGroup,
--      district, houseType, dairyIntent). Identity numbers, bank details, OTPs
--      and scans cannot be stored as keys. This is a guard, not a full control:
--      values are still free jsonb and must be validated by the app.
-- D11. profiles.version is an integer the app increments on each change.
--      assessments.profile_version records which version was assessed.
-- D12. assessments: profile_id and scheme_id are FKs. rule_version_id is
--      nullable FK. The app must NOT write the synthetic "<schemeId>:no-rules"
--      id, because it is not in rule_versions and the FK will reject it.
--      Assessment source ids go in assessment_source_links, not an array.
-- D13. progress_events: the app's ProgressEvent has no note, so no note column.
--      Free-text narrative is not persisted. kind is free text with a non-empty
--      check, because the app treats kind as a string (no enum exists yet).
--      entered_by is CHECK ('user') to match the app.
-- D14. reminders: no status column. Status (upcoming/due/overdue) is derived
--      from the clock at read time. Official reminders store due_on (date
--      only) with no timezone. Personal follow-ups store due_at (timestamptz)
--      plus timezone. A CHECK enforces which columns each kind uses. One row per
--      (owner, scheme, kind) is enforced by UNIQUE.
-- D15. review_audit.target_id is TEXT (catalogue ids are text, see D1).
--      RLS on, no browser policy. Only a verified server role may write it.
-- D16. The application plan (ApplicationPlan) is NOT given a table. Its fields
--      (documents, steps, officialUrl) are derivable from scheme_documents,
--      scheme_steps and schemes.application_channel. Possibly unused in the app.
-- D17. Every foreign key has an index. Link tables index the non-leading column.
-- D18. updated_at is added only to profiles and to catalogue parents
--      (schemes, rule_versions, source_records), where edits happen.
-- -----------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Catalogue (public read when reviewed/published; no browser writes)
-- ---------------------------------------------------------------------------

create table if not exists public.source_records (
  id text primary key check (char_length(id) > 0),
  url text not null check (char_length(url) > 0),
  publisher text not null,
  checked_at date,
  effective_from date,
  effective_to date,
  evidence_text text not null check (char_length(evidence_text) <= 300),
  verification_status text not null
    check (verification_status in ('verified', 'unverified', 'conflicting')),
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'reviewed', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (effective_to is null or effective_from is null or effective_to >= effective_from)
);

create table if not exists public.schemes (
  id text primary key check (char_length(id) > 0),
  title_en text not null check (char_length(title_en) > 0),
  title_hi text,
  department text not null,
  beneficiary_scope text not null
    check (beneficiary_scope in ('household', 'member')),
  application_channel text not null,
  last_verified date,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'reviewed', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scheme_source_links (
  scheme_id text not null references public.schemes (id) on delete cascade,
  source_record_id text not null references public.source_records (id) on delete restrict,
  primary key (scheme_id, source_record_id)
);

create table if not exists public.scheme_documents (
  scheme_id text not null references public.schemes (id) on delete cascade,
  position integer not null check (position >= 0),
  label_en text not null check (char_length(label_en) > 0),
  created_at timestamptz not null default now(),
  primary key (scheme_id, position)
);

create table if not exists public.scheme_steps (
  scheme_id text not null references public.schemes (id) on delete cascade,
  position integer not null check (position >= 0),
  text_en text not null check (char_length(text_en) > 0),
  created_at timestamptz not null default now(),
  primary key (scheme_id, position)
);

create table if not exists public.scheme_deadlines (
  id uuid primary key default gen_random_uuid(),
  scheme_id text not null references public.schemes (id) on delete cascade,
  deadline_on date not null,
  source_record_id text not null references public.source_records (id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.rule_versions (
  id text primary key check (char_length(id) > 0),
  scheme_id text not null references public.schemes (id) on delete cascade,
  version integer not null check (version >= 1),
  effective_at date not null,
  reviewed_at date,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'reviewed', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (scheme_id, version)
);

create table if not exists public.rule_version_source_links (
  rule_version_id text not null references public.rule_versions (id) on delete cascade,
  source_record_id text not null references public.source_records (id) on delete restrict,
  primary key (rule_version_id, source_record_id)
);

create table if not exists public.rules (
  id text primary key check (char_length(id) > 0),
  rule_version_id text not null references public.rule_versions (id) on delete cascade,
  rule_key text not null check (char_length(rule_key) > 0),
  fact_key text not null check (char_length(fact_key) > 0),
  operator text not null
    check (operator in ('equals', 'at_least', 'at_most', 'one_of', 'is_true', 'is_false')),
  value jsonb not null,
  description text not null,
  source_record_id text not null references public.source_records (id) on delete restrict,
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
  owner_id uuid not null unique references auth.users (id) on delete cascade,
  confirmed_facts jsonb not null default '{}'::jsonb
    check ((confirmed_facts - array['tribalGroup', 'district', 'houseType', 'dairyIntent', 'settlementArea', 'hasGovernmentEmployee']::text[]) = '{}'::jsonb),
  unknown_facts text[] not null default '{}',
  version integer not null default 1 check (version >= 1),
  consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  profile_version integer not null check (profile_version >= 1),
  scheme_id text not null references public.schemes (id) on delete cascade,
  rule_version_id text references public.rule_versions (id) on delete set null,
  outcome text not null
    check (outcome in ('likely_fit', 'needs_information', 'likely_mismatch', 'source_review_needed')),
  passed text[] not null default '{}',
  failed text[] not null default '{}',
  unknown text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.assessment_source_links (
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  source_record_id text not null references public.source_records (id) on delete restrict,
  primary key (assessment_id, source_record_id)
);

create table if not exists public.progress_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  scheme_id text not null references public.schemes (id) on delete cascade,
  kind text not null check (char_length(kind) > 0),
  at timestamptz not null,
  entered_by text not null default 'user' check (entered_by = 'user'),
  created_at timestamptz not null default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  scheme_id text not null references public.schemes (id) on delete cascade,
  kind text not null check (kind in ('official_deadline', 'personal_follow_up')),
  due_on date,
  due_at timestamptz,
  timezone text,
  created_at timestamptz not null default now(),
  unique (owner_id, scheme_id, kind),
  check (
    (kind = 'official_deadline'
      and due_on is not null and due_at is null and timezone is null)
    or
    (kind = 'personal_follow_up'
      and due_at is not null and due_on is null and timezone is not null)
  )
);

-- Audit trail for reviewer actions. Rows are written only by a verified server-side role.
create table if not exists public.review_audit (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid references auth.users (id) on delete set null,
  action text not null check (char_length(action) > 0),
  target_table text not null check (char_length(target_table) > 0),
  target_id text,
  note text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes on every foreign key (D17)
-- ---------------------------------------------------------------------------

create index if not exists scheme_source_links_source_idx on public.scheme_source_links (source_record_id);
create index if not exists scheme_documents_scheme_idx on public.scheme_documents (scheme_id);
create index if not exists scheme_steps_scheme_idx on public.scheme_steps (scheme_id);
create index if not exists scheme_deadlines_scheme_idx on public.scheme_deadlines (scheme_id);
create index if not exists scheme_deadlines_source_idx on public.scheme_deadlines (source_record_id);
create index if not exists rule_versions_scheme_idx on public.rule_versions (scheme_id);
create index if not exists rule_version_source_links_source_idx on public.rule_version_source_links (source_record_id);
create index if not exists rules_version_idx on public.rules (rule_version_id);
create index if not exists rules_source_idx on public.rules (source_record_id);
create index if not exists assessments_owner_idx on public.assessments (owner_id);
create index if not exists assessments_profile_idx on public.assessments (profile_id);
create index if not exists assessments_scheme_idx on public.assessments (scheme_id);
create index if not exists assessments_rule_version_idx on public.assessments (rule_version_id);
create index if not exists assessment_source_links_source_idx on public.assessment_source_links (source_record_id);
create index if not exists progress_events_owner_idx on public.progress_events (owner_id);
create index if not exists progress_events_scheme_idx on public.progress_events (scheme_id);
create index if not exists reminders_scheme_idx on public.reminders (scheme_id);
create index if not exists review_audit_reviewer_idx on public.review_audit (reviewer_id);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.source_records enable row level security;
alter table public.schemes enable row level security;
alter table public.scheme_source_links enable row level security;
alter table public.scheme_documents enable row level security;
alter table public.scheme_steps enable row level security;
alter table public.scheme_deadlines enable row level security;
alter table public.rule_versions enable row level security;
alter table public.rule_version_source_links enable row level security;
alter table public.rules enable row level security;
alter table public.profiles enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_source_links enable row level security;
alter table public.progress_events enable row level security;
alter table public.reminders enable row level security;
alter table public.review_audit enable row level security;

-- Public read of catalogue rows that are reviewed or published (D9).
drop policy if exists "public read reviewed or published source_records" on public.source_records;
create policy "public read reviewed or published source_records"
  on public.source_records for select
  using (publication_status in ('reviewed', 'published'));

drop policy if exists "public read reviewed or published schemes" on public.schemes;
create policy "public read reviewed or published schemes"
  on public.schemes for select
  using (publication_status in ('reviewed', 'published'));

drop policy if exists "public read scheme_source_links of published schemes" on public.scheme_source_links;
create policy "public read scheme_source_links of published schemes"
  on public.scheme_source_links for select
  using (exists (
    select 1 from public.schemes s
    where s.id = scheme_source_links.scheme_id
      and s.publication_status in ('reviewed', 'published')
  ));

drop policy if exists "public read scheme_documents of published schemes" on public.scheme_documents;
create policy "public read scheme_documents of published schemes"
  on public.scheme_documents for select
  using (exists (
    select 1 from public.schemes s
    where s.id = scheme_documents.scheme_id
      and s.publication_status in ('reviewed', 'published')
  ));

drop policy if exists "public read scheme_steps of published schemes" on public.scheme_steps;
create policy "public read scheme_steps of published schemes"
  on public.scheme_steps for select
  using (exists (
    select 1 from public.schemes s
    where s.id = scheme_steps.scheme_id
      and s.publication_status in ('reviewed', 'published')
  ));

drop policy if exists "public read scheme_deadlines of published schemes" on public.scheme_deadlines;
create policy "public read scheme_deadlines of published schemes"
  on public.scheme_deadlines for select
  using (exists (
    select 1 from public.schemes s
    where s.id = scheme_deadlines.scheme_id
      and s.publication_status in ('reviewed', 'published')
  ));

drop policy if exists "public read reviewed or published rule_versions" on public.rule_versions;
create policy "public read reviewed or published rule_versions"
  on public.rule_versions for select
  using (publication_status in ('reviewed', 'published'));

drop policy if exists "public read rule_version_source_links of published rule_versions" on public.rule_version_source_links;
create policy "public read rule_version_source_links of published rule_versions"
  on public.rule_version_source_links for select
  using (exists (
    select 1 from public.rule_versions rv
    where rv.id = rule_version_source_links.rule_version_id
      and rv.publication_status in ('reviewed', 'published')
  ));

drop policy if exists "public read rules of reviewed or published rule_versions" on public.rules;
create policy "public read rules of reviewed or published rule_versions"
  on public.rules for select
  using (exists (
    select 1 from public.rule_versions rv
    where rv.id = rules.rule_version_id
      and rv.publication_status in ('reviewed', 'published')
  ));

-- Owner-only policies for personal tables (select, insert, update, delete).
drop policy if exists "owner select profiles" on public.profiles;
create policy "owner select profiles" on public.profiles
  for select using (auth.uid() = owner_id);
drop policy if exists "owner insert profiles" on public.profiles;
create policy "owner insert profiles" on public.profiles
  for insert with check (auth.uid() = owner_id);
drop policy if exists "owner update profiles" on public.profiles;
create policy "owner update profiles" on public.profiles
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists "owner delete profiles" on public.profiles;
create policy "owner delete profiles" on public.profiles
  for delete using (auth.uid() = owner_id);

drop policy if exists "owner select assessments" on public.assessments;
create policy "owner select assessments" on public.assessments
  for select using (auth.uid() = owner_id);
drop policy if exists "owner insert assessments" on public.assessments;
create policy "owner insert assessments" on public.assessments
  for insert with check (auth.uid() = owner_id);
drop policy if exists "owner update assessments" on public.assessments;
create policy "owner update assessments" on public.assessments
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists "owner delete assessments" on public.assessments;
create policy "owner delete assessments" on public.assessments
  for delete using (auth.uid() = owner_id);

drop policy if exists "owner select assessment_source_links" on public.assessment_source_links;
create policy "owner select assessment_source_links" on public.assessment_source_links
  for select using (exists (
    select 1 from public.assessments a
    where a.id = assessment_source_links.assessment_id and a.owner_id = auth.uid()
  ));
drop policy if exists "owner insert assessment_source_links" on public.assessment_source_links;
create policy "owner insert assessment_source_links" on public.assessment_source_links
  for insert with check (exists (
    select 1 from public.assessments a
    where a.id = assessment_source_links.assessment_id and a.owner_id = auth.uid()
  ));
drop policy if exists "owner delete assessment_source_links" on public.assessment_source_links;
create policy "owner delete assessment_source_links" on public.assessment_source_links
  for delete using (exists (
    select 1 from public.assessments a
    where a.id = assessment_source_links.assessment_id and a.owner_id = auth.uid()
  ));

drop policy if exists "owner select progress_events" on public.progress_events;
create policy "owner select progress_events" on public.progress_events
  for select using (auth.uid() = owner_id);
drop policy if exists "owner insert progress_events" on public.progress_events;
create policy "owner insert progress_events" on public.progress_events
  for insert with check (auth.uid() = owner_id);
drop policy if exists "owner update progress_events" on public.progress_events;
create policy "owner update progress_events" on public.progress_events
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists "owner delete progress_events" on public.progress_events;
create policy "owner delete progress_events" on public.progress_events
  for delete using (auth.uid() = owner_id);

drop policy if exists "owner select reminders" on public.reminders;
create policy "owner select reminders" on public.reminders
  for select using (auth.uid() = owner_id);
drop policy if exists "owner insert reminders" on public.reminders;
create policy "owner insert reminders" on public.reminders
  for insert with check (auth.uid() = owner_id);
drop policy if exists "owner update reminders" on public.reminders;
create policy "owner update reminders" on public.reminders
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists "owner delete reminders" on public.reminders;
create policy "owner delete reminders" on public.reminders
  for delete using (auth.uid() = owner_id);

-- No browser policy on review_audit. With RLS enabled and no policy, the browser
-- role cannot read or write it. Reviewer writes need a verified server-side role,
-- which is not configured yet.
