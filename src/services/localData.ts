import { clearHouseholdStorage } from "./householdStore";
import { clearProgress } from "./progressRepository";
import { clearFollowUps } from "./reminderRepository";

/** Removes household answers, self-reported progress and personal reminders. Language preference is kept. */
export function clearHouseholdData(): void {
  clearHouseholdStorage();
  clearProgress();
  clearFollowUps();
}
