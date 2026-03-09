import { memo } from "react";

type PlanBuilderPanelProps = {
  screenId: string;
  routeId: string;
  title: string;
  planNameLabel: string;
  planNameValue: string;
  planNameActionId: string;
  onPlanNameChange: (value: string) => void;
  weeksLabel: string;
  weeksValue: string;
  weeksActionId: string;
  onWeeksChange: (value: string) => void;
  daysLabel: string;
  daysValue: string;
  daysActionId: string;
  onDaysChange: (value: string) => void;
  templateLabel: string;
  templateValue: string;
  templateActionId: string;
  onTemplateChange: (value: string) => void;
  templateOptions: {
    strength: string;
    hypertrophy: string;
    recomposition: string;
  };
  createLabel: string;
  createActionId: string;
  onCreate: () => void;
  loadLabel: string;
  loadActionId: string;
  onLoad: () => void;
  previewTitle: string;
  previewDaysLabel: string;
  previewDaysValue: string;
  previewExercisesLabel: string;
  previewExercisesValue: string;
  validationCopy: string | null;
};

export const PlanBuilderPanel = memo(function PlanBuilderPanel({
  screenId,
  routeId,
  title,
  planNameLabel,
  planNameValue,
  planNameActionId,
  onPlanNameChange,
  weeksLabel,
  weeksValue,
  weeksActionId,
  onWeeksChange,
  daysLabel,
  daysValue,
  daysActionId,
  onDaysChange,
  templateLabel,
  templateValue,
  templateActionId,
  onTemplateChange,
  templateOptions,
  createLabel,
  createActionId,
  onCreate,
  loadLabel,
  loadActionId,
  onLoad,
  previewTitle,
  previewDaysLabel,
  previewDaysValue,
  previewExercisesLabel,
  previewExercisesValue,
  validationCopy
}: PlanBuilderPanelProps) {
  return (
    <div
      className="history-list"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-status-id="web.planBuilder.status"
    >
      <p className="section-subtitle">{title}</p>
      <div className="inline-inputs">
        <input
          aria-label={planNameLabel}
          placeholder={planNameLabel}
          value={planNameValue}
          data-action-id={planNameActionId}
          onChange={(event) => onPlanNameChange(event.target.value)}
        />
        <input
          aria-label={weeksLabel}
          placeholder={weeksLabel}
          value={weeksValue}
          data-action-id={weeksActionId}
          onChange={(event) => onWeeksChange(event.target.value)}
        />
        <input
          aria-label={daysLabel}
          placeholder={daysLabel}
          value={daysValue}
          data-action-id={daysActionId}
          onChange={(event) => onDaysChange(event.target.value)}
        />
        <select
          aria-label={templateLabel}
          value={templateValue}
          data-action-id={templateActionId}
          onChange={(event) => onTemplateChange(event.target.value)}
        >
          <option value="strength">{templateOptions.strength}</option>
          <option value="hypertrophy">{templateOptions.hypertrophy}</option>
          <option value="recomposition">{templateOptions.recomposition}</option>
        </select>
      </div>
      <div className="inline-inputs">
        <button className="button primary" onClick={onCreate} type="button" data-action-id={createActionId}>
          {createLabel}
        </button>
        <button className="button ghost" onClick={onLoad} type="button" data-action-id={loadActionId}>
          {loadLabel}
        </button>
      </div>
      <p className="section-subtitle">{previewTitle}</p>
      <div className="inline-inputs">
        <article className="metric-item">
          <p>{previewDaysLabel}</p>
          <strong>{previewDaysValue}</strong>
        </article>
        <article className="metric-item">
          <p>{previewExercisesLabel}</p>
          <strong>{previewExercisesValue}</strong>
        </article>
      </div>
      {validationCopy ? <p className="validation-copy">{validationCopy}</p> : null}
    </div>
  );
});
