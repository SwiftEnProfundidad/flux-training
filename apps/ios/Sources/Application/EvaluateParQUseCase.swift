import Foundation

public enum EvaluateParQError: Error, Equatable {
  case emptyUserID
  case emptyResponses
}

public struct EvaluateParQUseCase: Sendable {
  public init() {}

  public func execute(userID: String, responses: [ParQResponse]) throws -> HealthScreening {
    guard userID.isEmpty == false else { throw EvaluateParQError.emptyUserID }
    guard responses.isEmpty == false else { throw EvaluateParQError.emptyResponses }

    let risk: HealthRisk = responses.contains(where: { $0.answer }) ? .moderate : .low
    return HealthScreening(
      userID: userID,
      responses: responses,
      risk: risk,
      reviewedAt: Date()
    )
  }
}
