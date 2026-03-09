import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ProgressMetricsView: View {
  @Bindable private var viewModel: ProgressViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String
  private let onOpenWeeklyReview: () -> Void
  private let onOpenGoalAdjust: () -> Void
  private let onOpenAICoach: () -> Void

  public init(
    viewModel: ProgressViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = ProgressRouteContract.metricsDarkScreenID,
    onOpenWeeklyReview: @escaping () -> Void = {},
    onOpenGoalAdjust: @escaping () -> Void = {},
    onOpenAICoach: @escaping () -> Void = {}
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
    self.onOpenWeeklyReview = onOpenWeeklyReview
    self.onOpenGoalAdjust = onOpenGoalAdjust
    self.onOpenAICoach = onOpenAICoach
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.progressTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.progressNavigationTitle))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 12) {
            Text("\(copy.text(.statusLabel)): \(copy.humanStatus(viewModel.status))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("progress.metrics.status")
            Button(copy.text(.loadProgress)) {
              Task { await viewModel.refresh(userID: userID) }
            }
            .buttonStyle(FluxPrimaryButtonStyle())
            .accessibilityIdentifier("progress.metrics.load")
          }
        }

        if let summary = viewModel.summary {
          FluxCard {
            VStack(alignment: .leading, spacing: 10) {
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
          }
        } else {
          FluxCard {
          Text(copy.text(.noProgressLoaded))
              .foregroundStyle(.white.opacity(0.74))
            .accessibilityIdentifier("progress.metrics.empty")
          }
        }

        FluxCard {
          VStack(alignment: .leading, spacing: 10) {
            Text(copy.text(.progressStageOverview))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.8))
            HStack(spacing: 10) {
              Button(copy.text(.progressStageWeeklyReview), action: onOpenWeeklyReview)
                .buttonStyle(FluxSecondaryButtonStyle())
                .accessibilityIdentifier("progress.metrics.openWeeklyReview")
              Button(copy.text(.progressStageGoal), action: onOpenGoalAdjust)
                .buttonStyle(FluxSecondaryButtonStyle())
                .accessibilityIdentifier("progress.metrics.openGoalAdjust")
            }
            Button(copy.text(.progressStageCoach), action: onOpenAICoach)
              .buttonStyle(FluxSecondaryButtonStyle())
              .accessibilityIdentifier("progress.metrics.openAICoach")
          }
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.progressTitle))
    .fluxScreenStyle()
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
