import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LegalCompliancePanel } from "./LegalCompliancePanel";

describe("LegalCompliancePanel", () => {
  it("renders summary and legal actions", () => {
    const html = renderToStaticMarkup(
      <LegalCompliancePanel
        exportDataActionId="web.legalCompliance.export"
        exportDataLabel="Exportar datos"
        language="es"
        medicalDisclaimerAccepted={false}
        medicalDisclaimerLabel="He leido el disclaimer medico"
        onExportData={() => undefined}
        onMedicalDisclaimerChange={() => undefined}
        onPrivacyPolicyChange={() => undefined}
        onRequestDeletion={() => undefined}
        onSaveConsent={() => undefined}
        onTermsChange={() => undefined}
        privacyPolicyAccepted={false}
        privacyPolicyLabel="Acepto politica de privacidad"
        requestDeletionActionId="web.legalCompliance.delete"
        requestDeletionLabel="Solicitar borrado"
        routeId="web.route.legal"
        saveConsentActionId="web.legalCompliance.save"
        saveConsentLabel="Guardar consentimiento"
        screenId="web.legalCompliance.screen"
        status="guardado"
        statusId="web.legalCompliance.status"
        statusLabel="Legal"
        summaryLabel="Resumen legal"
        summaryValue="saved"
        termsAccepted={false}
        termsLabel="Acepto terminos y condiciones"
        title="Privacidad y consentimiento"
      />
    );

    expect(html).toContain("Privacidad y consentimiento");
    expect(html).toContain("Resumen legal");
    expect(html).toContain("Acepto politica de privacidad");
    expect(html).toContain("Acepto terminos y condiciones");
    expect(html).toContain("He leido el disclaimer medico");
    expect(html).toContain("Guardar consentimiento");
    expect(html).toContain("Exportar datos");
    expect(html).toContain("Solicitar borrado");
    expect(html).toContain("web.legalCompliance.save");
  });

  it("renders idle summary when consent is missing", () => {
    const html = renderToStaticMarkup(
      <LegalCompliancePanel
        exportDataActionId="web.legalCompliance.export"
        exportDataLabel="Exportar datos"
        language="es"
        medicalDisclaimerAccepted={false}
        medicalDisclaimerLabel="He leido el disclaimer medico"
        onExportData={() => undefined}
        onMedicalDisclaimerChange={() => undefined}
        onPrivacyPolicyChange={() => undefined}
        onRequestDeletion={() => undefined}
        onSaveConsent={() => undefined}
        onTermsChange={() => undefined}
        privacyPolicyAccepted={false}
        privacyPolicyLabel="Acepto politica de privacidad"
        requestDeletionActionId="web.legalCompliance.delete"
        requestDeletionLabel="Solicitar borrado"
        routeId="web.route.legal"
        saveConsentActionId="web.legalCompliance.save"
        saveConsentLabel="Guardar consentimiento"
        screenId="web.legalCompliance.screen"
        status="inactivo"
        statusId="web.legalCompliance.status"
        statusLabel="Legal"
        summaryLabel="Resumen legal"
        summaryValue="idle"
        termsAccepted={false}
        termsLabel="Acepto terminos y condiciones"
        title="Privacidad y consentimiento"
      />
    );

    expect(html).toContain("inactivo");
    expect(html).toContain("idle");
  });

  it("hides internal status and summary in product mode", () => {
    const html = renderToStaticMarkup(
      <LegalCompliancePanel
        exportDataActionId="web.legalCompliance.export"
        exportDataLabel="Exportar datos"
        language="es"
        medicalDisclaimerAccepted={false}
        medicalDisclaimerLabel="He leido el disclaimer medico"
        onExportData={() => undefined}
        onMedicalDisclaimerChange={() => undefined}
        onPrivacyPolicyChange={() => undefined}
        onRequestDeletion={() => undefined}
        onSaveConsent={() => undefined}
        onTermsChange={() => undefined}
        privacyPolicyAccepted={false}
        privacyPolicyLabel="Acepto politica de privacidad"
        requestDeletionActionId="web.legalCompliance.delete"
        requestDeletionLabel="Solicitar borrado"
        routeId="web.route.legal"
        saveConsentActionId="web.legalCompliance.save"
        saveConsentLabel="Guardar consentimiento"
        screenId="web.legalCompliance.screen"
        showStatus={false}
        showSummary={false}
        status="guardado"
        statusId="web.legalCompliance.status"
        statusLabel="Legal"
        summaryLabel="Resumen legal"
        summaryValue="saved"
        termsAccepted={false}
        termsLabel="Acepto terminos y condiciones"
        title="Privacidad y consentimiento"
      />
    );

    expect(html).toContain("Privacidad y consentimiento");
    expect(html).not.toContain("Legal:");
    expect(html).not.toContain("Resumen legal");
    expect(html).not.toContain("saved");
  });
});
