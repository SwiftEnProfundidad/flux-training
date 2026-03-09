import { memo } from "react";

type PlanTemplateOption = {
  template: "strength" | "hypertrophy" | "recomposition";
  weeks: number;
  daysPerWeek: number;
  focus: string;
};

type PlanTemplatesPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  statusLabel: string;
  statusClass: string;
  statusValue: string;
  showStatus: boolean;
  summary: string;
  loadLabel: string;
  loadActionId: string;
  onLoad: () => void;
  applyLabel: string;
  applyActionId: string;
  onApply: () => void;
  clearLabel: string;
  clearActionId: string;
  onClear: () => void;
  isSelectionEmpty: boolean;
  noSelectionLabel: string;
  options: PlanTemplateOption[];
  selectedTemplate: string | null;
  selectActionId: string;
  onSelectTemplate: (template: "strength" | "hypertrophy" | "recomposition") => void;
  strengthLabel: string;
  hypertrophyLabel: string;
  recompositionLabel: string;
  weeksLabel: string;
  daysLabel: string;
  focusLabel: string;
  selectedOption: PlanTemplateOption | null;
};

const templateLabelMap = (option: PlanTemplateOption, labels: {
  strength: string;
  hypertrophy: string;
  recomposition: string;
}) => {
  if (option.template === "strength") {
    return labels.strength;
  }
  if (option.template === "hypertrophy") {
    return labels.hypertrophy;
  }
  return labels.recomposition;
};

export const PlanTemplatesPanel = memo(function PlanTemplatesPanel({
  screenId,
  routeId,
  statusId,
  title,
  statusLabel,
  statusClass,
  statusValue,
  showStatus,
  summary,
  loadLabel,
  loadActionId,
  onLoad,
  applyLabel,
  applyActionId,
  onApply,
  clearLabel,
  clearActionId,
  onClear,
  isSelectionEmpty,
  noSelectionLabel,
  options,
  selectedTemplate,
  selectActionId,
  onSelectTemplate,
  strengthLabel,
  hypertrophyLabel,
  recompositionLabel,
  weeksLabel,
  daysLabel,
  focusLabel,
  selectedOption
}: PlanTemplatesPanelProps) {
  return (
    <div className="history-list" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <header className="module-header">
        <h2>{title}</h2>
        {showStatus ? (
          <p>
            {statusLabel}: <span className={`status-pill status-${statusClass}`}>{statusValue}</span>
          </p>
        ) : null}
      </header>
      <p>{summary}</p>
      <div className="inline-inputs">
        <button className="button ghost" onClick={onLoad} type="button" data-action-id={loadActionId}>
          {loadLabel}
        </button>
        <button
          className="button primary"
          onClick={onApply}
          type="button"
          data-action-id={applyActionId}
          disabled={isSelectionEmpty}
        >
          {applyLabel}
        </button>
        <button
          className="button ghost"
          onClick={onClear}
          type="button"
          data-action-id={clearActionId}
          disabled={isSelectionEmpty}
        >
          {clearLabel}
        </button>
      </div>
      {options.length === 0 ? (
        <p className="empty-state">{noSelectionLabel}</p>
      ) : (
        <div className="choice-list">
          {options.map((option) => (
            <label key={option.template}>
              <input
                type="radio"
                name="selected-plan-template"
                value={option.template}
                data-action-id={selectActionId}
                checked={selectedTemplate === option.template}
                onChange={() => onSelectTemplate(option.template)}
              />
              <span>
                {templateLabelMap(option, {
                  strength: strengthLabel,
                  hypertrophy: hypertrophyLabel,
                  recomposition: recompositionLabel
                })}
              </span>
              <span>
                {weeksLabel} {option.weeks} · {daysLabel} {option.daysPerWeek} · {focusLabel}{" "}
                {option.focus}
              </span>
            </label>
          ))}
        </div>
      )}
      {selectedOption === null ? (
        <p className="empty-state">{noSelectionLabel}</p>
      ) : (
        <div className="inline-inputs">
          <article className="metric-item">
            <p>{weeksLabel}</p>
            <strong>{selectedOption.weeks}</strong>
          </article>
          <article className="metric-item">
            <p>{daysLabel}</p>
            <strong>{selectedOption.daysPerWeek}</strong>
          </article>
          <article className="metric-item">
            <p>{focusLabel}</p>
            <strong>{selectedOption.focus}</strong>
          </article>
        </div>
      )}
    </div>
  );
});
