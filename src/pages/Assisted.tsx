import { Link } from "react-router-dom";
import { useAppState } from "../context/AppState";

export default function Assisted() {
  const { resetHousehold, profile } = useAppState();
  const factCount = Object.keys(profile.confirmedFacts).length;

  return (
    <article className="flex flex-col gap-6 text-xl leading-relaxed">
      <h1 className="text-3xl font-semibold text-ink">Assisted mode</h1>
      <p className="rounded-md bg-surface-muted px-4 py-3 text-base">
        I am helping someone else. This is not an official service centre and not a government officer’s
        login. Ask before you type, and clear this browser before the next household.
      </p>
      <p>Confirmed answers currently in this browser: {factCount}.</p>
      <p>
        <Link
          to="/discover"
          className="inline-flex min-h-12 items-center rounded-md bg-ink px-4 font-semibold text-canvas"
        >
          Start this household
        </Link>
      </p>
      <button
        type="button"
        onClick={resetHousehold}
        className="min-h-12 self-start rounded-md border border-ink px-4 font-semibold text-ink"
      >
        Clear this household before the next person
      </button>
      <p className="text-base">
        <Link to="/plan/print" className="underline underline-offset-4">
          Open a printable action sheet
        </Link>
      </p>
    </article>
  );
}
