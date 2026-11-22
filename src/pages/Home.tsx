import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/Language";

const primaryLink =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 py-3 text-center font-semibold text-canvas hover:opacity-90";
const secondaryLink =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-3 text-center font-semibold text-ink hover:bg-surface-muted";
const textLink = "inline-flex min-h-11 items-center text-terracotta-text underline underline-offset-4";
const chapterHeading = "text-2xl font-semibold leading-tight text-ink";
const chapterMarker = "text-sm font-semibold uppercase tracking-wide text-accent-earth";
const chapterBody = "flex flex-col gap-4 text-ink-soft";
const storyFigure = "flex flex-col gap-2";
const storyImage = "aspect-[3/2] w-full rounded-md object-cover";
const storyCaption = "text-sm text-ink-soft";

export default function Home() {
  const { lang } = useLanguage();
  const hi = lang === "hi";
  return (
    <div className="flex flex-col gap-16">
      <section id="hook" className="flex flex-col gap-6 pt-4">
        <p className={chapterMarker}>{hi ? "अध्याय 1" : "Chapter 1"}</p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
          {hi
            ? "किसी योजना का नाम जाने बिना भी आगे का रास्ता मिलना चाहिए।"
            : "You shouldn't need to know a scheme's name to find a way forward."}
        </h1>
        <p className="text-lg text-ink-soft">
          {hi
            ? "हक़पथ मध्य प्रदेश के बैगा, भारिया और सहरिया परिवारों को संभावित सरकारी सहायता, उसके नियम और अगला कदम समझने में मदद करता है। यह सरकारी पोर्टल नहीं है।"
            : "HaqPath helps Baiga, Bharia and Sahariya households in Madhya Pradesh understand possible government benefits, see why they may qualify, and know what to do next."}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/login" className={primaryLink}>
            {hi ? "प्रवेश / साइन इन" : "Enter / Sign in"}
          </Link>
          <Link to="/discover" className={secondaryLink}>
            {hi ? "संभावित सहायता देखें" : "Find possible benefits"}
          </Link>
          <Link to="#how-it-works" className={secondaryLink}>
            {hi ? "यह कैसे काम करता है" : "See how it works"}
          </Link>
        </div>
        <figure className={storyFigure}>
          <picture>
            <source type="image/webp" srcSet="/images/story/hero-village.webp" />
            <img
              src="/images/story/hero-village.webp"
              width={768}
              height={512}
              alt={
                hi
                  ? "ग्रामीण परिदृश्य का उदाहरण चित्र — सड़क और हरियाली"
                  : "Illustrative rural landscape with a winding road and greenery"
              }
              fetchPriority="high"
              decoding="async"
              className={`${storyImage} object-[50%_54%]`}
            />
          </picture>
          <figcaption className={storyCaption}>
            {hi
              ? "उदाहरणात्मक संपादकीय चित्र; सत्यापित स्थान की तस्वीर नहीं।"
              : "Illustrative editorial image, not a photograph of a verified location."}
          </figcaption>
        </figure>
      </section>

      <section id="unseen-problem" className="flex flex-col gap-4 border-t border-border pt-10">
        <p className={chapterMarker}>{hi ? "अध्याय 2" : "Chapter 2"}</p>
        <h2 className={chapterHeading}>{hi ? "अदृश्य समस्या" : "The unseen problem"}</h2>
        <div className={chapterBody}>
          <p>
            {hi
              ? "पात्रता नियम अक्सर अधिकारियों के लिए लिखे जाते हैं, परिवारों के लिए नहीं। लाभ श्रेणी, ज़िला, परिवार की संरचना या आवास पर निर्भर हो सकता है, और हर बात अलग-अलग प्रपत्रों पर अलग तरह से लिखी जा सकती है।"
              : "Eligibility rules are often written for officers, not for families. A benefit may depend on category, district, household composition or housing, and each of these can be described in a different way on different forms."}
          </p>
          <p>
            {hi
              ? "नियम बदलते भी हैं। पिछले साल लागू योजना में इस साल नई शर्तें हो सकती हैं, और एक कार्यालय से दूसरे में माँगे गए दस्तावेज़ भिन्न हो सकते हैं।"
              : "Rules also change. A scheme that applied last year may have new conditions this year, and the documents asked for may differ from one office to the next."}
          </p>
          <p>
            {hi
              ? "योग्य होने पर भी आवेदन मार्ग कठिन हो सकता है: कौन-सा कार्यालय, कौन-सा पोर्टल, कौन-सा प्रमाण, किस क्रम में। कई उपयोगी लाभ यहीं खो जाते हैं।"
              : "Even when a household qualifies, the application route can be hard to follow: which office, which portal, which proof, and in which order. Many useful benefits are lost at these steps, not at the question of whether they are right for the family."}
          </p>
        </div>
      </section>

      <section id="how-it-works" className="flex flex-col gap-6 border-t border-border pt-10">
        <p className={chapterMarker}>{hi ? "अध्याय 3" : "Chapter 3"}</p>
        <h2 className={chapterHeading}>{hi ? "एक परिवार की कहानी" : "One household's story"}</h2>
        <p className="rounded-md bg-sage px-4 py-2 text-sm font-semibold text-ink">
          {hi ? "काल्पनिक उदाहरण परिवार" : "A fictional example household"}
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
            <h3 className="text-lg font-semibold text-ink">
              {hi ? "परिवार क्या कहता है" : "What the household says"}
            </h3>
            <p className="text-ink-soft">
              {hi
                ? "एक उदाहरण परिवार गाँव में रहता है — छोटा बच्चा और दादा-दादी के साथ। वे छोटे खेत पर खेती करते हैं, बच्चों और बुज़ुर्गों की सहायता के बारे में सुन चुके हैं, पर नहीं जानते कि कौन-सी बात उन पर लागू होती है या कौन से कागज़ ले जाएँ।"
                : "An example family lives in a village with a young child and a grandparent. They farm a small plot, have heard about help for children and older people, and do not know which of these apply to them or what papers to bring."}
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-muted p-5">
            <h3 className="text-lg font-semibold text-ink">
              {hi ? "सिस्टम को क्या जानना है" : "What the system needs to know"}
            </h3>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-ink-soft">
              <li>{hi ? "राज्य और ज़िला" : "State and district"}</li>
              <li>
                {hi
                  ? "परिवार की श्रेणी, जैसा परिवार बताए"
                  : "Household category, as the household describes it"}
              </li>
              <li>
                {hi
                  ? "क्या परिवार में बच्चा और बुज़ुर्ग रहते हैं"
                  : "Whether a child and an older person live in the household"}
              </li>
              <li>
                {hi
                  ? "हाँ या नहीं: क्या परिवार के पास पक्का मकान है?"
                  : "Yes or no: does the household own a pucca house?"}
              </li>
              <li>
                {hi
                  ? "परिवार के पास पहले से कौन से दस्तावेज़ हैं"
                  : "Which documents the household already has"}
              </li>
            </ul>
          </div>
        </div>
        <figure className={storyFigure}>
          <img
            src="/images/story/household-story.webp"
            width={768}
            height={512}
            loading="lazy"
            decoding="async"
            alt={
              hi
                ? "ग्रामीण घर के बाहर परिवार की बातचीत का चित्रण"
                : "Illustration of a family talking together outside a rural home"
            }
            className={`${storyImage} object-[50%_45%]`}
          />
          <figcaption className={storyCaption}>
            {hi
              ? "एआई-निर्मित चित्रण; वास्तविक लाभार्थी की कहानी नहीं।"
              : "AI-generated illustration; not an actual beneficiary story."}
          </figcaption>
        </figure>
      </section>

      <section id="intelligent-questions" className="flex flex-col gap-4 border-t border-border pt-10">
        <p className={chapterMarker}>{hi ? "अध्याय 4" : "Chapter 4"}</p>
        <h2 className={chapterHeading}>{hi ? "समझदार प्रश्न" : "The intelligent questions"}</h2>
        <div className={chapterBody}>
          <p>
            {hi
              ? "हक़पथ केवल वे प्रश्न पूछता है जो परिणाम बदल सकते हैं। हर प्रश्न के साथ संक्षिप्त कारण होता है, ताकि फॉर्म भरने के लिए अनावश्यक पूछताछ न हो।"
              : "HaqPath asks only the questions that could change the result. Each question comes with a short note explaining why it matters, so nothing is asked just to fill a form."}
          </p>
          <p>
            {hi
              ? "यदि कोई उत्तर परिणाम नहीं बदलेगा, तो वह प्रश्न नहीं पूछा जाता।"
              : "If an answer would not change the outcome, the question is not asked."}
          </p>
        </div>
        <div>
          <Link to="/discover" className={primaryLink}>
            {hi ? "प्रश्न आज़माएँ" : "Try the questions"}
          </Link>
        </div>
      </section>

      <section id="explainable-benefits" className="flex flex-col gap-4 border-t border-border pt-10">
        <p className={chapterMarker}>{hi ? "अध्याय 5" : "Chapter 5"}</p>
        <h2 className={chapterHeading}>{hi ? "समझ आने वाले लाभ" : "Explainable benefits"}</h2>
        <div className={chapterBody}>
          <p>{hi ? "हर योजना इनमें से एक परिणाम लेबल पर समाप्त होती है:" : "Every scheme ends in one of four outcome labels:"}</p>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li>{hi ? "संभावित योग्यता" : "Likely eligible"}</li>
            <li>{hi ? "अधिक जानकारी चाहिए" : "Needs more information"}</li>
            <li>{hi ? "इस योजना के लिए संभावित असंगति" : "Likely not eligible for this scheme"}</li>
            <li>{hi ? "स्रोत समीक्षाधीन" : "Source under review"}</li>
          </ul>
          <p>
            {hi
              ? "हर परिणाम उस नियम और आधिकारिक स्रोत को दिखाता है जिस पर वह आधारित है, ताकि आप स्वयं जाँच सकें या कार्यालय ले जा सकें।"
              : "Every result shows the rule it was based on and the official source for that rule, so you can check it yourself or take it to an office."}
          </p>
        </div>
        <div>
          <Link to="/results" className={textLink}>
            {hi ? "परिणाम कैसे समझाए जाते हैं देखें" : "See how results are explained"}
          </Link>
        </div>
      </section>

      <section id="readiness" className="flex flex-col gap-4 border-t border-border pt-10">
        <p className={chapterMarker}>{hi ? "अध्याय 6" : "Chapter 6"}</p>
        <h2 className={chapterHeading}>{hi ? "पात्रता से तैयारी तक" : "From eligibility to readiness"}</h2>
        <div className={chapterBody}>
          <p>
            {hi
              ? "यह जानना कि लाभ लागू हो सकता है, केवल पहला कदम है। हक़पथ परिणाम को दस्तावेज़ सूची, क्रमबद्ध आवेदन कदम और प्रगति दृश्य में बदलता है।"
              : "Knowing a benefit may apply is only the first step. HaqPath turns a result into a documents checklist, the application steps in order, and a progress view that shows what is still open."}
          </p>
        </div>
        <div>
          <Link to="/plan" className={primaryLink}>
            {hi ? "मेरी योजना खोलें" : "Open my plan"}
          </Link>
        </div>
        <figure className={storyFigure}>
          <img
            src="/images/story/action-checklist.webp"
            width={768}
            height={512}
            loading="lazy"
            decoding="async"
            alt={
              hi
                ? "नोटबुक के पास खाली कागज़ की सूची देखतीं हथेलियाँ — चित्रण"
                : "Illustration of hands looking at a blank paper checklist beside a notebook"
            }
            className={storyImage}
          />
          <figcaption className={storyCaption}>
            {hi ? "उदाहरणात्मक जाँच-सूची दृश्य।" : "Illustrative checklist scene."}
          </figcaption>
        </figure>
      </section>

      <section id="evidence-trust" className="flex flex-col gap-4 border-t border-border pt-10">
        <p className={chapterMarker}>{hi ? "अध्याय 7" : "Chapter 7"}</p>
        <h2 className={chapterHeading}>{hi ? "साक्ष्य और विश्वास" : "Evidence and trust"}</h2>
        <div className={chapterBody}>
          <p>
            {hi
              ? "हर नियम संस्करण, आधिकारिक स्रोत और अंतिम सत्यापन तिथि के साथ दर्ज होता है। जहाँ नियम या स्रोत अभी जाँचा नहीं गया, परिणाम वही कहता है।"
              : "Each rule is recorded with a version, the official source it came from, and the date it was last verified. Where a rule or source is not yet checked, the result says so."}
          </p>
          <p>
            {hi
              ? "स्रोत पुराना या समीक्षाधीन होने पर चेतावनी दिखती है। नियम सत्यापित होने तक हक़पथ योजना को पुष्ट नहीं दिखाता।"
              : "Review warnings appear when a source is out of date or under review. HaqPath does not show a scheme as confirmed until its rules have been verified."}
          </p>
        </div>
        <div>
          <Link to="/privacy" className={textLink}>
            {hi ? "गोपनीयता और सीमाएँ पढ़ें" : "Read our privacy and limits"}
          </Link>
        </div>
      </section>

      <section id="assisted-access" className="flex flex-col gap-4 border-t border-border pt-10">
        <p className={chapterMarker}>{hi ? "अध्याय 8" : "Chapter 8"}</p>
        <h2 className={chapterHeading}>{hi ? "सहायता से पहुँच" : "Assisted access"}</h2>
        <div className={chapterBody}>
          <p>
            {hi
              ? "हर कोई अकेले वेबसाइट नहीं चला सकता। स्वयंसेवक या एनजीओ कार्यकर्ता परिवार के साथ बैठकर उसी उपकरण का उपयोग कर सकता है, प्रश्न साथ में पूछकर और परिणाम परिवार की भाषा में समझाकर।"
              : "Not everyone can use a website alone. A community volunteer or an NGO worker may sit with a household and use the same tool on their behalf, going through the questions together and explaining each result in the household's own words."}
          </p>
        </div>
        <div>
          <Link to="/assisted" className={primaryLink}>
            {hi ? "सहायता मोड खोलें" : "Open assisted mode"}
          </Link>
        </div>
        <figure className={storyFigure}>
          <img
            src="/images/story/assisted-service.webp"
            width={768}
            height={512}
            loading="lazy"
            decoding="async"
            alt={
              hi
                ? "बाहर की मेज़ पर कागज़ात की बातचीत का चित्रण"
                : "Illustration of a conversation about paperwork at an outdoor table"
            }
            className={storyImage}
          />
          <figcaption className={storyCaption}>
            {hi
              ? "उदाहरण दृश्य; हक़पथ सेवा केंद्र की तस्वीर नहीं।"
              : "Illustrative scene; not a photographed HaqPath service centre."}
          </figcaption>
        </figure>
      </section>

      <section id="final-call" className="flex flex-col gap-6 border-t border-border pt-10">
        <p className={chapterMarker}>{hi ? "अध्याय 9" : "Chapter 9"}</p>
        <h2 className={chapterHeading}>
          {hi ? "जो जानते हैं, वहीं से शुरू करें।" : "Start with what you know."}
        </h2>
        <p className="text-ink-soft">
          {hi
            ? "योजना का नाम, कागज़ों का ढेर या अधिकारों की पूरी तस्वीर ज़रूरी नहीं। परिवार को सादे शब्दों में बताएँ और देखें आगे क्या संभव हो सकता है।"
            : "You do not need a scheme name, a file of papers or a full picture of your rights. Describe your household in plain words and see what may be possible next."}
        </p>
        <div>
          <Link to="/discover" className={primaryLink}>
            {hi ? "अभी शुरू करें" : "Start now"}
          </Link>
        </div>
        <footer className="rounded-md bg-sage px-4 py-3 text-sm text-ink-soft">
          {hi
            ? "हक़पथ एक स्वतंत्र तैयारी उपकरण है। यह सरकारी वेबसाइट नहीं है और आवेदन सेवा नहीं है।"
            : "HaqPath is an independent readiness tool. It is not a government website and not an application service."}
        </footer>
      </section>
    </div>
  );
}
