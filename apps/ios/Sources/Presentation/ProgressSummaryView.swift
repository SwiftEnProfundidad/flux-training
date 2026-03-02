import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ProgressSummaryView: View {
  @State private var viewModel: ProgressViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: ProgressViewModel,
    userID: String = "demo-user",
    copy: LocalizedCopy = LocalizedCopy(language: .es)
  ) {
    _viewModel = State(initialValue: viewModel)
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.progressTitle))
        .font(.title2)
        .accessibilityIdentifier("progress.title")

      Button(copy.text(.loadProgress)) {
        Task { await viewModel.refresh(userID: userID) }
      }
      .accessibilityIdentifier("progress.load")

      Text("\(copy.text(.statusLabel)): \(copy.humanStatus(viewModel.status))")
        .foregroundStyle(.secondary)
        .accessibilityIdentifier("progress.status")

      if let summary = viewModel.summary {
        VStack(alignment: .leading, spacing: 8) {
          Text("\(copy.text(.progressWorkoutsLabel)): \(summary.workoutSessionsCount)")
          Text("\(copy.text(.progressMinutesLabel)): \(summary.totalTrainingMinutes, format: .number.precision(.fractionLength(0...2)))")
          Text("\(copy.text(.progressSetsLabel)): \(summary.totalCompletedSets)")
          Text("\(copy.text(.progressNutritionLogsLabel)): \(summary.nutritionLogsCount)")
          Text("\(copy.text(.progressAverageCaloriesLabel)): \(summary.averageCalories, format: .number.precision(.fractionLength(0...2)))")
          Text("\(copy.text(.progressAverageProteinLabel)): \(summary.averageProteinGrams, format: .number.precision(.fractionLength(0...2)))")
          Text("\(copy.text(.progressAverageCarbsLabel)): \(summary.averageCarbsGrams, format: .number.precision(.fractionLength(0...2)))")
          Text("\(copy.text(.progressAverageFatsLabel)): \(summary.averageFatsGrams, format: .number.precision(.fractionLength(0...2)))")
        }

        LazyVStack(alignment: .leading, spacing: 8) {
          ForEach(summary.history) { entry in
            VStack(alignment: .leading, spacing: 4) {
              Text(entry.date)
                .font(.headline)
              Text("\(copy.text(.progressEntrySessionsLabel)): \(entry.workoutSessions)")
              Text("\(copy.text(.progressEntryMinutesLabel)): \(entry.trainingMinutes, format: .number.precision(.fractionLength(0...2)))")
              Text("\(copy.text(.progressEntrySetsLabel)): \(entry.completedSets)")
              Text("\(copy.text(.progressEntryCaloriesLabel)): \(entry.calories ?? 0, format: .number.precision(.fractionLength(0...2)))")
            }
            .padding(10)
            .background(.thinMaterial)
            .clipShape(.rect(cornerRadius: 12))
          }
        }
      } else {
        Text(copy.text(.noProgressLoaded))
          .foregroundStyle(.secondary)
      }
    }
    .padding()
  }
}
