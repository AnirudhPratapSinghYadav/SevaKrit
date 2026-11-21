import { getAllDraftSchemes, getPublishedSchemes, getSources } from "../services/schemeRepository";

// Read-only reviewer panel. It shows catalogue state and performs no writes.
export default function Review() {
  const schemes = [...getPublishedSchemes(), ...getAllDraftSchemes()];
  const sources = getSources();

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-ink">Reviewer panel</h1>
      <p>
        Editing is disabled in this demo. Publishing a new rule version needs a verified reviewer role on
        the server, which is not configured.
      </p>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">Schemes</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-sage">
                <th scope="col" className="py-2 pr-3 font-semibold text-ink">Id</th>
                <th scope="col" className="py-2 pr-3 font-semibold text-ink">Status</th>
                <th scope="col" className="py-2 pr-3 font-semibold text-ink">Last verified</th>
                <th scope="col" className="py-2 pr-3 font-semibold text-ink">Source ids</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((scheme) => (
                <tr key={scheme.id} className="border-b border-sage align-top">
                  <td className="py-2 pr-3">{scheme.id}</td>
                  <td className="py-2 pr-3">{scheme.status}</td>
                  <td className="py-2 pr-3">{scheme.lastVerified ?? "not verified"}</td>
                  <td className="py-2 pr-3">{scheme.sourceIds.join(", ") || "none"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">Sources</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-sage">
                <th scope="col" className="py-2 pr-3 font-semibold text-ink">Id</th>
                <th scope="col" className="py-2 pr-3 font-semibold text-ink">Status</th>
                <th scope="col" className="py-2 pr-3 font-semibold text-ink">Checked at</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.id} className="border-b border-sage align-top">
                  <td className="py-2 pr-3">{source.id}</td>
                  <td className="py-2 pr-3">{source.status}</td>
                  <td className="py-2 pr-3">{source.checkedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
