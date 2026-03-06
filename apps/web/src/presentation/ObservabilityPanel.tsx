import { memo } from "react";
import type { AppLanguage } from "./i18n";

interface ObservabilityPanelProps {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  status: string;
  statusLabel: string;
  language: AppLanguage;
  trackEventLabel: string;
  reportCrashLabel: string;
  loadDataLabel: string;
  trackEventActionId: string;
  reportCrashActionId: string;
  loadDataActionId: string;
  onTrackEvent: () => void;
  onReportCrash: () => void;
  onLoadData: () => void;
  analyticsEventsLabel: string;
  analyticsEventsValue: string;
  crashReportsLabel: string;
  crashReportsValue: string;
  blockedActionsLabel: string;
  blockedActionsValue: string;
  deniedEventsLabel: string;
  deniedEventsValue: string;
  fatalCrashesLabel: string;
  fatalCrashesValue: string;
  canonicalCoverageLabel: string;
  canonicalCoverageValue: string;
  operationalAlertsLabel: string;
  operationalAlertsValue: string;
  runbooksLabel: string;
  runbooksValue: string;
  onCallOwnerLabel: string;
  onCallOwnerValue: string;
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span>{label}</span> <strong>{value}</strong>
    </p>
  );
}

export const ObservabilityPanel = memo(function ObservabilityPanel({
  screenId,
  routeId,
  statusId,
  title,
  status,
  statusLabel,
  language,
  trackEventLabel,
  reportCrashLabel,
  loadDataLabel,
  trackEventActionId,
  reportCrashActionId,
  loadDataActionId,
  onTrackEvent,
  onReportCrash,
  onLoadData,
  analyticsEventsLabel,
  analyticsEventsValue,
  crashReportsLabel,
  crashReportsValue,
  blockedActionsLabel,
  blockedActionsValue,
  deniedEventsLabel,
  deniedEventsValue,
  fatalCrashesLabel,
  fatalCrashesValue,
  canonicalCoverageLabel,
  canonicalCoverageValue,
  operationalAlertsLabel,
  operationalAlertsValue,
  runbooksLabel,
  runbooksValue,
  onCallOwnerLabel,
  onCallOwnerValue
}: ObservabilityPanelProps) {
  return (
    <article
      className="module-card"
      data-language={language}
      data-route-id={routeId}
      data-screen-id={screenId}
      data-status-id={statusId}
    >
      <div className="section-heading">
        <h2>{title}</h2>
        <p>
          {statusLabel}: {status}
        </p>
      </div>
      <div className="form-grid">
        <div className="inline-inputs">
          <button className="button primary" data-action-id={trackEventActionId} onClick={onTrackEvent} type="button">
            {trackEventLabel}
          </button>
          <button className="button ghost" data-action-id={reportCrashActionId} onClick={onReportCrash} type="button">
            {reportCrashLabel}
          </button>
          <button className="button ghost" data-action-id={loadDataActionId} onClick={onLoadData} type="button">
            {loadDataLabel}
          </button>
        </div>
        <StatRow label={analyticsEventsLabel} value={analyticsEventsValue} />
        <StatRow label={crashReportsLabel} value={crashReportsValue} />
        <StatRow label={blockedActionsLabel} value={blockedActionsValue} />
        <StatRow label={deniedEventsLabel} value={deniedEventsValue} />
        <StatRow label={fatalCrashesLabel} value={fatalCrashesValue} />
        <StatRow label={canonicalCoverageLabel} value={canonicalCoverageValue} />
        <StatRow label={operationalAlertsLabel} value={operationalAlertsValue} />
        <StatRow label={runbooksLabel} value={runbooksValue} />
        <StatRow label={onCallOwnerLabel} value={onCallOwnerValue} />
      </div>
    </article>
  );
});
