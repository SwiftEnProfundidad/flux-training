import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AccountProfileView: View {
  @Bindable private var viewModel: AccountProfileViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: AccountProfileViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = SettingsRouteContract.accountProfileDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.accountProfileTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.profileStatusLabel))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 12) {
            fieldLabel(copy.text(.displayName))
            TextField(copy.text(.displayName), text: $viewModel.displayName)
              .fluxInputFieldStyle()
              .accessibilityIdentifier("account.profile.displayName")

            HStack(spacing: 10) {
              metricInput(
                label: copy.text(.age),
                intValue: $viewModel.age,
                identifier: "account.profile.age"
              )
              metricInput(
                label: copy.text(.heightCmLabel),
                doubleValue: $viewModel.heightCm,
                identifier: "account.profile.heightCm"
              )
            }

            metricInput(
              label: copy.text(.weightKgLabel),
              doubleValue: $viewModel.weightKg,
              identifier: "account.profile.weightKg"
            )

            fieldLabel(copy.text(.goalLabel))
            Picker(copy.text(.goalLabel), selection: $viewModel.goal) {
              Text(copy.text(.goalFatLoss)).tag(TrainingGoal.fatLoss)
              Text(copy.text(.goalRecomposition)).tag(TrainingGoal.recomposition)
              Text(copy.text(.goalMuscleGain)).tag(TrainingGoal.muscleGain)
              Text(copy.text(.goalHabit)).tag(TrainingGoal.habit)
            }
            .tint(.orange)
            .accessibilityIdentifier("account.profile.goal")
          }
        }

        Button(copy.text(.saveProfile)) {
          Task { await viewModel.save(userID: userID) }
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("account.profile.save")

        FluxCard {
          Text("\(copy.text(.profileStatusLabel)): \(copy.humanStatus(viewModel.status))")
            .font(.footnote.weight(.semibold))
            .foregroundStyle(.white.opacity(0.82))
            .accessibilityIdentifier("account.profile.status")
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.accountProfileTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refresh(userID: userID)
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
    intValue: Binding<Int>,
    identifier: String
  ) -> some View {
    VStack(alignment: .leading, spacing: 6) {
      fieldLabel(label)
      TextField(label, value: intValue, format: .number)
        .fluxInputFieldStyle()
        .accessibilityIdentifier(identifier)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }

  @ViewBuilder
  private func metricInput(
    label: String,
    doubleValue: Binding<Double>,
    identifier: String
  ) -> some View {
    VStack(alignment: .leading, spacing: 6) {
      fieldLabel(label)
      TextField(label, value: doubleValue, format: .number)
        .fluxInputFieldStyle()
        .accessibilityIdentifier(identifier)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}
