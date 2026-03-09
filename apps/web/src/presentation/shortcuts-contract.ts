import type { DashboardHomeStatus } from "./dashboard-home-contract";

type RoleCapabilitiesStatus = "idle" | "loading" | "loaded" | "error";

type CreateShortcutsScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  roleCapabilitiesStatus: RoleCapabilitiesStatus;
  visibleModulesCount: number;
};

export type ShortcutsScreenModel = {
  routeId: "web.route.shortcuts";
  screenId: "web.shortcuts.screen";
  status: DashboardHomeStatus;
};

export function createShortcutsScreenModel(
  input: CreateShortcutsScreenModelInput
): ShortcutsScreenModel {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied"
  ) {
    return {
      routeId: "web.route.shortcuts",
      screenId: "web.shortcuts.screen",
      status: input.dashboardHomeStatus
    };
  }
  if (input.dashboardHomeStatus === "error") {
    return {
      routeId: "web.route.shortcuts",
      screenId: "web.shortcuts.screen",
      status: "error"
    };
  }
  if (input.roleCapabilitiesStatus === "loading") {
    return {
      routeId: "web.route.shortcuts",
      screenId: "web.shortcuts.screen",
      status: "loading"
    };
  }
  if (input.roleCapabilitiesStatus === "error") {
    return {
      routeId: "web.route.shortcuts",
      screenId: "web.shortcuts.screen",
      status: "error"
    };
  }
  if (input.visibleModulesCount === 0) {
    return {
      routeId: "web.route.shortcuts",
      screenId: "web.shortcuts.screen",
      status: "empty"
    };
  }
  return {
    routeId: "web.route.shortcuts",
    screenId: "web.shortcuts.screen",
    status: "success"
  };
}
