import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/Language";

const tools = [
  { to: "/tools/compass", en: "HaqCompass", hi: "हक़कम्पास", blurbEn: "What-if eligibility", blurbHi: "क्या-अगर पात्रता" },
  { to: "/tools/pocket", en: "HaqPocket", hi: "हक़पॉकेट", blurbEn: "Printable public card", blurbHi: "प्रिंट योग्य कार्ड" },
  { to: "/tools/resolve", en: "HaqResolve", hi: "हक़रिज़ॉल्व", blurbEn: "Stuck? Next steps", blurbHi: "अटके? अगला कदम" },
  { to: "/tools/watch", en: "HaqWatch", hi: "हक़वॉच", blurbEn: "Rule-version check", blurbHi: "नियम संस्करण जाँच" },
  { to: "/tools/route", en: "SevaRoute", hi: "सेवारूट", blurbEn: "Visit preparation", blurbHi: "भेंट की तैयारी" },
] as const;

export default function Home() {
  const { lang } = useLanguage();
  const hi = lang === "hi";

  return (
    <div className="atmosphere relative overflow-x-clip">
      <div className="orb orb-a pointer-events-none absolute left-0 top-20 h-48 w-48 max-w-[40vw] bg-[radial-gradient(circle,#cbb97c_0%,transparent_70%)]" />
      <div className="orb orb-b pointer-events-none absolute right-0 top-[32rem] h-52 w-52 max-w-[40vw] bg-[radial-gradient(circle,#173b35_0%,transparent_70%)]" />

      {/* Immersive hero — one composition */}
      <section className="relative mx-auto grid min-h-[88vh] w-full max-w-page grid-cols-1 items-center gap-10 px-4 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-6 lg:pt-6">
        <div className="relative z-10 flex flex-col gap-6">
          <p className="reveal text-sm font-semibold uppercase tracking-[0.22em] text-accent-earth">
            {hi ? "हक़पथ · सेवाकृत" : "HaqPath · by SevaKrit"}
          </p>
          <h1 className="reveal reveal-delay-1 font-display text-[2.6rem] font-semibold leading-[1.08] text-ink md:text-6xl lg:text-[4.1rem]">
            {hi
              ? "किसी योजना का नाम जाने बिना भी आगे का रास्ता मिलना चाहिए।"
              : "You shouldn't need to know a scheme's name to find a way forward."}
          </h1>
          <p className="reveal reveal-delay-2 max-w-xl text-lg text-ink-soft md:text-xl">
            {hi
              ? "मध्य प्रदेश के बैगा, भारिया और सहरिया परिवारों के लिए — संभावित सहायता, स्पष्ट नियम-साक्ष्य, और अगला व्यावहारिक कदम। सरकारी पोर्टल नहीं।"
              : "For Baiga, Bharia and Sahariya households in Madhya Pradesh — possible benefits, explainable rules, and a practical next step. Not a government portal."}
          </p>
          <div className="reveal reveal-delay-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/discover"
              className="btn-primary-glow inline-flex min-h-12 items-center justify-center rounded-full px-7 font-semibold text-canvas"
            >
              {hi ? "संभावित सहायता देखें" : "Find possible benefits"}
            </Link>
            <Link
              to="/workspace"
              className="glass-panel inline-flex min-h-12 items-center justify-center rounded-full px-7 font-semibold text-ink"
            >
              {hi ? "कार्यक्षेत्र खोलें" : "Open workspace"}
            </Link>
            <Link
              to="#story"
              className="inline-flex min-h-12 items-center justify-center px-3 font-semibold text-accent-earth underline-offset-4 hover:underline"
            >
              {hi ? "कहानी देखें" : "See the story"}
            </Link>
          </div>
          <p className="reveal reveal-delay-4 text-sm text-ink-soft">
            {hi
              ? "परिणाम “संभावित” हैं — अंतिम निर्णय विभाग का रहता है।"
              : "Outcomes say “likely” — the department still decides."}
          </p>
        </div>

        {/* CSS 3D illustrative stage — inset so transforms stay in-bounds */}
        <div className="hero-stage relative mx-auto w-full max-w-xl overflow-hidden px-3 pb-10 pt-4 lg:pb-4">
          <div className="absolute inset-10 rounded-[40%] bg-[radial-gradient(circle_at_50%_40%,rgba(203,185,124,0.35),transparent_65%)] blur-2xl" />
          <figure className="float-3d story-frame relative z-20 mx-auto aspect-[4/3] w-[82%]">
            <img
              src="/images/story/hero-village.webp"
              width={768}
              height={512}
              alt={
                hi
                  ? "ग्रामीण परिदृश्य का उदाहरण चित्र"
                  : "Illustrative rural landscape with a winding road and greenery"
              }
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-[50%_54%]"
            />
          </figure>
          <figure className="float-3d-alt story-frame absolute bottom-6 right-4 z-10 hidden w-[52%] aspect-[4/3] sm:block">
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
        </div>
      </section>

      {/* Chapter scroll narrative */}
      <div id="story" className="mx-auto w-full max-w-page px-4 pb-20 lg:px-6">
        <div className="chapter-rail flex flex-col gap-16 pl-6 md:pl-10">
          <Chapter n={hi ? "२" : "2"} title={hi ? "अदृश्य समस्या" : "The unseen problem"}>
            <p>
              {hi
                ? "पात्रता नियम अक्सर अधिकारियों के लिए लिखे जाते हैं। श्रेणी, ज़िला, आवास — हर प्रपत्र पर अलग भाषा। नियम बदलते हैं; दस्तावेज़ कार्यालय-दर-कार्यालय भिन्न हो सकते हैं।"
                : "Eligibility rules are written for officers, not families. Category, district, housing — each form speaks a different language. Rules change; documents differ office to office."}
            </p>
          </Chapter>

          <Chapter n={hi ? "३" : "3"} title={hi ? "एक परिवार की कहानी" : "One household's story"}>
            <p className="mb-4 inline-flex rounded-full bg-sage px-3 py-1 text-sm font-semibold text-ink">
              {hi ? "काल्पनिक उदाहरण" : "Fictional example"}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="mb-2 font-semibold text-ink">{hi ? "परिवार क्या कहता है" : "What they say"}</h3>
                <p>
                  {hi
                    ? "गाँव में बच्चा और दादा-दादी के साथ छोटा खेत। सहायता की खबर है, पर कौन-सी योजना लागू होती है और कौन से कागज़ ले जाएँ — स्पष्ट नहीं।"
                    : "A village household with a child and elders, a small plot, and rumours of help — but not which scheme applies, or which papers to bring."}
                </p>
              </div>
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="mb-2 font-semibold text-ink">{hi ? "क्या जानना ज़रूरी है" : "What matters"}</h3>
                <ul className="list-disc space-y-1 pl-5">
                  <li>{hi ? "राज्य और ज़िला" : "State and district"}</li>
                  <li>{hi ? "जनजातीय समूह" : "Tribal group, as described"}</li>
                  <li>{hi ? "मकान का प्रकार" : "House type"}</li>
                  <li>{hi ? "सरकारी कर्मचारी?" : "Any government employee?"}</li>
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

          <Chapter n={hi ? "४" : "4"} title={hi ? "समझदार प्रश्न" : "Only questions that matter"}>
            <p>
              {hi
                ? "हक़पथ केवल वे प्रश्न पूछता है जो परिणाम बदल सकते हैं — हर प्रश्न के साथ कारण।"
                : "HaqPath asks only questions that can change the outcome — each with a short “why we ask”."}
            </p>
            <Link to="/discover" className="btn-primary-glow mt-4 inline-flex min-h-11 items-center rounded-full px-6 font-semibold text-canvas">
              {hi ? "प्रश्न आज़माएँ" : "Try the questions"}
            </Link>
          </Chapter>

          <Chapter n={hi ? "५" : "5"} title={hi ? "समझ आने वाले परिणाम" : "Explainable results"}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {(hi
                ? ["संभावित योग्यता", "अधिक जानकारी चाहिए", "संभावित असंगति", "स्रोत समीक्षाधीन"]
                : ["Likely eligible", "Needs more information", "Likely not eligible", "Source under review"]
              ).map((label) => (
                <li key={label} className="glass-panel rounded-2xl px-4 py-3 font-semibold text-ink">
                  {label}
                </li>
              ))}
            </ul>
          </Chapter>

          <Chapter n={hi ? "६" : "6"} title={hi ? "तैयारी तक" : "From fit to readiness"}>
            <div className="grid items-center gap-6 md:grid-cols-2">
              <p>
                {hi
                  ? "दस्तावेज़ सूची, क्रमबद्ध कदम, प्रगति और प्रिंट — सब आपके पुष्ट उत्तरों से।"
                  : "Document lists, ordered steps, progress and print — built from your confirmed answers."}
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

          <Chapter n={hi ? "७" : "7"} title={hi ? "साक्ष्य और विश्वास" : "Evidence you can check"}>
            <p>
              {hi
                ? "हर नियम संस्करण, आधिकारिक स्रोत और सत्यापन तिथि के साथ। असत्यापित स्रोत पर आत्मविश्वास नहीं।"
                : "Every rule carries a version, official source and verification date. Unverified sources never look confident."}
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
                    ? "स्वयंसेवक परिवार के साथ बैठकर उसी उपकरण का उपयोग कर सकता है — सहमति पहले।"
                    : "A volunteer can sit with a household and use the same tool — consent first."}
                </p>
                <Link to="/assisted" className="btn-primary-glow mt-4 inline-flex min-h-11 items-center rounded-full px-6 font-semibold text-canvas">
                  {hi ? "सहायता मोड" : "Assisted mode"}
                </Link>
              </div>
            </div>
          </Chapter>

          <Chapter n={hi ? "९" : "9"} title={hi ? "पाँच उपकरण, एक यात्रा" : "Five tools, one journey"}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="glass-panel group rounded-2xl p-4 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(23,59,53,0.14)]"
                >
                  <p className="font-display text-xl font-semibold text-ink">{hi ? tool.hi : tool.en}</p>
                  <p className="text-sm text-ink-soft">{hi ? tool.blurbHi : tool.blurbEn}</p>
                </Link>
              ))}
            </div>
          </Chapter>
        </div>

        <section className="relative mt-20 overflow-hidden rounded-[2rem] border border-white/40 bg-ink px-6 py-14 text-canvas shadow-[0_40px_100px_rgba(23,59,53,0.35)] md:px-12">
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(203,185,124,0.45),transparent_70%)]" />
          <h2 className="font-display text-3xl font-semibold md:text-5xl">
            {hi ? "जो जानते हैं, वहीं से शुरू करें।" : "Start with what you know."}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-canvas/85">
            {hi
              ? "योजना का नाम ज़रूरी नहीं। परिवार को सादे शब्दों में बताएँ।"
              : "You do not need a scheme name. Describe the household in plain words."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/discover"
              className="inline-flex min-h-12 items-center rounded-full bg-canvas px-7 font-semibold text-ink"
            >
              {hi ? "अभी शुरू करें" : "Start now"}
            </Link>
            <Link
              to="/login"
              className="inline-flex min-h-12 items-center rounded-full border border-canvas/40 px-7 font-semibold text-canvas"
            >
              {hi ? "साइन इन / अतिथि" : "Sign in / Guest"}
            </Link>
          </div>
          <p className="mt-6 text-sm text-canvas/70">
            {hi
              ? "स्वतंत्र तैयारी उपकरण — सरकारी वेबसाइट या आवेदन सेवा नहीं।"
              : "Independent readiness tool — not a government website or application service."}
          </p>
          <p className="mt-3">
            <Link to="/privacy" className="text-sm font-semibold text-accent-gold underline underline-offset-4">
              {hi ? "गोपनीयता और सीमाएँ पढ़ें" : "Read our privacy and limits"}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

function Chapter({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="relative flex flex-col gap-4">
      <div className="absolute -left-6 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-semibold text-canvas md:-left-10">
        {n}
      </div>
      <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">{title}</h2>
      <div className="max-w-3xl text-base leading-relaxed text-ink-soft md:text-lg">{children}</div>
    </section>
  );
}
