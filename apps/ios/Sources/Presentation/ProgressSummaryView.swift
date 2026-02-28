import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ProgressSummaryView: View {
  @State private var viewModel: ProgressViewModel
  private let userID: String

  public init(viewModel: ProgressViewModel, userID: String = "demo-user") {
    _viewModel = State(initialValue: viewModel)
    self.userID = userID
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text("Progress")
        .font(.title2)

      Button("Load Progress") {
        Task { await viewModel.refresh(userID: userID) }
      }

      Text("Status: \(viewModel.status)")
        .foregroundStyle(.secondary)

      if let summary = viewModel.summary {
        VStack(alignment: .leading, spacing: 8) {
          Text("Workouts: \(summary.workoutSessionsCount)")
          Text("Minutes: \(summary.totalTrainingMinutes, format: .number.precision(.fractionLength(0...2)))")
          Text("Sets: \(summary.totalCompletedSets)")
          Text("Nutrition logs: \(summary.nutritionLogsCount)")
          Text("Avg calories: \(summary.averageCalories, format: .number.precision(.fractionLength(0...2)))")
          Text("Avg protein: \(summary.averageProteinGrams, format: .number.precision(.fractionLength(0...2)))")
          Text("Avg carbs: \(summary.averageCarbsGrams, format: .number.precision(.fractionLength(0...2)))")
          Text("Avg fats: \(summary.averageFatsGrams, format: .number.precision(.fractionLength(0...2)))")
        }

        ForEach(summary.history) { entry in
          VStack(alignment: .leading, spacing: 4) {
            Text(entry.date)
              .font(.headline)
            Text("sessions: \(entry.workoutSessions)")
            Text("minutes: \(entry.trainingMinutes, format: .number.precision(.fractionLength(0...2)))")
            Text("sets: \(entry.completedSets)")
            Text("calories: \(entry.calories ?? 0, format: .number.precision(.fractionLength(0...2)))")
          }
          .padding(10)
          .background(.thinMaterial)
          .clipShape(.rect(cornerRadius: 12))
        }
      } else {
        Text("No progress loaded")
          .foregroundStyle(.secondary)
      }
    }
    .padding()
  }
}
