import Foundation

public enum SyncOfflineQueueUseCaseError: Error, Equatable {
  case missingUserID
}

public struct SyncOfflineQueueUseCase: Sendable {
  private let repository: any OfflineSyncQueueRepository
  private let gateway: any OfflineSyncGateway

  public init(repository: any OfflineSyncQueueRepository, gateway: any OfflineSyncGateway) {
    self.repository = repository
    self.gateway = gateway
  }

  public func execute(userID: String) async throws -> OfflineSyncResult {
    guard userID.isEmpty == false else {
      throw SyncOfflineQueueUseCaseError.missingUserID
    }

    let items = try await repository.list(userID: userID)
    guard items.isEmpty == false else {
      return OfflineSyncResult(acceptedIDs: [], rejected: [])
    }

    let result = try await gateway.process(userID: userID, items: items)

    if result.acceptedIDs.isEmpty == false {
      try await repository.remove(ids: result.acceptedIDs)
    }

    return result
  }
}
