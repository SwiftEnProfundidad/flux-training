import Foundation

public enum NutritionProgressAIScreenStatus: String, Sendable, Equatable {
  case idle
  case loading
  case saved
  case loaded
  case queued
  case error
  case offline
  case denied
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
