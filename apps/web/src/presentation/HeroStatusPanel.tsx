import { memo } from "react";
import { type AppLanguage } from "./i18n";

type HeroLane = "main" | "secondary";

type HeroStatusPanelProps = {
  language: AppLanguage;
  showQATools: boolean;
  webLane: HeroLane;
  readinessScore: number;
  readinessStateLabel: string;
  labels: {
    language: string;
    lane: string;
    laneMain: string;
    laneSecondary: string;
    readiness: string;
    authMetric: string;
    queueMetric: string;
    goalMetric: string;
    syncMetric: string;
    runtimeMetric: string;
  };
  values: {
    goal: string;
    auth: string;
    queue: string;
    sync: string;
    runtime: string;
  };
  hasAuthenticatedSession: boolean;
  onLanguageChange: (language: AppLanguage) => void;
  onWebLaneChange: (lane: HeroLane) => void;
};

export const HeroStatusPanel = memo(function HeroStatusPanel({
  language,
  showQATools,
  webLane,
  readinessScore,
  readinessStateLabel,
  labels,
  values,
  hasAuthenticatedSession,
  onLanguageChange,
  onWebLaneChange
}: HeroStatusPanelProps) {
  return (
    <>
      <div className="language-toggle">
        <span>{labels.language}</span>
        <div className="language-toggle-buttons">
          <button
            className={`button ghost language-button ${language === "es" ? "active" : ""}`}
            onClick={() => onLanguageChange("es")}
            type="button"
          >
            ES
          </button>
          <button
            className={`button ghost language-button ${language === "en" ? "active" : ""}`}
            onClick={() => onLanguageChange("en")}
            type="button"
          >
            EN
          </button>
        </div>
        {showQATools ? (
          <>
            <span>{labels.lane}</span>
            <div className="language-toggle-buttons">
              <button
                className={`button ghost language-button ${webLane === "main" ? "active" : ""}`}
                onClick={() => onWebLaneChange("main")}
                type="button"
              >
                {labels.laneMain}
              </button>
              <button
                className={`button ghost language-button ${webLane === "secondary" ? "active" : ""}`}
                onClick={() => onWebLaneChange("secondary")}
                type="button"
              >
                {labels.laneSecondary}
              </button>
            </div>
          </>
        ) : null}
      </div>
      <div className="readiness-panel">
        <p className="readiness-label">{labels.readiness}</p>
        <p className="readiness-score">{readinessScore}%</p>
        <p className="readiness-state">{readinessStateLabel}</p>
        <div className="readiness-progress" role="presentation">
          <span style={{ width: `${readinessScore}%` }} />
        </div>
        <div className="hero-metrics">
          {showQATools ? (
            <>
              <MetricItem title={labels.authMetric} value={values.auth} />
              {hasAuthenticatedSession ? (
                <MetricItem title={labels.queueMetric} value={values.queue} />
              ) : null}
              <MetricItem title={labels.goalMetric} value={values.goal} />
              {hasAuthenticatedSession ? (
                <MetricItem title={labels.syncMetric} value={values.sync} />
              ) : null}
              <MetricItem title={labels.runtimeMetric} value={values.runtime} />
            </>
          ) : (
            <MetricItem title={labels.goalMetric} value={values.goal} />
          )}
        </div>
      </div>
    </>
  );
});

type MetricItemProps = {
  title: string;
  value: string;
};

const MetricItem = memo(function MetricItem({ title, value }: MetricItemProps) {
  return (
    <article className="metric-item">
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  );
});
