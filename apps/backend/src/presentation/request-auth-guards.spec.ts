import { describe, expect, it } from "vitest";
import {
  parseAccessRoleHeader,
  parseBearerTokenHeader,
  toDeniedAccessReason
} from "./request-auth-guards";

describe("request-auth-guards", () => {
  it("parses bearer tokens case-insensitively", () => {
    expect(parseBearerTokenHeader("Bearer abc.def")).toBe("abc.def");
    expect(parseBearerTokenHeader("bearer token-123")).toBe("token-123");
  });

  it("returns null for invalid auth headers", () => {
    expect(parseBearerTokenHeader("")).toBeNull();
    expect(parseBearerTokenHeader("Basic xxx")).toBeNull();
    expect(parseBearerTokenHeader("Bearer   ")).toBeNull();
  });

  it("defaults access role to athlete when header is empty", () => {
    expect(parseAccessRoleHeader("")).toBe("athlete");
    expect(parseAccessRoleHeader("  ")).toBe("athlete");
  });

  it("parses explicit access roles", () => {
    expect(parseAccessRoleHeader("coach")).toBe("coach");
    expect(parseAccessRoleHeader("admin")).toBe("admin");
  });

  it("maps allowed to action_denied fallback for denied-audit compatibility", () => {
    expect(toDeniedAccessReason("domain_denied")).toBe("domain_denied");
    expect(toDeniedAccessReason("ownership_required")).toBe("ownership_required");
    expect(toDeniedAccessReason("medical_consent_required")).toBe(
      "medical_consent_required"
    );
    expect(toDeniedAccessReason("action_denied")).toBe("action_denied");
    expect(toDeniedAccessReason("allowed")).toBe("action_denied");
  });
});
