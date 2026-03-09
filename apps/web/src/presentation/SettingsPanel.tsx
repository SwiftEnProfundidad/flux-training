import { memo } from "react";

type SettingsPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  status: string;
  statusLabel: string;
  notificationsEnabled: boolean;
  onNotificationsChange: (value: boolean) => void;
  notificationsLabel: string;
  watchSyncEnabled: boolean;
  onWatchSyncChange: (value: boolean) => void;
  watchSyncLabel: string;
  calendarSyncEnabled: boolean;
  onCalendarSyncChange: (value: boolean) => void;
  calendarSyncLabel: string;
  saveLabel: string;
  saveActionId: string;
  onSave: () => void;
};

export const SettingsPanel = memo(function SettingsPanel({
  screenId,
  routeId,
  statusId,
  title,
  status,
  statusLabel,
  notificationsEnabled,
  onNotificationsChange,
  notificationsLabel,
  watchSyncEnabled,
  onWatchSyncChange,
  watchSyncLabel,
  calendarSyncEnabled,
  onCalendarSyncChange,
  calendarSyncLabel,
  saveLabel,
  saveActionId,
  onSave
}: SettingsPanelProps) {
  return (
    <article
      className="module-card"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-status-id={statusId}
    >
      <header className="module-header">
        <h2>{title}</h2>
        <p>
          {statusLabel}: <span className="status-pill">{status}</span>
        </p>
      </header>
      <div className="form-grid">
        <label>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(event) => onNotificationsChange(event.target.checked)}
          />
          {notificationsLabel}
        </label>
        <label>
          <input
            type="checkbox"
            checked={watchSyncEnabled}
            onChange={(event) => onWatchSyncChange(event.target.checked)}
          />
          {watchSyncLabel}
        </label>
        <label>
          <input
            type="checkbox"
            checked={calendarSyncEnabled}
            onChange={(event) => onCalendarSyncChange(event.target.checked)}
          />
          {calendarSyncLabel}
        </label>
        <button className="button primary" onClick={onSave} type="button" data-action-id={saveActionId}>
          {saveLabel}
        </button>
      </div>
    </article>
  );
});
