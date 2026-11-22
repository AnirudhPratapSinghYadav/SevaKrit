import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/Language";
import { usePointerTilt } from "../hooks/usePointerTilt";
import { useScrollReveal } from "../hooks/useScrollReveal";

const tools = [
  { to: "/tools/compass", en: "HaqCompass", hi: "हक़कम्पास", blurbEn: "What-if fit", blurbHi: "क्या-अगर पात्रता" },
  { to: "/tools/pocket", en: "HaqPocket", hi: "हक़पॉकेट", blurbEn: "Printable card", blurbHi: "प्रिंट कार्ड" },
  { to: "/tools/resolve", en: "HaqResolve", hi: "हक़रिज़ॉल्व", blurbEn: "Unstick next step", blurbHi: "अटकाव तोड़ें" },
  { to: "/tools/watch", en: "HaqWatch", hi: "हक़वॉच", blurbEn: "Rule versions", blurbHi: "नियम संस्करण" },
  { to: "/tools/route", en: "SevaRoute", hi: "सेवारूट", blurbEn: "Visit prep", blurbHi: "भेंट तैयारी" },
] as const;

const outcomes = [
  { en: "Likely eligible", hi: "संभावित योग्यता", tone: "success" as const },
  { en: "Needs more information", hi: "अधिक जानकारी चाहिए", tone: "warn" as const },
  { en: "Likely not eligible", hi: "संभावित असंगति", tone: "muted" as const },
  { en: "Source under review", hi: "स्रोत समीक्षाधीन", tone: "info" as const },
] as const;

export default function Home() {
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const tilt = usePointerTilt(9);
  useScrollReveal();

  return (
    <div className="relative overflow-x-clip">
      {/* A) Full-viewport cinematic hero */}
      <section className="relative left-1/2 right-1/2 flex min-h-[100svh] w-screen -translate-x-1/2 items-end overflow-hidden">
        <img
          src="/images/story/hero-village.webp"
          width={1600}
          height={900}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[50%_42%] parallax-hero"
        />
        <div className="hero-scrim absolute inset-0" aria-hidden="true" />
        <div className="orb orb-a pointer-events-none absolute left-[8%] top-[18%] h-56 w-56 bg-[radial-gradient(circle,#d4b45a_0%,transparent_70%)]" />
        <div className="orb orb-b pointer-events-none absolute bottom-[12%] right-[10%] h-64 w-64 bg-[radial-gradient(circle,#a84a1f_0%,transparent_70%)]" />

        <div className="relative z-10 mx-auto grid w-full max-w-page grid-cols-1 items-end gap-10 px-4 pb-16 pt-28 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-20">
          <div className="hero-copy flex flex-col gap-6">
            <p className="reveal hero-eyebrow text-sm font-semibold uppercase tracking-[0.28em]">
              {hi ? "हक़पथ · सेवाकृत" : "HaqPath · SevaKrit"}
            </p>
            <h1 className="reveal reveal-delay-1 hero-title font-display text-[2.75rem] font-semibold leading-[1.05] md:text-6xl lg:text-[4.25rem]">
              {hi
                ? "किसी योजना का नाम जाने बिना भी आगे का रास्ता मिलना चाहिए।"
                : "You shouldn't need to know a scheme's name to find a way forward."}
            </h1>
            <p className="reveal reveal-delay-2 hero-lede max-w-xl text-lg md:text-xl">
              {hi
                ? "मध्य प्रदेश के बैगा, भारिया, सहरिया परिवारों के लिए: संभावित सहायता, नियम-साक्ष्य, अगला ठोस कदम।"
                : "For Baiga, Bharia and Sahariya households in Madhya Pradesh: possible benefits, rule evidence, a concrete next step."}
            </p>
            <div className="reveal reveal-delay-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/discover"
                className="btn-gold magnetic-cta inline-flex min-h-12 items-center justify-center rounded-full px-8 font-semibold"
              >
                {hi ? "संभावित सहायता देखें" : "Find possible benefits"}
              </Link>
              <Link
                to="/workspace"
                className="hero-cta-secondary inline-flex min-h-12 items-center justify-center rounded-full px-8 font-semibold"
              >
                {hi ? "कार्यक्षेत्र" : "Open workspace"}
              </Link>
              <Link
                to="#story"
                className="hero-cta-link inline-flex min-h-12 items-center justify-center px-3 font-semibold underline-offset-4 hover:underline"
              >
                {hi ? "कैसे काम करता है" : "How it works"}
              </Link>
            </div>
            <p className="reveal reveal-delay-4 hero-note text-sm">
              {hi ? "परिणाम “संभावित” हैं। अंतिम निर्णय विभाग का।" : "Outcomes say likely. Departments decide."}
            </p>
          </div>

          <div
            ref={tilt.ref}
            onPointerMove={tilt.onPointerMove}
            onPointerLeave={tilt.onPointerLeave}
            className="hero-stage tilt-stage relative hidden min-h-[20rem] lg:block"
          >
            <figure className="float-3d story-frame tilt-layer absolute right-0 top-0 aspect-[4/3] w-[78%]">
              <img
                src="/images/story/household-story.webp"
                width={640}
                height={480}
                alt={hi ? "परिवार की बातचीत का चित्रण" : "Illustration of a family talking outside a rural home"}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-[50%_45%]"
              />
            </figure>
            <div className="glass-panel float-chip absolute bottom-8 left-0 z-30 max-w-[12rem] rounded-2xl px-3 py-2 text-xs font-semibold text-ink">
              {hi ? "नियम + स्रोत दिखते हैं" : "Rules and sources shown"}
            </div>
            <div className="glass-panel float-chip-alt absolute right-4 top-8 z-30 max-w-[10rem] rounded-2xl px-3 py-2 text-xs font-semibold text-ink">
              {hi ? "आधार / OTP नहीं" : "No Aadhaar / OTP"}
            </div>
          </div>
        </div>
      </section>

      <div id="story" className="mx-auto w-full max-w-page px-4 pb-24 lg:px-6">
        <div className="chapter-rail flex flex-col gap-20 pl-6 md:pl-10">
          <Chapter n={hi ? "२" : "2"} title={hi ? "अदृश्य समस्या" : "Rules hide from families"}>
            <p>
              {hi
                ? "पात्रता भाषा अधिकारियों के लिए लिखी जाती है। श्रेणी, ज़िला, आवास: हर प्रपत्र अलग। नियम बदलते हैं; कागज़ कार्यालय-दर-कार्यालय भिन्न।"
                : "Eligibility language is written for officers. Category, district, housing: each form differs. Rules move. Papers change office to office."}
            </p>
          </Chapter>

          <Chapter n={hi ? "३" : "3"} title={hi ? "एक परिवार" : "One household"}>
            <p className="mb-4 inline-flex rounded-full bg-sage px-3 py-1 text-sm font-semibold text-ink">
              {hi ? "काल्पनिक उदाहरण" : "Fictional example"}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="mb-2 font-semibold text-ink">{hi ? "वे क्या कहते हैं" : "What they say"}</h3>
                <p>
                  {hi
                    ? "गाँव में बच्चा और दादा-दादी, छोटा खेत। सहायता की खबर है. कौन सी योजना, कौन से कागज़, स्पष्ट नहीं।"
                    : "Village household, child and elders, small plot. Rumours of help: not which scheme, not which papers."}
                </p>
              </div>
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="mb-2 font-semibold text-ink">{hi ? "क्या मायने रखता है" : "What matters"}</h3>
                <ul className="list-disc space-y-1 pl-5">
                  <li>{hi ? "राज्य और ज़िला" : "State and district"}</li>
                  <li>{hi ? "जनजातीय समूह" : "Tribal group"}</li>
                  <li>{hi ? "मकान का प्रकार" : "House type"}</li>
                  <li>{hi ? "सरकारी कर्मचारी?" : "Government employee?"}</li>
                </ul>
              </div>
            </div>
            <figure className="story-frame mt-6 aspect-[21/9] w-full">
              <img
                src="/images/story/visual-storyboard.webp"
                width={1200}
                height={514}
                loading="lazy"
                decoding="async"
                alt={hi ? "कहानी का दृश्य बोर्ड" : "Illustrative storyboard for the household journey"}
                className="h-full w-full object-cover"
              />
            </figure>
          </Chapter>

          <Chapter n={hi ? "४" : "4"} title={hi ? "केवल निर्णायक प्रश्न" : "Only questions that change outcomes"}>
            <p>
              {hi
                ? "हक़पथ वही प्रश्न पूछता है जो परिणाम बदल सकते हैं. हर प्रश्न के साथ कारण।"
                : "HaqPath asks only questions that can change the result. Each with a short why."}
            </p>
            <Link to="/discover" className="btn-primary-glow magnetic-cta mt-4 inline-flex min-h-11 items-center rounded-full px-6 font-semibold text-canvas">
              {hi ? "प्रश्न आज़माएँ" : "Try the questions"}
            </Link>
          </Chapter>

          {/* B) Outcome constellation */}
          <Chapter n={hi ? "५" : "5"} title={hi ? "परिणाम नक्षत्र" : "Outcome constellation"}>
            <div className="constellation">
              {outcomes.map((item, index) => (
                <button
                  key={item.en}
                  type="button"
                  className={`constellation-node tone-${item.tone}`}
                  style={{ "--i": index } as CSSProperties}
                >
                  {hi ? item.hi : item.en}
                </button>
              ))}
              <div className="constellation-core glass-panel" aria-hidden>
                <span>{hi ? "साक्ष्य" : "Evidence"}</span>
              </div>
            </div>
          </Chapter>

          <Chapter n={hi ? "६" : "6"} title={hi ? "पात्रता से तैयारी" : "Fit to readiness"}>
            <div className="grid items-center gap-6 md:grid-cols-2">
              <p>
                {hi
                  ? "दस्तावेज़ सूची, क्रमबद्ध कदम, प्रगति, प्रिंट: आपके पुष्ट उत्तरों से।"
                  : "Document lists, ordered steps, progress, print: from your confirmed answers."}
              </p>
              <figure className="story-frame aspect-[3/2]">
                <img
                  src="/images/story/action-checklist.webp"
                  width={768}
                  height={512}
                  loading="lazy"
                  decoding="async"
                  alt={hi ? "तैयारी सूची का चित्रण" : "Illustration of a preparation checklist"}
                  className="h-full w-full object-cover"
                />
              </figure>
            </div>
            <Link to="/plan" className="mt-4 inline-flex min-h-11 items-center font-semibold text-accent-earth underline underline-offset-4">
              {hi ? "मेरी योजना" : "Open my plan"}
            </Link>
          </Chapter>

          <Chapter n={hi ? "७" : "7"} title={hi ? "जाँच योग्य साक्ष्य" : "Evidence you can check"}>
            <p>
              {hi
                ? "हर नियम: संस्करण, आधिकारिक स्रोत, सत्यापन तिथि। असत्यापित स्रोत पर आत्मविश्वास नहीं।"
                : "Every rule: version, official source, verification date. Unverified sources never look confident."}
            </p>
          </Chapter>

          <Chapter n={hi ? "८" : "8"} title={hi ? "सहायता से पहुँच" : "Assisted access"}>
            <div className="grid items-center gap-6 md:grid-cols-2">
              <figure className="story-frame aspect-[3/2] order-2 md:order-1">
                <img
                  src="/images/story/assisted-service.webp"
                  width={768}
                  height={512}
                  loading="lazy"
                  decoding="async"
                  alt={hi ? "सहायता मोड का चित्रण" : "Illustration of assisted help with paperwork"}
                  className="h-full w-full object-cover"
                />
              </figure>
              <div className="order-1 md:order-2">
                <p>
                  {hi
                    ? "स्वयंसेवक परिवार के साथ बैठकर उसी उपकरण का उपयोग कर सकता है। सहमति पहले।"
                    : "A volunteer can sit with the household and use the same tool. Consent first."}
                </p>
                <Link to="/assisted" className="btn-primary-glow mt-4 inline-flex min-h-11 items-center rounded-full px-6 font-semibold text-canvas">
                  {hi ? "सहायता मोड" : "Assisted mode"}
                </Link>
              </div>
            </div>
          </Chapter>

          {/* C) Glass tool command dock */}
          <Chapter n={hi ? "९" : "9"} title={hi ? "पाँच उपकरण" : "Five tools, one journey"}>
            <img
              src="/images/ui/tools-pictograms.jpg"
              width={1280}
              height={720}
              alt=""
              aria-hidden="true"
              className="mb-4 h-28 w-full rounded-2xl object-cover object-center"
              loading="lazy"
            />
            <nav className="tool-dock" aria-label={hi ? "हक़पथ उपकरण" : "HaqPath tools"}>
              {tools.map((tool, index) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="tool-dock-item"
                  style={{ "--i": index } as CSSProperties}
                >
                  <span className="font-display text-lg font-semibold text-ink">{hi ? tool.hi : tool.en}</span>
                  <span className="text-sm text-ink-soft">{hi ? tool.blurbHi : tool.blurbEn}</span>
                </Link>
              ))}
            </nav>
          </Chapter>
        </div>

        <section className="relative mt-24 overflow-hidden rounded-[2rem] border border-white/40 bg-ink px-6 py-14 text-canvas shadow-[0_40px_100px_rgba(23,59,53,0.35)] md:px-12" data-reveal>
          <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(203,185,124,0.45),transparent_70%)]" />
          <h2 className="font-display text-3xl font-semibold md:text-5xl">
            {hi ? "जो जानते हैं, वहीं से शुरू करें।" : "Start with what you know."}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-canvas/85">
            {hi ? "योजना का नाम ज़रूरी नहीं। परिवार को सादे शब्दों में बताएँ।" : "No scheme name required. Describe the household in plain words."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/discover" className="magnetic-cta inline-flex min-h-12 items-center rounded-full bg-canvas px-7 font-semibold text-ink">
              {hi ? "अभी शुरू करें" : "Start now"}
            </Link>
            <Link to="/login" className="inline-flex min-h-12 items-center rounded-full border border-canvas/40 px-7 font-semibold text-canvas">
              {hi ? "साइन इन / अतिथि" : "Sign in / Guest"}
            </Link>
          </div>
          <p className="mt-3">
            <Link to="/privacy" className="text-sm font-semibold text-accent-gold underline underline-offset-4">
              {hi ? "गोपनीयता" : "Privacy"}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

function Chapter({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="relative flex flex-col gap-4" data-reveal>
      <div className="absolute -left-6 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-semibold text-canvas md:-left-10">
        {n}
      </div>
      <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">{title}</h2>
      <div className="max-w-3xl text-base leading-relaxed text-ink-soft md:text-lg">{children}</div>
    </section>
  );
}
