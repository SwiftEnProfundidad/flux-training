import SwiftUI

@available(iOS 17, macOS 14, *)
public struct NutritionLogMealLightView: View {
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
    NutritionLogMealView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: NutritionRouteContract.logMealLightScreenID
    )
    .preferredColorScheme(.light)
  }
}
