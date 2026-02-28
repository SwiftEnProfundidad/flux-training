import Foundation

public enum AIRecommendationPriority: String, Sendable, Equatable {
  case high
  case medium
  case low
}

public enum AIRecommendationCategory: String, Sendable, Equatable {
  case training
  case nutrition
  case recovery
  case sync
  case legal
}

public enum AIRecommendationImpact: String, Sendable, Equatable {
  case retention
  case consistency
  case safety
  case performance
}

public struct AIRecommendation: Sendable, Equatable {
  public let id: String
  public let userID: String
  public let title: String
  public let rationale: String
  public let priority: AIRecommendationPriority
  public let category: AIRecommendationCategory
  public let expectedImpact: AIRecommendationImpact
  public let actionLabel: String
  public let generatedAt: Date

  public init(
    id: String,
    userID: String,
    title: String,
    rationale: String,
    priority: AIRecommendationPriority,
    category: AIRecommendationCategory,
    expectedImpact: AIRecommendationImpact,
    actionLabel: String,
    generatedAt: Date
  ) {
    self.id = id
    self.userID = userID
    self.title = title
    self.rationale = rationale
    self.priority = priority
    self.category = category
    self.expectedImpact = expectedImpact
    self.actionLabel = actionLabel
    self.generatedAt = generatedAt
  }
}
