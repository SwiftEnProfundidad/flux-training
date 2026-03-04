import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct SessionSummaryView: View {
  @Bindable private var viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = TrainingRouteContract.sessionSummaryDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    Form {
      Section(copy.text(.sessionStatusLabel)) {
        Text("\(copy.text(.sessionStatusLabel)): \(copy.humanStatus(viewModel.sessionStatus))")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.sessionSummary.status")
        Text("\(copy.text(.sessionsLabel)): \(viewModel.sessions.count)")
          .accessibilityIdentifier("training.sessionSummary.count")
        if let latestSessionEndedAt = viewModel.latestSessionEndedAt {
          Text(
            "\(copy.text(.lastSessionLabel)): \(latestSessionEndedAt.formatted(date: .abbreviated, time: .shortened))"
          )
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.sessionSummary.latest")
        }
      }

      Section(copy.text(.trainingTitle)) {
        Button(copy.text(.refreshTrainingCockpit)) {
          Task { await viewModel.refreshDashboard(userID: userID) }
        }
        .buttonStyle(.bordered)
        .accessibilityIdentifier("training.sessionSummary.refresh")

        Button(copy.text(.logDemoSession)) {
          Task { await viewModel.logDemoSession(userID: userID) }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("training.sessionSummary.logSession")
      }
    }
    .navigationTitle(copy.text(.sessionStatusLabel))
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refreshDashboard(userID: userID)
    }
  }
}
