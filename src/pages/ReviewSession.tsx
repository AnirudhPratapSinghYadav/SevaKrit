import { useEffect, useState, type FormEvent } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

type Role = string | null;

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
          Uses the configured Supabase project. There is no local password stored in this app.
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
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-ink">Signed in</h2>
      <p>
        Account role from the database: {role ?? "none"}. A missing role cannot edit or publish.
      </p>
      <button
        type="button"
        onClick={() => void client.auth.signOut()}
        className="min-h-11 self-start rounded-md border border-ink px-4 text-ink"
      >
        Sign out
      </button>
      {canEdit ? (
        <section className="flex flex-col gap-2">
          <h3 className="font-semibold text-ink">New draft scheme</h3>
          <label htmlFor="draft-id">Scheme id</label>
          <input id="draft-id" value={schemeId} onChange={(event) => setSchemeId(event.target.value)} className="min-h-11 rounded-md border border-border px-3" />
          <label htmlFor="draft-title">English title</label>
          <input id="draft-title" value={title} onChange={(event) => setTitle(event.target.value)} className="min-h-11 rounded-md border border-border px-3" />
          <button type="button" onClick={() => void createDraft()} className="min-h-11 self-start rounded-md border border-ink px-4 text-ink">
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
            The database refuses this unless a linked source is verified, human-dated, published, and not conflicting.
          </p>
          <label htmlFor="version-id">Rule version id</label>
          <input id="version-id" value={versionId} onChange={(event) => setVersionId(event.target.value)} className="min-h-11 rounded-md border border-border px-3" />
          <label htmlFor="publish-reason">Reason</label>
          <input id="publish-reason" value={reason} onChange={(event) => setReason(event.target.value)} className="min-h-11 rounded-md border border-border px-3" />
          <button type="button" onClick={() => void publish()} className="min-h-11 self-start rounded-md bg-ink px-4 font-semibold text-canvas">
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
