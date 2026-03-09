import SwiftUI

@available(iOS 17, macOS 14, *)
public struct NutritionHubLightView: View {
  private let viewModel: NutritionViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: NutritionViewModel,
    userID: String,
    copy: LocalizedCopy
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    NutritionHubView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: NutritionRouteContract.nutritionHubLightScreenID
    )
    .preferredColorScheme(.light)
  }
}
