import Foundation

public enum CreateTrainingPlanError: Error, Equatable {
  case emptyID
  case emptyUserID
  case emptyName
  case invalidWeeks
  case emptyDays
}

public struct CreateTrainingPlanUseCase: Sendable {
  private let repository: any TrainingPlanRepository

  public init(repository: any TrainingPlanRepository) {
    self.repository = repository
  }

  public func execute(
    id: String,
    userID: String,
    name: String,
    weeks: Int,
    days: [TrainingPlanDay]
  ) async throws -> TrainingPlan {
    guard id.isEmpty == false else { throw CreateTrainingPlanError.emptyID }
    guard userID.isEmpty == false else { throw CreateTrainingPlanError.emptyUserID }
    guard name.isEmpty == false else { throw CreateTrainingPlanError.emptyName }
    guard weeks > 0 else { throw CreateTrainingPlanError.invalidWeeks }
    guard days.isEmpty == false else { throw CreateTrainingPlanError.emptyDays }

    let plan = TrainingPlan(
      id: id,
      userID: userID,
      name: name,
      weeks: weeks,
      days: days,
      createdAt: Date()
    )
    try await repository.save(plan: plan)
    return plan
  }
}

