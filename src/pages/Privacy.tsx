export default function Privacy() {
  return (
    <article className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-ink">Privacy and data handling</h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">What we store</h2>
        <p>
          Your answers and your progress are stored only in this browser in demo mode. Nothing is sent
          to a server.
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
          A &ldquo;Clear this browser&rsquo;s data&rdquo; option will arrive in a later phase. It is not
          available in this demo yet, so you can clear the data yourself through your browser&rsquo;s
          site settings.
        </p>
      </section>
    </article>
  );
}

