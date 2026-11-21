// SYNTHETIC household profiles for development and tests only.
// Every name, value and fact key here is invented. None describes a real household
// and none reflects an official eligibility threshold.
import type { HouseholdProfile } from "../domain/types";

export const syntheticProfiles: Record<string, HouseholdProfile> = {
  // Synthetic household A: sits exactly on the inclusive boundaries
  // (size 5, income 300000) and uses a non-canonical district spelling to exercise trimming/case folding.
  synthetic_a: {
    id: "synthetic_a",
    confirmedFacts: {
      synthetic_household_size: 5,
      synthetic_income_inr: 300000,
      synthetic_district_type: " Alpha ",
      synthetic_proof_x: true,
      synthetic_proof_y: false,
      synthetic_disqualifier: false,
    },
    unknownFacts: [],
  },
  // Synthetic household B: income, second proof and disqualifier are not confirmed.
  synthetic_b: {
    id: "synthetic_b",
    confirmedFacts: {
      synthetic_household_size: 4,
      synthetic_district_type: "beta",
      synthetic_proof_x: false,
    },
    unknownFacts: ["synthetic_income_inr", "synthetic_proof_y", "synthetic_disqualifier"],
  },
  // Synthetic household C: income one unit above the synthetic boundary.
  synthetic_c: {
    id: "synthetic_c",
    confirmedFacts: {
      synthetic_household_size: 3,
      synthetic_income_inr: 300001,
      synthetic_district_type: "beta",
      synthetic_proof_x: true,
      synthetic_disqualifier: false,
    },
    unknownFacts: [],
  },
  // Synthetic empty profile: nothing confirmed, nothing declared unknown.
  synthetic_empty: {
    id: "synthetic_empty",
    confirmedFacts: {},
    unknownFacts: [],
  },
};
