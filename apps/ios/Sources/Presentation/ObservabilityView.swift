import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ObservabilityView: View {
  @State private var viewModel: ObservabilityViewModel
  private let userID: String

  public init(viewModel: ObservabilityViewModel, userID: String = "demo-user") {
    _viewModel = State(initialValue: viewModel)
    self.userID = userID
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text("Observability")
        .font(.title2)

      HStack {
        Button("Track event") {
          Task { await viewModel.trackDemoEvent(userID: userID) }
        }
        Button("Report crash") {
          Task { await viewModel.reportDemoCrash(userID: userID) }
        }
        Button("Load data") {
          Task { await viewModel.refresh(userID: userID) }
        }
      }

      Text("Status: \(viewModel.status)")
        .foregroundStyle(.secondary)
      Text("Analytics events: \(viewModel.analyticsEvents.count)")
      Text("Crash reports: \(viewModel.crashReports.count)")
    }
    .padding()
  }
}
