import SwiftUI

@available(iOS 17, macOS 14, *)
public struct OfflineSyncView: View {
  @State private var viewModel: OfflineSyncViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: OfflineSyncViewModel,
    userID: String = "demo-user",
    copy: LocalizedCopy = LocalizedCopy(language: .es)
  ) {
    _viewModel = State(initialValue: viewModel)
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.offlineSyncTitle))
        .font(.title2)

      HStack {
        Button(copy.text(.refreshQueue)) {
          Task { await viewModel.refresh(userID: userID) }
        }
        Button(copy.text(.syncQueue)) {
          Task { await viewModel.sync(userID: userID) }
        }
      }

      Text("\(copy.text(.pendingActionsLabel)): \(viewModel.pendingCount)")
      Text("\(copy.text(.rejectedLastSyncLabel)): \(viewModel.lastRejectedCount)")
      Text("\(copy.text(.idempotencyKeyLabel)): \(viewModel.lastIdempotencyKey)")
      Text(
        "\(copy.text(.idempotencyReplayLabel)): \(copy.text(viewModel.lastIdempotencyReplay ? .idempotencyReplayYes : .idempotencyReplayNo))"
      )
      Text("\(copy.text(.idempotencyTTLLabel)): \(viewModel.lastIdempotencyTTLSeconds)s")
      Text("\(copy.text(.statusLabel)): \(copy.humanStatus(viewModel.syncStatus))")
        .foregroundStyle(.secondary)
    }
    .padding()
  }
}
