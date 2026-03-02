import Foundation

public enum DailyTrainingVideoScreenStatus: String, Sendable, Equatable {
  case idle
  case loading
  case saved
  case loaded
  case queued
  case error
  case offline
  case denied
}

public struct DailyTrainingVideoScreenContract: Sendable, Equatable {
  public var planName: String
  public var selectedPlanID: String
  public var selectedExerciseID: String
  public var videoLocale: String
  public var sessions: [WorkoutSession]
  public var trainingStatus: DailyTrainingVideoScreenStatus
  public var sessionStatus: DailyTrainingVideoScreenStatus
  public var videoStatus: DailyTrainingVideoScreenStatus

  public init(
    planName: String = "",
    selectedPlanID: String = "",
    selectedExerciseID: String = "goblet-squat",
    videoLocale: String = "es-ES",
    sessions: [WorkoutSession] = [],
    trainingStatus: DailyTrainingVideoScreenStatus = .idle,
    sessionStatus: DailyTrainingVideoScreenStatus = .idle,
    videoStatus: DailyTrainingVideoScreenStatus = .idle
  ) {
    self.planName = planName
    self.selectedPlanID = selectedPlanID
    self.selectedExerciseID = selectedExerciseID
    self.videoLocale = videoLocale
    self.sessions = sessions
    self.trainingStatus = trainingStatus
    self.sessionStatus = sessionStatus
    self.videoStatus = videoStatus
  }
}
