import Foundation

public enum HealthRisk: String, Sendable, Equatable {
  case low
  case moderate
  case high
}

public struct ParQResponse: Sendable, Equatable {
  public let questionID: String
  public let answer: Bool

  public init(questionID: String, answer: Bool) {
    self.questionID = questionID
    self.answer = answer
  }
}

public struct HealthScreening: Sendable, Equatable {
  public let userID: String
  public let responses: [ParQResponse]
  public let risk: HealthRisk
  public let reviewedAt: Date

  public init(userID: String, responses: [ParQResponse], risk: HealthRisk, reviewedAt: Date) {
    self.userID = userID
    self.responses = responses
    self.risk = risk
    self.reviewedAt = reviewedAt
  }
}

