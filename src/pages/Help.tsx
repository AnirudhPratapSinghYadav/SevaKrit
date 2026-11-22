import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/Language";

const OUTCOMES = [
  {
    tone: "Likely fit",
    toneHi: "संभावित योग्यता",
    blurb: "Confirmed answers meet source-reviewed rules. Department still decides.",
    blurbHi: "पुष्ट उत्तर स्रोत-समीक्षित नियमों से मेल खाते हैं। निर्णय विभाग का।",
  },
  {
    tone: "Needs information",
    toneHi: "जानकारी चाहिए",
    blurb: "A rule cannot finish until you answer, or you chose “I don’t know”.",
    blurbHi: "जब तक उत्तर न दें या “मुझे नहीं पता” रहे, नियम अधूरा रहता है।",
  },
  {
    tone: "Likely mismatch",
    toneHi: "संभावित असंगति",
    blurb: "A confirmed answer conflicts with a reviewed rule.",
    blurbHi: "पुष्ट उत्तर समीक्षित नियम से टकराता है।",
  },
  {
    tone: "Source under review",
    toneHi: "स्रोत समीक्षाधीन",
    blurb: "Missing, stale, or conflicting source — no confident fit shown.",
    blurbHi: "स्रोत अधूरा/पुराना/विरोधी — आत्मविश्वास वाला परिणाम नहीं।",
  },
] as const;

const TOOLS = [
  { to: "/tools/compass", en: "HaqCompass", hi: "हक़कम्पास", blurb: "What-if fit", blurbHi: "क्या-अगर पात्रता" },
  { to: "/tools/route", en: "SevaRoute", hi: "सेवारूट", blurb: "Visit order", blurbHi: "भेंट क्रम" },
  { to: "/tools/watch", en: "HaqWatch", hi: "हक़वॉच", blurb: "Rule versions", blurbHi: "नियम संस्करण" },
  { to: "/tools/pocket", en: "HaqPocket", hi: "हक़पॉकेट", blurb: "Printable card", blurbHi: "प्रिंट कार्ड" },
  { to: "/tools/resolve", en: "HaqResolve", hi: "हक़रिज़ॉल्व", blurb: "Unstick a step", blurbHi: "अटकाव तोड़ें" },
] as const;

export default function Help() {
  const { lang } = useLanguage();
  const hi = lang === "hi";

  return (
    <article className="mx-auto flex w-full max-w-page flex-col gap-10 px-1 pb-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">{hi ? "सहायता" : "Help"}</h1>
        <p className="max-w-2xl text-lg text-ink-soft">
          {hi
            ? "पुष्ट उत्तर ↔ प्रकाशित नियम। आवेदन आप स्वयं आधिकारिक चैनल पर करें।"
            : "Confirmed answers ↔ published rules. You apply on the official channel."}
        </p>
      </header>

      <figure className="overflow-hidden rounded-[1.5rem] border border-border/70 shadow-[var(--shadow-soft)]">
        <img
          src="/images/ui/outcome-pictograms.jpg"
          width={1280}
          height={720}
          alt=""
          className="h-auto w-full object-cover"
        />
      </figure>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold text-ink">
          {hi ? "परिणाम का अर्थ" : "What each result means"}
        </h2>
        <div className="icon-step-grid">
          {OUTCOMES.map((item) => (
            <div key={item.tone} className="icon-step">
              <p className="font-display text-lg font-semibold text-ink">{hi ? item.toneHi : item.tone}</p>
              <p className="text-sm text-ink-soft">{hi ? item.blurbHi : item.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold text-ink">{hi ? "पाँच उपकरण" : "Five tools"}</h2>
        <figure className="overflow-hidden rounded-[1.35rem] border border-border/60">
          <img
            src="/images/ui/haq-tools-strip.jpg"
            width={1280}
            height={720}
            alt=""
            className="h-auto w-full object-cover"
          />
        </figure>
        <nav className="icon-step-grid" aria-label={hi ? "उपकरण" : "Tools"}>
          {TOOLS.map((tool) => (
            <Link key={tool.to} to={tool.to} className="icon-step pressable">
              <span className="font-display text-lg font-semibold text-ink">{hi ? tool.hi : tool.en}</span>
              <span className="text-sm text-ink-soft">{hi ? tool.blurbHi : tool.blurb}</span>
            </Link>
          ))}
        </nav>
      </section>

      <p className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
        <Link to="/how-it-works" className="text-accent-earth underline underline-offset-4">
          {hi ? "यह कैसे काम करता है" : "How it works"}
        </Link>
        <Link to="/glossary" className="text-accent-earth underline underline-offset-4">
          {hi ? "स्थिति शब्द" : "Status meanings"}
        </Link>
        <Link to="/privacy" className="text-accent-earth underline underline-offset-4">
          {hi ? "गोपनीयता" : "Privacy"}
        </Link>
      </p>
    </article>
  );
}
