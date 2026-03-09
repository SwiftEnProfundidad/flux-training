import Foundation

public actor InMemoryOfflineSyncGateway: OfflineSyncGateway {
  private let createTrainingPlanUseCase: CreateTrainingPlanUseCase
  private let createWorkoutSessionUseCase: CreateWorkoutSessionUseCase
  private let createNutritionLogUseCase: CreateNutritionLogUseCase

  public init(
    createTrainingPlanUseCase: CreateTrainingPlanUseCase,
    createWorkoutSessionUseCase: CreateWorkoutSessionUseCase,
    createNutritionLogUseCase: CreateNutritionLogUseCase
  ) {
    self.createTrainingPlanUseCase = createTrainingPlanUseCase
    self.createWorkoutSessionUseCase = createWorkoutSessionUseCase
    self.createNutritionLogUseCase = createNutritionLogUseCase
  }

  public func process(userID: String, items: [OfflineSyncQueueItem]) async throws -> OfflineSyncResult {
    var acceptedIDs: [String] = []
    var rejected: [OfflineSyncRejectedItem] = []

    for item in items {
      guard item.userID == userID else {
        rejected.append(OfflineSyncRejectedItem(id: item.id, reason: "invalid_user"))
        continue
      }

      do {
        switch item.action {
        case .createTrainingPlan(let payload):
          _ = try await createTrainingPlanUseCase.execute(
            id: payload.id,
            userID: payload.userID,
            name: payload.name,
            weeks: payload.weeks,
            days: payload.days
          )
        case .createWorkoutSession(let payload):
          _ = try await createWorkoutSessionUseCase.execute(input: payload)
        case .createNutritionLog(let payload):
          _ = try await createNutritionLogUseCase.execute(log: payload)
        }
        acceptedIDs.append(item.id)
      } catch {
        rejected.append(OfflineSyncRejectedItem(id: item.id, reason: "processing_failed"))
      }
    }

    let sortedIDs = items.map(\.id).sorted().joined(separator: ",")
    return OfflineSyncResult(
      acceptedIDs: acceptedIDs,
      rejected: rejected,
      idempotency: OfflineSyncIdempotencyMetadata(
        key: "ios-local-sync:\(userID):\(sortedIDs)",
        replayed: false,
        ttlSeconds: 300
      )
    )
  }
}
