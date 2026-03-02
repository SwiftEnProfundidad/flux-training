import { describe, expect, it } from "vitest";
import { createDefaultSettingsLegalScreenModel } from "./settings-legal-contract";

describe("settings legal screen contract", () => {
  it("creates default model in idle states", () => {
    expect(createDefaultSettingsLegalScreenModel()).toEqual({
      notificationsEnabled: true,
      watchSyncEnabled: true,
      calendarSyncEnabled: false,
      privacyPolicyAccepted: false,
      termsAccepted: false,
      medicalDisclaimerAccepted: false,
      settingsStatus: "idle",
      legalStatus: "idle"
    });
  });
});
