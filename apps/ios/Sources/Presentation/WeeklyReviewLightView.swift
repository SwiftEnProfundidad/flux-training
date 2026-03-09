import SwiftUI

@available(iOS 17, macOS 14, *)
public struct WeeklyReviewLightView: View {
  private let progressViewModel: ProgressViewModel
  private let trainingViewModel: TrainingFlowViewModel
  private let nutritionViewModel: NutritionViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    progressViewModel: ProgressViewModel,
    trainingViewModel: TrainingFlowViewModel,
    nutritionViewModel: NutritionViewModel,
    userID: String,
    copy: LocalizedCopy
  ) {
    self.progressViewModel = progressViewModel
    self.trainingViewModel = trainingViewModel
    self.nutritionViewModel = nutritionViewModel
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    WeeklyReviewView(
      progressViewModel: progressViewModel,
      trainingViewModel: trainingViewModel,
      nutritionViewModel: nutritionViewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: ProgressRouteContract.weeklyReviewLightScreenID
    )
    .preferredColorScheme(.light)
  }
}
