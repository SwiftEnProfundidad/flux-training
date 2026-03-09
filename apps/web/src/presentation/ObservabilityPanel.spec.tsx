import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ObservabilityPanel } from "./ObservabilityPanel";

describe("ObservabilityPanel", () => {
  it("renders observability actions and stats", () => {
    const html = renderToStaticMarkup(
      <ObservabilityPanel
        analyticsEventsLabel="Eventos de analitica"
        analyticsEventsValue="3"
        blockedActionsLabel="Acciones bloqueadas"
        blockedActionsValue="1"
        canonicalCoverageLabel="Cobertura canonica"
        canonicalCoverageValue="2/3"
        crashReportsLabel="Reportes de fallos"
        crashReportsValue="1"
        deniedEventsLabel="Eventos denegados"
        deniedEventsValue="0"
        fatalCrashesLabel="Fallos fatales"
        fatalCrashesValue="1"
        language="es"
        loadDataActionId="web.analyticsOverview.load"
        loadDataLabel="Cargar datos"
        onCallOwnerLabel="Responsable on-call"
        onCallOwnerValue="ops-flux"
        onLoadData={() => undefined}
        onReportCrash={() => undefined}
        onTrackEvent={() => undefined}
        operationalAlertsLabel="Alertas operativas abiertas"
        operationalAlertsValue="2"
        reportCrashActionId="web.analyticsOverview.crash"
        reportCrashLabel="Reportar crash"
        routeId="web.route.observability"
        runbooksLabel="Guias operativas activas"
        runbooksValue="4"
        screenId="web.analyticsOverview.screen"
        status="success"
        statusId="web.analyticsOverview.status"
        statusLabel="Observabilidad"
        title="Observabilidad"
        trackEventActionId="web.analyticsOverview.track"
        trackEventLabel="Registrar evento"
      />
    );

    expect(html).toContain("Observabilidad");
    expect(html).toContain("Registrar evento");
    expect(html).toContain("Reportar crash");
    expect(html).toContain("Cargar datos");
    expect(html).toContain("Eventos de analitica");
    expect(html).toContain("ops-flux");
  });

  it("renders empty state values", () => {
    const html = renderToStaticMarkup(
      <ObservabilityPanel
        analyticsEventsLabel="Eventos de analitica"
        analyticsEventsValue="0"
        blockedActionsLabel="Acciones bloqueadas"
        blockedActionsValue="0"
        canonicalCoverageLabel="Cobertura canonica"
        canonicalCoverageValue="0/0"
        crashReportsLabel="Reportes de fallos"
        crashReportsValue="0"
        deniedEventsLabel="Eventos denegados"
        deniedEventsValue="0"
        fatalCrashesLabel="Fallos fatales"
        fatalCrashesValue="0"
        language="es"
        loadDataActionId="web.analyticsOverview.load"
        loadDataLabel="Cargar datos"
        onCallOwnerLabel="Responsable on-call"
        onCallOwnerValue="-"
        onLoadData={() => undefined}
        onReportCrash={() => undefined}
        onTrackEvent={() => undefined}
        operationalAlertsLabel="Alertas operativas abiertas"
        operationalAlertsValue="0"
        reportCrashActionId="web.analyticsOverview.crash"
        reportCrashLabel="Reportar crash"
        routeId="web.route.observability"
        runbooksLabel="Guias operativas activas"
        runbooksValue="0"
        screenId="web.analyticsOverview.screen"
        status="idle"
        statusId="web.analyticsOverview.status"
        statusLabel="Observabilidad"
        title="Observabilidad"
        trackEventActionId="web.analyticsOverview.track"
        trackEventLabel="Registrar evento"
      />
    );

    expect(html).toContain("idle");
    expect(html).toContain("0/0");
  });
});
