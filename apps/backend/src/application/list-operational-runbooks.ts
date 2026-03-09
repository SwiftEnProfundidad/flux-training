import {
  operationalRunbookSchema,
  type OperationalRunbook,
  type OperationalRunbookStep
} from "@flux/contracts";

function runbookSteps(
  stepPrefix: string,
  steps: Array<Omit<OperationalRunbookStep, "id">>
): OperationalRunbookStep[] {
  return steps.map((step, index) => ({
    id: `${stepPrefix}-step-${index + 1}`,
    ...step
  }));
}

export class ListOperationalRunbooksUseCase {
  constructor(private readonly nowFactory: () => string = () => new Date().toISOString()) {}

  execute(): OperationalRunbook[] {
    const updatedAt = this.nowFactory();

    const runbooks: OperationalRunbook[] = [
      {
        id: "RB-fatal-crash",
        alertCode: "fatal_crash_slo_breach",
        title: "Fatal crash containment",
        objective: "Contain fatal crashes and restore stable runtime behavior.",
        ownerOnCall: "backend_oncall",
        steps: runbookSteps("fatal-crash", [
          {
            title: "Acknowledge the incident page",
            ownerRole: "on_call_engineer",
            slaMinutes: 5,
            outcome: "Incident acknowledged with traceable ticket."
          },
          {
            title: "Scope affected versions and rollback if needed",
            ownerRole: "incident_commander",
            slaMinutes: 15,
            outcome: "Impact scope documented and mitigation applied."
          },
          {
            title: "Publish post-incident update",
            ownerRole: "operations_manager",
            slaMinutes: 30,
            outcome: "Status update shared with product and support teams."
          }
        ]),
        updatedAt
      },
      {
        id: "RB-denied-access",
        alertCode: "denied_access_spike",
        title: "Denied access spike triage",
        objective: "Reduce denied-access friction while preserving RBAC policy.",
        ownerOnCall: "security_oncall",
        steps: runbookSteps("denied-access", [
          {
            title: "Validate policy source and recent RBAC changes",
            ownerRole: "security_engineer",
            slaMinutes: 10,
            outcome: "Root policy candidate identified."
          },
          {
            title: "Confirm ownership/consent context in affected domains",
            ownerRole: "product_ops",
            slaMinutes: 20,
            outcome: "Domain-level impact documented."
          },
          {
            title: "Apply corrective permission rollout",
            ownerRole: "security_oncall",
            slaMinutes: 30,
            outcome: "Denied-access trend returns below threshold."
          }
        ]),
        updatedAt
      },
      {
        id: "RB-blocked-actions",
        alertCode: "blocked_action_spike",
        title: "Blocked action recovery",
        objective: "Recover blocked critical actions without breaking authorization safety.",
        ownerOnCall: "operations_oncall",
        steps: runbookSteps("blocked-actions", [
          {
            title: "Identify top blocked action paths",
            ownerRole: "operations_analyst",
            slaMinutes: 10,
            outcome: "Top blocked flows ranked by frequency."
          },
          {
            title: "Run targeted recovery simulation",
            ownerRole: "operations_oncall",
            slaMinutes: 20,
            outcome: "Recovery actions validated in runtime dashboard."
          },
          {
            title: "Notify customer support playbook",
            ownerRole: "support_lead",
            slaMinutes: 30,
            outcome: "Support communication aligned with mitigation status."
          }
        ]),
        updatedAt
      },
      {
        id: "RB-canonical-coverage",
        alertCode: "canonical_coverage_drop",
        title: "Telemetry canonical coverage recovery",
        objective: "Restore canonical event coverage required for alert reliability.",
        ownerOnCall: "platform_oncall",
        steps: runbookSteps("canonical-coverage", [
          {
            title: "Identify custom events without canonical mapping",
            ownerRole: "platform_engineer",
            slaMinutes: 15,
            outcome: "Missing canonical mappings documented."
          },
          {
            title: "Patch event emitters and deploy",
            ownerRole: "platform_oncall",
            slaMinutes: 30,
            outcome: "Canonical coverage returns above policy threshold."
          }
        ]),
        updatedAt
      },
      {
        id: "RB-high-incident-backlog",
        alertCode: "high_incident_backlog",
        title: "High severity backlog reduction",
        objective: "Reduce unresolved high-severity incident backlog under SLO.",
        ownerOnCall: "support_oncall",
        steps: runbookSteps("high-backlog", [
          {
            title: "Assign incident commander",
            ownerRole: "support_oncall",
            slaMinutes: 5,
            outcome: "Single accountable owner assigned."
          },
          {
            title: "Batch triage and prioritize by blast radius",
            ownerRole: "support_manager",
            slaMinutes: 20,
            outcome: "Backlog reprioritized by enterprise impact."
          },
          {
            title: "Escalate unresolved blockers",
            ownerRole: "incident_commander",
            slaMinutes: 40,
            outcome: "Escalation path tracked until backlog is below threshold."
          }
        ]),
        updatedAt
      }
    ];

    return operationalRunbookSchema.array().parse(runbooks);
  }
}
