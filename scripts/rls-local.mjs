/**
 * Runs against a local Supabase stack. Reads connection details from the environment
 * printed by `npx supabase status -o env`. Does not print keys.
 */
import { createClient } from "@supabase/supabase-js";
import pg from "pg";

const url = process.env.API_URL ?? process.env.SUPABASE_URL;
const anon = process.env.ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
const service = process.env.SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const dbUrl = process.env.DB_URL ?? process.env.DATABASE_URL;

if (!url || !anon || !service || !dbUrl) {
  console.error("BLOCKED: missing API_URL, ANON_KEY, SERVICE_ROLE_KEY, or DB_URL");
  process.exit(2);
}

const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
const anonClient = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
const password = "Local-test-password-1";
const stamp = Date.now().toString(36);

function fail(name, detail) {
  console.error("FAIL", name, detail);
  process.exitCode = 1;
}
function pass(name) {
  console.log("PASS", name);
}

async function userClient(email) {
  const client = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return client;
}

async function ensureUser(email) {
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  return data.user.id;
}

const ids = [];
try {
  const citizenId = await ensureUser(`citizen-${stamp}@haqpath.local`);
  const editorId = await ensureUser(`editor-${stamp}@haqpath.local`);
  const publisherId = await ensureUser(`publisher-${stamp}@haqpath.local`);
  ids.push(citizenId, editorId, publisherId);

  const db = new pg.Client({ connectionString: dbUrl });
  await db.connect();
  await db.query(
    `insert into public.reviewer_memberships (user_id, role, active) values ($1, 'editor', true), ($2, 'publisher', true)`,
    [editorId, publisherId],
  );

  const sourceId = `src-${stamp}`;
  const schemeId = `sch-pub-${stamp}`;
  const draftId = `sch-draft-${stamp}`;
  const versionId = `ver-${stamp}`;
  await db.query(
    `insert into public.source_records (id, url, publisher, evidence_text, verification_status, publication_status, human_verified_at)
     values ($1, 'https://cmhelpline.mp.gov.in/example', 'MP CM Helpline', 'local rls fixture', 'verified', 'published', now())`,
    [sourceId],
  );
  await db.query(
    `insert into public.schemes (id, title_en, department, beneficiary_scope, application_channel, publication_status)
     values ($1, 'Published fixture', 'test', 'household', 'test', 'published'),
            ($2, 'Draft fixture', 'test', 'household', 'test', 'draft')`,
    [schemeId, draftId],
  );
  await db.query(
    `insert into public.rule_versions (id, scheme_id, version, effective_at, publication_status)
     values ($1, $2, 1, '2024-01-01', 'draft')`,
    [versionId, schemeId],
  );
  await db.query(
    `insert into public.rule_version_source_links (rule_version_id, source_record_id) values ($1, $2)`,
    [versionId, sourceId],
  );

  const published = await anonClient.from("schemes").select("id").eq("id", schemeId);
  if (published.error || published.data?.length !== 1) fail("anon read published", published.error ?? published.data);
  else pass("anon read published");

  const hidden = await anonClient.from("schemes").select("id").eq("id", draftId);
  if (hidden.error) fail("anon draft query", hidden.error.message);
  else if ((hidden.data ?? []).length !== 0) fail("anon cannot see draft", hidden.data);
  else pass("anon cannot see draft");

  const anonWrite = await anonClient.from("schemes").insert({
    id: `anon-${stamp}`,
    title_en: "nope",
    department: "x",
    beneficiary_scope: "household",
    application_channel: "x",
    publication_status: "draft",
  });
  if (!anonWrite.error) fail("anon insert denied", "insert succeeded");
  else pass("anon insert denied");

  const citizen = await userClient(`citizen-${stamp}@haqpath.local`);
  const citizenWrite = await citizen.from("schemes").insert({
    id: `cit-${stamp}`,
    title_en: "nope",
    department: "x",
    beneficiary_scope: "household",
    application_channel: "x",
  });
  if (!citizenWrite.error) fail("citizen insert denied", "insert succeeded");
  else pass("citizen insert denied");

  const escalate = await citizen.from("reviewer_memberships").insert({ user_id: citizenId, role: "publisher" });
  if (!escalate.error) fail("citizen cannot grant role", "insert succeeded");
  else pass("citizen cannot grant role");

  const editor = await userClient(`editor-${stamp}@haqpath.local`);
  const editorDraft = await editor.from("schemes").insert({
    id: `ed-${stamp}`,
    title_en: "editor draft",
    department: "x",
    beneficiary_scope: "household",
    application_channel: "x",
    publication_status: "draft",
  });
  if (editorDraft.error) fail("editor can insert draft", editorDraft.error.message);
  else pass("editor can insert draft");

  const editorPublish = await editor.rpc("publish_rule_version", {
    p_version_id: versionId,
    p_reason: "editor must not publish",
  });
  if (!editorPublish.error) fail("editor publish denied", "rpc succeeded");
  else pass("editor publish denied");

  const editorEscalate = await editor.from("reviewer_memberships").update({ role: "publisher" }).eq("user_id", editorId);
  if (!editorEscalate.error && (editorEscalate.data ?? []).length > 0) fail("editor cannot escalate", editorEscalate.data);
  else pass("editor cannot escalate");

  await db.query(`update public.source_records set human_verified_at = null where id = $1`, [sourceId]);
  const publisher = await userClient(`publisher-${stamp}@haqpath.local`);
  const unverified = await publisher.rpc("publish_rule_version", {
    p_version_id: versionId,
    p_reason: "should fail without human verification",
  });
  if (!unverified.error) fail("unverified source blocks publish", "rpc succeeded");
  else pass("unverified source blocks publish");

  await db.query(
    `update public.source_records set human_verified_at = now(), verification_status = 'verified', publication_status = 'published' where id = $1`,
    [sourceId],
  );
  const publishedOk = await publisher.rpc("publish_rule_version", {
    p_version_id: versionId,
    p_reason: "local rls test",
  });
  if (publishedOk.error) fail("publisher can publish verified version", publishedOk.error.message);
  else pass("publisher can publish verified version");

  const audit = await db.query(`select count(*)::int as n from public.review_events where rule_version_id = $1`, [versionId]);
  if (audit.rows[0].n < 1) fail("audit row written", audit.rows);
  else pass("audit row written");

  const mutateAudit = await publisher.from("review_events").delete().eq("rule_version_id", versionId);
  if (!mutateAudit.error) fail("audit delete denied", "delete succeeded");
  else pass("audit delete denied");

  const rewrite = await publisher.from("rule_versions").update({ publication_status: "draft" }).eq("id", versionId);
  if (!rewrite.error) fail("published version immutable", "update succeeded");
  else pass("published version immutable");

  await db.query("begin");
  await db.query(`select set_config('request.jwt.claims', $1, true)`, [
    JSON.stringify({ sub: publisherId, role: "authenticated" }),
  ]);
  await db.query("set local role authenticated");
  await db.query(`select public.publish_rule_version($1, 'rollback probe')`, [`missing-${stamp}`]).catch(() => {});
  await db.query("rollback");
  const still = await db.query(`select publication_status from public.rule_versions where id = $1`, [versionId]);
  if (still.rows[0].publication_status !== "published") fail("rollback leaves published row", still.rows);
  else pass("rollback leaves published row");

  await db.end();
} catch (error) {
  console.error("FAIL harness", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  for (const id of ids) {
    await admin.auth.admin.deleteUser(id).catch(() => {});
  }
}

if (process.exitCode === 1) process.exit(1);
console.log("RLS local suite finished");
