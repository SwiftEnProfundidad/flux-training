import { describe, expect, it } from "vitest";
import { createTranslator, humanizeStatus, resolveLanguage } from "./i18n";

describe("i18n", () => {
  it("uses spanish as base language", () => {
    const translate = createTranslator("es");
    expect(translate("heroTitle")).toBe("Entrena con foco y seguimiento real");
    expect(translate("trainingSectionTitle")).toBe("Entrenamiento");
  });

  it("supports english language", () => {
    const translate = createTranslator("en");
    expect(translate("heroTitle")).toBe("Train with focus and real tracking");
    expect(translate("trainingSectionTitle")).toBe("Training");
    expect(translate("domainFilterLabel")).toBe("Domain");
    expect(translate("roleLabel")).toBe("Role");
    expect(translate("roleAthlete")).toBe("Athlete");
    expect(translate("roleCoach")).toBe("Coach");
    expect(translate("roleAdmin")).toBe("Admin");
    expect(translate("recoverByEmail")).toBe("Recover by email");
    expect(translate("recoverBySMS")).toBe("Recover by SMS");
    expect(translate("retryRoleCapabilities")).toBe("Retry capabilities");
    expect(translate("dashboardHomeTitle")).toBe("Dashboard home");
    expect(translate("dashboardHomeStatusLabel")).toBe("Dashboard");
    expect(translate("dashboardHomeVisibleModulesLabel")).toBe("Visible modules");
    expect(translate("dashboardHomeActiveDomainLabel")).toBe("Active domain");
    expect(translate("dashboardHomeRefreshAction")).toBe("Refresh dashboard");
    expect(translate("operationsHubTitle")).toBe("Core operations");
    expect(translate("bulkAssignStarterPlan")).toBe("Assign starter plan");
    expect(translate("rowsShownLabel")).toBe("Visible rows");
    expect(translate("loadMoreRows")).toBe("Load more rows");
    expect(translate("showAllRows")).toBe("Show all");
    expect(translate("athleteColumn")).toBe("Athlete");
    expect(translate("governanceTitle")).toBe("Users + roles + RBAC");
    expect(translate("governanceLoadCapabilities")).toBe("Load RBAC matrix");
    expect(translate("governancePrincipalColumn")).toBe("User");
    expect(translate("auditTitle")).toBe("Audit + compliance");
    expect(translate("auditLoadTimeline")).toBe("Load audit timeline");
    expect(translate("auditExportForensic")).toBe("Export forensic audit");
    expect(translate("auditClearFilters")).toBe("Clear audit filters");
    expect(translate("auditSummaryColumn")).toBe("Summary");
    expect(translate("auditStructuredLogsLabel")).toBe("Structured logs");
    expect(translate("auditActivityLogLabel")).toBe("Activity log entries");
    expect(translate("auditForensicStatusLabel")).toBe("Forensic export status");
    expect(translate("billingSupportTitle")).toBe("Billing + support");
    expect(translate("billingSupportLoadData")).toBe("Load billing/support");
    expect(translate("billingSupportClearSelection")).toBe("Clear incident selection");
    expect(translate("billingInvoiceStatusFilterLabel")).toBe("invoice status");
    expect(translate("billingIncidentsSectionTitle")).toBe("Support incidents");
    expect(translate("billingIncidentStateResolved")).toBe("resolved");
    expect(translate("idempotencyKeyLabel")).toBe("Idempotency key");
    expect(translate("idempotencyReplayLabel")).toBe("Idempotency replay");
    expect(translate("idempotencyReplayYes")).toBe("yes");
    expect(translate("idempotencyReplayNo")).toBe("no");
    expect(translate("idempotencyTTLLabel")).toBe("Idempotency TTL");
    expect(translate("observabilityOperationalAlertsLabel")).toBe("Open operational alerts");
    expect(translate("observabilityRunbooksLabel")).toBe("Active runbooks");
    expect(translate("observabilityOnCallOwnerLabel")).toBe("On-call owner");
    expect(translate("nutritionFiltersLabel")).toBe("Nutrition filters");
    expect(translate("progressFiltersLabel")).toBe("Progress filters");
    expect(translate("effortMetric")).toBe("Effort");
    expect(translate("noNutritionFilteredLogs")).toBe("No nutrition logs match this filter.");
    expect(translate("noProgressFilteredHistory")).toBe("No history matches this filter.");
    expect(translate("domainOperations")).toBe("Operations");
    expect(translate("settingsTitle")).toBe("Settings");
    expect(translate("legalSectionTitle")).toBe("Privacy and consent");
    expect(translate("goalPickerLabel")).toBe("goal");
    expect(translate("exercisePickerLabel")).toBe("exercise");
    expect(translate("videoLocalePickerLabel")).toBe("video language");
    expect(translate("runtimeStateSectionTitle")).toBe("Enterprise runtime state by domain");
    expect(translate("runtimeStateModeLabel")).toBe("Runtime mode");
    expect(translate("runtimeStateRecoveryAction")).toBe("Recover domain");
    expect(translate("noModulesForSelectedDomain")).toBe(
      "No modules are available for the selected domain."
    );
  });

  it("exposes domain filter translations in spanish", () => {
    const translate = createTranslator("es");
    expect(translate("domainFilterLabel")).toBe("Dominio");
    expect(translate("roleLabel")).toBe("Rol");
    expect(translate("roleAthlete")).toBe("Atleta");
    expect(translate("roleCoach")).toBe("Coach");
    expect(translate("roleAdmin")).toBe("Admin");
    expect(translate("recoverByEmail")).toBe("Recuperar por email");
    expect(translate("recoverBySMS")).toBe("Recuperar por SMS");
    expect(translate("retryRoleCapabilities")).toBe("Reintentar capacidades");
    expect(translate("dashboardHomeTitle")).toBe("Dashboard home");
    expect(translate("dashboardHomeStatusLabel")).toBe("Dashboard");
    expect(translate("dashboardHomeVisibleModulesLabel")).toBe("Modulos visibles");
    expect(translate("dashboardHomeActiveDomainLabel")).toBe("Dominio activo");
    expect(translate("dashboardHomeRefreshAction")).toBe("Refrescar dashboard");
    expect(translate("operationsHubTitle")).toBe("Operaciones core");
    expect(translate("bulkAssignStarterPlan")).toBe("Asignar starter plan");
    expect(translate("rowsShownLabel")).toBe("Filas visibles");
    expect(translate("loadMoreRows")).toBe("Cargar mas filas");
    expect(translate("showAllRows")).toBe("Ver todas");
    expect(translate("athleteColumn")).toBe("Atleta");
    expect(translate("governanceTitle")).toBe("Usuarios + roles + RBAC");
    expect(translate("governanceLoadCapabilities")).toBe("Cargar matriz RBAC");
    expect(translate("governancePrincipalColumn")).toBe("Usuario");
    expect(translate("auditTitle")).toBe("Audit + compliance");
    expect(translate("auditLoadTimeline")).toBe("Cargar timeline audit");
    expect(translate("auditExportForensic")).toBe("Exportar forense");
    expect(translate("auditClearFilters")).toBe("Limpiar filtros audit");
    expect(translate("auditSummaryColumn")).toBe("Resumen");
    expect(translate("auditStructuredLogsLabel")).toBe("Logs estructurados");
    expect(translate("auditActivityLogLabel")).toBe("Entradas activity log");
    expect(translate("auditForensicStatusLabel")).toBe("Estado export forense");
    expect(translate("billingSupportTitle")).toBe("Billing + soporte");
    expect(translate("billingSupportLoadData")).toBe("Cargar billing/soporte");
    expect(translate("billingSupportClearSelection")).toBe("Limpiar seleccion incidencias");
    expect(translate("billingInvoiceStatusFilterLabel")).toBe("estado factura");
    expect(translate("billingIncidentsSectionTitle")).toBe("Incidencias de soporte");
    expect(translate("billingIncidentStateResolved")).toBe("resuelta");
    expect(translate("idempotencyKeyLabel")).toBe("Clave idempotencia");
    expect(translate("idempotencyReplayLabel")).toBe("Replay idempotente");
    expect(translate("idempotencyReplayYes")).toBe("si");
    expect(translate("idempotencyReplayNo")).toBe("no");
    expect(translate("idempotencyTTLLabel")).toBe("TTL idempotencia");
    expect(translate("observabilityOperationalAlertsLabel")).toBe("Alertas operativas abiertas");
    expect(translate("observabilityRunbooksLabel")).toBe("Runbooks activos");
    expect(translate("observabilityOnCallOwnerLabel")).toBe("Owner on-call");
    expect(translate("nutritionFiltersLabel")).toBe("Filtros de nutricion");
    expect(translate("progressFiltersLabel")).toBe("Filtros de progreso");
    expect(translate("effortMetric")).toBe("Esfuerzo");
    expect(translate("noNutritionFilteredLogs")).toBe(
      "No hay registros nutricionales para este filtro."
    );
    expect(translate("noProgressFilteredHistory")).toBe("No hay historial para este filtro.");
    expect(translate("domainAll")).toBe("Todo");
    expect(translate("domainTraining")).toBe("Entrenamiento");
    expect(translate("domainOperations")).toBe("Operaciones");
    expect(translate("settingsTitle")).toBe("Ajustes");
    expect(translate("legalSectionTitle")).toBe("Privacidad y consentimiento");
    expect(translate("goalPickerLabel")).toBe("objetivo");
    expect(translate("exercisePickerLabel")).toBe("ejercicio");
    expect(translate("videoLocalePickerLabel")).toBe("idioma del video");
    expect(translate("runtimeStateSectionTitle")).toBe("Estado enterprise por dominio");
    expect(translate("runtimeStateModeLabel")).toBe("Modo runtime");
    expect(translate("runtimeStateRecoveryAction")).toBe("Recuperar dominio");
    expect(translate("noModulesForSelectedDomain")).toBe(
      "No hay modulos para el dominio seleccionado."
    );
  });

  it("resolves preferred language from locale", () => {
    expect(resolveLanguage("es-ES")).toBe("es");
    expect(resolveLanguage("en-GB")).toBe("en");
    expect(resolveLanguage("fr-FR")).toBe("es");
  });

  it("humanizes statuses in both languages", () => {
    expect(humanizeStatus("signed_out", "es")).toBe("sin sesion");
    expect(humanizeStatus("signed_out", "en")).toBe("signed out");
    expect(humanizeStatus("upgrade_required", "es")).toBe("actualizacion requerida");
    expect(humanizeStatus("upgrade_required", "en")).toBe("upgrade required");
    expect(humanizeStatus("validation_error", "es")).toBe("error de validacion");
    expect(humanizeStatus("validation_error", "en")).toBe("validation error");
    expect(humanizeStatus("consent_required", "es")).toBe("consentimiento requerido");
    expect(humanizeStatus("consent_required", "en")).toBe("consent required");
    expect(humanizeStatus("recovery_sent_email", "es")).toBe("recuperacion enviada por email");
    expect(humanizeStatus("recovery_sent_email", "en")).toBe("recovery sent by email");
    expect(humanizeStatus("recovery_sent_sms", "es")).toBe("recuperacion enviada por sms");
    expect(humanizeStatus("recovery_sent_sms", "en")).toBe("recovery sent by sms");
    expect(humanizeStatus("exported", "es")).toBe("exportado");
    expect(humanizeStatus("exported", "en")).toBe("exported");
    expect(humanizeStatus("deletion_requested", "es")).toBe("borrado solicitado");
    expect(humanizeStatus("deletion_requested", "en")).toBe("deletion requested");
    expect(humanizeStatus("loading", "es")).toBe("cargando");
    expect(humanizeStatus("loading", "en")).toBe("loading");
    expect(humanizeStatus("offline", "es")).toBe("sin conexion");
    expect(humanizeStatus("offline", "en")).toBe("offline");
    expect(humanizeStatus("denied", "es")).toBe("sin permiso");
    expect(humanizeStatus("denied", "en")).toBe("denied");
  });
});
