import {
  analyticsEventSchema,
  canonicalAnalyticsEventNameSchema,
  type AnalyticsEvent,
  type CanonicalAnalyticsEventName
} from "@flux/contracts";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";

const canonicalEventNameSet = new Set<CanonicalAnalyticsEventName>([
  "dashboard_interaction",
  "dashboard_domain_changed",
  "dashboard_role_changed",
  "dashboard_domain_access_denied",
  "dashboard_action_blocked",
  "governance_bulk_role_assignment_saved",
  "billing_support_incidents_resolved",
  "audit_timeline_exported",
  "critical_regression_passed",
  "happy_path_completed",
  "recovery_path_completed"
]);

function resolveCanonicalEventName(name: string): CanonicalAnalyticsEventName {
  if (canonicalEventNameSet.has(name as CanonicalAnalyticsEventName)) {
    return canonicalAnalyticsEventNameSchema.parse(name);
  }
  return "custom";
}

function resolveCorrelationId(attributes: AnalyticsEvent["attributes"]): string {
  const rawValue = attributes.correlationId;
  if (typeof rawValue === "string" && rawValue.trim().length > 0) {
    return rawValue;
  }
  return `corr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export class CreateAnalyticsEventUseCase {
  constructor(private readonly repository: AnalyticsEventRepository) {}

  async execute(input: AnalyticsEvent): Promise<AnalyticsEvent> {
    const parsedInput = analyticsEventSchema.parse(input);
    const canonicalEventName = resolveCanonicalEventName(parsedInput.name);
    const correlationId = resolveCorrelationId(parsedInput.attributes);
    const normalizedEvent = analyticsEventSchema.parse({
      ...parsedInput,
      attributes: {
        ...parsedInput.attributes,
        correlationId,
        canonicalEventName,
        source: parsedInput.source,
        runtimeEventIndex:
          typeof parsedInput.attributes.runtimeEventIndex === "string"
            ? parsedInput.attributes.runtimeEventIndex
            : "0"
      }
    });
    await this.repository.save(normalizedEvent);
    return normalizedEvent;
  }
}
