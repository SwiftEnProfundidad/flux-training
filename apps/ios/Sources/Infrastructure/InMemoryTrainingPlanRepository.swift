import Foundation

public actor InMemoryTrainingPlanRepository: TrainingPlanRepository {
  private var plans: [TrainingPlan] = []

  public init() {}

  public func save(plan: TrainingPlan) async throws {
    plans.append(plan)
  }

  public func allPlans() async -> [TrainingPlan] {
    plans
  }

  public func listByUserID(_ userID: String) async throws -> [TrainingPlan] {
    plans.filter { $0.userID == userID }
  }
}
