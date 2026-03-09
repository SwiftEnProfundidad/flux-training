import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BillingSupportPanel } from "./BillingSupportPanel";

describe("BillingSupportPanel", () => {
  it("renders empty billing and incidents states", () => {
    const markup = renderToStaticMarkup(
      <BillingSupportPanel
        screenId="web.billingOverview.screen"
        routeId="web.route.billingOverview"
        statusId="web.billingOverview.status"
        title="Billing + soporte"
        supportScreenId="web.supportIncidents.screen"
        supportRouteId="web.route.supportIncidents"
        supportStatusId="web.supportIncidents.status"
        loadDataLabel="Cargar billing/soporte"
        billingLoadDataActionId="web.billingOverview.loadData"
        supportLoadDataActionId="web.supportIncidents.loadData"
        onLoadData={vi.fn()}
        resolveSelectedLabel="Resolver incidencias seleccionadas"
        billingResolveSelectedActionId="web.billingOverview.resolveSelected"
        supportResolveSelectedActionId="web.supportIncidents.resolveSelected"
        onResolveSelected={vi.fn()}
        clearSelectionLabel="Limpiar seleccion"
        billingClearSelectionActionId="web.billingOverview.clearSelection"
        supportClearSelectionActionId="web.supportIncidents.clearSelection"
        onClearSelection={vi.fn()}
        clearFiltersLabel="Limpiar filtros billing"
        billingClearFiltersActionId="web.billingOverview.clearFilters"
        supportClearFiltersActionId="web.supportIncidents.clearFilters"
        onClearFilters={vi.fn()}
        searchPlaceholder="buscar factura o incidencia"
        searchValue=""
        onSearchChange={vi.fn()}
        domainPlaceholder="filtrar dominio incidencia"
        domainValue=""
        onDomainChange={vi.fn()}
        invoiceStatusFilterLabel="estado factura"
        invoiceStatusFilterValue="all"
        invoiceStatusOptions={[{ value: "all", label: "todos los estados" }]}
        onInvoiceStatusFilterChange={vi.fn()}
        incidentStateFilterLabel="estado incidencia"
        incidentStateFilterValue="all"
        incidentStateOptions={[{ value: "all", label: "todas las incidencias" }]}
        onIncidentStateFilterChange={vi.fn()}
        incidentSeverityFilterLabel="severidad incidencia"
        incidentSeverityFilterValue="all"
        incidentSeverityOptions={[{ value: "all", label: "todas las severidades" }]}
        onIncidentSeverityFilterChange={vi.fn()}
        invoicesLoadedLabel="Facturas cargadas"
        invoicesLoadedValue="0"
        incidentsLoadedLabel="Incidencias cargadas"
        incidentsLoadedValue="0"
        incidentsSelectedLabel="Incidencias seleccionadas"
        incidentsSelectedValue="0"
        invoicesSectionTitle="Resumen de facturacion"
        noInvoicesLabel="No hay facturas para este filtro."
        invoiceRowsInfoLabel="Filas visibles 0/0"
        invoiceRows={[]}
        invoiceIdColumnLabel="Factura"
        accountColumnLabel="Cuenta"
        periodColumnLabel="Periodo"
        amountColumnLabel="Importe"
        invoiceStatusColumnLabel="Estado"
        sourceColumnLabel="Origen"
        invoiceStatusHumanizer={(value) => value}
        invoiceSourceHumanizer={(value) => value}
        invoiceStatusClassName={() => "neutral"}
        hasMoreInvoiceRows={false}
        loadMoreRowsLabel="Cargar mas"
        onLoadMoreInvoiceRows={vi.fn()}
        showAllRowsLabel="Mostrar todo"
        onShowAllInvoiceRows={vi.fn()}
        incidentsSectionTitle="Incidencias de soporte"
        noIncidentsLabel="No hay incidencias para este filtro."
        incidentRowsInfoLabel="Filas visibles 0/0"
        incidentRows={[]}
        selectedIncidentIds={new Set()}
        onToggleIncidentSelection={vi.fn()}
        incidentIdColumnLabel="Incidencia"
        openedAtColumnLabel="Abierta"
        incidentDomainColumnLabel="Dominio"
        incidentSeverityColumnLabel="Severidad"
        incidentStateColumnLabel="Estado"
        incidentCorrelationColumnLabel="Correlacion"
        incidentSummaryColumnLabel="Resumen"
        incidentSeverityHumanizer={(value) => value}
        incidentStateHumanizer={(value) => value}
        incidentSeverityClassName={() => "neutral"}
        incidentStateClassName={() => "neutral"}
        hasMoreIncidentRows={false}
        onLoadMoreIncidentRows={vi.fn()}
        onShowAllIncidentRows={vi.fn()}
      />
    );

    expect(markup).toContain("Billing + soporte");
    expect(markup).toContain("No hay facturas para este filtro.");
    expect(markup).toContain("No hay incidencias para este filtro.");
    expect(markup).toContain("web.billingOverview.loadData");
    expect(markup).toContain("web.supportIncidents.loadData");
  });

  it("renders invoice and incident rows", () => {
    const markup = renderToStaticMarkup(
      <BillingSupportPanel
        screenId="web.billingOverview.screen"
        routeId="web.route.billingOverview"
        statusId="web.billingOverview.status"
        title="Billing + soporte"
        supportScreenId="web.supportIncidents.screen"
        supportRouteId="web.route.supportIncidents"
        supportStatusId="web.supportIncidents.status"
        loadDataLabel="Cargar billing/soporte"
        billingLoadDataActionId="web.billingOverview.loadData"
        supportLoadDataActionId="web.supportIncidents.loadData"
        onLoadData={vi.fn()}
        resolveSelectedLabel="Resolver incidencias seleccionadas"
        billingResolveSelectedActionId="web.billingOverview.resolveSelected"
        supportResolveSelectedActionId="web.supportIncidents.resolveSelected"
        onResolveSelected={vi.fn()}
        clearSelectionLabel="Limpiar seleccion"
        billingClearSelectionActionId="web.billingOverview.clearSelection"
        supportClearSelectionActionId="web.supportIncidents.clearSelection"
        onClearSelection={vi.fn()}
        clearFiltersLabel="Limpiar filtros billing"
        billingClearFiltersActionId="web.billingOverview.clearFilters"
        supportClearFiltersActionId="web.supportIncidents.clearFilters"
        onClearFilters={vi.fn()}
        searchPlaceholder="buscar factura o incidencia"
        searchValue="demo"
        onSearchChange={vi.fn()}
        domainPlaceholder="filtrar dominio incidencia"
        domainValue="operations"
        onDomainChange={vi.fn()}
        invoiceStatusFilterLabel="estado factura"
        invoiceStatusFilterValue="all"
        invoiceStatusOptions={[{ value: "all", label: "todos los estados" }]}
        onInvoiceStatusFilterChange={vi.fn()}
        incidentStateFilterLabel="estado incidencia"
        incidentStateFilterValue="all"
        incidentStateOptions={[{ value: "all", label: "todas las incidencias" }]}
        onIncidentStateFilterChange={vi.fn()}
        incidentSeverityFilterLabel="severidad incidencia"
        incidentSeverityFilterValue="all"
        incidentSeverityOptions={[{ value: "all", label: "todas las severidades" }]}
        onIncidentSeverityFilterChange={vi.fn()}
        invoicesLoadedLabel="Facturas cargadas"
        invoicesLoadedValue="1"
        incidentsLoadedLabel="Incidencias cargadas"
        incidentsLoadedValue="1"
        incidentsSelectedLabel="Incidencias seleccionadas"
        incidentsSelectedValue="1"
        invoicesSectionTitle="Resumen de facturacion"
        noInvoicesLabel="No hay facturas para este filtro."
        invoiceRowsInfoLabel="Filas visibles 1/1"
        invoiceRows={[
          {
            id: "INV-0001",
            accountId: "demo-user",
            period: "2026-03",
            amountEUR: 9,
            status: "overdue",
            source: "manual"
          }
        ]}
        invoiceIdColumnLabel="Factura"
        accountColumnLabel="Cuenta"
        periodColumnLabel="Periodo"
        amountColumnLabel="Importe"
        invoiceStatusColumnLabel="Estado"
        sourceColumnLabel="Origen"
        invoiceStatusHumanizer={(value) => value}
        invoiceSourceHumanizer={(value) => value}
        invoiceStatusClassName={() => "warning"}
        hasMoreInvoiceRows={false}
        loadMoreRowsLabel="Cargar mas"
        onLoadMoreInvoiceRows={vi.fn()}
        showAllRowsLabel="Mostrar todo"
        onShowAllInvoiceRows={vi.fn()}
        incidentsSectionTitle="Incidencias de soporte"
        noIncidentsLabel="No hay incidencias para este filtro."
        incidentRowsInfoLabel="Filas visibles 1/1"
        incidentRows={[
          {
            id: "INC-1",
            openedAt: "2026-03-06T18:00:00Z",
            domain: "operations",
            severity: "high",
            state: "open",
            summary: "runtime blocked",
            source: "analytics",
            correlationId: "corr-1"
          }
        ]}
        selectedIncidentIds={new Set(["INC-1"])}
        onToggleIncidentSelection={vi.fn()}
        incidentIdColumnLabel="Incidencia"
        openedAtColumnLabel="Abierta"
        incidentDomainColumnLabel="Dominio"
        incidentSeverityColumnLabel="Severidad"
        incidentStateColumnLabel="Estado"
        incidentCorrelationColumnLabel="Correlacion"
        incidentSummaryColumnLabel="Resumen"
        incidentSeverityHumanizer={(value) => value}
        incidentStateHumanizer={(value) => value}
        incidentSeverityClassName={() => "warning"}
        incidentStateClassName={() => "danger"}
        hasMoreIncidentRows={false}
        onLoadMoreIncidentRows={vi.fn()}
        onShowAllIncidentRows={vi.fn()}
      />
    );

    expect(markup).toContain("INV-0001");
    expect(markup).toContain("demo-user");
    expect(markup).toContain("status-pill status-warning");
    expect(markup).toContain("INC-1");
    expect(markup).toContain("corr-1");
    expect(markup).toContain("runtime blocked");
    expect(markup).toContain("checked");
  });
});
