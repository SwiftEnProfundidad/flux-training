import Foundation

public enum QueueOfflineActionUseCaseError: Error, Equatable {
  case missingUserID
}

public struct QueueOfflineActionUseCase: Sendable {
  private let repository: any OfflineSyncQueueRepository

  public init(repository: any OfflineSyncQueueRepository) {
    self.repository = repository
  }

  public func execute(action: OfflineSyncAction, itemID: String = UUID().uuidString, enqueuedAt: Date = Date()) async throws {
    let userID: String
    switch action {
    case .createTrainingPlan(let payload):
      userID = payload.userID
    case .createWorkoutSession(let payload):
      userID = payload.userID
    case .createNutritionLog(let payload):
      userID = payload.userID
    }

    guard userID.isEmpty == false else {
      throw QueueOfflineActionUseCaseError.missingUserID
    }

    let item = OfflineSyncQueueItem(id: itemID, userID: userID, enqueuedAt: enqueuedAt, action: action)
    try await repository.enqueue(item: item)
  }

  public func list(userID: String) async throws -> [OfflineSyncQueueItem] {
    guard userID.isEmpty == false else { throw QueueOfflineActionUseCaseError.missingUserID }
    return try await repository.list(userID: userID)
  }
}
