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
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.trainingTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.planName))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 12) {
            TextField(copy.text(.planName), text: $viewModel.planName)
              .fluxInputFieldStyle()
              .accessibilityIdentifier("training.planActive.planName")

            Button(copy.text(.createPlan)) {
              Task { await viewModel.createStarterPlan(userID: userID) }
            }
            .buttonStyle(FluxPrimaryButtonStyle())
            .accessibilityIdentifier("training.planActive.createPlan")

            Text("\(copy.text(.statusLabel)): \(copy.humanStatus(viewModel.status))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("training.planActive.status")
          }
        }

        FluxCard {
          VStack(alignment: .leading, spacing: 10) {
            Text(copy.text(.plansLoadedLabel))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
            if viewModel.plans.isEmpty {
              Text(copy.text(.noPlansYet))
                .foregroundStyle(.white.opacity(0.7))
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
                        .foregroundStyle(.white)
                      Text("\(plan.weeks)w")
                        .font(.footnote)
                        .foregroundStyle(.white.opacity(0.65))
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
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.trainingTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refreshDashboard(userID: userID)
    }
  }
}
