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
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.trainingTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.trainingCockpitTitle))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 10) {
              FluxMetricPill(
                title: copy.text(.plansLoadedLabel),
                value: "\(viewModel.plans.count)"
              )
              .accessibilityIdentifier("training.today.plans")
              FluxMetricPill(
                title: copy.text(.todaySessionsLabel),
                value: "\(viewModel.todaySessionsCount)"
              )
              .accessibilityIdentifier("training.today.sessions")
            }
            Text("\(copy.text(.statusLabel)): \(copy.humanStatus(viewModel.status))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("training.today.status")
            if let latestSessionEndedAt = viewModel.latestSessionEndedAt {
              Text(
                "\(copy.text(.lastSessionLabel)): \(latestSessionEndedAt.formatted(date: .abbreviated, time: .shortened))"
              )
              .font(.footnote)
              .foregroundStyle(.white.opacity(0.7))
              .accessibilityIdentifier("training.today.latestSession")
            }
          }
        }

        Button(copy.text(.refreshTrainingCockpit)) {
          Task { await viewModel.refreshDashboard(userID: userID) }
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("training.today.refresh")
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.trainingTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refreshDashboard(userID: userID)
    }
  }
}
