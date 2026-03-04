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
    Form {
      Section(copy.text(.accountProfileTitle)) {
        TextField(copy.text(.displayName), text: $viewModel.displayName)
          .accessibilityIdentifier("account.profile.displayName")
        TextField(copy.text(.age), value: $viewModel.age, format: .number)
          .accessibilityIdentifier("account.profile.age")
        TextField(copy.text(.heightCmLabel), value: $viewModel.heightCm, format: .number)
          .accessibilityIdentifier("account.profile.heightCm")
        TextField(copy.text(.weightKgLabel), value: $viewModel.weightKg, format: .number)
          .accessibilityIdentifier("account.profile.weightKg")
        Picker(copy.text(.goalLabel), selection: $viewModel.goal) {
          Text(copy.text(.goalFatLoss)).tag(TrainingGoal.fatLoss)
          Text(copy.text(.goalRecomposition)).tag(TrainingGoal.recomposition)
          Text(copy.text(.goalMuscleGain)).tag(TrainingGoal.muscleGain)
          Text(copy.text(.goalHabit)).tag(TrainingGoal.habit)
        }
        .accessibilityIdentifier("account.profile.goal")
      }

      Section {
        Button(copy.text(.saveProfile)) {
          Task {
            await viewModel.save(userID: userID)
          }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("account.profile.save")
      }

      Section(copy.text(.profileStatusLabel)) {
        Text(copy.humanStatus(viewModel.status))
          .font(.footnote)
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("account.profile.status")
      }
    }
    .navigationTitle(copy.text(.accountProfileTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refresh(userID: userID)
    }
  }
}
