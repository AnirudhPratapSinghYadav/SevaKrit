import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/Language";
import { getPublishedSchemes } from "../services/schemeRepository";

const STEPS = [
  {
    img: "/images/ui/step-describe.svg",
    en: "Describe the household",
    hi: "परिवार बताएँ",
    blurbEn: "Facts stay unconfirmed until you press Confirm.",
    blurbHi: "पुष्टि बटन तक तथ्य अनिश्चित रहते हैं।",
  },
  {
    img: "/images/ui/step-check.svg",
    en: "Answer only what changes outcomes",
    hi: "केवल निर्णायक प्रश्न",
    blurbEn: "“I don’t know” stays unknown — never guessed.",
    blurbHi: "“मुझे नहीं पता” अज्ञात रहता है — अनुमान नहीं।",
  },
  {
    img: "/images/ui/step-prepare.svg",
    en: "See fit, then prepare",
    hi: "पात्रता देखें, फिर तैयारी",
    blurbEn: "Plans appear only for likely fits.",
    blurbHi: "योजना केवल संभावित-योग्य पर।",
  },
  {
    img: "/images/ui/step-office.svg",
    en: "Apply on the official channel",
    hi: "आधिकारिक चैनल पर आवेदन",
    blurbEn: "HaqPath prepares you; departments decide.",
    blurbHi: "हक़पथ तैयारी करता है; निर्णय विभाग का।",
  },
] as const;

export default function HowItWorks() {
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const published = getPublishedSchemes();

  return (
    <article className="mx-auto flex w-full max-w-page flex-col gap-10 px-1 pb-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">
          {hi ? "यह कैसे काम करता है" : "How it works"}
        </h1>
        <p className="max-w-xl text-lg text-ink-soft">
          {hi ? "चार कदम। कम पाठ। साफ़ अगला कदम।" : "Four steps. Less prose. Clear next move."}
        </p>
      </header>

      <div className="icon-step-grid">
        {STEPS.map((step, index) => (
          <div key={step.en} className="icon-step">
            <img src={step.img} width={80} height={80} alt="" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">
              {hi ? String(index + 1) : String(index + 1)}
            </p>
            <h2 className="font-display text-xl font-semibold text-ink">{hi ? step.hi : step.en}</h2>
            <p className="text-sm text-ink-soft">{hi ? step.blurbHi : step.blurbEn}</p>
          </div>
        ))}
      </div>

      <section className="glass-panel flex flex-col gap-3 rounded-[1.5rem] p-5 md:p-6">
        <h2 className="font-display text-2xl font-semibold text-ink">
          {hi ? "रिकॉर्ड की गई समीक्षा तिथियाँ" : "Recorded review dates"}
        </h2>
        {published.length === 0 ? (
          <p>{hi ? "कोई योजना प्रकाशित नहीं।" : "No scheme is published."}</p>
        ) : (
          <ul className="grid gap-2 md:grid-cols-2">
            {published.map((scheme) => (
              <li key={scheme.id} className="rounded-xl border border-border/70 bg-surface/80 px-3 py-2 text-sm">
                <span className="font-semibold text-ink">{scheme.title.en}</span>
                <span className="block text-ink-soft">
                  {hi ? "अंतिम मानव सत्यापन" : "Last human verification"}:{" "}
                  {scheme.lastVerified ?? (hi ? "दर्ज नहीं" : "not recorded")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link
        to="/discover"
        className="btn-gold magnetic-cta inline-flex min-h-12 w-fit items-center rounded-full px-8 font-semibold"
      >
        {hi ? "परिवार का विवरण लिखें" : "Describe a household"}
      </Link>
    </article>
  );
}
