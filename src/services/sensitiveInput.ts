export interface SensitiveScan {
  blocked: boolean;
  message: string | null;
}

/**
 * Blocks likely identity numbers before they enter state or storage.
 * A 10-digit mobile number alone is not treated as Aadhaar.
 * The raw match is never returned.
 */
export function scanSensitiveInput(text: string): SensitiveScan {
  const aadhaar = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/.test(text);
  const longAccount = /\b\d{11,18}\b/.test(text);
  const otp = /\b(otp|one[- ]time password)\b/i.test(text);
  if (aadhaar || longAccount || otp) {
    return {
      blocked: true,
      message:
        "That description looks like it includes an ID number, account number, or OTP. Remove it and try again. Share those only on the official portal.",
    };
  }
  return { blocked: false, message: null };
}
