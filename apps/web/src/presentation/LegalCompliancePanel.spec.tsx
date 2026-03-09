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
        onExportData={() => undefined}
        onRequestDeletion={() => undefined}
        onSaveConsent={() => undefined}
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
        title="Privacidad y consentimiento"
      />
    );

    expect(html).toContain("Privacidad y consentimiento");
    expect(html).toContain("Resumen legal");
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
        onExportData={() => undefined}
        onRequestDeletion={() => undefined}
        onSaveConsent={() => undefined}
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
        title="Privacidad y consentimiento"
      />
    );

    expect(html).toContain("inactivo");
    expect(html).toContain("idle");
  });
});
