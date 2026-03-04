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
    Form {
      Section(copy.text(.recommendationsTitle)) {
        Button(copy.text(.loadRecommendations)) {
          Task { await loadAction() }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("aiCoach.load")
        .disabled(status == NutritionProgressAIScreenStatus.loading.rawValue)
      }

      Section(copy.text(.statusLabel)) {
        Text(copy.humanStatus(status))
          .font(.footnote)
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("aiCoach.status")
      }

      if recommendations.isEmpty {
        Section {
          Text(copy.text(.noRecommendations))
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("aiCoach.empty")
        }
      } else {
        Section(copy.text(.recommendationsTitle)) {
          ForEach(recommendations, id: \.id) { recommendation in
            VStack(alignment: .leading, spacing: 6) {
              Text(recommendation.title)
                .font(.headline)
              Text(recommendation.rationale)
                .font(.subheadline)
                .foregroundStyle(.secondary)
              Text(recommendation.actionLabel)
                .font(.footnote.weight(.semibold))
                .foregroundStyle(.orange)
            }
            .padding(.vertical, 4)
          }
        }
      }
    }
    .navigationTitle(copy.text(.recommendationsTitle))
    .accessibilityIdentifier(screenAccessibilityID)
  }
}
