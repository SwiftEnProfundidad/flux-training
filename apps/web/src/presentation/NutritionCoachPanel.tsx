import { memo } from "react";
import type { AthleteOperationsRow, AthleteRiskLevel } from "./core-operations";

type CohortNutritionRow = {
  athleteId: string;
  logsCount: number;
  averageCalories: number;
  averageProteinGrams: number;
  riskLevel: AthleteRiskLevel;
};

type NutritionCoachPanelProps = {
  coachScreenId: string;
  coachRouteId: string;
  coachStatusId: string;
  coachTitle: string;
  coachSummary: string;
  coachLoadLabel: string;
  coachLoadActionId: string;
  onCoachLoad: () => void;
  coachLoadDisabled: boolean;
  coachFocusLabel: string;
  coachFocusActionId: string;
  onCoachFocusAtRisk: () => void;
  coachOpenOperationsLabel: string;
  coachOpenOperationsActionId: string;
  onCoachOpenOperations: () => void;
  athletesLoadedLabel: string;
  athletesLoadedValue: string;
  athletesAtRiskLabel: string;
  athletesAtRiskValue: string;
  coachEmptyLabel: string;
  coachRows: AthleteOperationsRow[];
  plansLabel: string;
  sessionsLabel: string;
  nutritionLabel: string;
  lastSessionLabel: string;
  riskAttentionLabel: string;
  riskNormalLabel: string;
  riskClassName: (riskLevel: AthleteRiskLevel) => string;
  showCohortView: boolean;
  cohortScreenId: string;
  cohortRouteId: string;
  cohortStatusId: string;
  cohortTitle: string;
  cohortSummary: string;
  cohortLoadLabel: string;
  cohortLoadActionId: string;
  onCohortLoad: () => void;
  cohortLoadDisabled: boolean;
  cohortFocusLabel: string;
  cohortFocusActionId: string;
  onCohortFocusHighestRisk: () => void;
  cohortRows: CohortNutritionRow[];
  cohortRowsLoadedValue: string;
  cohortAtRiskValue: string;
  cohortEmptyLabel: string;
  cohortLogsLabel: string;
  cohortAvgCaloriesLabel: string;
  cohortAvgProteinLabel: string;
};

type StatLineProps = {
  label: string;
  value: string;
};

function StatLine({ label, value }: StatLineProps) {
  return (
    <p className="history-item-head">
      <span>{label}</span>
      <strong>{value}</strong>
    </p>
  );
}

function RiskPill({
  riskLevel,
  attentionLabel,
  normalLabel,
  classNameForRisk
}: {
  riskLevel: AthleteRiskLevel;
  attentionLabel: string;
  normalLabel: string;
  classNameForRisk: (riskLevel: AthleteRiskLevel) => string;
}) {
  return (
    <span className={`status-pill status-${classNameForRisk(riskLevel)}`}>
      {riskLevel === "attention" ? attentionLabel : normalLabel}
    </span>
  );
}

export const NutritionCoachPanel = memo(function NutritionCoachPanel({
  coachScreenId,
  coachRouteId,
  coachStatusId,
  coachTitle,
  coachSummary,
  coachLoadLabel,
  coachLoadActionId,
  onCoachLoad,
  coachLoadDisabled,
  coachFocusLabel,
  coachFocusActionId,
  onCoachFocusAtRisk,
  coachOpenOperationsLabel,
  coachOpenOperationsActionId,
  onCoachOpenOperations,
  athletesLoadedLabel,
  athletesLoadedValue,
  athletesAtRiskLabel,
  athletesAtRiskValue,
  coachEmptyLabel,
  coachRows,
  plansLabel,
  sessionsLabel,
  nutritionLabel,
  lastSessionLabel,
  riskAttentionLabel,
  riskNormalLabel,
  riskClassName,
  showCohortView,
  cohortScreenId,
  cohortRouteId,
  cohortStatusId,
  cohortTitle,
  cohortSummary,
  cohortLoadLabel,
  cohortLoadActionId,
  onCohortLoad,
  cohortLoadDisabled,
  cohortFocusLabel,
  cohortFocusActionId,
  onCohortFocusHighestRisk,
  cohortRows,
  cohortRowsLoadedValue,
  cohortAtRiskValue,
  cohortEmptyLabel,
  cohortLogsLabel,
  cohortAvgCaloriesLabel,
  cohortAvgProteinLabel
}: NutritionCoachPanelProps) {
  return (
    <>
      <div
        className="history-list"
        data-screen-id={coachScreenId}
        data-route-id={coachRouteId}
        data-status-id={coachStatusId}
      >
        <p className="section-subtitle">{coachTitle}</p>
        <p className="runtime-state-copy">{coachSummary}</p>
        <div className="inline-inputs">
          <button
            className="button primary"
            onClick={onCoachLoad}
            type="button"
            data-action-id={coachLoadActionId}
            disabled={coachLoadDisabled}
          >
            {coachLoadLabel}
          </button>
          <button
            className="button ghost"
            onClick={onCoachFocusAtRisk}
            type="button"
            data-action-id={coachFocusActionId}
          >
            {coachFocusLabel}
          </button>
          <button
            className="button ghost"
            onClick={onCoachOpenOperations}
            type="button"
            data-action-id={coachOpenOperationsActionId}
          >
            {coachOpenOperationsLabel}
          </button>
        </div>
        <StatLine label={athletesLoadedLabel} value={athletesLoadedValue} />
        <StatLine label={athletesAtRiskLabel} value={athletesAtRiskValue} />
        {coachRows.length === 0 ? (
          <p className="empty-state">{coachEmptyLabel}</p>
        ) : (
          <div className="history-list">
            {coachRows.map((row) => (
              <article key={row.athleteId} className="history-item">
                <div className="history-item-head">
                  <strong>{row.athleteId}</strong>
                  <RiskPill
                    riskLevel={row.riskLevel}
                    attentionLabel={riskAttentionLabel}
                    normalLabel={riskNormalLabel}
                    classNameForRisk={riskClassName}
                  />
                </div>
                <div className="history-values">
                  <span>{plansLabel} {row.plansCount}</span>
                  <span>{sessionsLabel} {row.sessionsCount}</span>
                  <span>{nutritionLabel} {row.nutritionLogsCount}</span>
                  <span>{lastSessionLabel} {row.lastSessionDate}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      {showCohortView ? (
        <div
          className="history-list"
          data-screen-id={cohortScreenId}
          data-route-id={cohortRouteId}
          data-status-id={cohortStatusId}
        >
          <p className="section-subtitle">{cohortTitle}</p>
          <p className="runtime-state-copy">{cohortSummary}</p>
          <div className="inline-inputs">
            <button
              className="button primary"
              onClick={onCohortLoad}
              type="button"
              data-action-id={cohortLoadActionId}
              disabled={cohortLoadDisabled}
            >
              {cohortLoadLabel}
            </button>
            <button
              className="button ghost"
              onClick={onCohortFocusHighestRisk}
              type="button"
              data-action-id={cohortFocusActionId}
            >
              {cohortFocusLabel}
            </button>
          </div>
          <StatLine label={athletesLoadedLabel} value={cohortRowsLoadedValue} />
          <StatLine label={athletesAtRiskLabel} value={cohortAtRiskValue} />
          {cohortRows.length === 0 ? (
            <p className="empty-state">{cohortEmptyLabel}</p>
          ) : (
            <div className="history-list">
              {cohortRows.map((row) => (
                <article key={row.athleteId} className="history-item">
                  <div className="history-item-head">
                    <strong>{row.athleteId}</strong>
                    <RiskPill
                      riskLevel={row.riskLevel}
                      attentionLabel={riskAttentionLabel}
                      normalLabel={riskNormalLabel}
                      classNameForRisk={riskClassName}
                    />
                  </div>
                  <div className="history-values">
                    <span>{cohortLogsLabel} {row.logsCount}</span>
                    <span>{cohortAvgCaloriesLabel} {row.averageCalories}</span>
                    <span>{cohortAvgProteinLabel} {row.averageProteinGrams}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </>
  );
});
