import { useState } from "react";
import { useAppState } from "../context/AppState";

export default function Privacy() {
  const { resetHousehold, confirmedFacts, unknownFacts } = useAppState();
  const [cleared, setCleared] = useState(false);

  return (
    <article className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-ink">Privacy and data handling</h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">What we store</h2>
        <p>
          Confirmed answers, self-reported steps, and personal follow-up dates are stored in this
          browser only. The typed story is not saved after you leave the page. Nothing is sent to a
          server in this demo.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">What we never collect</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Aadhaar or any other ID numbers</li>
          <li>Document scans or photos</li>
          <li>Bank account numbers</li>
          <li>OTPs</li>
        </ul>
        <p>If a description looks like it contains one of these, it is not read or saved.</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">Where to do ID steps</h2>
        <p>
          Any step that needs an ID number, a document upload or an OTP is done only on the official
          portal or office named in your plan. It is never done inside this app.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">What results mean</h2>
        <p>
          Results are &ldquo;likely&rdquo; guidance to help you prepare. They are not a government
          decision, and only the official office can decide eligibility.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">Deleting your data</h2>
        <p>
          This removes confirmed answers, self-reported steps, and personal reminders from this
          browser. The language choice is kept.
        </p>
        <button
          type="button"
          onClick={() => {
            resetHousehold();
            setCleared(true);
          }}
          className="min-h-11 self-start rounded-md border border-ink px-4 font-semibold text-ink"
        >
          Clear this browser&apos;s household data
        </button>
        {cleared && <p role="status">Household data in this browser was cleared.</p>}
        <button
          type="button"
          onClick={() => {
            const blob = new Blob(
              [JSON.stringify({ confirmedFacts, unknownFacts }, null, 2)],
              { type: "application/json" },
            );
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "haqpath-confirmed-facts.json";
            anchor.click();
            URL.revokeObjectURL(url);
          }}
          className="min-h-11 self-start rounded-md border border-ink px-4 text-ink"
        >
          Download confirmed facts (no story text)
        </button>
      </section>

      <p className="text-sm">
        Interface Hindi, where shown, is a product translation and not a certified government translation.
      </p>
    </article>
  );
}
