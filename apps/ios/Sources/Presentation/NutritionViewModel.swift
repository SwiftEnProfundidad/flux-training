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

  public var screenStatus: NutritionProgressAIScreenStatus {
    NutritionProgressAIScreenStatus.fromRuntimeStatus(status)
  }

  public init(
    createNutritionLogUseCase: CreateNutritionLogUseCase,
    listNutritionLogsUseCase: ListNutritionLogsUseCase
  ) {
    self.createNutritionLogUseCase = createNutritionLogUseCase
    self.listNutritionLogsUseCase = listNutritionLogsUseCase
  }

  public func saveLog(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      status = NutritionProgressAIScreenStatus.validationError.rawValue
      return
    }

    status = NutritionProgressAIScreenStatus.loading.rawValue
    do {
      let _ = try await createNutritionLogUseCase.execute(
        log: NutritionLog(
          userID: resolvedUserID,
          date: date,
          calories: calories,
          proteinGrams: proteinGrams,
          carbsGrams: carbsGrams,
          fatsGrams: fatsGrams
        )
      )
      status = NutritionProgressAIScreenStatus.saved.rawValue
    } catch {
      status = resolveStatus(for: error)
    }
  }

  public func refreshLogs(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      logs = []
      status = NutritionProgressAIScreenStatus.validationError.rawValue
      return
    }

    status = NutritionProgressAIScreenStatus.loading.rawValue
    do {
      logs = try await listNutritionLogsUseCase.execute(userID: resolvedUserID)
      status = logs.isEmpty
        ? NutritionProgressAIScreenStatus.empty.rawValue
        : NutritionProgressAIScreenStatus.loaded.rawValue
    } catch {
      status = resolveStatus(for: error)
    }
  }

  private func resolveStatus(for error: Error) -> String {
    if error is CreateNutritionLogError {
      return NutritionProgressAIScreenStatus.validationError.rawValue
    }
    if let urlError = error as? URLError, urlError.code == .notConnectedToInternet {
      return NutritionProgressAIScreenStatus.offline.rawValue
    }
    return NutritionProgressAIScreenStatus.error.rawValue
  }
}
