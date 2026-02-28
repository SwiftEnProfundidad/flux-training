import Foundation
import Observation

@MainActor
@Observable
public final class ProgressViewModel {
  public private(set) var summary: ProgressSummary?
  public private(set) var status: String = "idle"

  private let buildProgressSummaryUseCase: BuildProgressSummaryUseCase

  public init(buildProgressSummaryUseCase: BuildProgressSummaryUseCase) {
    self.buildProgressSummaryUseCase = buildProgressSummaryUseCase
  }

  public func refresh(userID: String) async {
    do {
      summary = try await buildProgressSummaryUseCase.execute(userID: userID)
      status = "loaded"
    } catch {
      status = "error"
    }
  }
}
