import { describe, expect, it } from "vitest";
import { createShortcutsScreenModel } from "./shortcuts-contract";

describe("shortcuts contract", () => {
  it("inherits denied and offline from dashboard home", () => {
    expect(
      createShortcutsScreenModel({
        dashboardHomeStatus: "denied",
        roleCapabilitiesStatus: "loaded",
        visibleModulesCount: 4
      }).status
    ).toBe("denied");

    expect(
      createShortcutsScreenModel({
        dashboardHomeStatus: "offline",
        roleCapabilitiesStatus: "loaded",
        visibleModulesCount: 4
      }).status
    ).toBe("offline");
  });

  it("resolves loading and error from role capabilities", () => {
    expect(
      createShortcutsScreenModel({
        dashboardHomeStatus: "success",
        roleCapabilitiesStatus: "loading",
        visibleModulesCount: 4
      }).status
    ).toBe("loading");

    expect(
      createShortcutsScreenModel({
        dashboardHomeStatus: "success",
        roleCapabilitiesStatus: "error",
        visibleModulesCount: 4
      }).status
    ).toBe("error");
  });

  it("resolves empty without visible modules", () => {
    expect(
      createShortcutsScreenModel({
        dashboardHomeStatus: "success",
        roleCapabilitiesStatus: "loaded",
        visibleModulesCount: 0
      }).status
    ).toBe("empty");
  });

  it("returns canonical route and screen identifiers", () => {
    expect(
      createShortcutsScreenModel({
        dashboardHomeStatus: "success",
        roleCapabilitiesStatus: "loaded",
        visibleModulesCount: 4
      })
    ).toEqual({
      routeId: "web.route.shortcuts",
      screenId: "web.shortcuts.screen",
      status: "success"
    });
  });
});
