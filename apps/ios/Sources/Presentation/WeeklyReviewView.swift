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
    Form {
      Section(copy.text(.progressNavigationTitle)) {
        Button(copy.text(.loadProgress)) {
          Task { await refreshWeeklyReview() }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("progress.weeklyReview.refresh")
      }

      Section(copy.text(.progressTitle)) {
        Text(copy.humanStatus(progressViewModel.status))
          .accessibilityIdentifier("progress.weeklyReview.progressStatus")
        Text("\(copy.text(.progressWorkoutsLabel)): \(progressViewModel.summary?.workoutSessionsCount ?? 0)")
          .accessibilityIdentifier("progress.weeklyReview.workouts")
        Text("\(copy.text(.progressMinutesLabel)): \(format(progressViewModel.summary?.totalTrainingMinutes ?? 0))")
          .accessibilityIdentifier("progress.weeklyReview.minutes")
      }

      Section(copy.text(.trainingTitle)) {
        Text(copy.humanStatus(trainingViewModel.status))
          .accessibilityIdentifier("progress.weeklyReview.trainingStatus")
        Text("\(copy.text(.sessionsLabel)): \(trainingViewModel.sessions.count)")
          .accessibilityIdentifier("progress.weeklyReview.sessions")
      }

      Section(copy.text(.nutritionTitle)) {
        Text(copy.humanStatus(nutritionViewModel.status))
          .accessibilityIdentifier("progress.weeklyReview.nutritionStatus")
        Text("\(copy.text(.nutritionLogsLoaded)): \(nutritionViewModel.logs.count)")
          .accessibilityIdentifier("progress.weeklyReview.nutritionLogs")
      }
    }
    .navigationTitle(copy.text(.progressNavigationTitle))
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
}
