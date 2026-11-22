import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { demoHouseholds } from "../data/demoHouseholds";
import { OUTCOME_LABELS } from "../domain/outcomeLabels";
import { evaluatePublishedSchemes } from "../services/evaluatePublished";

type Role = string | null;

/** Database-backed reviewer session. Role comes from RPC, never from localStorage. */
export default function ReviewSession({ client }: { client: SupabaseClient }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [schemeId, setSchemeId] = useState("");
  const [title, setTitle] = useState("");
  const [versionId, setVersionId] = useState("");
  const [reason, setReason] = useState("");
  const [sampleId, setSampleId] = useState<keyof typeof demoHouseholds>("fit_baiga_dindori");

  const sampleOutcomes = useMemo(() => {
    const profile = demoHouseholds[sampleId];
    if (!profile) return [];
    return evaluatePublishedSchemes(profile, "2026-11-22T12:00:00Z");
  }, [sampleId]);

  useEffect(() => {
    void client.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = client.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, [client]);

  useEffect(() => {
    if (session === null) {
      setRole(null);
      return;
    }
    void client.rpc("current_reviewer_role").then(({ data, error }) => {
      setRole(error ? null : (data as string | null));
      if (error) setMessage(error.message);
    });
  }, [client, session]);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    const { error } = await client.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "Signed in.");
  }

  async function createDraft() {
    const { error } = await client.from("schemes").insert({
      id: schemeId.trim(),
      title_en: title.trim(),
      department: "Draft — not an official listing",
      beneficiary_scope: "household",
      application_channel: "Not stated",
      publication_status: "draft",
    });
    setMessage(error ? error.message : "Draft scheme saved. It is not public.");
  }

  async function publish() {
    const { error } = await client.rpc("publish_rule_version", {
      p_version_id: versionId.trim(),
      p_reason: reason.trim(),
    });
    setMessage(error ? error.message : "Publish call finished.");
  }

  if (session === null) {
    return (
      <form onSubmit={signIn} className="flex max-w-md flex-col gap-3">
        <h2 className="text-xl font-semibold text-ink">Reviewer sign-in</h2>
        <p className="text-sm">
          Uses the configured Supabase project. Authorization is checked in the database, not in the browser.
        </p>
        <label htmlFor="review-email" className="font-semibold text-ink">
          Email
        </label>
        <input
          id="review-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-11 rounded-md border border-border px-3"
          required
        />
        <label htmlFor="review-password" className="font-semibold text-ink">
          Password
        </label>
        <input
          id="review-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-h-11 rounded-md border border-border px-3"
          required
        />
        <button type="submit" className="min-h-11 self-start rounded-md bg-ink px-4 font-semibold text-canvas">
          Sign in
        </button>
        {message !== null && <p role="status">{message}</p>}
      </form>
    );
  }

  const canEdit = role === "editor" || role === "publisher";
  const canPublish = role === "publisher";

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">Signed in</h2>
        <p>
          Database role: <span className="font-semibold">{role ?? "none"}</span>. A missing membership cannot
          edit or publish.
        </p>
        <button
          type="button"
          onClick={() => void client.auth.signOut()}
          className="min-h-11 self-start rounded-md border border-ink px-4 text-ink"
        >
          Sign out
        </button>
      </div>

      <section className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
        <h3 className="font-semibold text-ink">Synthetic impact simulator</h3>
        <p className="text-sm">
          Runs the same offline evaluator used by citizens. Profiles are fictional. This does not publish
          anything.
        </p>
        <label htmlFor="sample-id" className="font-semibold text-ink">
          Sample household
        </label>
        <select
          id="sample-id"
          value={sampleId}
          onChange={(event) => setSampleId(event.target.value as keyof typeof demoHouseholds)}
          className="min-h-11 rounded-md border border-border px-3"
        >
          {Object.keys(demoHouseholds).map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <ul className="list-disc pl-5 text-sm">
          {sampleOutcomes.map((entry) => (
            <li key={entry.scheme.id}>
              {entry.scheme.title.en}: {OUTCOME_LABELS[entry.detail.assessment.outcome]}
            </li>
          ))}
        </ul>
        <Link to="/samples" className="underline underline-offset-4">
          Open all sample households
        </Link>
      </section>

      {canEdit ? (
        <section className="flex flex-col gap-2">
          <h3 className="font-semibold text-ink">New draft scheme</h3>
          <label htmlFor="draft-id">Scheme id</label>
          <input
            id="draft-id"
            value={schemeId}
            onChange={(event) => setSchemeId(event.target.value)}
            className="min-h-11 rounded-md border border-border px-3"
          />
          <label htmlFor="draft-title">English title</label>
          <input
            id="draft-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="min-h-11 rounded-md border border-border px-3"
          />
          <button
            type="button"
            onClick={() => void createDraft()}
            className="min-h-11 self-start rounded-md border border-ink px-4 text-ink"
          >
            Save draft
          </button>
        </section>
      ) : (
        <p>This account cannot create drafts.</p>
      )}

      {canPublish ? (
        <section className="flex flex-col gap-2">
          <h3 className="font-semibold text-ink">Publish a rule version</h3>
          <p className="text-sm">
            The database refuses this unless a linked source is verified, human-dated, published, and not
            conflicting.
          </p>
          <label htmlFor="version-id">Rule version id</label>
          <input
            id="version-id"
            value={versionId}
            onChange={(event) => setVersionId(event.target.value)}
            className="min-h-11 rounded-md border border-border px-3"
          />
          <label htmlFor="publish-reason">Reason</label>
          <input
            id="publish-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="min-h-11 rounded-md border border-border px-3"
          />
          <button
            type="button"
            onClick={() => void publish()}
            className="min-h-11 self-start rounded-md bg-ink px-4 font-semibold text-canvas"
          >
            Publish
          </button>
        </section>
      ) : (
        <p>This account cannot publish.</p>
      )}
      {message !== null && <p role="status">{message}</p>}
    </section>
  );
}
