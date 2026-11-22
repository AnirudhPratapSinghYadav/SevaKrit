import { describe, expect, it } from "vitest";
import { scanSensitiveInput } from "../services/sensitiveInput";

describe("scanSensitiveInput", () => {
  it("blocks a 12-digit Aadhaar-like number without echoing it", () => {
    const result = scanSensitiveInput("My number is 1234 5678 9012");
    expect(result.blocked).toBe(true);
    expect(result.message).not.toContain("1234");
  });

  it("does not treat a 10-digit mobile number as an identity number", () => {
    const result = scanSensitiveInput("Call me on 9876543210 about the house");
    expect(result.blocked).toBe(false);
  });

  it("blocks an OTP mention", () => {
    expect(scanSensitiveInput("the OTP is ready").blocked).toBe(true);
  });
});
