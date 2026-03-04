import { describe, expect, it } from "vitest";
import { createLegalComplianceScreenModel } from "./legal-compliance-contract";

describe("legal compliance contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createLegalComplianceScreenModel({
        dashboardHomeStatus: "success",
        legalStatus: "saved",
        privacyPolicyAccepted: true,
        termsAccepted: true,
        medicalDisclaimerAccepted: true
      })
    ).toEqual({
      routeId: "web.route.legalCompliance",
      screenId: "web.legalCompliance.screen",
      status: "success",
      actions: {
        saveConsent: "web.legalCompliance.saveConsent",
        exportData: "web.legalCompliance.exportData",
        requestDeletion: "web.legalCompliance.requestDeletion"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createLegalComplianceScreenModel({
        dashboardHomeStatus: "loading",
        legalStatus: "saved",
        privacyPolicyAccepted: true,
        termsAccepted: true,
        medicalDisclaimerAccepted: true
      }).status
    ).toBe("loading");

    expect(
      createLegalComplianceScreenModel({
        dashboardHomeStatus: "offline",
        legalStatus: "saved",
        privacyPolicyAccepted: true,
        termsAccepted: true,
        medicalDisclaimerAccepted: true
      }).status
    ).toBe("offline");
  });

  it("maps legal runtime states to canonical status", () => {
    expect(
      createLegalComplianceScreenModel({
        dashboardHomeStatus: "success",
        legalStatus: "loading",
        privacyPolicyAccepted: true,
        termsAccepted: true,
        medicalDisclaimerAccepted: true
      }).status
    ).toBe("loading");

    expect(
      createLegalComplianceScreenModel({
        dashboardHomeStatus: "success",
        legalStatus: "error",
        privacyPolicyAccepted: true,
        termsAccepted: true,
        medicalDisclaimerAccepted: true
      }).status
    ).toBe("error");

    expect(
      createLegalComplianceScreenModel({
        dashboardHomeStatus: "success",
        legalStatus: "consent_required",
        privacyPolicyAccepted: false,
        termsAccepted: true,
        medicalDisclaimerAccepted: true
      }).status
    ).toBe("denied");
  });

  it("returns empty when consent set is incomplete", () => {
    expect(
      createLegalComplianceScreenModel({
        dashboardHomeStatus: "success",
        legalStatus: "idle",
        privacyPolicyAccepted: true,
        termsAccepted: false,
        medicalDisclaimerAccepted: true
      }).status
    ).toBe("empty");
  });
});
