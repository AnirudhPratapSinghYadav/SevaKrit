import { Link, useParams } from "react-router-dom";
import { getPublishedSchemeBySlug } from "../services/evaluatePublished";
import { getSources } from "../services/schemeRepository";
import { useLanguage } from "../i18n/Language";

/** Public QR destination: scheme facts only. No household localStorage required. */
export default function PublicScheme() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();
  const scheme = slug ? getPublishedSchemeBySlug(slug) : undefined;
  const sources = getSources();

  if (!scheme) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink">{t("detailNotFound")}</h1>
        <Link to="/" className="underline underline-offset-4">
          {t("notFoundHome")}
        </Link>
      </section>
    );
  }

  const source = sources.find((item) => scheme.sourceIds.includes(item.id));
  const title = lang === "hi" && scheme.title.hi ? scheme.title.hi : scheme.title.en;

  return (
    <article className="flex flex-col gap-6">
      <p className="rounded-md bg-surface-muted px-4 py-3 text-sm">
        {lang === "hi"
          ? "यह सार्वजनिक योजना पृष्ठ है। इसमें परिवार के निजी उत्तर नहीं होते।"
          : "This is a public scheme page. It does not contain any household answers."}
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink">{title}</h1>
      <p className="text-sm">{scheme.department}</p>
      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">{t("detailPath")}</h2>
        <p>{scheme.applicationChannel}</p>
        <ol className="list-decimal space-y-1 pl-5">
          {scheme.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">{t("detailDocuments")}</h2>
        <ul className="list-disc pl-5">
          {scheme.documents.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
      </section>
      {source && (
        <p>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-terracotta-text underline underline-offset-4"
          >
            {t("planOfficialSource")}
          </a>
        </p>
      )}
      <p className="text-sm">{t("detailDisclaimer")}</p>
      <Link to="/discover" className="inline-flex min-h-11 items-center self-start rounded-md bg-ink px-4 font-semibold text-canvas">
        {t("ctaFind")}
      </Link>
    </article>
  );
}
