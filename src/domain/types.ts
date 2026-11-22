import { z } from "zod";

const IsoDate = z.string().date();
const IsoDateTime = z.string().datetime();
const FactValue = z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]);

export const SourceRecordSchema = z
  .object({
    id: z.string(),
    url: z.string().url(),
    publisher: z.string(),
    // Leads not yet read carry the sentinel "not-yet-checked" instead of a date.
    checkedAt: z.union([IsoDate, z.literal("not-yet-checked")]),
    effectiveFrom: IsoDate.optional(),
    effectiveTo: IsoDate.optional(),
    evidenceText: z.string().max(300),
    status: z.enum(["verified", "unverified", "conflicting"]),
  })
  .strict();
export type SourceRecord = z.infer<typeof SourceRecordSchema>;

export const SchemeSchema = z
  .object({
    id: z.string(),
    title: z
      .object({
        en: z.string(),
        hi: z.string().optional(),
      })
      .strict(),
    department: z.string(),
    beneficiaryScope: z.enum(["household", "member"]),
    applicationChannel: z.string(),
    steps: z.array(z.string()),
    documents: z.array(z.string()),
    deadline: IsoDate.nullable(),
    sourceIds: z.array(z.string()),
    status: z.enum(["draft", "published"]),
    lastVerified: IsoDate.nullable(),
  })
  .strict();
export type Scheme = z.infer<typeof SchemeSchema>;

export const RuleSchema = z
  .object({
    id: z.string(),
    factKey: z.string(),
    operator: z.enum(["equals", "at_least", "at_most", "one_of", "is_true", "is_false"]),
    value: FactValue,
    description: z.string(),
    sourceId: z.string(),
    group: z.string().optional(),
    exclusion: z.boolean(),
  })
  .strict();
export type Rule = z.infer<typeof RuleSchema>;

export const RuleVersionSchema = z
  .object({
    id: z.string(),
    schemeId: z.string(),
    version: z.number().int().min(1),
    effectiveAt: IsoDate,
    // Exclusive end of the applicability interval [effectiveAt, effectiveTo). Missing means open-ended.
    effectiveTo: IsoDate.optional(),
    reviewedAt: IsoDate.nullable(),
    sourceIds: z.array(z.string()),
    rules: z.array(RuleSchema),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.effectiveTo !== undefined && value.effectiveTo <= value.effectiveAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["effectiveTo"],
        message: "effectiveTo must be strictly greater than effectiveAt",
      });
    }
  });
export type RuleVersion = z.infer<typeof RuleVersionSchema>;

export const HouseholdProfileSchema = z
  .object({
    id: z.string().optional(),
    confirmedFacts: z.record(z.string(), FactValue),
    unknownFacts: z.array(z.string()),
  })
  .strict();
export type HouseholdProfile = z.infer<typeof HouseholdProfileSchema>;

export const OutcomeEnum = z.enum([
  "likely_fit",
  "needs_information",
  "likely_mismatch",
  "source_review_needed",
]);
export type Outcome = z.infer<typeof OutcomeEnum>;

export const AssessmentSchema = z
  .object({
    schemeId: z.string(),
    ruleVersionId: z.string(),
    outcome: OutcomeEnum,
    passed: z.array(z.string()),
    failed: z.array(z.string()),
    unknown: z.array(z.string()),
    sourceIds: z.array(z.string()),
    conflictingRuleVersionIds: z.array(z.string()).optional(),
  })
  .strict();
export type Assessment = z.infer<typeof AssessmentSchema>;

export const ApplicationPlanSchema = z
  .object({
    schemeId: z.string(),
    documents: z.array(z.string()),
    steps: z.array(z.string()),
    officialUrl: z.string().url(),
  })
  .strict();
export type ApplicationPlan = z.infer<typeof ApplicationPlanSchema>;

export const ProgressEventSchema = z
  .object({
    schemeId: z.string(),
    kind: z.string(),
    at: IsoDateTime,
    enteredBy: z.literal("user"),
  })
  .strict();
export type ProgressEvent = z.infer<typeof ProgressEventSchema>;
