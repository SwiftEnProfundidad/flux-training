import Foundation

public actor InMemoryNutritionLogRepository: NutritionLogRepository {
  private var logs: [NutritionLog] = []

  public init() {}

  public func save(log: NutritionLog) async throws {
    logs.append(log)
  }

  public func listByUserID(_ userID: String) async throws -> [NutritionLog] {
    logs.filter { $0.userID == userID }
  }
}

