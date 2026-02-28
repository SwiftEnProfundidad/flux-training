import Foundation

public struct NutritionLog: Sendable, Equatable {
  public let userID: String
  public let date: String
  public let calories: Double
  public let proteinGrams: Double
  public let carbsGrams: Double
  public let fatsGrams: Double

  public init(
    userID: String,
    date: String,
    calories: Double,
    proteinGrams: Double,
    carbsGrams: Double,
    fatsGrams: Double
  ) {
    self.userID = userID
    self.date = date
    self.calories = calories
    self.proteinGrams = proteinGrams
    self.carbsGrams = carbsGrams
    self.fatsGrams = fatsGrams
  }
}

public protocol NutritionLogRepository: Sendable {
  func save(log: NutritionLog) async throws
  func listByUserID(_ userID: String) async throws -> [NutritionLog]
}

