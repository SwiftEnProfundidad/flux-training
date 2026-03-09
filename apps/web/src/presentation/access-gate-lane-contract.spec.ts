import { describe, expect, it } from "vitest";
import { createAccessGateLaneScreenModel } from "./access-gate-lane-contract";

describe("access gate lane contract", () => {
  it("maps main lane identifiers and preserves signed out status", () => {
    expect(
      createAccessGateLaneScreenModel({
        lane: "main",
        hasAuthenticatedSession: false,
        authStatus: "signed_out"
      })
    ).toEqual({
      routeId: "web.route.accessGate",
      screenId: "web.accessGate.screen",
      status: "signed_out"
    });
  });

  it("maps secondary lane identifiers", () => {
    expect(
      createAccessGateLaneScreenModel({
        lane: "secondary",
        hasAuthenticatedSession: false,
        authStatus: "session_required"
      })
    ).toEqual({
      routeId: "web.route.light.accessGate",
      screenId: "web.light.accessGate.screen",
      status: "session_required"
    });
  });

  it("upgrades to signed_in status when session exists", () => {
    expect(
      createAccessGateLaneScreenModel({
        lane: "secondary",
        hasAuthenticatedSession: true,
        authStatus: "signed_out"
      }).status
    ).toBe("signed_in");
  });
});
