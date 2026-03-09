import { describe, expect, it } from "vitest";
import { resolveVercelEndpointHandler } from "./vercel-endpoint-handler";

describe("resolveVercelEndpointHandler", () => {
  it("returns the health handler for the health endpoint", () => {
    const handler = resolveVercelEndpointHandler("health");

    expect(handler).not.toBeNull();
    expect(typeof handler).toBe("function");
  });

  it("returns the create auth session handler for auth endpoint", () => {
    const handler = resolveVercelEndpointHandler("createAuthSession");

    expect(handler).not.toBeNull();
    expect(typeof handler).toBe("function");
  });

  it("returns null for unknown endpoints", () => {
    expect(resolveVercelEndpointHandler("missing-endpoint")).toBeNull();
  });
});
