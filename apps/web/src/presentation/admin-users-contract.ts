import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";

type CreateAdminUsersScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  governanceStatus: ModuleRuntimeStatus;
  isAdminRole: boolean;
  principalsCount: number;
};

export type AdminUsersScreenModel = {
  routeId: "web.route.adminUsers";
  screenId: "web.adminUsers.screen";
  status: DashboardHomeStatus;
  actions: {
    loadCapabilities: "web.adminUsers.loadCapabilities";
    assignAthlete: "web.adminUsers.assignAthlete";
    assignCoach: "web.adminUsers.assignCoach";
    assignAdmin: "web.adminUsers.assignAdmin";
    clearSelection: "web.adminUsers.clearSelection";
  };
};

function resolveAdminUsersStatus(input: CreateAdminUsersScreenModelInput): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (input.isAdminRole === false) {
    return "denied";
  }

  if (input.governanceStatus === "loading" || input.governanceStatus === "queued") {
    return "loading";
  }
  if (input.governanceStatus === "offline") {
    return "offline";
  }
  if (input.governanceStatus === "denied") {
    return "denied";
  }
  if (
    input.governanceStatus === "error" ||
    input.governanceStatus === "validation_error"
  ) {
    return "error";
  }
  if (input.governanceStatus === "empty" || input.principalsCount === 0) {
    return "empty";
  }
  return "success";
}

export function createAdminUsersScreenModel(
  input: CreateAdminUsersScreenModelInput
): AdminUsersScreenModel {
  return {
    routeId: "web.route.adminUsers",
    screenId: "web.adminUsers.screen",
    status: resolveAdminUsersStatus(input),
    actions: {
      loadCapabilities: "web.adminUsers.loadCapabilities",
      assignAthlete: "web.adminUsers.assignAthlete",
      assignCoach: "web.adminUsers.assignCoach",
      assignAdmin: "web.adminUsers.assignAdmin",
      clearSelection: "web.adminUsers.clearSelection"
    }
  };
}
