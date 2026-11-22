import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppState } from "../context/AppState";
import { useLanguage } from "../i18n/Language";

const STEPS = ["consent", "answers", "finish"] as const;

export default function Assisted() {
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const { profile, setManualFact, resetHousehold } = useAppState();
  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [drafts, setDrafts] = useState({
    tribalGroup: "",
    district: "",
    houseType: "",
    settlementArea: "",
    hasGovernmentEmployee: "",
  });

  const factCount = Object.keys(profile.confirmedFacts).length;
  const current = STEPS[step] ?? "consent";

  function saveField(key: keyof typeof drafts) {
    const message = setManualFact(key, drafts[key]);
    setNotice(message ?? (hi ? "उत्तर सहेजा गया।" : "Answer saved on this device."));
  }

  return (
    <article className="flex flex-col gap-6 text-lg leading-relaxed">
      <h1 className="font-display text-3xl font-semibold text-ink">
        {hi ? "सहायता मोड" : "Assisted mode"}
      </h1>
      <p className="rounded-md bg-surface-muted px-4 py-3 text-base">
        {hi
          ? "आप किसी और की मदद कर रहे हैं। यह सरकारी लॉगिन नहीं है। पहचान संख्या न लिखें।"
          : "You are helping someone else. This is not a government login. Do not type identity numbers."}
      </p>
      <p className="text-sm text-ink-soft">
        {hi ? `चरण ${step + 1} / ${STEPS.length}` : `Step ${step + 1} of ${STEPS.length}`}
      </p>

      {current === "consent" && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-ink">
            {hi ? "सहमति" : "Consent"}
          </h2>
          <p>
            {hi
              ? "आगे बढ़ने से पहले व्यक्ति से पूछें कि क्या उनके उत्तर इस डिवाइस पर लिखे जा सकते हैं।"
              : "Ask the person whether their answers may be typed on this device before you continue."}
          </p>
          {factCount > 0 && (
            <p>
              {hi
                ? `इस ब्राउज़र में पहले से ${factCount} उत्तर हैं। नया परिवार शुरू करने से पहले उन्हें मिटाएँ।`
                : `This browser already has ${factCount} saved answers. Clear them before a new household.`}
            </p>
          )}
          <label className="flex min-h-11 items-start gap-3">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1 h-5 w-5"
            />
            <span>
              {hi
                ? "जिस व्यक्ति की मैं मदद कर रहा हूँ, उसने इस डिवाइस पर उत्तर दर्ज करने की सहमति दी है।"
                : "The person I am helping agrees that I may enter their answers on this device."}
            </span>
          </label>
          <button
            type="button"
            disabled={!consent}
            onClick={() => setStep(1)}
            className="min-h-12 self-start rounded-md bg-ink px-4 font-semibold text-canvas disabled:opacity-50"
          >
            {hi ? "उत्तरों पर जाएँ" : "Continue to answers"}
          </button>
        </section>
      )}

      {current === "answers" && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-ink">{hi ? "उत्तर" : "Answers"}</h2>
          <p className="text-base">
            {hi
              ? "हर उत्तर अलग से सहेजें। “I don't know” अज्ञात रहता है।"
              : "Save each answer on its own. “I don't know” stays unknown."}
          </p>
          {(
            [
              ["tribalGroup", hi ? "जनजातीय समूह" : "Tribal group", "Baiga"],
              ["district", hi ? "ज़िला" : "District", "Dindori"],
              ["houseType", hi ? "मकान (kutcha / pucca)" : "House (kutcha or pucca)", "kutcha"],
              ["settlementArea", hi ? "क्षेत्र (rural / urban)" : "Area (rural or urban)", "rural"],
              ["hasGovernmentEmployee", hi ? "सरकारी कर्मचारी (Yes / No)" : "Government employee (Yes or No)", "No"],
            ] as const
          ).map(([key, label, example]) => (
            <div key={key} className="flex flex-col gap-2">
              <label htmlFor={`assist-${key}`} className="font-semibold text-ink">
                {label}
              </label>
              <input
                id={`assist-${key}`}
                value={drafts[key]}
                placeholder={example}
                onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))}
                className="min-h-12 rounded-md border border-border px-3"
              />
              <button
                type="button"
                onClick={() => saveField(key)}
                className="min-h-12 self-start rounded-md border border-ink px-4 font-semibold text-ink"
              >
                {hi ? "यह उत्तर सहेजें" : "Save this answer"}
              </button>
            </div>
          ))}
          {notice !== null && <p role="status">{notice}</p>}
          <button
            type="button"
            onClick={() => setStep(2)}
            className="min-h-12 self-start rounded-md bg-ink px-4 font-semibold text-canvas"
          >
            {hi ? "समाप्त करें" : "Finish"}
          </button>
        </section>
      )}

      {current === "finish" && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-ink">{hi ? "अगला कदम" : "Next"}</h2>
          <p>
            {hi
              ? "परिणाम नियम जाँच हैं, सरकारी स्वीकृति नहीं।"
              : "Results are rule checks, not a government approval."}
          </p>
          <p>
            <Link to="/results" className="underline underline-offset-4">
              {hi ? "परिणाम देखें" : "See results"}
            </Link>
            {" · "}
            <Link to="/plan/print" className="underline underline-offset-4">
              {hi ? "प्रिंट शीट" : "Printable sheet"}
            </Link>
          </p>
          <button
            type="button"
            onClick={() => {
              resetHousehold();
              setConsent(false);
              setStep(0);
              setNotice(hi ? "इस परिवार के उत्तर मिटा दिए गए।" : "This household's answers were cleared.");
            }}
            className="min-h-12 self-start rounded-md border border-ink px-4 font-semibold text-ink"
          >
            {hi ? "अगले व्यक्ति से पहले मिटाएँ" : "Clear before the next person"}
          </button>
          {notice !== null && <p role="status">{notice}</p>}
        </section>
      )}
    </article>
  );
}
