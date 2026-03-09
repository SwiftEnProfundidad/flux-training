import Foundation
import Observation

@MainActor
@Observable
public final class ProgressViewModel {
  public private(set) var summary: ProgressSummary?
  public private(set) var status: String = "idle"

  private let buildProgressSummaryUseCase: BuildProgressSummaryUseCase

  public var screenStatus: NutritionProgressAIScreenStatus {
    NutritionProgressAIScreenStatus.fromRuntimeStatus(status)
  }

  public init(buildProgressSummaryUseCase: BuildProgressSummaryUseCase) {
    self.buildProgressSummaryUseCase = buildProgressSummaryUseCase
  }

  public func refresh(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      summary = nil
      status = NutritionProgressAIScreenStatus.validationError.rawValue
      return
    }

    status = NutritionProgressAIScreenStatus.loading.rawValue
    do {
      summary = try await buildProgressSummaryUseCase.execute(userID: resolvedUserID)
      if let summary, summary.workoutSessionsCount == 0, summary.nutritionLogsCount == 0 {
        status = NutritionProgressAIScreenStatus.empty.rawValue
      } else {
        status = NutritionProgressAIScreenStatus.loaded.rawValue
      }
    } catch {
      summary = nil
      status = resolveStatus(for: error)
    }
  }

  private func resolveStatus(for error: Error) -> String {
    if error is BuildProgressSummaryUseCaseError {
      return NutritionProgressAIScreenStatus.validationError.rawValue
    }
    if let urlError = error as? URLError, urlError.code == .notConnectedToInternet {
      return NutritionProgressAIScreenStatus.offline.rawValue
    }
    return NutritionProgressAIScreenStatus.error.rawValue
  }
}
