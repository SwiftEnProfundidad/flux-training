import Foundation

public actor InMemoryOfflineSyncQueueRepository: OfflineSyncQueueRepository {
  private var records: [OfflineSyncQueueItem] = []

  public init() {}

  public func enqueue(item: OfflineSyncQueueItem) async throws {
    records.append(item)
  }

  public func list(userID: String) async throws -> [OfflineSyncQueueItem] {
    records.filter { $0.userID == userID }
  }

  public func remove(ids: [String]) async throws {
    let idSet = Set(ids)
    records.removeAll { idSet.contains($0.id) }
  }
}
