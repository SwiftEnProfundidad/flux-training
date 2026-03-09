import { memo } from "react";

type ExerciseDetailVideo = {
  id: string;
  title: string;
  coach: string;
  difficulty: string;
  locale: string;
  durationSeconds: number;
  thumbnailUrl: string;
};

type ExerciseDetailPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  statusLabel: string;
  statusClass: string;
  statusValue: string;
  showStatus: boolean;
  summary: string;
  loadActionLabel: string;
  loadActionId: string;
  onLoadDetail: () => void;
  selectLabel: string;
  selectedVideoId: string;
  selectActionId: string;
  onSelectVideoId: (value: string) => void;
  clearActionLabel: string;
  clearActionId: string;
  onClearSelection: () => void;
  clearDisabled: boolean;
  openActionLabel: string;
  openActionId: string;
  onOpenVideo: () => void;
  openDisabled: boolean;
  noSelectionLabel: string;
  selectedVideo: ExerciseDetailVideo | null;
  coachLabel: string;
  difficultyLabel: string;
  localeLabel: string;
  durationLabel: string;
  videos: ExerciseDetailVideo[];
};

export const ExerciseDetailPanel = memo(function ExerciseDetailPanel({
  screenId,
  routeId,
  statusId,
  title,
  statusLabel,
  statusClass,
  statusValue,
  showStatus,
  summary,
  loadActionLabel,
  loadActionId,
  onLoadDetail,
  selectLabel,
  selectedVideoId,
  selectActionId,
  onSelectVideoId,
  clearActionLabel,
  clearActionId,
  onClearSelection,
  clearDisabled,
  openActionLabel,
  openActionId,
  onOpenVideo,
  openDisabled,
  noSelectionLabel,
  selectedVideo,
  coachLabel,
  difficultyLabel,
  localeLabel,
  durationLabel,
  videos
}: ExerciseDetailPanelProps) {
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
        <button
          className="button ghost"
          onClick={onLoadDetail}
          type="button"
          data-action-id={loadActionId}
        >
          {loadActionLabel}
        </button>
        <select
          aria-label={selectLabel}
          value={selectedVideoId}
          data-action-id={selectActionId}
          onChange={(event) => onSelectVideoId(event.target.value)}
        >
          <option value="">{selectLabel}</option>
          {videos.map((video) => (
            <option key={video.id} value={video.id}>
              {video.title}
            </option>
          ))}
        </select>
        <button
          className="button ghost"
          onClick={onClearSelection}
          type="button"
          data-action-id={clearActionId}
          disabled={clearDisabled}
        >
          {clearActionLabel}
        </button>
        <button
          className="button ghost"
          onClick={onOpenVideo}
          type="button"
          data-action-id={openActionId}
          disabled={openDisabled}
        >
          {openActionLabel}
        </button>
      </div>
      {selectedVideo === null ? (
        <p className="empty-state">{noSelectionLabel}</p>
      ) : (
        <div className="video-grid">
          <article className="video-item">
            <img src={selectedVideo.thumbnailUrl} alt={selectedVideo.title} loading="lazy" />
            <div className="video-body">
              <strong>{selectedVideo.title}</strong>
              <div className="metric-grid">
                <article className="metric-item">
                  <p>{coachLabel}</p>
                  <strong>{selectedVideo.coach}</strong>
                </article>
                <article className="metric-item">
                  <p>{difficultyLabel}</p>
                  <strong>{selectedVideo.difficulty}</strong>
                </article>
                <article className="metric-item">
                  <p>{localeLabel}</p>
                  <strong>{selectedVideo.locale}</strong>
                </article>
                <article className="metric-item">
                  <p>{durationLabel}</p>
                  <strong>{Math.round(selectedVideo.durationSeconds / 60)} min</strong>
                </article>
              </div>
            </div>
          </article>
        </div>
      )}
    </div>
  );
});
