import type { DashboardDomain } from "./dashboard-domains";

export type RuntimeObservabilitySession = {
  sessionId: string;
  eventIndex: number;
  correlationIndex: number;
  deniedSessionCount: number;
  deniedByDomain: Record<DashboardDomain, number>;
};

export function createRuntimeObservabilitySession(
  sessionId: string = `rt-${Date.now()}`
): RuntimeObservabilitySession {
  return {
    sessionId,
    eventIndex: 0,
    correlationIndex: 0,
    deniedSessionCount: 0,
    deniedByDomain: {
      all: 0,
      onboarding: 0,
      training: 0,
      nutrition: 0,
      progress: 0,
      operations: 0
    }
  };
}

export function nextCorrelationId(
  session: RuntimeObservabilitySession,
  domain: DashboardDomain,
  trigger: string
): string {
  session.correlationIndex += 1;
  return `${session.sessionId}:${domain}:${trigger}:${session.correlationIndex}`;
}

export function nextEventAttributes(
  session: RuntimeObservabilitySession,
  domain: DashboardDomain,
  correlationId?: string
): Record<string, string> {
  session.eventIndex += 1;
  const attributes: Record<string, string> = {
    runtimeSessionId: session.sessionId,
    runtimeEventIndex: String(session.eventIndex),
    deniedSessionCount: String(session.deniedSessionCount),
    deniedDomainCount: String(session.deniedByDomain[domain] ?? 0)
  };
  if (correlationId !== undefined) {
    attributes.correlationId = correlationId;
  }
  return attributes;
}

export function nextDeniedEventAttributes(
  session: RuntimeObservabilitySession,
  domain: DashboardDomain,
  correlationId?: string
): Record<string, string> {
  session.deniedSessionCount += 1;
  session.deniedByDomain[domain] = (session.deniedByDomain[domain] ?? 0) + 1;
  return nextEventAttributes(session, domain, correlationId);
}
