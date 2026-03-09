import { describe, expect, it } from "vitest";
import {
  createRuntimeObservabilitySession,
  nextCorrelationId,
  nextDeniedEventAttributes,
  nextEventAttributes
} from "./runtime-observability";

describe("runtime observability", () => {
  it("increments event index and preserves denied counters for non-denied events", () => {
    const session = createRuntimeObservabilitySession("rt-fixed");

    const first = nextEventAttributes(session, "training");
    const second = nextEventAttributes(session, "training");

    expect(first.runtimeSessionId).toBe("rt-fixed");
    expect(first.runtimeEventIndex).toBe("1");
    expect(first.deniedSessionCount).toBe("0");
    expect(first.deniedDomainCount).toBe("0");
    expect(second.runtimeEventIndex).toBe("2");
    expect(second.deniedSessionCount).toBe("0");
  });

  it("increments denied counters per session and domain", () => {
    const session = createRuntimeObservabilitySession("rt-denied");

    const firstDenied = nextDeniedEventAttributes(session, "operations");
    const secondDenied = nextDeniedEventAttributes(session, "operations");
    const onboardingDenied = nextDeniedEventAttributes(session, "onboarding");

    expect(firstDenied.deniedSessionCount).toBe("1");
    expect(firstDenied.deniedDomainCount).toBe("1");
    expect(secondDenied.deniedSessionCount).toBe("2");
    expect(secondDenied.deniedDomainCount).toBe("2");
    expect(onboardingDenied.deniedSessionCount).toBe("3");
    expect(onboardingDenied.deniedDomainCount).toBe("1");
  });

  it("generates stable correlation ids and propagates them into event attributes", () => {
    const session = createRuntimeObservabilitySession("rt-correlation");

    const correlationId = nextCorrelationId(session, "progress", "domain_select");
    const deniedAttributes = nextDeniedEventAttributes(session, "progress", correlationId);
    const blockedAttributes = nextEventAttributes(session, "progress", correlationId);

    expect(correlationId).toBe("rt-correlation:progress:domain_select:1");
    expect(deniedAttributes.correlationId).toBe(correlationId);
    expect(blockedAttributes.correlationId).toBe(correlationId);
    expect(deniedAttributes.runtimeEventIndex).toBe("1");
    expect(blockedAttributes.runtimeEventIndex).toBe("2");
  });
});
