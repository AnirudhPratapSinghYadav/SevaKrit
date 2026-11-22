import { useMemo } from "react";
import { Link } from "react-router-dom";
import FeatureRail from "../components/FeatureRail";
import PublicQr from "../components/qr/PublicQr";
import EmptyState from "../components/ui/EmptyState";
import { assertPocketPrivacy, buildPocketCard } from "../domain/haqPocket";
import { useLanguage } from "../i18n/Language";
import { pushActivity } from "../services/activityInbox";
import { planSchemes } from "../services/evaluatePublished";
import { getSources } from "../services/schemeRepository";
import { useAppState } from "../context/AppState";

export default function HaqPocket() {
  const { profile } = useAppState();
  const { t, lang } = useLanguage();
  const nowIso = new Date().toISOString();
  const actionable = planSchemes(profile, nowIso);
  const sources = getSources();
  const origin = typeof window !== "undefined" ? window.location.origin : "http://127.0.0.1:5173";

  const cards = useMemo(
    () => actionable.map(({ scheme }) => buildPocketCard(scheme, sources, origin)),
    [actionable, sources, origin],
  );

  return (
    <section className="flex flex-col gap-6">
      <FeatureRail />
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold text-ink">{t("toolPocket")}</h1>
        <p className="text-ink-soft">{t("pocketIntro")}</p>
      </header>

      {cards.length === 0 ? (
        <EmptyState
          title={t("toolPocket")}
          description={t("planEmpty")}
          action={
            <Link to="/discover" className="underline underline-offset-4">
              {t("planUpdate")}
            </Link>
          }
        />
      ) : (
        cards.map((card) => {
          const privacy = assertPocketPrivacy(card.qrPayload);
          return (
            <article
              key={card.schemeId}
              className="print-sheet flex flex-col gap-4 rounded-md border border-sage p-4"
            >
              <h2 className="text-xl font-semibold text-ink">
                {lang === "hi" && card.titleHi ? card.titleHi : card.titleEn}
              </h2>
              <p className="text-sm">{card.department}</p>
              <p className="text-sm">{card.applicationChannel}</p>
              <p className="text-sm">{card.verificationNote}</p>
              <section className="flex flex-col gap-2">
                <h3 className="font-semibold text-ink">{t("planDocuments")}</h3>
                <ul className="list-disc pl-5 text-sm">
                  {card.documents.map((doc) => (
                    <li key={doc}>{doc}</li>
                  ))}
                </ul>
              </section>
              <section className="flex flex-col gap-2">
                <h3 className="font-semibold text-ink">{t("planSteps")}</h3>
                <ol className="list-decimal pl-5 text-sm">
                  {card.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </section>
              {card.officialUrl && (
                <p>
                  <a
                    href={card.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terracotta-text underline underline-offset-4"
                  >
                    {t("planOfficialSource")}
                  </a>
                </p>
              )}
              {privacy.ok ? (
                <PublicQr payload={card.qrPayload} label={t("pocketQrLabel")} />
              ) : (
                <p role="alert" className="text-sm text-error-ink">
                  {privacy.reason}
                </p>
              )}
              <p className="text-sm">
                <Link to={card.publicPath} className="underline underline-offset-4">
                  {t("pocketOpenPublic")}
                </Link>
              </p>
              <button
                type="button"
                onClick={() => {
                  pushActivity(
                    "pocket_printed",
                    "HaqPocket print opened",
                    `Public card for ${card.schemeId}. QR stays privacy-safe (public scheme URL only).`,
                  );
                  window.print();
                }}
                className="min-h-11 self-start rounded-md border border-ink px-4 font-semibold text-ink no-print"
              >
                {t("printButton")}
              </button>
            </article>
          );
        })
      )}
    </section>
  );
}
