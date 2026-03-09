import Foundation

public struct QueuedTrainingPlanInput: Sendable, Equatable {
  public let id: String
  public let userID: String
  public let name: String
  public let weeks: Int
  public let days: [TrainingPlanDay]

  public init(id: String, userID: String, name: String, weeks: Int, days: [TrainingPlanDay]) {
    self.id = id
    self.userID = userID
    self.name = name
    self.weeks = weeks
    self.days = days
  }
}

public enum OfflineSyncAction: Sendable, Equatable {
  case createTrainingPlan(QueuedTrainingPlanInput)
  case createWorkoutSession(CreateWorkoutSessionInput)
  case createNutritionLog(NutritionLog)
}

public struct OfflineSyncQueueItem: Sendable, Equatable, Identifiable {
  public let id: String
  public let userID: String
  public let enqueuedAt: Date
  public let action: OfflineSyncAction

  public init(id: String, userID: String, enqueuedAt: Date, action: OfflineSyncAction) {
    self.id = id
    self.userID = userID
    self.enqueuedAt = enqueuedAt
    self.action = action
  }
}

public struct OfflineSyncRejectedItem: Sendable, Equatable {
  public let id: String
  public let reason: String

  public init(id: String, reason: String) {
    self.id = id
    self.reason = reason
  }
}

public struct OfflineSyncResult: Sendable, Equatable {
  public let acceptedIDs: [String]
  public let rejected: [OfflineSyncRejectedItem]
  public let idempotency: OfflineSyncIdempotencyMetadata?

  public init(
    acceptedIDs: [String],
    rejected: [OfflineSyncRejectedItem],
    idempotency: OfflineSyncIdempotencyMetadata? = nil
  ) {
    self.acceptedIDs = acceptedIDs
    self.rejected = rejected
    self.idempotency = idempotency
  }
}

public struct OfflineSyncIdempotencyMetadata: Sendable, Equatable {
  public let key: String
  public let replayed: Bool
  public let ttlSeconds: Int

  public init(key: String, replayed: Bool, ttlSeconds: Int) {
    self.key = key
    self.replayed = replayed
    self.ttlSeconds = ttlSeconds
  }
}

public protocol OfflineSyncQueueRepository: Sendable {
  func enqueue(item: OfflineSyncQueueItem) async throws
  func list(userID: String) async throws -> [OfflineSyncQueueItem]
  func remove(ids: [String]) async throws
}

public protocol OfflineSyncGateway: Sendable {
  func process(userID: String, items: [OfflineSyncQueueItem]) async throws -> OfflineSyncResult
}
