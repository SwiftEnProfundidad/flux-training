import { describe, expect, it } from "vitest";
import { createAuditTrailScreenModel } from "./audit-trail-contract";

describe("audit trail contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createAuditTrailScreenModel({
        dashboardHomeStatus: "success",
        auditStatus: "loaded",
        rowsCount: 8
      })
    ).toEqual({
      routeId: "web.route.auditTrail",
      screenId: "web.auditTrail.screen",
      status: "success",
      actions: {
        loadTimeline: "web.auditTrail.loadTimeline",
        exportCsv: "web.auditTrail.exportCsv",
        exportForensic: "web.auditTrail.exportForensic",
        clearFilters: "web.auditTrail.clearFilters"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createAuditTrailScreenModel({
        dashboardHomeStatus: "offline",
        auditStatus: "loaded",
        rowsCount: 3
      }).status
    ).toBe("offline");

    expect(
      createAuditTrailScreenModel({
        dashboardHomeStatus: "denied",
        auditStatus: "loaded",
        rowsCount: 3
      }).status
    ).toBe("denied");
  });

  it("maps module runtime to canonical screen status", () => {
    expect(
      createAuditTrailScreenModel({
        dashboardHomeStatus: "success",
        auditStatus: "loading",
        rowsCount: 0
      }).status
    ).toBe("loading");

    expect(
      createAuditTrailScreenModel({
        dashboardHomeStatus: "success",
        auditStatus: "validation_error",
        rowsCount: 2
      }).status
    ).toBe("error");

    expect(
      createAuditTrailScreenModel({
        dashboardHomeStatus: "success",
        auditStatus: "empty",
        rowsCount: 0
      }).status
    ).toBe("empty");
  });
});
