import {
  dataRetentionPolicySchema,
  type DataRetentionPolicy
} from "@flux/contracts";

const DATA_RETENTION_POLICIES: DataRetentionPolicy[] = [
  {
    domain: "auth",
    retentionDays: 365,
    legalBasis: "security_audit_and_fraud_prevention",
    effectiveFrom: "2026-03-02T00:00:00.000Z"
  },
  {
    domain: "training",
    retentionDays: 730,
    legalBasis: "service_delivery_and_analytics",
    effectiveFrom: "2026-03-02T00:00:00.000Z"
  },
  {
    domain: "nutrition",
    retentionDays: 730,
    legalBasis: "service_delivery_and_analytics",
    effectiveFrom: "2026-03-02T00:00:00.000Z"
  },
  {
    domain: "legal",
    retentionDays: 1825,
    legalBasis: "gdpr_art_6_1_c",
    effectiveFrom: "2026-03-02T00:00:00.000Z"
  },
  {
    domain: "observability",
    retentionDays: 180,
    legalBasis: "incident_response_and_operability",
    effectiveFrom: "2026-03-02T00:00:00.000Z"
  }
];

export class ListDataRetentionPoliciesUseCase {
  execute(): DataRetentionPolicy[] {
    return dataRetentionPolicySchema.array().parse(DATA_RETENTION_POLICIES);
  }
}
