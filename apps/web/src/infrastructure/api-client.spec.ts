import { describe, expect, it } from "vitest";
import {
  assertApiResponse,
  createApiHeaders,
  isClientUpdateRequiredError,
  resolveWebClientVersion
} from "./api-client";

describe("api-client infrastructure helpers", () => {
  it("resolveWebClientVersion uses explicit env value", () => {
    expect(resolveWebClientVersion({ VITE_APP_VERSION: "0.3.1" })).toBe("0.3.1");
  });

  it("resolveWebClientVersion falls back to default when env is missing", () => {
    expect(resolveWebClientVersion({})).toBe("0.1.0");
  });

  it("createApiHeaders includes platform and version headers", () => {
    const headers = createApiHeaders({ VITE_APP_VERSION: "0.9.0" }, true);
    expect(headers["x-flux-client-platform"]).toBe("web");
    expect(headers["x-flux-client-version"]).toBe("0.9.0");
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("assertApiResponse throws upgrade error code when backend requires update", async () => {
    const response = new Response(JSON.stringify({ error: "client_update_required" }), {
      status: 426,
      headers: { "Content-Type": "application/json" }
    });

    await expect(assertApiResponse(response, "fallback_error")).rejects.toThrowError(
      "client_update_required"
    );
  });

  it("isClientUpdateRequiredError detects known upgrade error", () => {
    expect(isClientUpdateRequiredError(new Error("client_update_required"))).toBe(true);
    expect(isClientUpdateRequiredError(new Error("any_other_error"))).toBe(false);
  });
});
