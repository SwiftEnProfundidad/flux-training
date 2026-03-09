import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AuthWelcomeView: View {
  @Bindable private var viewModel: AuthViewModel
  private let copy: LocalizedCopy
  private let readinessScore: Int
  private let goalLabel: String
  private let screenAccessibilityID: String
  private let onUseEmailLogin: () -> Void

  public init(
    viewModel: AuthViewModel,
    copy: LocalizedCopy,
    readinessScore: Int,
    goalLabel: String,
    screenAccessibilityID: String = AuthRouteContract.welcomeDarkScreenID,
    onUseEmailLogin: @escaping () -> Void = {}
  ) {
    self.viewModel = viewModel
    self.copy = copy
    self.readinessScore = readinessScore
    self.goalLabel = goalLabel
    self.screenAccessibilityID = screenAccessibilityID
    self.onUseEmailLogin = onUseEmailLogin
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 16) {
        Text("FLUX TRAINING")
          .font(.caption.weight(.black))
          .kerning(2)
          .foregroundStyle(.white.opacity(0.85))
          .accessibilityIdentifier("auth.welcome.brand")

        Text(copy.text(.heroTitle))
          .font(.system(size: 38, weight: .black, design: .rounded))
          .foregroundStyle(.white)
          .lineSpacing(2)
          .accessibilityIdentifier("auth.welcome.title")

        Text(copy.text(.dailyObjective))
          .font(.title3.weight(.medium))
          .foregroundStyle(.white.opacity(0.85))
          .accessibilityIdentifier("auth.welcome.subtitle")

        HStack {
          FluxMetricPill(
            title: copy.text(.readinessLabel),
            value: "\(readinessScore)%"
          )
          .accessibilityIdentifier("auth.welcome.readiness")
          FluxMetricPill(
            title: copy.text(.goalLabel),
            value: goalLabel
          )
          .accessibilityIdentifier("auth.welcome.goal")
        }
        .frame(maxWidth: .infinity)

        FluxCard {
          Text(copy.text(.dailyObjective))
            .font(.callout)
            .foregroundStyle(.white.opacity(0.86))
        }

        Button(copy.text(.signInWithApple)) {
          Task {
            await viewModel.signInWithApple()
          }
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("auth.welcome.signInApple")

        Button(copy.text(.signInWithEmail)) {
          onUseEmailLogin()
        }
        .buttonStyle(FluxSecondaryButtonStyle())
        .accessibilityIdentifier("auth.welcome.signInEmail")

        if let feedback = copy.authFeedback(viewModel.authStatus) {
          FluxCard {
            Text(feedback)
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.orange)
              .accessibilityIdentifier("auth.welcome.status")
          }
        }
      }
      .padding(16)
      .frame(maxWidth: .infinity, alignment: .leading)
    }
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
  }
}
