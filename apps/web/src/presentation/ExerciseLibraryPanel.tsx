import { memo } from "react";

type ExerciseLibraryVideo = {
  id: string;
  title: string;
  coach: string;
  difficulty: string;
  durationSeconds: number;
  thumbnailUrl: string;
  videoUrl: string;
};

type ExerciseLibraryPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  statusLabel: string;
  statusClass: string;
  statusValue: string;
  showStatus: boolean;
  exercisePickerLabel: string;
  selectedExercise: string;
  selectExerciseActionId: string;
  onSelectExercise: (value: string) => void;
  videoLocalePickerLabel: string;
  videoLocale: string;
  selectLocaleActionId: string;
  onSelectLocale: (value: string) => void;
  loadVideosLabel: string;
  loadVideosActionId: string;
  onLoadVideos: () => void;
  videosStatusLabel: string;
  videosStatusValue: string;
  noVideosLabel: string;
  openVideoLabel: string;
  openVideoActionId: string;
  videos: ExerciseLibraryVideo[];
};

export const ExerciseLibraryPanel = memo(function ExerciseLibraryPanel({
  screenId,
  routeId,
  statusId,
  title,
  statusLabel,
  statusClass,
  statusValue,
  showStatus,
  exercisePickerLabel,
  selectedExercise,
  selectExerciseActionId,
  onSelectExercise,
  videoLocalePickerLabel,
  videoLocale,
  selectLocaleActionId,
  onSelectLocale,
  loadVideosLabel,
  loadVideosActionId,
  onLoadVideos,
  videosStatusLabel,
  videosStatusValue,
  noVideosLabel,
  openVideoLabel,
  openVideoActionId,
  videos
}: ExerciseLibraryPanelProps) {
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
      <div className="inline-inputs">
        <select
          aria-label={exercisePickerLabel}
          value={selectedExercise}
          data-action-id={selectExerciseActionId}
          onChange={(event) => onSelectExercise(event.target.value)}
        >
          <option value="goblet-squat">goblet-squat</option>
          <option value="bench-press">bench-press</option>
        </select>
        <select
          aria-label={videoLocalePickerLabel}
          value={videoLocale}
          data-action-id={selectLocaleActionId}
          onChange={(event) => onSelectLocale(event.target.value)}
        >
          <option value="es-ES">es-ES</option>
          <option value="en-US">en-US</option>
        </select>
        <button
          className="button ghost"
          onClick={onLoadVideos}
          type="button"
          data-action-id={loadVideosActionId}
        >
          {loadVideosLabel}
        </button>
      </div>
      <p className="stat-line">
        <span>{videosStatusLabel}</span>
        <strong>{videosStatusValue}</strong>
      </p>
      {videos.length === 0 ? (
        <p className="empty-state">{noVideosLabel}</p>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <article key={video.id} className="video-item">
              <img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
              <div className="video-body">
                <strong>{video.title}</strong>
                <p>{video.coach}</p>
                <p>
                  {video.difficulty} · {Math.round(video.durationSeconds / 60)} min
                </p>
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-action-id={openVideoActionId}
                >
                  {openVideoLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
});
