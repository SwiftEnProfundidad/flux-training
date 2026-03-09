import type { DashboardHomeStatus } from "./dashboard-home-contract";

type LegalComplianceRuntimeStatus =
  | "idle"
  | "loading"
  | "saved"
  | "consent_required"
  | "deletion_requested"
  | "exported"
  | "error";

type CreateLegalComplianceScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  legalStatus: LegalComplianceRuntimeStatus;
  privacyPolicyAccepted: boolean;
  termsAccepted: boolean;
  medicalDisclaimerAccepted: boolean;
};

export type LegalComplianceScreenModel = {
  routeId: "web.route.legalCompliance";
  screenId: "web.legalCompliance.screen";
  status: DashboardHomeStatus;
  actions: {
    saveConsent: "web.legalCompliance.saveConsent";
    exportData: "web.legalCompliance.exportData";
    requestDeletion: "web.legalCompliance.requestDeletion";
  };
};

function resolveLegalComplianceStatus(
  input: CreateLegalComplianceScreenModelInput
): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (input.legalStatus === "loading") {
    return "loading";
  }
  if (input.legalStatus === "error") {
    return "error";
  }
  if (input.legalStatus === "consent_required") {
    return "denied";
  }
  if (
    input.legalStatus === "saved" ||
    input.legalStatus === "exported" ||
    input.legalStatus === "deletion_requested"
  ) {
    return "success";
  }
  if (
    input.privacyPolicyAccepted === false ||
    input.termsAccepted === false ||
    input.medicalDisclaimerAccepted === false
  ) {
    return "empty";
  }
  return "success";
}

export function createLegalComplianceScreenModel(
  input: CreateLegalComplianceScreenModelInput
): LegalComplianceScreenModel {
  return {
    routeId: "web.route.legalCompliance",
    screenId: "web.legalCompliance.screen",
    status: resolveLegalComplianceStatus(input),
    actions: {
      saveConsent: "web.legalCompliance.saveConsent",
      exportData: "web.legalCompliance.exportData",
      requestDeletion: "web.legalCompliance.requestDeletion"
    }
  };
}
