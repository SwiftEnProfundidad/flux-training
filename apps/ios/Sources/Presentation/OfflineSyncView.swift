import SwiftUI

@available(iOS 17, macOS 14, *)
public struct OfflineSyncView: View {
  @State private var viewModel: OfflineSyncViewModel
  private let userID: String

  public init(viewModel: OfflineSyncViewModel, userID: String = "demo-user") {
    _viewModel = State(initialValue: viewModel)
    self.userID = userID
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text("Offline queue")
        .font(.title2)

      HStack {
        Button("Refresh") {
          Task { await viewModel.refresh(userID: userID) }
        }
        Button("Sync") {
          Task { await viewModel.sync(userID: userID) }
        }
      }

      Text("Pending actions: \(viewModel.pendingCount)")
      Text("Rejected on last sync: \(viewModel.lastRejectedCount)")
      Text("Status: \(viewModel.syncStatus)")
        .foregroundStyle(.secondary)
    }
    .padding()
  }
}
