import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AuditTrailPanel } from "./AuditTrailPanel";

describe("AuditTrailPanel", () => {
  it("renders empty audit state and actions", () => {
    const markup = renderToStaticMarkup(
      <AuditTrailPanel
        screenId="web.auditTrail.screen"
        routeId="web.route.auditTrail"
        statusId="web.auditTrail.status"
        title="Audit + compliance"
        loadTimelineLabel="Cargar timeline audit"
        loadTimelineActionId="web.auditTrail.loadTimeline"
        onLoadTimeline={vi.fn()}
        exportCsvLabel="Exportar CSV audit"
        exportCsvActionId="web.auditTrail.exportCsv"
        onExportCsv={vi.fn()}
        exportForensicLabel="Exportar forense"
        exportForensicActionId="web.auditTrail.exportForensic"
        onExportForensic={vi.fn()}
        clearFiltersLabel="Limpiar filtros audit"
        clearFiltersActionId="web.auditTrail.clearFilters"
        onClearFilters={vi.fn()}
        searchPlaceholder="buscar evento audit"
        searchValue=""
        onSearchChange={vi.fn()}
        domainPlaceholder="filtrar dominio audit"
        domainValue=""
        onDomainChange={vi.fn()}
        sourceFilterLabel="fuente audit"
        sourceFilterValue="all"
        sourceOptions={[{ value: "all", label: "todas las fuentes" }]}
        onSourceFilterChange={vi.fn()}
        categoryFilterLabel="categoria audit"
        categoryFilterValue="all"
        categoryOptions={[{ value: "all", label: "todas las categorias" }]}
        onCategoryFilterChange={vi.fn()}
        severityFilterLabel="severidad audit"
        severityFilterValue="all"
        severityOptions={[{ value: "all", label: "todas las severidades" }]}
        onSeverityFilterChange={vi.fn()}
        rowsLoadedLabel="Filas audit cargadas"
        rowsLoadedValue="0"
        rowsFilteredLabel="Filas audit filtradas"
        rowsFilteredValue="0"
        structuredLogsLabel="Logs estructurados"
        structuredLogsValue="0"
        activityLogLabel="Entradas activity log"
        activityLogValue="0"
        forensicStatusLabel="Estado export forense"
        forensicStatusValue="-"
        emptyLabel="No hay filas de audit para este filtro."
        rowsInfoLabel="Filas visibles 0/0"
        rows={[]}
        occurredAtLabel="Fecha"
        sourceLabel="Fuente"
        categoryLabel="Categoria"
        severityLabel="Severidad"
        nameLabel="Nombre"
        domainLabel="Dominio"
        correlationLabel="Correlacion"
        summaryLabel="Resumen"
        severityHumanizer={(value) => value}
        severityClassName={() => "neutral"}
        hasMoreRows={false}
        loadMoreRowsLabel="Cargar mas"
        onLoadMoreRows={vi.fn()}
        showAllRowsLabel="Mostrar todo"
        onShowAllRows={vi.fn()}
      />
    );

    expect(markup).toContain("Audit + compliance");
    expect(markup).toContain("No hay filas de audit para este filtro.");
    expect(markup).toContain("web.auditTrail.loadTimeline");
    expect(markup).toContain("web.auditTrail.exportCsv");
  });

  it("renders audit rows and severity pill", () => {
    const markup = renderToStaticMarkup(
      <AuditTrailPanel
        screenId="web.auditTrail.screen"
        routeId="web.route.auditTrail"
        statusId="web.auditTrail.status"
        title="Audit + compliance"
        loadTimelineLabel="Cargar timeline audit"
        loadTimelineActionId="web.auditTrail.loadTimeline"
        onLoadTimeline={vi.fn()}
        exportCsvLabel="Exportar CSV audit"
        exportCsvActionId="web.auditTrail.exportCsv"
        onExportCsv={vi.fn()}
        exportForensicLabel="Exportar forense"
        exportForensicActionId="web.auditTrail.exportForensic"
        onExportForensic={vi.fn()}
        clearFiltersLabel="Limpiar filtros audit"
        clearFiltersActionId="web.auditTrail.clearFilters"
        onClearFilters={vi.fn()}
        searchPlaceholder="buscar evento audit"
        searchValue="login"
        onSearchChange={vi.fn()}
        domainPlaceholder="filtrar dominio audit"
        domainValue="auth"
        onDomainChange={vi.fn()}
        sourceFilterLabel="fuente audit"
        sourceFilterValue="all"
        sourceOptions={[{ value: "all", label: "todas las fuentes" }]}
        onSourceFilterChange={vi.fn()}
        categoryFilterLabel="categoria audit"
        categoryFilterValue="all"
        categoryOptions={[{ value: "all", label: "todas las categorias" }]}
        onCategoryFilterChange={vi.fn()}
        severityFilterLabel="severidad audit"
        severityFilterValue="all"
        severityOptions={[{ value: "all", label: "todas las severidades" }]}
        onSeverityFilterChange={vi.fn()}
        rowsLoadedLabel="Filas audit cargadas"
        rowsLoadedValue="1"
        rowsFilteredLabel="Filas audit filtradas"
        rowsFilteredValue="1"
        structuredLogsLabel="Logs estructurados"
        structuredLogsValue="1"
        activityLogLabel="Entradas activity log"
        activityLogValue="1"
        forensicStatusLabel="Estado export forense"
        forensicStatusValue="guardado"
        emptyLabel="No hay filas de audit para este filtro."
        rowsInfoLabel="Filas visibles 1/1"
        rows={[
          {
            id: "audit-1",
            occurredAt: "2026-03-06T18:00:00Z",
            source: "web",
            category: "analytics",
            severity: "warning",
            name: "login_failed",
            domain: "auth",
            correlationId: "corr-1",
            summary: "bad credentials"
          }
        ]}
        occurredAtLabel="Fecha"
        sourceLabel="Fuente"
        categoryLabel="Categoria"
        severityLabel="Severidad"
        nameLabel="Nombre"
        domainLabel="Dominio"
        correlationLabel="Correlacion"
        summaryLabel="Resumen"
        severityHumanizer={(value) => value}
        severityClassName={() => "warning"}
        hasMoreRows={false}
        loadMoreRowsLabel="Cargar mas"
        onLoadMoreRows={vi.fn()}
        showAllRowsLabel="Mostrar todo"
        onShowAllRows={vi.fn()}
      />
    );

    expect(markup).toContain("Filas visibles 1/1");
    expect(markup).toContain("login_failed");
    expect(markup).toContain("corr-1");
    expect(markup).toContain("bad credentials");
    expect(markup).toContain("status-pill status-warning");
  });
});
