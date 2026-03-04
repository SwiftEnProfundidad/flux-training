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
    expect(translate("laneLabel")).toBe("Lane");
    expect(translate("laneMain")).toBe("Main");
    expect(translate("laneSecondary")).toBe("Secondary");
    expect(translate("recoverByEmail")).toBe("Recover by email");
    expect(translate("recoverBySMS")).toBe("Recover by SMS");
    expect(translate("retryRoleCapabilities")).toBe("Retry capabilities");
    expect(translate("dashboardHomeTitle")).toBe("Dashboard home");
    expect(translate("dashboardHomeStatusLabel")).toBe("Dashboard");
    expect(translate("dashboardHomeVisibleModulesLabel")).toBe("Visible modules");
    expect(translate("dashboardHomeActiveDomainLabel")).toBe("Active domain");
    expect(translate("dashboardHomeRefreshAction")).toBe("Refresh dashboard");
    expect(translate("quickActionsTitle")).toBe("Quick actions");
    expect(translate("quickActionsStatusLabel")).toBe("Quick actions");
    expect(translate("quickActionsRunAll")).toBe("Run quick actions");
    expect(translate("alertCenterTitle")).toBe("Alert center");
    expect(translate("alertCenterStatusLabel")).toBe("Alerts");
    expect(translate("alertCenterLoadAction")).toBe("Load alerts");
    expect(translate("alertCenterAuditAction")).toBe("Open audit");
    expect(translate("alertCenterOpenCountLabel")).toBe("Open alerts");
    expect(translate("alertCenterHighSeverityLabel")).toBe("Critical severity");
    expect(translate("alertCenterRunbooksLabel")).toBe("Active runbooks");
    expect(translate("alertCenterNoAlerts")).toBe("No operational alerts are open.");
    expect(translate("systemStatusTitle")).toBe("System status");
    expect(translate("systemStatusStatusLabel")).toBe("System");
    expect(translate("systemStatusRuntimeLabel")).toBe("Runtime");
    expect(translate("systemStatusReleaseLabel")).toBe("Release");
    expect(translate("systemStatusRoleMatrixLabel")).toBe("Role matrix");
    expect(translate("systemStatusQueueLabel")).toBe("Pending queue");
    expect(translate("dashboardKpisTitle")).toBe("Dashboard KPIs");
    expect(translate("dashboardKpisStatusLabel")).toBe("KPIs");
    expect(translate("dashboardKpisRefreshAction")).toBe("Refresh KPIs");
    expect(translate("readinessMonitorTitle")).toBe("Readiness monitor");
    expect(translate("readinessMonitorStatusLabel")).toBe("Readiness");
    expect(translate("readinessMonitorScoreLabel")).toBe("Score");
    expect(translate("readinessMonitorRefreshAction")).toBe("Refresh readiness");
    expect(translate("alertsFullTitle")).toBe("Alerts full");
    expect(translate("alertsFullStatusLabel")).toBe("Alerts full");
    expect(translate("alertsFullRefreshAction")).toBe("Refresh alerts full");
    expect(translate("alertsFullAuditAction")).toBe("View audit timeline");
    expect(translate("alertsFullNoAlerts")).toBe("No open alerts for this domain.");
    expect(translate("alertsFullCodeLabel")).toBe("Code");
    expect(translate("alertsFullRunbookLabel")).toBe("Runbook");
    expect(translate("recentActivityTitle")).toBe("Recent activity");
    expect(translate("recentActivityStatusLabel")).toBe("Activity");
    expect(translate("recentActivityRefreshAction")).toBe("Refresh activity");
    expect(translate("recentActivityNoEntries")).toBe("No recent activity for this domain.");
    expect(translate("recentActivityOutcomeLabel")).toBe("Outcome");
    expect(translate("recentActivityDeniedLabel")).toBe("Denied");
    expect(translate("recentActivityErrorLabel")).toBe("Errors");
    expect(translate("shortcutsTitle")).toBe("Shortcuts");
    expect(translate("shortcutsStatusLabel")).toBe("Shortcuts");
    expect(translate("shortcutsRunAction")).toBe("Run shortcuts");
    expect(translate("shortcutsRefreshAction")).toBe("Refresh shortcuts");
    expect(translate("shortcutsRecoverAction")).toBe("Recover domain");
    expect(translate("shortcutsVisibleModulesLabel")).toBe("Visible modules");
    expect(translate("shortcutsNoItems")).toBe("No shortcuts are available for this domain.");
    expect(translate("cohortAnalysisTitle")).toBe("Cohort analysis");
    expect(translate("cohortAnalysisStatusLabel")).toBe("Cohorts");
    expect(translate("cohortAnalysisRefreshAction")).toBe("Refresh cohorts");
    expect(translate("cohortAnalysisNoRows")).toBe(
      "No cohorts are available with the current data."
    );
    expect(translate("cohortAnalysisSizeLabel")).toBe("Cohort size");
    expect(translate("cohortAnalysisAttentionLabel")).toBe("Attention");
    expect(translate("cohortAnalysisNormalLabel")).toBe("Normal");
    expect(translate("cohortAnalysisAvgSessionsLabel")).toBe("Avg sessions");
    expect(translate("operationsHubTitle")).toBe("Core operations");
    expect(translate("planBuilderTitle")).toBe("Plan builder");
    expect(translate("planBuilderStatusLabel")).toBe("Builder");
    expect(translate("planBuilderWeeksLabel")).toBe("weeks");
    expect(translate("planBuilderDaysLabel")).toBe("days per week");
    expect(translate("planBuilderTemplateLabel")).toBe("template");
    expect(translate("planBuilderTemplateStrength")).toBe("strength");
    expect(translate("planBuilderTemplateHypertrophy")).toBe("hypertrophy");
    expect(translate("planBuilderTemplateRecomposition")).toBe("recomposition");
    expect(translate("planBuilderPreviewTitle")).toBe("Plan preview");
    expect(translate("planBuilderPreviewDaysLabel")).toBe("configured days");
    expect(translate("planBuilderPreviewExercisesLabel")).toBe("exercises per day");
    expect(translate("planBuilderInvalidConfiguration")).toBe(
      "Invalid configuration: review weeks and days."
    );
    expect(translate("planAssignmentTitle")).toBe("Plan assignment");
    expect(translate("planAssignmentStatusLabel")).toBe("Assignment");
    expect(translate("planAssignmentPlanLabel")).toBe("Active plan");
    expect(translate("planAssignmentSelectedAthletesLabel")).toBe("Selected athletes");
    expect(translate("planAssignmentAtRiskAthletesLabel")).toBe("At-risk athletes");
    expect(translate("planAssignmentAssignSelectedAction")).toBe("Assign to selected");
    expect(translate("planAssignmentAssignAtRiskAction")).toBe("Assign to at-risk");
    expect(translate("planAssignmentClearAction")).toBe("Clear selection");
    expect(translate("planAssignmentNoSelection")).toBe(
      "Select athletes in operations to enable assignment."
    );
    expect(translate("planAssignmentSelectedListTitle")).toBe("Target athletes");
    expect(translate("planAssignmentAssignedSuffix")).toBe("assigned");
    expect(translate("plansLoadedLabel")).toBe("Plans loaded");
    expect(translate("noPlansLoaded")).toBe("No plans loaded yet.");
    expect(translate("sessionDetailTitle")).toBe("Session detail");
    expect(translate("sessionDetailStatusLabel")).toBe("Detail");
    expect(translate("sessionDetailSelectLabel")).toBe("select session");
    expect(translate("sessionDetailClearAction")).toBe("Clear session");
    expect(translate("sessionDetailOpenVideoAction")).toBe("Open exercise video");
    expect(translate("sessionDetailPlanLabel")).toBe("plan");
    expect(translate("sessionDetailStartedLabel")).toBe("start");
    expect(translate("sessionDetailEndedLabel")).toBe("end");
    expect(translate("sessionDetailDurationLabel")).toBe("duration");
    expect(translate("sessionDetailExerciseCountLabel")).toBe("exercises");
    expect(translate("sessionDetailNoSelection")).toBe(
      "No session selected to display details."
    );
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
    expect(translate("deviationAlertsTitle")).toBe("Deviation alerts");
    expect(translate("deviationAlertsStatusLabel")).toBe("Deviations");
    expect(translate("deviationAlertsLoadAction")).toBe("Evaluate deviations");
    expect(translate("deviationAlertsClearAction")).toBe("Reset filters");
    expect(translate("deviationAlertsHighRiskLabel")).toBe("High risk");
    expect(translate("deviationAlertsModerateRiskLabel")).toBe("Moderate risk");
    expect(translate("deviationAlertsReasonCalories")).toBe("Calories out of target range");
    expect(translate("deviationAlertsReasonProtein")).toBe("Protein below target");
    expect(translate("deviationAlertsNoData")).toBe(
      "No nutrition deviations detected for this filter."
    );
    expect(translate("nutritionCoachViewTitle")).toBe("Nutrition coach view");
    expect(translate("nutritionCoachViewStatusLabel")).toBe("Coach");
    expect(translate("nutritionCoachViewLoadAction")).toBe("Load cohort");
    expect(translate("nutritionCoachViewFocusAction")).toBe("Focus at risk");
    expect(translate("nutritionCoachViewOpenOperationsAction")).toBe("Open operations");
    expect(translate("nutritionCoachViewNoRows")).toBe(
      "No athletes available for coach view with current data."
    );
    expect(translate("nutritionCoachViewAtRiskLabel")).toBe("Athletes at risk");
    expect(translate("cohortNutritionTitle")).toBe("Cohort nutrition");
    expect(translate("cohortNutritionStatusLabel")).toBe("Cohort");
    expect(translate("cohortNutritionLoadAction")).toBe("Load nutrition cohort");
    expect(translate("cohortNutritionFocusAction")).toBe("Focus highest risk");
    expect(translate("cohortNutritionNoRows")).toBe(
      "No nutrition cohort available for this filter."
    );
    expect(translate("cohortNutritionLogsLabel")).toBe("logs");
    expect(translate("cohortNutritionAvgCaloriesLabel")).toBe("avg kcal");
    expect(translate("cohortNutritionAvgProteinLabel")).toBe("avg protein");
    expect(translate("logDetailTitle")).toBe("Nutrition log detail");
    expect(translate("logDetailStatusLabel")).toBe("Detail");
    expect(translate("logDetailLoadAction")).toBe("Refresh detail");
    expect(translate("logDetailClearAction")).toBe("Clear selection");
    expect(translate("logDetailOpenCoachAction")).toBe("Open coach view");
    expect(translate("logDetailSelectPlaceholder")).toBe("select log");
    expect(translate("logDetailSelectedDateLabel")).toBe("selected date");
    expect(translate("logDetailSelectedAthleteLabel")).toBe("selected athlete");
    expect(translate("logDetailNoSelection")).toBe(
      "No nutrition log selected to display details."
    );
    expect(translate("progressFiltersLabel")).toBe("Progress filters");
    expect(translate("progressTrendsTitle")).toBe("Progress trends");
    expect(translate("progressTrendsStatusLabel")).toBe("Trends");
    expect(translate("progressTrendsRefreshAction")).toBe("Refresh trends");
    expect(translate("progressTrendsNoData")).toBe("No progress data available to show trends.");
    expect(translate("aiInsightsTitle")).toBe("AI insights");
    expect(translate("aiInsightsStatusLabel")).toBe("Insights");
    expect(translate("aiInsightsLoadAction")).toBe("Load AI insights");
    expect(translate("effortMetric")).toBe("Effort");
    expect(translate("noNutritionFilteredLogs")).toBe("No nutrition logs match this filter.");
    expect(translate("noProgressFilteredHistory")).toBe("No history matches this filter.");
    expect(translate("domainOperations")).toBe("Operations");
    expect(translate("settingsTitle")).toBe("Settings");
    expect(translate("legalSectionTitle")).toBe("Privacy and consent");
    expect(translate("goalPickerLabel")).toBe("goal");
    expect(translate("exercisePickerLabel")).toBe("exercise");
    expect(translate("videoLocalePickerLabel")).toBe("video language");
    expect(translate("exerciseDetailTitle")).toBe("Exercise detail");
    expect(translate("exerciseDetailStatusLabel")).toBe("Detail");
    expect(translate("exerciseDetailLoadAction")).toBe("Refresh detail");
    expect(translate("exerciseDetailOpenAction")).toBe("Open video");
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
    expect(translate("laneLabel")).toBe("Lane");
    expect(translate("laneMain")).toBe("Main");
    expect(translate("laneSecondary")).toBe("Secondary");
    expect(translate("recoverByEmail")).toBe("Recuperar por email");
    expect(translate("recoverBySMS")).toBe("Recuperar por SMS");
    expect(translate("retryRoleCapabilities")).toBe("Reintentar capacidades");
    expect(translate("dashboardHomeTitle")).toBe("Dashboard home");
    expect(translate("dashboardHomeStatusLabel")).toBe("Dashboard");
    expect(translate("dashboardHomeVisibleModulesLabel")).toBe("Modulos visibles");
    expect(translate("dashboardHomeActiveDomainLabel")).toBe("Dominio activo");
    expect(translate("dashboardHomeRefreshAction")).toBe("Refrescar dashboard");
    expect(translate("quickActionsTitle")).toBe("Acciones rapidas");
    expect(translate("quickActionsStatusLabel")).toBe("Quick actions");
    expect(translate("quickActionsRunAll")).toBe("Ejecutar acciones rapidas");
    expect(translate("alertCenterTitle")).toBe("Centro de alertas");
    expect(translate("alertCenterStatusLabel")).toBe("Alertas");
    expect(translate("alertCenterLoadAction")).toBe("Cargar alertas");
    expect(translate("alertCenterAuditAction")).toBe("Abrir audit");
    expect(translate("alertCenterOpenCountLabel")).toBe("Alertas abiertas");
    expect(translate("alertCenterHighSeverityLabel")).toBe("Severidad critica");
    expect(translate("alertCenterRunbooksLabel")).toBe("Runbooks activos");
    expect(translate("alertCenterNoAlerts")).toBe("No hay alertas operativas abiertas.");
    expect(translate("systemStatusTitle")).toBe("Estado del sistema");
    expect(translate("systemStatusStatusLabel")).toBe("Sistema");
    expect(translate("systemStatusRuntimeLabel")).toBe("Runtime");
    expect(translate("systemStatusReleaseLabel")).toBe("Release");
    expect(translate("systemStatusRoleMatrixLabel")).toBe("Matriz de roles");
    expect(translate("systemStatusQueueLabel")).toBe("Cola pendiente");
    expect(translate("dashboardKpisTitle")).toBe("Dashboard KPIs");
    expect(translate("dashboardKpisStatusLabel")).toBe("KPIs");
    expect(translate("dashboardKpisRefreshAction")).toBe("Refrescar KPIs");
    expect(translate("readinessMonitorTitle")).toBe("Readiness monitor");
    expect(translate("readinessMonitorStatusLabel")).toBe("Readiness");
    expect(translate("readinessMonitorScoreLabel")).toBe("Score");
    expect(translate("readinessMonitorRefreshAction")).toBe("Refrescar readiness");
    expect(translate("alertsFullTitle")).toBe("Alerts full");
    expect(translate("alertsFullStatusLabel")).toBe("Alerts full");
    expect(translate("alertsFullRefreshAction")).toBe("Refrescar alerts full");
    expect(translate("alertsFullAuditAction")).toBe("Ver timeline audit");
    expect(translate("alertsFullNoAlerts")).toBe("No hay alertas abiertas para este dominio.");
    expect(translate("alertsFullCodeLabel")).toBe("Codigo");
    expect(translate("alertsFullRunbookLabel")).toBe("Runbook");
    expect(translate("recentActivityTitle")).toBe("Actividad reciente");
    expect(translate("recentActivityStatusLabel")).toBe("Actividad");
    expect(translate("recentActivityRefreshAction")).toBe("Refrescar actividad");
    expect(translate("recentActivityNoEntries")).toBe("No hay actividad reciente para este dominio.");
    expect(translate("recentActivityOutcomeLabel")).toBe("Resultado");
    expect(translate("recentActivityDeniedLabel")).toBe("Denegadas");
    expect(translate("recentActivityErrorLabel")).toBe("Errores");
    expect(translate("shortcutsTitle")).toBe("Shortcuts");
    expect(translate("shortcutsStatusLabel")).toBe("Shortcuts");
    expect(translate("shortcutsRunAction")).toBe("Ejecutar shortcuts");
    expect(translate("shortcutsRefreshAction")).toBe("Refrescar shortcuts");
    expect(translate("shortcutsRecoverAction")).toBe("Recuperar dominio");
    expect(translate("shortcutsVisibleModulesLabel")).toBe("Modulos visibles");
    expect(translate("shortcutsNoItems")).toBe("No hay shortcuts disponibles para este dominio.");
    expect(translate("cohortAnalysisTitle")).toBe("Analisis de cohortes");
    expect(translate("cohortAnalysisStatusLabel")).toBe("Cohortes");
    expect(translate("cohortAnalysisRefreshAction")).toBe("Refrescar cohortes");
    expect(translate("cohortAnalysisNoRows")).toBe(
      "No hay cohortes disponibles con los datos actuales."
    );
    expect(translate("cohortAnalysisSizeLabel")).toBe("Tamano cohorte");
    expect(translate("cohortAnalysisAttentionLabel")).toBe("Atencion");
    expect(translate("cohortAnalysisNormalLabel")).toBe("Normal");
    expect(translate("cohortAnalysisAvgSessionsLabel")).toBe("Media sesiones");
    expect(translate("operationsHubTitle")).toBe("Operaciones core");
    expect(translate("planBuilderTitle")).toBe("Plan builder");
    expect(translate("planBuilderStatusLabel")).toBe("Builder");
    expect(translate("planBuilderWeeksLabel")).toBe("semanas");
    expect(translate("planBuilderDaysLabel")).toBe("dias por semana");
    expect(translate("planBuilderTemplateLabel")).toBe("template");
    expect(translate("planBuilderTemplateStrength")).toBe("fuerza");
    expect(translate("planBuilderTemplateHypertrophy")).toBe("hipertrofia");
    expect(translate("planBuilderTemplateRecomposition")).toBe("recomposicion");
    expect(translate("planBuilderPreviewTitle")).toBe("Previsualizacion del plan");
    expect(translate("planBuilderPreviewDaysLabel")).toBe("dias configurados");
    expect(translate("planBuilderPreviewExercisesLabel")).toBe("ejercicios por dia");
    expect(translate("planBuilderInvalidConfiguration")).toBe(
      "Configuracion invalida: revisa semanas y dias."
    );
    expect(translate("planAssignmentTitle")).toBe("Asignacion de plan");
    expect(translate("planAssignmentStatusLabel")).toBe("Asignacion");
    expect(translate("planAssignmentPlanLabel")).toBe("Plan activo");
    expect(translate("planAssignmentSelectedAthletesLabel")).toBe("Atletas seleccionados");
    expect(translate("planAssignmentAtRiskAthletesLabel")).toBe("Atletas en riesgo");
    expect(translate("planAssignmentAssignSelectedAction")).toBe("Asignar a seleccion");
    expect(translate("planAssignmentAssignAtRiskAction")).toBe("Asignar a riesgo");
    expect(translate("planAssignmentClearAction")).toBe("Limpiar seleccion");
    expect(translate("planAssignmentNoSelection")).toBe(
      "Selecciona atletas en operaciones para habilitar la asignacion."
    );
    expect(translate("planAssignmentSelectedListTitle")).toBe("Atletas objetivo");
    expect(translate("planAssignmentAssignedSuffix")).toBe("asignado");
    expect(translate("plansLoadedLabel")).toBe("Planes cargados");
    expect(translate("noPlansLoaded")).toBe("Todavia no hay planes cargados.");
    expect(translate("sessionDetailTitle")).toBe("Detalle de sesion");
    expect(translate("sessionDetailStatusLabel")).toBe("Detalle");
    expect(translate("sessionDetailSelectLabel")).toBe("seleccionar sesion");
    expect(translate("sessionDetailClearAction")).toBe("Limpiar sesion");
    expect(translate("sessionDetailOpenVideoAction")).toBe("Abrir video ejercicio");
    expect(translate("sessionDetailPlanLabel")).toBe("plan");
    expect(translate("sessionDetailStartedLabel")).toBe("inicio");
    expect(translate("sessionDetailEndedLabel")).toBe("fin");
    expect(translate("sessionDetailDurationLabel")).toBe("duracion");
    expect(translate("sessionDetailExerciseCountLabel")).toBe("ejercicios");
    expect(translate("sessionDetailNoSelection")).toBe(
      "No hay sesion seleccionada para mostrar detalle."
    );
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
    expect(translate("deviationAlertsTitle")).toBe("Alertas de desvio");
    expect(translate("deviationAlertsStatusLabel")).toBe("Desvios");
    expect(translate("deviationAlertsLoadAction")).toBe("Evaluar desvios");
    expect(translate("deviationAlertsClearAction")).toBe("Reiniciar filtros");
    expect(translate("deviationAlertsHighRiskLabel")).toBe("Riesgo alto");
    expect(translate("deviationAlertsModerateRiskLabel")).toBe("Riesgo moderado");
    expect(translate("deviationAlertsReasonCalories")).toBe("Calorias fuera de objetivo");
    expect(translate("deviationAlertsReasonProtein")).toBe("Proteina por debajo del objetivo");
    expect(translate("deviationAlertsNoData")).toBe(
      "No hay desvios nutricionales para este filtro."
    );
    expect(translate("nutritionCoachViewTitle")).toBe("Vista coach nutricion");
    expect(translate("nutritionCoachViewStatusLabel")).toBe("Coach");
    expect(translate("nutritionCoachViewLoadAction")).toBe("Cargar cohorte");
    expect(translate("nutritionCoachViewFocusAction")).toBe("Foco en riesgo");
    expect(translate("nutritionCoachViewOpenOperationsAction")).toBe("Abrir operaciones");
    expect(translate("nutritionCoachViewNoRows")).toBe(
      "No hay atletas para la vista coach con los datos actuales."
    );
    expect(translate("nutritionCoachViewAtRiskLabel")).toBe("Atletas en riesgo");
    expect(translate("cohortNutritionTitle")).toBe("Cohorte nutricion");
    expect(translate("cohortNutritionStatusLabel")).toBe("Cohorte");
    expect(translate("cohortNutritionLoadAction")).toBe("Cargar cohorte nutricion");
    expect(translate("cohortNutritionFocusAction")).toBe("Foco riesgo maximo");
    expect(translate("cohortNutritionNoRows")).toBe(
      "No hay cohorte nutricional disponible para este filtro."
    );
    expect(translate("cohortNutritionLogsLabel")).toBe("logs");
    expect(translate("cohortNutritionAvgCaloriesLabel")).toBe("kcal media");
    expect(translate("cohortNutritionAvgProteinLabel")).toBe("proteina media");
    expect(translate("logDetailTitle")).toBe("Detalle de registro nutricional");
    expect(translate("logDetailStatusLabel")).toBe("Detalle");
    expect(translate("logDetailLoadAction")).toBe("Refrescar detalle");
    expect(translate("logDetailClearAction")).toBe("Limpiar seleccion");
    expect(translate("logDetailOpenCoachAction")).toBe("Abrir vista coach");
    expect(translate("logDetailSelectPlaceholder")).toBe("seleccionar log");
    expect(translate("logDetailSelectedDateLabel")).toBe("fecha seleccionada");
    expect(translate("logDetailSelectedAthleteLabel")).toBe("atleta seleccionado");
    expect(translate("logDetailNoSelection")).toBe(
      "No hay log seleccionado para mostrar detalle."
    );
    expect(translate("progressFiltersLabel")).toBe("Filtros de progreso");
    expect(translate("progressTrendsTitle")).toBe("Tendencias de progreso");
    expect(translate("progressTrendsStatusLabel")).toBe("Tendencias");
    expect(translate("progressTrendsRefreshAction")).toBe("Refrescar tendencias");
    expect(translate("progressTrendsNoData")).toBe(
      "No hay datos de progreso para mostrar tendencias."
    );
    expect(translate("aiInsightsTitle")).toBe("Insights IA");
    expect(translate("aiInsightsStatusLabel")).toBe("Insights");
    expect(translate("aiInsightsLoadAction")).toBe("Cargar insights IA");
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
