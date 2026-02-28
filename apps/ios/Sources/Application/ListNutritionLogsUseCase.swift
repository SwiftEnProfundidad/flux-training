import Foundation

public struct ListNutritionLogsUseCase: Sendable {
  private let repository: any NutritionLogRepository

  public init(repository: any NutritionLogRepository) {
    self.repository = repository
  }

  public func execute(userID: String) async throws -> [NutritionLog] {
    guard userID.isEmpty == false else { return [] }
    return try await repository.listByUserID(userID)
  }
}

