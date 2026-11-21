import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { HouseholdProfile } from "../domain/types";
import { parseNarrative, type ProposedFact } from "../services/parseNarrative";

type FactValue = HouseholdProfile["confirmedFacts"][string];

export interface AppStateValue {
  narrative: string;
  proposed: ProposedFact[];
  confirmedFacts: Record<string, FactValue>;
  followUpAnswers: Record<string, string>;
  profile: HouseholdProfile;
  setNarrative: (text: string) => void;
  /** Replaces current proposals with facts parsed from text. Proposals are never confirmed here. */
  proposeFacts: (text: string) => ProposedFact[];
  /** Explicit user Confirm: the only path that moves a proposal into confirmed facts. */
  confirmFact: (factKey: string) => void;
  removeProposal: (factKey: string) => void;
  answerFollowUp: (factKey: string, answer: string) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [narrative, setNarrative] = useState("");
  const [proposed, setProposed] = useState<ProposedFact[]>([]);
  const [confirmedFacts, setConfirmedFacts] = useState<Record<string, FactValue>>({});
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});

  const proposeFacts = useCallback((text: string): ProposedFact[] => {
    const facts = parseNarrative(text);
    setProposed(facts);
    return facts;
  }, []);

  const confirmFact = useCallback(
    (factKey: string) => {
      const hit = proposed.find((fact) => fact.factKey === factKey);
      if (!hit) return;
      setConfirmedFacts((current) => ({ ...current, [factKey]: hit.value }));
      setProposed((current) => current.filter((fact) => fact.factKey !== factKey));
    },
    [proposed],
  );

  const removeProposal = useCallback((factKey: string) => {
    setProposed((current) => current.filter((fact) => fact.factKey !== factKey));
  }, []);

  const answerFollowUp = useCallback((factKey: string, answer: string) => {
    const trimmed = answer.trim();
    if (trimmed === "") return;
    setFollowUpAnswers((current) => ({ ...current, [factKey]: trimmed }));
  }, []);

  const profile = useMemo<HouseholdProfile>(
    () => ({
      confirmedFacts: { ...confirmedFacts, ...followUpAnswers },
      unknownFacts: [],
    }),
    [confirmedFacts, followUpAnswers],
  );

  const value = useMemo<AppStateValue>(
    () => ({
      narrative,
      proposed,
      confirmedFacts,
      followUpAnswers,
      profile,
      setNarrative,
      proposeFacts,
      confirmFact,
      removeProposal,
      answerFollowUp,
    }),
    [narrative, proposed, confirmedFacts, followUpAnswers, profile, proposeFacts, confirmFact, removeProposal, answerFollowUp],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (value === null) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return value;
}
