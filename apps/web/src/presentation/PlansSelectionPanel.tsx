import { memo } from "react";

type PlanSelectionOption = {
  id: string;
  name: string;
  weeks: number;
};

type PlansSelectionPanelProps = {
  plansCountLabel: string;
  plansCountValue: string;
  noPlansLabel: string;
  plans: PlanSelectionOption[];
  selectedPlanId: string;
  selectActionId: string;
  onSelectPlan: (planId: string) => void;
  weeksSuffix: string;
};

export const PlansSelectionPanel = memo(function PlansSelectionPanel({
  plansCountLabel,
  plansCountValue,
  noPlansLabel,
  plans,
  selectedPlanId,
  selectActionId,
  onSelectPlan,
  weeksSuffix
}: PlansSelectionPanelProps) {
  return (
    <>
      <p className="stat-line">
        <span>{plansCountLabel}</span>
        <strong>{plansCountValue}</strong>
      </p>
      {plans.length === 0 ? (
        <p className="empty-state">{noPlansLabel}</p>
      ) : (
        <div className="choice-list">
          {plans.map((plan) => (
            <label key={plan.id}>
              <input
                type="radio"
                name="selected-plan"
                data-action-id={selectActionId}
                checked={selectedPlanId === plan.id}
                onChange={() => onSelectPlan(plan.id)}
              />
              {plan.name} ({plan.weeks} {weeksSuffix})
            </label>
          ))}
        </div>
      )}
    </>
  );
});
