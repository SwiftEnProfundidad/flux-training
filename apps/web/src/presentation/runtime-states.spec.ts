import { describe, expect, it } from "vitest";
import {
  createInitialDomainRuntimeStates,
  resetRuntimeStateForActiveDomain,
  resolveActiveDomainRuntimeState,
  setRuntimeStateForActiveDomain
} from "./runtime-states";

describe("enterprise runtime states", () => {
  it("starts in success for every domain", () => {
    expect(createInitialDomainRuntimeStates()).toEqual({
      all: "success",
      onboarding: "success",
      training: "success",
      nutrition: "success",
      progress: "success",
      operations: "success"
    });
  });

  it("does not override all domain runtime state", () => {
    const initial = createInitialDomainRuntimeStates();

    const updated = setRuntimeStateForActiveDomain("all", "offline", initial);

    expect(updated).toEqual(initial);
    expect(resolveActiveDomainRuntimeState("all", updated)).toBe("success");
  });

  it("applies runtime state to selected domain and can recover", () => {
    const initial = createInitialDomainRuntimeStates();
    const blocked = setRuntimeStateForActiveDomain("operations", "denied", initial);

    expect(resolveActiveDomainRuntimeState("operations", blocked)).toBe("denied");

    const recovered = resetRuntimeStateForActiveDomain("operations", blocked);

    expect(resolveActiveDomainRuntimeState("operations", recovered)).toBe("success");
  });
});
