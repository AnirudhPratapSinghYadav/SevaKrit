/**
 * Applies HaqPath migrations to a disposable Postgres and runs SQL-level RLS checks.
 * Does not need Studio/pg_meta. Auth is stubbed enough for auth.uid() policies.
 */
import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const dbUrl = process.env.DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:54432/haqpath";
const root = path.resolve("supabase/migrations");

function pass(name) {
  console.log("PASS", name);
}
function fail(name, detail) {
  console.error("FAIL", name, detail);
  process.exitCode = 1;
}

const client = new pg.Client({ connectionString: dbUrl });
await client.connect();

await client.query(`
  create extension if not exists pgcrypto;
  do $$ begin
    create role anon nologin;
  exception when duplicate_object then null;
  end $$;
  do $$ begin
    create role authenticated nologin;
  exception when duplicate_object then null;
  end $$;
  create schema if not exists auth;
  create table if not exists auth.users (
    id uuid primary key default gen_random_uuid()
  );
  create or replace function auth.uid() returns uuid
  language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
`);
await client.query(`grant usage on schema public to anon, authenticated`);

for (const file of ["001_initial.sql", "002_product_schema.sql", "003_reviewer_rls_audit.sql"]) {
  const sql = fs.readFileSync(path.join(root, file), "utf8");
  await client.query(sql);
  pass(`applied ${file}`);
}

const publisher = (await client.query(`insert into auth.users default values returning id`)).rows[0].id;
const citizen = (await client.query(`insert into auth.users default values returning id`)).rows[0].id;
await client.query(
  `insert into public.reviewer_memberships (user_id, role, active) values ($1, 'publisher', true)`,
  [publisher],
);

await client.query(
  `insert into public.source_records (id, url, publisher, evidence_text, verification_status, publication_status, human_verified_at)
   values ('src-sql', 'https://cmhelpline.mp.gov.in/example', 'MP CM Helpline', 'sql rls', 'verified', 'draft', now())`,
);
await client.query(
  `insert into public.schemes (id, title_en, department, beneficiary_scope, application_channel, publication_status)
   values ('sch-pub', 'Published', 'test', 'household', 'test', 'draft'),
          ('sch-draft', 'Draft', 'test', 'household', 'test', 'draft')`,
);
await client.query(
  `insert into public.rule_versions (id, scheme_id, version, effective_at, publication_status)
   values ('ver-1', 'sch-pub', 1, '2024-01-01', 'draft')`,
);
await client.query(`insert into public.rule_version_source_links values ('ver-1', 'src-sql')`);

await client.query("begin");
await client.query(`select set_config('request.jwt.claim.sub', $1, true)`, [publisher]);
await client.query(`set local role authenticated`);
await client.query(`update public.source_records set publication_status = 'published' where id = 'src-sql'`);
await client.query(`update public.schemes set publication_status = 'published' where id = 'sch-pub'`);
await client.query("commit");

await client.query("begin");
await client.query(`select set_config('role', 'anon', true)`);
await client.query(`set local role anon`);
const anonPub = await client.query(`select id from public.schemes where id = 'sch-pub'`);
const anonDraft = await client.query(`select id from public.schemes where id = 'sch-draft'`);
if (anonPub.rowCount === 1) pass("anon sees published");
else fail("anon sees published", anonPub.rows);
if (anonDraft.rowCount === 0) pass("anon cannot see draft");
else fail("anon cannot see draft", anonDraft.rows);
await client.query("rollback");

await client.query("begin");
await client.query(`select set_config('request.jwt.claim.sub', $1, true)`, [citizen]);
await client.query(`set local role authenticated`);
let denied = false;
try {
  await client.query(
    `insert into public.schemes (id, title_en, department, beneficiary_scope, application_channel)
     values ('sch-citizen', 'nope', 'x', 'household', 'x')`,
  );
} catch {
  denied = true;
}
if (denied) pass("citizen insert denied");
else fail("citizen insert denied", "insert succeeded");
await client.query("rollback");

await client.query("begin");
await client.query(`select set_config('request.jwt.claim.sub', $1, true)`, [publisher]);
await client.query(`set local role authenticated`);
await client.query(`select public.publish_rule_version('ver-1', 'sql harness')`);
const status = await client.query(`select publication_status from public.rule_versions where id = 'ver-1'`);
if (status.rows[0]?.publication_status === "published") pass("publisher publish verified version");
else fail("publisher publish verified version", status.rows);
const audit = await client.query(`select count(*)::int as n from public.review_events where rule_version_id = 'ver-1'`);
if (audit.rows[0].n >= 1) pass("audit row written");
else fail("audit row written", audit.rows);
await client.query("commit");

await client.end();
if (process.exitCode === 1) process.exit(1);
console.log("SQL RLS suite finished");
