import { describe, expect, it } from "vitest";
import {
  applyDashboardDomainToURL,
  getProductVisibleModules,
  getVisibleModules,
  isModuleVisible,
  normalizeDomainForRuntimeMode,
  readDashboardDomainFromURL,
  resolveDashboardRole,
  resolveDashboardDomain,
  resolvePostSignInDomain
} from "./dashboard-domains";

describe("dashboard domain navigation", () => {
  it("shows all modules for all domain", () => {
    expect(getVisibleModules("all")).toEqual([
      "onboarding",
      "training",
      "operationsHub",
      "adminGovernance",
      "auditCompliance",
      "billingSupport",
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



  it("maps product mode to domain-specific modules", () => {
    expect(getProductVisibleModules("onboarding")).toEqual(["onboarding", "legal"]);
    expect(getProductVisibleModules("training")).toEqual(["training"]);
    expect(getProductVisibleModules("nutrition")).toEqual(["nutrition"]);
    expect(getProductVisibleModules("progress")).toEqual(["progress", "recommendations"]);
    expect(getProductVisibleModules("operations")).toEqual([
      "onboarding",
      "training",
      "nutrition",
      "progress"
    ]);
  });


  it("lands on panel after sign-in in product mode", () => {
    expect(resolvePostSignInDomain(false)).toBe("all");
    expect(resolvePostSignInDomain(true)).toBe("operations");
  });

  it("normalizes operations away in product runtime mode", () => {
    expect(normalizeDomainForRuntimeMode("operations", false)).toBe("onboarding");
    expect(normalizeDomainForRuntimeMode("all", false)).toBe("all");
    expect(normalizeDomainForRuntimeMode("progress", false)).toBe("progress");
    expect(normalizeDomainForRuntimeMode("operations", true)).toBe("operations");
  });

  it("can normalize product mode to a custom landing domain for operations", () => {
    expect(normalizeDomainForRuntimeMode("all", false, "training")).toBe("all");
    expect(normalizeDomainForRuntimeMode("operations", false, "training")).toBe("training");
  });

  it("shows only operations modules", () => {
    expect(getVisibleModules("operations")).toEqual([
      "operationsHub",
      "adminGovernance",
      "auditCompliance",
      "billingSupport",
      "recommendations",
      "settings",
      "legal",
      "offlineSync",
      "observability"
    ]);
    expect(isModuleVisible("operationsHub", "operations")).toBe(true);
    expect(isModuleVisible("adminGovernance", "operations")).toBe(true);
    expect(isModuleVisible("auditCompliance", "operations")).toBe(true);
    expect(isModuleVisible("billingSupport", "operations")).toBe(true);
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
