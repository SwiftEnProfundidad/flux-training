import type { DashboardHomeStatus } from "./dashboard-home-contract";

type ObservabilityStatus =
  | "idle"
  | "loading"
  | "event_saved"
  | "crash_saved"
  | "loaded"
  | "error";

type CreateAnalyticsOverviewScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  observabilityStatus: ObservabilityStatus;
  analyticsEventsCount: number;
  crashReportsCount: number;
};

export type AnalyticsOverviewScreenModel = {
  routeId: "web.route.analyticsOverview";
  screenId: "web.analyticsOverview.screen";
  status: DashboardHomeStatus;
  actions: {
    trackEvent: "web.analyticsOverview.trackEvent";
    reportCrash: "web.analyticsOverview.reportCrash";
    loadData: "web.analyticsOverview.loadData";
  };
};

export function createAnalyticsOverviewScreenModel(
  input: CreateAnalyticsOverviewScreenModelInput
): AnalyticsOverviewScreenModel {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied"
  ) {
    return {
      routeId: "web.route.analyticsOverview",
      screenId: "web.analyticsOverview.screen",
      status: input.dashboardHomeStatus,
      actions: {
        trackEvent: "web.analyticsOverview.trackEvent",
        reportCrash: "web.analyticsOverview.reportCrash",
        loadData: "web.analyticsOverview.loadData"
      }
    };
  }
  if (input.dashboardHomeStatus === "error") {
    return {
      routeId: "web.route.analyticsOverview",
      screenId: "web.analyticsOverview.screen",
      status: "error",
      actions: {
        trackEvent: "web.analyticsOverview.trackEvent",
        reportCrash: "web.analyticsOverview.reportCrash",
        loadData: "web.analyticsOverview.loadData"
      }
    };
  }
  if (input.observabilityStatus === "loading") {
    return {
      routeId: "web.route.analyticsOverview",
      screenId: "web.analyticsOverview.screen",
      status: "loading",
      actions: {
        trackEvent: "web.analyticsOverview.trackEvent",
        reportCrash: "web.analyticsOverview.reportCrash",
        loadData: "web.analyticsOverview.loadData"
      }
    };
  }
  if (input.observabilityStatus === "error") {
    return {
      routeId: "web.route.analyticsOverview",
      screenId: "web.analyticsOverview.screen",
      status: "error",
      actions: {
        trackEvent: "web.analyticsOverview.trackEvent",
        reportCrash: "web.analyticsOverview.reportCrash",
        loadData: "web.analyticsOverview.loadData"
      }
    };
  }
  if (input.analyticsEventsCount === 0 && input.crashReportsCount === 0) {
    return {
      routeId: "web.route.analyticsOverview",
      screenId: "web.analyticsOverview.screen",
      status: "empty",
      actions: {
        trackEvent: "web.analyticsOverview.trackEvent",
        reportCrash: "web.analyticsOverview.reportCrash",
        loadData: "web.analyticsOverview.loadData"
      }
    };
  }
  return {
    routeId: "web.route.analyticsOverview",
    screenId: "web.analyticsOverview.screen",
    status: "success",
    actions: {
      trackEvent: "web.analyticsOverview.trackEvent",
      reportCrash: "web.analyticsOverview.reportCrash",
      loadData: "web.analyticsOverview.loadData"
    }
  };
}
