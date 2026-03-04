import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct NutritionHubView: View {
  @Bindable private var viewModel: NutritionViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: NutritionViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = NutritionRouteContract.nutritionHubDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    Form {
      Section(copy.text(.nutritionTitle)) {
        Text(copy.text(.nutritionTitle))
          .font(.subheadline)
          .foregroundStyle(.secondary)
      }

      Section(copy.text(.nutritionDate)) {
        TextField(copy.text(.nutritionDate), text: $viewModel.date)
          .textFieldStyle(.roundedBorder)
          .accessibilityIdentifier("nutrition.hub.date")
      }

      Section(copy.text(.nutritionTitle)) {
        HStack {
          TextField(copy.text(.calories), value: $viewModel.calories, format: .number)
            .textFieldStyle(.roundedBorder)
            .accessibilityIdentifier("nutrition.hub.calories")
          TextField(copy.text(.protein), value: $viewModel.proteinGrams, format: .number)
            .textFieldStyle(.roundedBorder)
            .accessibilityIdentifier("nutrition.hub.protein")
        }
        HStack {
          TextField(copy.text(.carbs), value: $viewModel.carbsGrams, format: .number)
            .textFieldStyle(.roundedBorder)
            .accessibilityIdentifier("nutrition.hub.carbs")
          TextField(copy.text(.fats), value: $viewModel.fatsGrams, format: .number)
            .textFieldStyle(.roundedBorder)
            .accessibilityIdentifier("nutrition.hub.fats")
        }
      }

      Section {
        Button(copy.text(.saveLog)) {
          Task { await viewModel.saveLog(userID: userID) }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("nutrition.hub.save")

        Button(copy.text(.loadLogs)) {
          Task { await viewModel.refreshLogs(userID: userID) }
        }
        .buttonStyle(.bordered)
        .accessibilityIdentifier("nutrition.hub.load")
      }

      Section(copy.text(.nutritionStatusLabel)) {
        Text("\(copy.text(.nutritionStatusLabel)): \(copy.humanStatus(viewModel.status))")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("nutrition.hub.status")
        Text("\(copy.text(.nutritionLogsLoaded)): \(viewModel.logs.count)")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("nutrition.hub.logsCount")
      }
    }
    .navigationTitle(copy.text(.nutritionTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task {
      await viewModel.refreshLogs(userID: userID)
    }
  }
}
