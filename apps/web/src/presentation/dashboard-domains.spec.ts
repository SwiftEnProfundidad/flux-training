import { describe, expect, it } from "vitest";
import {
  applyDashboardDomainToURL,
  getVisibleModules,
  isModuleVisible,
  readDashboardDomainFromURL,
  resolveDashboardRole,
  resolveDashboardDomain
} from "./dashboard-domains";

describe("dashboard domain navigation", () => {
  it("shows all modules for all domain", () => {
    expect(getVisibleModules("all")).toEqual([
      "onboarding",
      "training",
      "operationsHub",
      "recommendations",
      "nutrition",
      "progress",
      "settings",
      "legal",
      "offlineSync",
      "observability"
    ]);
  });

  it("shows only training modules", () => {
    expect(getVisibleModules("training")).toEqual(["training"]);
    expect(isModuleVisible("training", "training")).toBe(true);
    expect(isModuleVisible("onboarding", "training")).toBe(false);
    expect(isModuleVisible("nutrition", "training")).toBe(false);
  });

  it("shows only operations modules", () => {
    expect(getVisibleModules("operations")).toEqual([
      "operationsHub",
      "recommendations",
      "settings",
      "legal",
      "offlineSync",
      "observability"
    ]);
    expect(isModuleVisible("operationsHub", "operations")).toBe(true);
    expect(isModuleVisible("recommendations", "operations")).toBe(true);
    expect(isModuleVisible("settings", "operations")).toBe(true);
    expect(isModuleVisible("legal", "operations")).toBe(true);
    expect(isModuleVisible("progress", "operations")).toBe(false);
  });

  it("resolves persisted domain safely", () => {
    expect(resolveDashboardDomain("training")).toBe("training");
    expect(resolveDashboardDomain("unknown")).toBe("all");
    expect(resolveDashboardDomain(null)).toBe("all");
  });

  it("resolves persisted role safely", () => {
    expect(resolveDashboardRole("athlete")).toBe("athlete");
    expect(resolveDashboardRole("coach")).toBe("coach");
    expect(resolveDashboardRole("admin")).toBe("admin");
    expect(resolveDashboardRole("unknown")).toBe("athlete");
    expect(resolveDashboardRole(null)).toBe("athlete");
  });

  it("reads domain from url when query parameter is valid", () => {
    expect(readDashboardDomainFromURL("https://flux.training/?domain=operations")).toBe(
      "operations"
    );
    expect(readDashboardDomainFromURL("https://flux.training/?domain=unknown")).toBeNull();
  });

  it("writes domain into url query parameter", () => {
    expect(
      applyDashboardDomainToURL("https://flux.training/app?lang=es", "training")
    ).toBe("https://flux.training/app?lang=es&domain=training");
  });
});
