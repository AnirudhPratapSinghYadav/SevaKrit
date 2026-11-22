import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/Language";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-ink">{t("notFoundTitle")}</h1>
      <p>{t("notFoundBody")}</p>
      <Link to="/" className="inline-flex min-h-11 items-center underline underline-offset-4">
        {t("notFoundHome")}
      </Link>
    </section>
  );
}
