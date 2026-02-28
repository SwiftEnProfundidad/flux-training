import { describe, expect, it } from "vitest";
import {
  ClientUpdateRequiredError,
  EnsureSupportedClientVersionUseCase
} from "./ensure-supported-client-version";

describe("EnsureSupportedClientVersionUseCase", () => {
  const useCase = new EnsureSupportedClientVersionUseCase({
    webMinimumVersion: "0.1.0",
    iosMinimumVersion: "1.4.2"
  });

  it("allows requests when web version is equal or greater than minimum", () => {
    expect(() =>
      useCase.execute({ platform: "web", clientVersion: "0.1.3" })
    ).not.toThrow();
  });

  it("rejects requests when web version is lower than minimum", () => {
    expect(() =>
      useCase.execute({ platform: "web", clientVersion: "0.0.9" })
    ).toThrowError(ClientUpdateRequiredError);
  });

  it("allows unknown platforms to keep backward compatibility", () => {
    expect(() =>
      useCase.execute({ platform: "desktop", clientVersion: "0.0.1" })
    ).not.toThrow();
  });

  it("rejects malformed semantic versions for supported platforms", () => {
    expect(() =>
      useCase.execute({ platform: "ios", clientVersion: "1.4.beta" })
    ).toThrowError(ClientUpdateRequiredError);
  });
});
