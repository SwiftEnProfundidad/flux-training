import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ObservabilityView: View {
  @State private var viewModel: ObservabilityViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: ObservabilityViewModel,
    userID: String = "demo-user",
    copy: LocalizedCopy = LocalizedCopy(language: .es)
  ) {
    _viewModel = State(initialValue: viewModel)
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.observabilityTitle))
        .font(.title2)

      HStack {
        Button(copy.text(.trackEvent)) {
          Task { await viewModel.trackDemoEvent(userID: userID) }
        }
        Button(copy.text(.reportCrash)) {
          Task { await viewModel.reportDemoCrash(userID: userID) }
        }
        Button(copy.text(.loadData)) {
          Task { await viewModel.refresh(userID: userID) }
        }
      }

      Text("\(copy.text(.statusLabel)): \(copy.humanStatus(viewModel.status))")
        .foregroundStyle(.secondary)
      Text("\(copy.text(.analyticsEventsLabel)): \(viewModel.analyticsEvents.count)")
      Text("\(copy.text(.crashReportsLabel)): \(viewModel.crashReports.count)")
    }
    .padding()
  }
}
