import Foundation

private struct RemoteTrainingPlanExerciseDTO: Codable {
  let exerciseId: String
  let targetSets: Int
  let targetReps: Int
}

private struct RemoteTrainingPlanDayDTO: Codable {
  let dayIndex: Int
  let exercises: [RemoteTrainingPlanExerciseDTO]
}

private struct RemoteTrainingPlanDTO: Codable {
  let id: String
  let userId: String
  let name: String
  let weeks: Int
  let days: [RemoteTrainingPlanDayDTO]
  let createdAt: Date
}

private struct RemoteSetLogDTO: Codable {
  let reps: Int
  let loadKg: Double
  let rpe: Double
}

private struct RemoteExerciseLogDTO: Codable {
  let exerciseId: String
  let sets: [RemoteSetLogDTO]
}

private struct RemoteWorkoutSessionDTO: Codable {
  let userId: String
  let planId: String
  let startedAt: Date
  let endedAt: Date
  let exercises: [RemoteExerciseLogDTO]
}

private struct RemoteNutritionLogDTO: Codable {
  let userId: String
  let date: String
  let calories: Double
  let proteinGrams: Double
  let carbsGrams: Double
  let fatsGrams: Double
}

private struct RemoteExerciseVideoDTO: Codable {
  let id: String
  let exerciseId: String
  let title: String
  let coach: String
  let difficulty: String
  let durationSeconds: Int
  let videoUrl: URL
  let thumbnailUrl: URL
  let tags: [String]
  let locale: String
}

private struct RemoteAnalyticsEventDTO: Codable {
  let userId: String
  let name: String
  let source: String
  let occurredAt: Date
  let attributes: [String: String]
}

private struct RemoteCrashReportDTO: Codable {
  let userId: String
  let source: String
  let message: String
  let stackTrace: String?
  let severity: String
  let occurredAt: Date
}

private struct CreateTrainingPlanRequest: Encodable {
  let id: String
  let userId: String
  let name: String
  let weeks: Int
  let days: [RemoteTrainingPlanDayDTO]
}

private struct CreateTrainingPlanResponse: Decodable {
  let plan: RemoteTrainingPlanDTO
}

private struct ListTrainingPlansResponse: Decodable {
  let plans: [RemoteTrainingPlanDTO]
}

private struct CreateWorkoutSessionRequest: Encodable {
  let userId: String
  let planId: String
  let startedAt: Date
  let endedAt: Date
  let exercises: [RemoteExerciseLogDTO]
}

private struct CreateWorkoutSessionResponse: Decodable {
  let payload: RemoteWorkoutSessionDTO
}

private struct ListWorkoutSessionsResponse: Decodable {
  let sessions: [RemoteWorkoutSessionDTO]
}

private struct CreateNutritionLogRequest: Encodable {
  let userId: String
  let date: String
  let calories: Double
  let proteinGrams: Double
  let carbsGrams: Double
  let fatsGrams: Double
}

private struct CreateNutritionLogResponse: Decodable {
  let log: RemoteNutritionLogDTO
}

private struct ListNutritionLogsResponse: Decodable {
  let logs: [RemoteNutritionLogDTO]
}

private struct ListExerciseVideosResponse: Decodable {
  let videos: [RemoteExerciseVideoDTO]
}

private struct CreateAnalyticsEventRequest: Encodable {
  let userId: String
  let name: String
  let source: String
  let occurredAt: Date
  let attributes: [String: String]
}

private struct CreateAnalyticsEventResponse: Decodable {
  let event: RemoteAnalyticsEventDTO
}

private struct ListAnalyticsEventsResponse: Decodable {
  let events: [RemoteAnalyticsEventDTO]
}

private struct CreateCrashReportRequest: Encodable {
  let userId: String
  let source: String
  let message: String
  let stackTrace: String?
  let severity: String
  let occurredAt: Date
}

private struct CreateCrashReportResponse: Decodable {
  let report: RemoteCrashReportDTO
}

private struct ListCrashReportsResponse: Decodable {
  let reports: [RemoteCrashReportDTO]
}

private struct ProcessSyncQueueRequestItemActionPayloadTrainingPlan: Encodable {
  let id: String
  let userId: String
  let name: String
  let weeks: Int
  let days: [RemoteTrainingPlanDayDTO]
}

private struct ProcessSyncQueueRequestItemActionPayloadWorkoutSession: Encodable {
  let userId: String
  let planId: String
  let startedAt: Date
  let endedAt: Date
  let exercises: [RemoteExerciseLogDTO]
}

private struct ProcessSyncQueueRequestItemActionPayloadNutritionLog: Encodable {
  let userId: String
  let date: String
  let calories: Double
  let proteinGrams: Double
  let carbsGrams: Double
  let fatsGrams: Double
}

private struct ProcessSyncQueueRequestItemAction: Encodable {
  let type: String
  let payload: EncodablePayload

  struct EncodablePayload: Encodable {
    let trainingPlan: ProcessSyncQueueRequestItemActionPayloadTrainingPlan?
    let workoutSession: ProcessSyncQueueRequestItemActionPayloadWorkoutSession?
    let nutritionLog: ProcessSyncQueueRequestItemActionPayloadNutritionLog?

    func encode(to encoder: Encoder) throws {
      if let trainingPlan {
        try trainingPlan.encode(to: encoder)
        return
      }
      if let workoutSession {
        try workoutSession.encode(to: encoder)
        return
      }
      if let nutritionLog {
        try nutritionLog.encode(to: encoder)
        return
      }
      var container = encoder.singleValueContainer()
      try container.encodeNil()
    }
  }
}

private struct ProcessSyncQueueRequestItem: Encodable {
  let id: String
  let userId: String
  let enqueuedAt: Date
  let action: ProcessSyncQueueRequestItemAction
}

private struct ProcessSyncQueueRequest: Encodable {
  let userId: String
  let items: [ProcessSyncQueueRequestItem]
}

private struct ProcessSyncQueueResponseRejectedItem: Decodable {
  let id: String
  let reason: String
}

private struct ProcessSyncQueueResponseIdempotency: Decodable {
  let key: String
  let replayed: Bool
  let ttlSeconds: Int
}

private struct ProcessSyncQueueResponseResult: Decodable {
  let acceptedIds: [String]
  let rejected: [ProcessSyncQueueResponseRejectedItem]
}

private struct ProcessSyncQueueResponse: Decodable {
  let result: ProcessSyncQueueResponseResult
  let idempotency: ProcessSyncQueueResponseIdempotency?
}

private func mapTrainingPlanDayDTOs(from days: [TrainingPlanDay]) -> [RemoteTrainingPlanDayDTO] {
  days.map { day in
    RemoteTrainingPlanDayDTO(
      dayIndex: day.dayIndex,
      exercises: day.exercises.map { exercise in
        RemoteTrainingPlanExerciseDTO(
          exerciseId: exercise.exerciseID,
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps
        )
      }
    )
  }
}

private func mapTrainingPlan(from dto: RemoteTrainingPlanDTO) -> TrainingPlan {
  TrainingPlan(
    id: dto.id,
    userID: dto.userId,
    name: dto.name,
    weeks: dto.weeks,
    days: dto.days.map { day in
      TrainingPlanDay(
        dayIndex: day.dayIndex,
        exercises: day.exercises.map { exercise in
          TrainingPlanExercise(
            exerciseID: exercise.exerciseId,
            targetSets: exercise.targetSets,
            targetReps: exercise.targetReps
          )
        }
      )
    },
    createdAt: dto.createdAt
  )
}

private func mapExerciseLogDTOs(from logs: [ExerciseLog]) -> [RemoteExerciseLogDTO] {
  logs.map { log in
    RemoteExerciseLogDTO(
      exerciseId: log.exerciseID,
      sets: log.sets.map { set in
        RemoteSetLogDTO(reps: set.reps, loadKg: set.loadKg, rpe: set.rpe)
      }
    )
  }
}

private func mapWorkoutSession(from dto: RemoteWorkoutSessionDTO) -> WorkoutSession {
  WorkoutSession(
    userID: dto.userId,
    planID: dto.planId,
    startedAt: dto.startedAt,
    endedAt: dto.endedAt,
    exercises: dto.exercises.map { exercise in
      ExerciseLog(
        exerciseID: exercise.exerciseId,
        sets: exercise.sets.map { set in
          SetLog(reps: set.reps, loadKg: set.loadKg, rpe: set.rpe)
        }
      )
    }
  )
}

private func mapNutritionLog(from dto: RemoteNutritionLogDTO) -> NutritionLog {
  NutritionLog(
    userID: dto.userId,
    date: dto.date,
    calories: dto.calories,
    proteinGrams: dto.proteinGrams,
    carbsGrams: dto.carbsGrams,
    fatsGrams: dto.fatsGrams
  )
}

private func mapExerciseVideo(from dto: RemoteExerciseVideoDTO) -> ExerciseVideo {
  ExerciseVideo(
    id: dto.id,
    exerciseID: dto.exerciseId,
    title: dto.title,
    coach: dto.coach,
    difficulty: ExerciseVideoDifficulty(rawValue: dto.difficulty) ?? .beginner,
    durationSeconds: dto.durationSeconds,
    videoURL: dto.videoUrl,
    thumbnailURL: dto.thumbnailUrl,
    tags: dto.tags,
    locale: dto.locale
  )
}

private func mapObservabilitySource(from rawValue: String) -> ObservabilitySource {
  ObservabilitySource(rawValue: rawValue) ?? .ios
}

private func mapAnalyticsEvent(from dto: RemoteAnalyticsEventDTO) -> AnalyticsEvent {
  AnalyticsEvent(
    userID: dto.userId,
    name: dto.name,
    source: mapObservabilitySource(from: dto.source),
    occurredAt: dto.occurredAt,
    attributes: dto.attributes
  )
}

private func mapCrashReport(from dto: RemoteCrashReportDTO) -> CrashReport {
  CrashReport(
    userID: dto.userId,
    source: mapObservabilitySource(from: dto.source),
    message: dto.message,
    stackTrace: dto.stackTrace,
    severity: CrashSeverity(rawValue: dto.severity) ?? .warning,
    occurredAt: dto.occurredAt
  )
}

public actor RemoteTrainingPlanRepository: TrainingPlanRepository {
  private let client: FluxBackendClient

  public init(client: FluxBackendClient) {
    self.client = client
  }

  public func save(plan: TrainingPlan) async throws {
    let _ = try await client.post(
      path: "createTrainingPlan",
      body: CreateTrainingPlanRequest(
        id: plan.id,
        userId: plan.userID,
        name: plan.name,
        weeks: plan.weeks,
        days: mapTrainingPlanDayDTOs(from: plan.days)
      ),
      requiresAuthorization: true
    ) as CreateTrainingPlanResponse
  }

  public func listByUserID(_ userID: String) async throws -> [TrainingPlan] {
    let response: ListTrainingPlansResponse = try await client.get(
      path: "listTrainingPlans",
      queryItems: [URLQueryItem(name: "userId", value: userID)],
      requiresAuthorization: true
    )
    return response.plans.map(mapTrainingPlan)
  }
}

public actor RemoteWorkoutSessionRepository: WorkoutSessionRepository {
  private let client: FluxBackendClient

  public init(client: FluxBackendClient) {
    self.client = client
  }

  public func save(session: WorkoutSession) async throws {
    let _ = try await client.post(
      path: "createWorkoutSession",
      body: CreateWorkoutSessionRequest(
        userId: session.userID,
        planId: session.planID,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        exercises: mapExerciseLogDTOs(from: session.exercises)
      ),
      requiresAuthorization: true
    ) as CreateWorkoutSessionResponse
  }

  public func listByUserID(_ userID: String) async throws -> [WorkoutSession] {
    let response: ListWorkoutSessionsResponse = try await client.get(
      path: "listWorkoutSessions",
      queryItems: [URLQueryItem(name: "userId", value: userID)],
      requiresAuthorization: true
    )
    return response.sessions.map(mapWorkoutSession)
  }
}

public actor RemoteNutritionLogRepository: NutritionLogRepository {
  private let client: FluxBackendClient

  public init(client: FluxBackendClient) {
    self.client = client
  }

  public func save(log: NutritionLog) async throws {
    let _ = try await client.post(
      path: "createNutritionLog",
      body: CreateNutritionLogRequest(
        userId: log.userID,
        date: log.date,
        calories: log.calories,
        proteinGrams: log.proteinGrams,
        carbsGrams: log.carbsGrams,
        fatsGrams: log.fatsGrams
      ),
      requiresAuthorization: true
    ) as CreateNutritionLogResponse
  }

  public func listByUserID(_ userID: String) async throws -> [NutritionLog] {
    let response: ListNutritionLogsResponse = try await client.get(
      path: "listNutritionLogs",
      queryItems: [URLQueryItem(name: "userId", value: userID)],
      requiresAuthorization: true
    )
    return response.logs.map(mapNutritionLog)
  }
}

public actor RemoteExerciseVideoRepository: ExerciseVideoRepository {
  private let client: FluxBackendClient

  public init(client: FluxBackendClient) {
    self.client = client
  }

  public func listByExerciseID(_ exerciseID: String, locale: String) async throws -> [ExerciseVideo] {
    guard let userID = await client.currentUserID() else {
      throw FluxBackendClientError.missingAuthorizationBearer
    }
    let response: ListExerciseVideosResponse = try await client.get(
      path: "listExerciseVideos",
      queryItems: [
        URLQueryItem(name: "userId", value: userID),
        URLQueryItem(name: "exerciseId", value: exerciseID),
        URLQueryItem(name: "locale", value: locale)
      ],
      requiresAuthorization: true
    )
    return response.videos.map(mapExerciseVideo)
  }
}

public actor RemoteAnalyticsEventRepository: AnalyticsEventRepository {
  private let client: FluxBackendClient

  public init(client: FluxBackendClient) {
    self.client = client
  }

  public func save(event: AnalyticsEvent) async throws {
    let _ = try await client.post(
      path: "createAnalyticsEvent",
      body: CreateAnalyticsEventRequest(
        userId: event.userID,
        name: event.name,
        source: event.source.rawValue,
        occurredAt: event.occurredAt,
        attributes: event.attributes
      ),
      requiresAuthorization: true
    ) as CreateAnalyticsEventResponse
  }

  public func listByUserID(_ userID: String) async throws -> [AnalyticsEvent] {
    let response: ListAnalyticsEventsResponse = try await client.get(
      path: "listAnalyticsEvents",
      queryItems: [URLQueryItem(name: "userId", value: userID)],
      requiresAuthorization: true
    )
    return response.events.map(mapAnalyticsEvent)
  }
}

public actor RemoteCrashReportRepository: CrashReportRepository {
  private let client: FluxBackendClient

  public init(client: FluxBackendClient) {
    self.client = client
  }

  public func save(report: CrashReport) async throws {
    let _ = try await client.post(
      path: "createCrashReport",
      body: CreateCrashReportRequest(
        userId: report.userID,
        source: report.source.rawValue,
        message: report.message,
        stackTrace: report.stackTrace,
        severity: report.severity.rawValue,
        occurredAt: report.occurredAt
      ),
      requiresAuthorization: true
    ) as CreateCrashReportResponse
  }

  public func listByUserID(_ userID: String) async throws -> [CrashReport] {
    let response: ListCrashReportsResponse = try await client.get(
      path: "listCrashReports",
      queryItems: [URLQueryItem(name: "userId", value: userID)],
      requiresAuthorization: true
    )
    return response.reports.map(mapCrashReport)
  }
}

public actor RemoteOfflineSyncGateway: OfflineSyncGateway {
  private let client: FluxBackendClient

  public init(client: FluxBackendClient) {
    self.client = client
  }

  public func process(userID: String, items: [OfflineSyncQueueItem]) async throws -> OfflineSyncResult {
    let requestItems = items.map { item in
      switch item.action {
      case .createTrainingPlan(let payload):
        return ProcessSyncQueueRequestItem(
          id: item.id,
          userId: item.userID,
          enqueuedAt: item.enqueuedAt,
          action: ProcessSyncQueueRequestItemAction(
            type: "create_training_plan",
            payload: .init(
              trainingPlan: .init(
                id: payload.id,
                userId: payload.userID,
                name: payload.name,
                weeks: payload.weeks,
                days: mapTrainingPlanDayDTOs(from: payload.days)
              ),
              workoutSession: nil,
              nutritionLog: nil
            )
          )
        )
      case .createWorkoutSession(let payload):
        return ProcessSyncQueueRequestItem(
          id: item.id,
          userId: item.userID,
          enqueuedAt: item.enqueuedAt,
          action: ProcessSyncQueueRequestItemAction(
            type: "create_workout_session",
            payload: .init(
              trainingPlan: nil,
              workoutSession: .init(
                userId: payload.userID,
                planId: payload.planID,
                startedAt: payload.startedAt,
                endedAt: payload.endedAt,
                exercises: mapExerciseLogDTOs(from: payload.exercises)
              ),
              nutritionLog: nil
            )
          )
        )
      case .createNutritionLog(let payload):
        return ProcessSyncQueueRequestItem(
          id: item.id,
          userId: item.userID,
          enqueuedAt: item.enqueuedAt,
          action: ProcessSyncQueueRequestItemAction(
            type: "create_nutrition_log",
            payload: .init(
              trainingPlan: nil,
              workoutSession: nil,
              nutritionLog: .init(
                userId: payload.userID,
                date: payload.date,
                calories: payload.calories,
                proteinGrams: payload.proteinGrams,
                carbsGrams: payload.carbsGrams,
                fatsGrams: payload.fatsGrams
              )
            )
          )
        )
      }
    }

    let response: ProcessSyncQueueResponse = try await client.post(
      path: "processSyncQueue",
      body: ProcessSyncQueueRequest(userId: userID, items: requestItems),
      requiresAuthorization: true
    )

    return OfflineSyncResult(
      acceptedIDs: response.result.acceptedIds,
      rejected: response.result.rejected.map { item in
        OfflineSyncRejectedItem(id: item.id, reason: item.reason)
      },
      idempotency: response.idempotency.map { metadata in
        OfflineSyncIdempotencyMetadata(
          key: metadata.key,
          replayed: metadata.replayed,
          ttlSeconds: metadata.ttlSeconds
        )
      }
    )
  }
}
