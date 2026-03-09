import { describe, expect, it } from "vitest";
import { deriveModuleRuntimeStatus } from "./module-runtime-status";

describe("module runtime status", () => {
  it("prioritizes domain denied/offline/error states for active module domain", () => {
    expect(
      deriveModuleRuntimeStatus({
        activeDomain: "nutrition",
        moduleDomain: "nutrition",
        activeDomainRuntimeState: "denied",
        hasValidationError: false,
        totalItems: 3,
        filteredItems: 3,
        currentStatus: "loaded"
      })
    ).toBe("denied");

    expect(
      deriveModuleRuntimeStatus({
        activeDomain: "progress",
        moduleDomain: "progress",
        activeDomainRuntimeState: "offline",
        hasValidationError: false,
        totalItems: 2,
        filteredItems: 2,
        currentStatus: "loaded"
      })
    ).toBe("offline");

    expect(
      deriveModuleRuntimeStatus({
        activeDomain: "operations",
        moduleDomain: "operations",
        activeDomainRuntimeState: "error",
        hasValidationError: false,
        totalItems: 2,
        filteredItems: 2,
        currentStatus: "loaded"
      })
    ).toBe("error");
  });

  it("returns validation error when filters are invalid", () => {
    expect(
      deriveModuleRuntimeStatus({
        activeDomain: "all",
        moduleDomain: "nutrition",
        activeDomainRuntimeState: "success",
        hasValidationError: true,
        totalItems: 3,
        filteredItems: 3,
        currentStatus: "loaded"
      })
    ).toBe("validation_error");
  });

  it("preserves loading/queued and resolves empty/loaded states deterministically", () => {
    expect(
      deriveModuleRuntimeStatus({
        activeDomain: "all",
        moduleDomain: "operations",
        activeDomainRuntimeState: "success",
        hasValidationError: false,
        totalItems: 5,
        filteredItems: 5,
        currentStatus: "loading"
      })
    ).toBe("loading");

    expect(
      deriveModuleRuntimeStatus({
        activeDomain: "all",
        moduleDomain: "operations",
        activeDomainRuntimeState: "success",
        hasValidationError: false,
        totalItems: 5,
        filteredItems: 0,
        currentStatus: "idle"
      })
    ).toBe("empty");

    expect(
      deriveModuleRuntimeStatus({
        activeDomain: "all",
        moduleDomain: "operations",
        activeDomainRuntimeState: "success",
        hasValidationError: false,
        totalItems: 5,
        filteredItems: 3,
        currentStatus: "idle"
      })
    ).toBe("loaded");
  });
});
