import Foundation

public enum NutritionProgressAIScreenStatus: String, Sendable, Equatable {
  case idle
  case loading
  case empty
  case saved
  case loaded
  case queued
  case validationError = "validation_error"
  case error
  case offline
  case denied

  public static func fromRuntimeStatus(_ rawStatus: String) -> NutritionProgressAIScreenStatus {
    switch rawStatus.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() {
    case "loading":
      return .loading
    case "empty":
      return .empty
    case "saved":
      return .saved
    case "loaded", "session_active", "fallback_loaded", "synced", "event_saved", "crash_saved":
      return .loaded
    case "queued":
      return .queued
    case "validation_error":
      return .validationError
    case "offline":
      return .offline
    case "denied":
      return .denied
    case "error", "auth_error":
      return .error
    default:
      return .idle
    }
  }
}

public struct NutritionProgressAIScreenContract: Sendable, Equatable {
  public var nutritionLogs: [NutritionLog]
  public var progressSummary: ProgressSummary?
  public var recommendations: [AIRecommendation]
  public var nutritionStatus: NutritionProgressAIScreenStatus
  public var progressStatus: NutritionProgressAIScreenStatus
  public var recommendationsStatus: NutritionProgressAIScreenStatus

  public init(
    nutritionLogs: [NutritionLog] = [],
    progressSummary: ProgressSummary? = nil,
    recommendations: [AIRecommendation] = [],
    nutritionStatus: NutritionProgressAIScreenStatus = .idle,
    progressStatus: NutritionProgressAIScreenStatus = .idle,
    recommendationsStatus: NutritionProgressAIScreenStatus = .idle
  ) {
    self.nutritionLogs = nutritionLogs
    self.progressSummary = progressSummary
    self.recommendations = recommendations
    self.nutritionStatus = nutritionStatus
    self.progressStatus = progressStatus
    self.recommendationsStatus = recommendationsStatus
  }
}
