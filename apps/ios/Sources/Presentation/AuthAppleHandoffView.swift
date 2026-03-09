import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AuthAppleHandoffView: View {
  @Bindable private var viewModel: AuthViewModel
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String
  private let onUseEmailInstead: () -> Void

  public init(
    viewModel: AuthViewModel,
    copy: LocalizedCopy,
    screenAccessibilityID: String = AuthRouteContract.appleHandoffDarkScreenID,
    onUseEmailInstead: @escaping () -> Void = {}
  ) {
    self.viewModel = viewModel
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
    self.onUseEmailInstead = onUseEmailInstead
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.applePermissionsTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.applePermissionsSubtitle))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 10) {
            permissionRow(copy.text(.applePermissionNameEmail))
            permissionRow(copy.text(.applePermissionHealthKitRead))
            permissionRow(copy.text(.applePermissionCalendarEvents))
            Text(copy.text(.applePermissionRequiredCount))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.orange)
              .padding(.top, 2)
          }
        }

        Button(copy.text(.signInWithApple)) {
          Task {
            await viewModel.signInWithApple()
          }
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("auth.appleHandoff.continue")

        Button(copy.text(.appleUseEmailInstead)) {
          onUseEmailInstead()
        }
        .buttonStyle(FluxSecondaryButtonStyle())
        .accessibilityIdentifier("auth.appleHandoff.useEmail")

        if let feedback = copy.authFeedback(viewModel.authStatus) {
          FluxCard {
            Text(feedback)
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.orange)
              .accessibilityIdentifier("auth.appleHandoff.status")
          }
        }
    }
    .padding(16)
    }
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
  }

  private func permissionRow(_ title: String) -> some View {
    HStack(spacing: 10) {
      Circle()
        .fill(Color.orange.opacity(0.9))
        .frame(width: 8, height: 8)
      Text(title)
        .font(.body.weight(.medium))
        .foregroundStyle(.white.opacity(0.9))
    }
  }
}
