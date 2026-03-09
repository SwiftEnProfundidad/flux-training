import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AICoachView: View {
  @Binding private var recommendations: [AIRecommendation]
  @Binding private var status: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String
  private let loadAction: @Sendable () async -> Void

  public init(
    recommendations: Binding<[AIRecommendation]>,
    status: Binding<String>,
    copy: LocalizedCopy,
    screenAccessibilityID: String = ProgressRouteContract.aiCoachDarkScreenID,
    loadAction: @escaping @Sendable () async -> Void
  ) {
    _recommendations = recommendations
    _status = status
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
    self.loadAction = loadAction
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.recommendationsTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        FluxCard {
          VStack(alignment: .leading, spacing: 10) {
            Text("\(copy.text(.statusLabel)): \(copy.humanStatus(status))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("aiCoach.status")
            Button(copy.text(.loadRecommendations)) {
              Task { await loadAction() }
            }
            .buttonStyle(FluxPrimaryButtonStyle())
            .accessibilityIdentifier("aiCoach.load")
            .disabled(status == NutritionProgressAIScreenStatus.loading.rawValue)
          }
        }

        if recommendations.isEmpty {
          FluxCard {
            Text(copy.text(.noRecommendations))
              .foregroundStyle(.white.opacity(0.7))
              .accessibilityIdentifier("aiCoach.empty")
          }
        } else {
          FluxCard {
            VStack(alignment: .leading, spacing: 12) {
              ForEach(recommendations, id: \.id) { recommendation in
                VStack(alignment: .leading, spacing: 6) {
                  Text(recommendation.title)
                    .font(.headline)
                    .foregroundStyle(.white)
                  Text(recommendation.rationale)
                    .font(.subheadline)
                    .foregroundStyle(.white.opacity(0.7))
                  Text(recommendation.actionLabel)
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(.orange)
                }
              }
            }
          }
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.recommendationsTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
  }
}
