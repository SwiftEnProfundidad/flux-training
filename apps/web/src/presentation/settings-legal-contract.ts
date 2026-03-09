export type SettingsLegalStatus =
  | "idle"
  | "loading"
  | "saved"
  | "exported"
  | "deletion_requested"
  | "error"
  | "offline"
  | "denied";

export type SettingsLegalScreenModel = {
  notificationsEnabled: boolean;
  watchSyncEnabled: boolean;
  calendarSyncEnabled: boolean;
  privacyPolicyAccepted: boolean;
  termsAccepted: boolean;
  medicalDisclaimerAccepted: boolean;
  settingsStatus: SettingsLegalStatus;
  legalStatus: SettingsLegalStatus;
};

export function createDefaultSettingsLegalScreenModel(): SettingsLegalScreenModel {
  return {
    notificationsEnabled: true,
    watchSyncEnabled: true,
    calendarSyncEnabled: false,
    privacyPolicyAccepted: false,
    termsAccepted: false,
    medicalDisclaimerAccepted: false,
    settingsStatus: "idle",
    legalStatus: "idle"
  };
}
