import Foundation
import Observation

@MainActor
@Observable
public final class NutritionViewModel {
  public var date: String = "2026-02-26"
  public var calories: Double = 2200
  public var proteinGrams: Double = 150
  public var carbsGrams: Double = 230
  public var fatsGrams: Double = 70
  public private(set) var logs: [NutritionLog] = []
  public private(set) var status: String = "idle"

  private let createNutritionLogUseCase: CreateNutritionLogUseCase
  private let listNutritionLogsUseCase: ListNutritionLogsUseCase

  public init(
    createNutritionLogUseCase: CreateNutritionLogUseCase,
    listNutritionLogsUseCase: ListNutritionLogsUseCase
  ) {
    self.createNutritionLogUseCase = createNutritionLogUseCase
    self.listNutritionLogsUseCase = listNutritionLogsUseCase
  }

  public func saveLog(userID: String) async {
    do {
      let _ = try await createNutritionLogUseCase.execute(
        log: NutritionLog(
          userID: userID,
          date: date,
          calories: calories,
          proteinGrams: proteinGrams,
          carbsGrams: carbsGrams,
          fatsGrams: fatsGrams
        )
      )
      status = "saved"
    } catch {
      status = "error"
    }
  }

  public func refreshLogs(userID: String) async {
    do {
      logs = try await listNutritionLogsUseCase.execute(userID: userID)
      status = "loaded"
    } catch {
      status = "error"
    }
  }
}

