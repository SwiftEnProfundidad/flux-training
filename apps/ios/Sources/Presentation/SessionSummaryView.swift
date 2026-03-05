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
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.sessionStatusLabel))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        FluxCard {
          VStack(alignment: .leading, spacing: 8) {
            Text("\(copy.text(.sessionStatusLabel)): \(copy.humanStatus(viewModel.sessionStatus))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("training.sessionSummary.status")
            Text("\(copy.text(.sessionsLabel)): \(viewModel.sessions.count)")
              .foregroundStyle(.white)
              .accessibilityIdentifier("training.sessionSummary.count")
            if let latestSessionEndedAt = viewModel.latestSessionEndedAt {
              Text(
                "\(copy.text(.lastSessionLabel)): \(latestSessionEndedAt.formatted(date: .abbreviated, time: .shortened))"
              )
              .foregroundStyle(.white.opacity(0.7))
              .accessibilityIdentifier("training.sessionSummary.latest")
            }
          }
        }

        HStack(spacing: 10) {
        Button(copy.text(.refreshTrainingCockpit)) {
          Task { await viewModel.refreshDashboard(userID: userID) }
        }
        .buttonStyle(FluxSecondaryButtonStyle())
        .accessibilityIdentifier("training.sessionSummary.refresh")

        Button(copy.text(.logDemoSession)) {
          Task { await viewModel.logDemoSession(userID: userID) }
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("training.sessionSummary.logSession")
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.sessionStatusLabel))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refreshDashboard(userID: userID)
    }
  }
}
