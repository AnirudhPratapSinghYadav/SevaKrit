import type { HouseholdProfile } from "../domain/types";

/** Synthetic demo households for PM-JANMAN housing — not real residents. */
export const demoHouseholds: Record<string, HouseholdProfile> = {
  fit_baiga_dindori: {
    id: "fit_baiga_dindori",
    confirmedFacts: {
      tribalGroup: "Baiga",
      district: "Dindori",
      houseType: "kutcha",
      settlementArea: "rural",
      hasGovernmentEmployee: false,
    },
    unknownFacts: [],
  },
  mismatch_pucca: {
    id: "mismatch_pucca",
    confirmedFacts: {
      tribalGroup: "Baiga",
      district: "Dindori",
      houseType: "pucca",
      settlementArea: "rural",
      hasGovernmentEmployee: false,
    },
    unknownFacts: [],
  },
  needs_info: {
    id: "needs_info",
    confirmedFacts: {
      tribalGroup: "Baiga",
      district: "Dindori",
      houseType: "kutcha",
      settlementArea: "rural",
    },
    unknownFacts: ["hasGovernmentEmployee"],
  },
};
