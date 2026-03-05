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
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.nutritionTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.nutritionStageOverview))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 12) {
            fieldLabel(copy.text(.nutritionDate))
            TextField(copy.text(.nutritionDate), text: $viewModel.date)
              .fluxInputFieldStyle()
              .accessibilityIdentifier("nutrition.hub.date")

            HStack(spacing: 10) {
              metricInput(
                label: copy.text(.calories),
                value: $viewModel.calories,
                identifier: "nutrition.hub.calories"
              )
              metricInput(
                label: copy.text(.protein),
                value: $viewModel.proteinGrams,
                identifier: "nutrition.hub.protein"
              )
            }

            HStack(spacing: 10) {
              metricInput(
                label: copy.text(.carbs),
                value: $viewModel.carbsGrams,
                identifier: "nutrition.hub.carbs"
              )
              metricInput(
                label: copy.text(.fats),
                value: $viewModel.fatsGrams,
                identifier: "nutrition.hub.fats"
              )
            }

            HStack(spacing: 10) {
              Button(copy.text(.saveLog)) {
                Task { await viewModel.saveLog(userID: userID) }
              }
              .buttonStyle(FluxPrimaryButtonStyle())
              .accessibilityIdentifier("nutrition.hub.save")

              Button(copy.text(.loadLogs)) {
                Task { await viewModel.refreshLogs(userID: userID) }
              }
              .buttonStyle(FluxSecondaryButtonStyle())
              .accessibilityIdentifier("nutrition.hub.load")
            }
          }
        }

        FluxCard {
          VStack(alignment: .leading, spacing: 8) {
            Text("\(copy.text(.nutritionStatusLabel)): \(copy.humanStatus(viewModel.status))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("nutrition.hub.status")
            Text("\(copy.text(.nutritionLogsLoaded)): \(viewModel.logs.count)")
              .font(.footnote)
              .foregroundStyle(.white.opacity(0.7))
              .accessibilityIdentifier("nutrition.hub.logsCount")
          }
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.nutritionTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refreshLogs(userID: userID)
    }
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
