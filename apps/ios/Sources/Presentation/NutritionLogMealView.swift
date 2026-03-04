import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct NutritionLogMealView: View {
  @Bindable private var viewModel: NutritionViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: NutritionViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = NutritionRouteContract.logMealDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    Form {
      Section(copy.text(.saveLog)) {
        TextField(copy.text(.nutritionDate), text: $viewModel.date)
          .textFieldStyle(.roundedBorder)
          .accessibilityIdentifier("nutrition.logMeal.date")
      }

      Section(copy.text(.nutritionTitle)) {
        HStack {
          TextField(copy.text(.calories), value: $viewModel.calories, format: .number)
            .textFieldStyle(.roundedBorder)
            .accessibilityIdentifier("nutrition.logMeal.calories")
          TextField(copy.text(.protein), value: $viewModel.proteinGrams, format: .number)
            .textFieldStyle(.roundedBorder)
            .accessibilityIdentifier("nutrition.logMeal.protein")
        }
        HStack {
          TextField(copy.text(.carbs), value: $viewModel.carbsGrams, format: .number)
            .textFieldStyle(.roundedBorder)
            .accessibilityIdentifier("nutrition.logMeal.carbs")
          TextField(copy.text(.fats), value: $viewModel.fatsGrams, format: .number)
            .textFieldStyle(.roundedBorder)
            .accessibilityIdentifier("nutrition.logMeal.fats")
        }
      }

      Section {
        Button(copy.text(.saveLog)) {
          Task { await viewModel.saveLog(userID: userID) }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("nutrition.logMeal.save")
      }

      Section(copy.text(.nutritionStatusLabel)) {
        Text("\(copy.text(.nutritionStatusLabel)): \(copy.humanStatus(viewModel.status))")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("nutrition.logMeal.status")
      }
    }
    .navigationTitle(copy.text(.saveLog))
    .accessibilityIdentifier(screenAccessibilityID)
  }
}
