import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct WeeklyReviewView: View {
  @Bindable private var progressViewModel: ProgressViewModel
  @Bindable private var trainingViewModel: TrainingFlowViewModel
  @Bindable private var nutritionViewModel: NutritionViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    progressViewModel: ProgressViewModel,
    trainingViewModel: TrainingFlowViewModel,
    nutritionViewModel: NutritionViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = ProgressRouteContract.weeklyReviewDarkScreenID
  ) {
    self.progressViewModel = progressViewModel
    self.trainingViewModel = trainingViewModel
    self.nutritionViewModel = nutritionViewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.progressNavigationTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Button(copy.text(.loadProgress)) {
          Task { await refreshWeeklyReview() }
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("progress.weeklyReview.refresh")

        FluxCard {
          VStack(alignment: .leading, spacing: 8) {
            Text(copy.text(.progressTitle))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
            metricRow(copy.humanStatus(progressViewModel.status), "")
              .accessibilityIdentifier("progress.weeklyReview.progressStatus")
            metricRow(
              copy.text(.progressWorkoutsLabel),
              "\(progressViewModel.summary?.workoutSessionsCount ?? 0)"
            )
            .accessibilityIdentifier("progress.weeklyReview.workouts")
            metricRow(
              copy.text(.progressMinutesLabel),
              format(progressViewModel.summary?.totalTrainingMinutes ?? 0)
            )
            .accessibilityIdentifier("progress.weeklyReview.minutes")
          }
        }

        FluxCard {
          VStack(alignment: .leading, spacing: 8) {
            Text(copy.text(.trainingTitle))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
            metricRow(copy.humanStatus(trainingViewModel.status), "")
              .accessibilityIdentifier("progress.weeklyReview.trainingStatus")
            metricRow(copy.text(.sessionsLabel), "\(trainingViewModel.sessions.count)")
              .accessibilityIdentifier("progress.weeklyReview.sessions")
          }
        }

        FluxCard {
          VStack(alignment: .leading, spacing: 8) {
            Text(copy.text(.nutritionTitle))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
            metricRow(copy.humanStatus(nutritionViewModel.status), "")
              .accessibilityIdentifier("progress.weeklyReview.nutritionStatus")
            metricRow(copy.text(.nutritionLogsLoaded), "\(nutritionViewModel.logs.count)")
              .accessibilityIdentifier("progress.weeklyReview.nutritionLogs")
          }
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.progressNavigationTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await refreshWeeklyReview()
    }
  }

  private func refreshWeeklyReview() async {
    async let refreshProgress: Void = progressViewModel.refresh(userID: userID)
    async let refreshTraining: Void = trainingViewModel.refreshDashboard(userID: userID)
    async let refreshNutrition: Void = nutritionViewModel.refreshLogs(userID: userID)
    _ = await (refreshProgress, refreshTraining, refreshNutrition)
  }

  private func format(_ value: Double) -> String {
    value.formatted(.number.precision(.fractionLength(0...2)))
  }

  @ViewBuilder
  private func metricRow(_ title: String, _ value: String) -> some View {
    HStack(alignment: .firstTextBaseline) {
      Text(title)
        .foregroundStyle(.white.opacity(0.72))
      Spacer(minLength: 12)
      if value.isEmpty == false {
        Text(value)
          .font(.body.weight(.semibold))
          .foregroundStyle(.white)
      }
    }
  }
}
