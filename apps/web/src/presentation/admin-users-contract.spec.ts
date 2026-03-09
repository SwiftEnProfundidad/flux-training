import { describe, expect, it } from "vitest";
import { createAdminUsersScreenModel } from "./admin-users-contract";

describe("admin users contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createAdminUsersScreenModel({
        dashboardHomeStatus: "success",
        governanceStatus: "loaded",
        isAdminRole: true,
        principalsCount: 2
      })
    ).toEqual({
      routeId: "web.route.adminUsers",
      screenId: "web.adminUsers.screen",
      status: "success",
      actions: {
        loadCapabilities: "web.adminUsers.loadCapabilities",
        assignAthlete: "web.adminUsers.assignAthlete",
        assignCoach: "web.adminUsers.assignCoach",
        assignAdmin: "web.adminUsers.assignAdmin",
        clearSelection: "web.adminUsers.clearSelection"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createAdminUsersScreenModel({
        dashboardHomeStatus: "offline",
        governanceStatus: "loaded",
        isAdminRole: true,
        principalsCount: 3
      }).status
    ).toBe("offline");

    expect(
      createAdminUsersScreenModel({
        dashboardHomeStatus: "denied",
        governanceStatus: "loaded",
        isAdminRole: true,
        principalsCount: 3
      }).status
    ).toBe("denied");
  });

  it("returns denied for non-admin roles", () => {
    expect(
      createAdminUsersScreenModel({
        dashboardHomeStatus: "success",
        governanceStatus: "loaded",
        isAdminRole: false,
        principalsCount: 3
      }).status
    ).toBe("denied");
  });

  it("maps governance runtime states to dashboard statuses", () => {
    expect(
      createAdminUsersScreenModel({
        dashboardHomeStatus: "success",
        governanceStatus: "loading",
        isAdminRole: true,
        principalsCount: 3
      }).status
    ).toBe("loading");

    expect(
      createAdminUsersScreenModel({
        dashboardHomeStatus: "success",
        governanceStatus: "error",
        isAdminRole: true,
        principalsCount: 3
      }).status
    ).toBe("error");

    expect(
      createAdminUsersScreenModel({
        dashboardHomeStatus: "success",
        governanceStatus: "empty",
        isAdminRole: true,
        principalsCount: 0
      }).status
    ).toBe("empty");
  });
});
