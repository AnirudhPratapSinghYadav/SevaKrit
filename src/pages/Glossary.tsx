import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/Language";

export default function Glossary() {
  const { t, lang } = useLanguage();
  const hi = lang === "hi";
  return (
    <article className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold text-ink">{t("glossaryTitle")}</h1>
      <dl className="flex flex-col gap-4">
        <div>
          <dt className="font-semibold text-success-ink">{t("likelyFit")}</dt>
          <dd>
            {hi
              ? "पुष्ट उत्तर प्रकाशित, स्रोत-समीक्षित नियमों से मेल खाते हैं। विभाग अभी भी निर्णय लेता है।"
              : "Confirmed answers match published, source-reviewed rules. The department still decides."}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-warning-ink">{t("needsInformation")}</dt>
          <dd>
            {hi
              ? "किसी नियम की जाँच अधूरी है क्योंकि उत्तर नहीं है या आपने “मुझे नहीं पता” चुना।"
              : "A rule cannot be checked because an answer is missing or you chose “I don’t know”."}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-mismatch-ink">{t("likelyMismatch")}</dt>
          <dd>
            {hi
              ? "पुष्ट उत्तर एक समीक्षित नियम से टकराता है। यह सरकारी अस्वीकृति नहीं है।"
              : "A confirmed answer conflicts with a reviewed rule. This is not a government rejection."}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-info-ink">{t("sourceUnderReview")}</dt>
          <dd>
            {hi
              ? "स्रोत गायब, पुराना या विरोधाभासी है, इसलिए हक़पथ आत्मविश्वास से योग्यता या असंगति नहीं बताता।"
              : "The source is missing, stale, or conflicting, so HaqPath will not give a confident fit or mismatch."}
          </dd>
        </div>
      </dl>
      <p>
        <Link to="/help" className="underline underline-offset-4">
          {hi ? "सहायता पर वापस" : "Back to help"}
        </Link>
      </p>
    </article>
  );
}
