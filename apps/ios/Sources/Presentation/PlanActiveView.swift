import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct PlanActiveView: View {
  @Bindable private var viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = TrainingRouteContract.planActiveDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    Form {
      Section(copy.text(.planName)) {
        TextField(copy.text(.planName), text: $viewModel.planName)
          .accessibilityIdentifier("training.planActive.planName")
        Button(copy.text(.createPlan)) {
          Task { await viewModel.createStarterPlan(userID: userID) }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("training.planActive.createPlan")
      }

      Section(copy.text(.statusLabel)) {
        Text(copy.humanStatus(viewModel.status))
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.planActive.status")
      }

      Section(copy.text(.plansLoadedLabel)) {
        if viewModel.plans.isEmpty {
          Text(copy.text(.noPlansYet))
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("training.planActive.empty")
        } else {
          ForEach(viewModel.plans, id: \.id) { plan in
            Button {
              viewModel.selectedPlanID = plan.id
            } label: {
              HStack {
                VStack(alignment: .leading, spacing: 2) {
                  Text(plan.name)
                    .font(.body.weight(.semibold))
                  Text("\(plan.weeks)w")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                }
                Spacer()
                if viewModel.selectedPlanID == plan.id {
                  Image(systemName: "checkmark.circle.fill")
                    .foregroundStyle(.orange)
                }
              }
            }
            .buttonStyle(.plain)
            .accessibilityIdentifier("training.planActive.plan.\(plan.id)")
          }
        }
      }
    }
    .navigationTitle(copy.text(.trainingTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refreshDashboard(userID: userID)
    }
  }
}
