import Foundation

public enum CreateNutritionLogError: Error, Equatable {
  case emptyUserID
  case invalidDate
  case invalidValue
}

public struct CreateNutritionLogUseCase: Sendable {
  private let repository: any NutritionLogRepository

  public init(repository: any NutritionLogRepository) {
    self.repository = repository
  }

  public func execute(log: NutritionLog) async throws -> NutritionLog {
    guard log.userID.isEmpty == false else { throw CreateNutritionLogError.emptyUserID }
    guard log.date.count == 10 else { throw CreateNutritionLogError.invalidDate }
    guard log.calories >= 0,
      log.proteinGrams >= 0,
      log.carbsGrams >= 0,
      log.fatsGrams >= 0
    else {
      throw CreateNutritionLogError.invalidValue
    }
    try await repository.save(log: log)
    return log
  }
}

