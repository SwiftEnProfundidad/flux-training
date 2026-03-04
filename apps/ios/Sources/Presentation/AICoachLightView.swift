import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AICoachLightView: View {
  @Binding private var recommendations: [AIRecommendation]
  @Binding private var status: String
  private let copy: LocalizedCopy
  private let loadAction: @Sendable () async -> Void

  public init(
    recommendations: Binding<[AIRecommendation]>,
    status: Binding<String>,
    copy: LocalizedCopy,
    loadAction: @escaping @Sendable () async -> Void
  ) {
    _recommendations = recommendations
    _status = status
    self.copy = copy
    self.loadAction = loadAction
  }

  public var body: some View {
    AICoachView(
      recommendations: $recommendations,
      status: $status,
      copy: copy,
      screenAccessibilityID: ProgressRouteContract.aiCoachLightScreenID,
      loadAction: loadAction
    )
    .preferredColorScheme(.light)
  }
}
