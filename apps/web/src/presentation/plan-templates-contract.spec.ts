import { describe, expect, it } from "vitest";
import { createPlanTemplatesScreenModel } from "./plan-templates-contract";

describe("plan templates contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createPlanTemplatesScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        planTemplatesStatus: "loaded",
        templatesCount: 3,
        hasSelectedTemplate: true
      })
    ).toEqual({
      routeId: "web.route.light.planTemplates",
      screenId: "web.light.planTemplates.screen",
      status: "success",
      actions: {
        loadTemplates: "web.light.planTemplates.loadTemplates",
        selectTemplate: "web.light.planTemplates.selectTemplate",
        applyTemplate: "web.light.planTemplates.applyTemplate",
        clearSelection: "web.light.planTemplates.clearSelection"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createPlanTemplatesScreenModel({
        dashboardHomeStatus: "offline",
        trainingStatus: "loaded",
        planTemplatesStatus: "loaded",
        templatesCount: 3,
        hasSelectedTemplate: true
      }).status
    ).toBe("offline");
  });

  it("maps runtime and selection to canonical status", () => {
    expect(
      createPlanTemplatesScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "validation_error",
        planTemplatesStatus: "loaded",
        templatesCount: 3,
        hasSelectedTemplate: true
      }).status
    ).toBe("error");

    expect(
      createPlanTemplatesScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        planTemplatesStatus: "loaded",
        templatesCount: 3,
        hasSelectedTemplate: false
      }).status
    ).toBe("empty");
  });
});
