import Foundation
import Observation

@MainActor
@Observable
public final class OfflineSyncViewModel {
  public private(set) var pendingCount: Int = 0
  public private(set) var syncStatus: String = "idle"
  public private(set) var lastRejectedCount: Int = 0

  private let queueOfflineActionUseCase: QueueOfflineActionUseCase
  private let syncOfflineQueueUseCase: SyncOfflineQueueUseCase

  public init(
    queueOfflineActionUseCase: QueueOfflineActionUseCase,
    syncOfflineQueueUseCase: SyncOfflineQueueUseCase
  ) {
    self.queueOfflineActionUseCase = queueOfflineActionUseCase
    self.syncOfflineQueueUseCase = syncOfflineQueueUseCase
  }

  public func refresh(userID: String) async {
    do {
      let pendingItems = try await queueOfflineActionUseCase.list(userID: userID)
      pendingCount = pendingItems.count
    } catch {
      syncStatus = "error"
    }
  }

  public func sync(userID: String) async {
    do {
      let result = try await syncOfflineQueueUseCase.execute(userID: userID)
      lastRejectedCount = result.rejected.count
      syncStatus = "synced"
      let pendingItems = try await queueOfflineActionUseCase.list(userID: userID)
      pendingCount = pendingItems.count
    } catch {
      syncStatus = "error"
    }
  }
}
