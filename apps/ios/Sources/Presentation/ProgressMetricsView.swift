import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ProgressMetricsView: View {
  @Bindable private var viewModel: ProgressViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: ProgressViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = ProgressRouteContract.metricsDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    Form {
      Section(copy.text(.progressTitle)) {
        Text(copy.text(.progressNavigationTitle))
          .font(.subheadline)
          .foregroundStyle(.secondary)
      }

      Section {
        Button(copy.text(.loadProgress)) {
          Task { await viewModel.refresh(userID: userID) }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("progress.metrics.load")
      }

      Section(copy.text(.statusLabel)) {
        Text(copy.humanStatus(viewModel.status))
          .font(.footnote)
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("progress.metrics.status")
      }

      if let summary = viewModel.summary {
        Section(copy.text(.progressTitle)) {
          metricRow(copy.text(.progressWorkoutsLabel), "\(summary.workoutSessionsCount)")
            .accessibilityIdentifier("progress.metrics.workouts")
          metricRow(copy.text(.progressMinutesLabel), format(summary.totalTrainingMinutes))
            .accessibilityIdentifier("progress.metrics.minutes")
          metricRow(copy.text(.progressSetsLabel), "\(summary.totalCompletedSets)")
            .accessibilityIdentifier("progress.metrics.sets")
          metricRow(copy.text(.progressNutritionLogsLabel), "\(summary.nutritionLogsCount)")
            .accessibilityIdentifier("progress.metrics.nutritionLogs")
          metricRow(copy.text(.progressAverageCaloriesLabel), format(summary.averageCalories))
            .accessibilityIdentifier("progress.metrics.avgCalories")
          metricRow(copy.text(.progressAverageProteinLabel), format(summary.averageProteinGrams))
            .accessibilityIdentifier("progress.metrics.avgProtein")
          metricRow(copy.text(.progressAverageCarbsLabel), format(summary.averageCarbsGrams))
            .accessibilityIdentifier("progress.metrics.avgCarbs")
          metricRow(copy.text(.progressAverageFatsLabel), format(summary.averageFatsGrams))
            .accessibilityIdentifier("progress.metrics.avgFats")
        }
      } else {
        Section {
          Text(copy.text(.noProgressLoaded))
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("progress.metrics.empty")
        }
      }
    }
    .navigationTitle(copy.text(.progressTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refresh(userID: userID)
    }
  }

  @ViewBuilder
  private func metricRow(_ title: String, _ value: String) -> some View {
    HStack {
      Text(title)
      Spacer(minLength: 12)
      Text(value)
        .font(.body.weight(.semibold))
    }
  }

  private func format(_ value: Double) -> String {
    value.formatted(.number.precision(.fractionLength(0...2)))
  }
}
