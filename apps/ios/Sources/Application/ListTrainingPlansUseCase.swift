import Foundation

public struct ListTrainingPlansUseCase: Sendable {
  private let repository: any TrainingPlanRepository

  public init(repository: any TrainingPlanRepository) {
    self.repository = repository
  }

  public func execute(userID: String) async throws -> [TrainingPlan] {
    guard userID.isEmpty == false else { return [] }
    return try await repository.listByUserID(userID)
  }
}

