import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct TrainingTodayView: View {
  @Bindable private var viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = TrainingRouteContract.todayDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    Form {
      Section(copy.text(.trainingCockpitTitle)) {
        Button(copy.text(.refreshTrainingCockpit)) {
          Task { await viewModel.refreshDashboard(userID: userID) }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("training.today.refresh")
      }

      Section(copy.text(.statusLabel)) {
        Text(copy.humanStatus(viewModel.status))
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.today.status")
      }

      Section(copy.text(.trainingTitle)) {
        Text("\(copy.text(.plansLoadedLabel)): \(viewModel.plans.count)")
          .accessibilityIdentifier("training.today.plans")
        Text("\(copy.text(.todaySessionsLabel)): \(viewModel.todaySessionsCount)")
          .accessibilityIdentifier("training.today.sessions")
        if let latestSessionEndedAt = viewModel.latestSessionEndedAt {
          Text(
            "\(copy.text(.lastSessionLabel)): \(latestSessionEndedAt.formatted(date: .abbreviated, time: .shortened))"
          )
          .accessibilityIdentifier("training.today.latestSession")
        }
      }
    }
    .navigationTitle(copy.text(.trainingTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refreshDashboard(userID: userID)
    }
  }
}
