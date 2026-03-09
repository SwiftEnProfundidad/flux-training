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
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.saveLog))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.nutritionStageLog))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 12) {
            fieldLabel(copy.text(.nutritionDate))
            TextField(copy.text(.nutritionDate), text: $viewModel.date)
              .fluxInputFieldStyle()
              .accessibilityIdentifier("nutrition.logMeal.date")

            HStack(spacing: 10) {
              metricInput(
                label: copy.text(.calories),
                value: $viewModel.calories,
                identifier: "nutrition.logMeal.calories"
              )
              metricInput(
                label: copy.text(.protein),
                value: $viewModel.proteinGrams,
                identifier: "nutrition.logMeal.protein"
              )
            }

            HStack(spacing: 10) {
              metricInput(
                label: copy.text(.carbs),
                value: $viewModel.carbsGrams,
                identifier: "nutrition.logMeal.carbs"
              )
              metricInput(
                label: copy.text(.fats),
                value: $viewModel.fatsGrams,
                identifier: "nutrition.logMeal.fats"
              )
            }

            Button(copy.text(.saveLog)) {
              Task { await viewModel.saveLog(userID: userID) }
            }
            .buttonStyle(FluxPrimaryButtonStyle())
            .accessibilityIdentifier("nutrition.logMeal.save")
          }
        }

        FluxCard {
          Text("\(copy.text(.nutritionStatusLabel)): \(copy.humanStatus(viewModel.status))")
            .font(.footnote.weight(.semibold))
            .foregroundStyle(.white.opacity(0.82))
            .accessibilityIdentifier("nutrition.logMeal.status")
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.saveLog))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
  }

  @ViewBuilder
  private func fieldLabel(_ title: String) -> some View {
    Text(title)
      .font(.caption.weight(.semibold))
      .foregroundStyle(.white.opacity(0.8))
  }

  @ViewBuilder
  private func metricInput(
    label: String,
    value: Binding<Double>,
    identifier: String
  ) -> some View {
    VStack(alignment: .leading, spacing: 6) {
      fieldLabel(label)
      TextField(label, value: value, format: .number)
        .fluxInputFieldStyle()
        .accessibilityIdentifier(identifier)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}
