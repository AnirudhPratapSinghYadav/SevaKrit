import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FeatureRail from "../components/FeatureRail";
import EmptyState from "../components/ui/EmptyState";
import { useAppState } from "../context/AppState";
import { runHaqCompass } from "../domain/haqCompass";
import { useLanguage } from "../i18n/Language";
import type { MessageKey } from "../i18n/messages";
import type { Outcome } from "../domain/types";

const OUTCOME_KEYS: Record<Outcome, MessageKey> = {
  likely_fit: "likelyFit",
  needs_information: "needsInformation",
  likely_mismatch: "likelyMismatch",
  source_review_needed: "sourceUnderReview",
};

export default function HaqCompass() {
  const { profile } = useAppState();
  const { t } = useLanguage();
  const [houseType, setHouseType] = useState("pucca");
  const [gov, setGov] = useState("Yes");
  const nowIso = useMemo(() => new Date().toISOString(), []);

  const report = useMemo(() => {
    const overrides: Record<string, string | boolean> = {};
    if (houseType) overrides.houseType = houseType;
    if (gov === "Yes") overrides.hasGovernmentEmployee = true;
    if (gov === "No") overrides.hasGovernmentEmployee = false;
    return runHaqCompass(profile, overrides, nowIso);
  }, [profile, houseType, gov, nowIso]);

  return (
    <section className="flex flex-col gap-6">
      <FeatureRail />
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold text-ink">{t("toolCompass")}</h1>
        <p className="text-ink-soft">{t("compassIntro")}</p>
        <p className="rounded-md bg-surface-muted px-4 py-3 text-sm">{report.disclaimer}</p>
      </header>

      <fieldset className="flex flex-col gap-3 rounded-md border border-border p-4">
        <legend className="px-1 font-semibold text-ink">{t("compassHypothetical")}</legend>
        <label htmlFor="compass-house" className="font-semibold text-ink">
          {t("compassHouse")}
        </label>
        <select
          id="compass-house"
          value={houseType}
          onChange={(event) => setHouseType(event.target.value)}
          className="min-h-11 rounded-md border border-border px-3"
        >
          <option value="kutcha">kutcha</option>
          <option value="pucca">pucca</option>
        </select>
        <label htmlFor="compass-gov" className="font-semibold text-ink">
          {t("compassGov")}
        </label>
        <select
          id="compass-gov"
          value={gov}
          onChange={(event) => setGov(event.target.value)}
          className="min-h-11 rounded-md border border-border px-3"
        >
          <option value="No">{t("no")}</option>
          <option value="Yes">{t("yes")}</option>
        </select>
      </fieldset>

      {report.diffs.length === 0 ? (
        <EmptyState
          title={t("toolCompass")}
          description={t("planEmpty")}
          action={
            <Link to="/discover" className="underline underline-offset-4">
              {t("planUpdate")}
            </Link>
          }
        />
      ) : null}

      <ul className="flex flex-col gap-3">
        {report.diffs.map((diff) => (
          <li key={diff.schemeId} className="rounded-md border border-border bg-surface p-4">
            <h2 className="font-semibold text-ink">{diff.titleEn}</h2>
            <p className="text-sm">
              {t("compassCurrent")}: {t(OUTCOME_KEYS[diff.baselineOutcome])}
            </p>
            <p className="text-sm">
              {t("compassWhatIf")}: {t(OUTCOME_KEYS[diff.hypotheticalOutcome])}
              {diff.blocked ? ` — ${t("compassBlocked")}` : ""}
            </p>
            {diff.blockReason !== null && <p className="text-sm text-warning-ink">{diff.blockReason}</p>}
            {diff.flippedRules.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm">
                {diff.flippedRules.map((rule) => (
                  <li key={rule.ruleId}>
                    {rule.ruleId}: {rule.before} → {rule.after}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <p>
        <Link to="/results" className="underline underline-offset-4">
          {t("planReviewResults")}
        </Link>
      </p>
    </section>
  );
}
