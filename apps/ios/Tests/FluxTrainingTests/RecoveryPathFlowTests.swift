import XCTest
@testable import FluxTraining

actor RecoveryOfflineSyncGateway: OfflineSyncGateway {
  private var attempts = 0

  private let createWorkoutSessionUseCase: CreateWorkoutSessionUseCase

  init(createWorkoutSessionUseCase: CreateWorkoutSessionUseCase) {
    self.createWorkoutSessionUseCase = createWorkoutSessionUseCase
  }

  func process(userID: String, items: [OfflineSyncQueueItem]) async throws -> OfflineSyncResult {
    attempts += 1

    if attempts == 1 {
      return OfflineSyncResult(
        acceptedIDs: [],
        rejected: items.map { OfflineSyncRejectedItem(id: $0.id, reason: "processing_failed") },
        idempotency: OfflineSyncIdempotencyMetadata(
          key: "ios-recovery-sync:\(userID)",
          replayed: false,
          ttlSeconds: 300
        )
      )
    }

    for item in items {
      switch item.action {
      case let .createWorkoutSession(payload):
        _ = try await createWorkoutSessionUseCase.execute(input: payload)
      case .createTrainingPlan, .createNutritionLog:
        continue
      }
    }

    return OfflineSyncResult(
      acceptedIDs: items.map(\.id),
      rejected: [],
      idempotency: OfflineSyncIdempotencyMetadata(
        key: "ios-recovery-sync:\(userID)",
        replayed: true,
        ttlSeconds: 300
      )
    )
  }
}

final class RecoveryPathFlowTests: XCTestCase {
  func test_recoveryPath_retriesOfflineSyncAndRecoversProgressState() async throws {
    let queueRepository = InMemoryOfflineSyncQueueRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let nutritionLogRepository = InMemoryNutritionLogRepository()
    let analyticsEventRepository = InMemoryAnalyticsEventRepository()
    let crashReportRepository = InMemoryCrashReportRepository()

    let queueUseCase = QueueOfflineActionUseCase(repository: queueRepository)
    let syncUseCase = SyncOfflineQueueUseCase(
      repository: queueRepository,
      gateway: RecoveryOfflineSyncGateway(
        createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(
          repository: workoutSessionRepository
        )
      )
    )
    let progressUseCase = BuildProgressSummaryUseCase(
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(repository: nutritionLogRepository)
    )
    let createAnalyticsEventUseCase = CreateAnalyticsEventUseCase(repository: analyticsEventRepository)
    let listAnalyticsEventsUseCase = ListAnalyticsEventsUseCase(repository: analyticsEventRepository)
    let createCrashReportUseCase = CreateCrashReportUseCase(repository: crashReportRepository)
    let listCrashReportsUseCase = ListCrashReportsUseCase(repository: crashReportRepository)

    try await queueUseCase.execute(
      action: .createWorkoutSession(
        CreateWorkoutSessionInput(
          userID: "user-recovery-1",
          planID: "plan-recovery-1",
          startedAt: makeDate("2026-03-02T08:00:00Z"),
          endedAt: makeDate("2026-03-02T08:35:00Z"),
          exercises: [ExerciseLog(exerciseID: "squat", sets: [SetLog(reps: 8, loadKg: 60, rpe: 8)])]
        )
      ),
      itemID: "ios-recovery-queue-1",
      enqueuedAt: makeDate("2026-03-02T20:00:00Z")
    )

    let firstSync = try await syncUseCase.execute(userID: "user-recovery-1")
    let pendingAfterFailure = try await queueUseCase.list(userID: "user-recovery-1")
    let secondSync = try await syncUseCase.execute(userID: "user-recovery-1")
    let pendingAfterRecovery = try await queueUseCase.list(userID: "user-recovery-1")
    let progress = try await progressUseCase.execute(
      userID: "user-recovery-1",
      generatedAt: makeDate("2026-03-02T20:10:00Z")
    )

    _ = try await createCrashReportUseCase.execute(
      report: CrashReport(
        userID: "user-recovery-1",
        source: .ios,
        message: "Initial sync failure",
        stackTrace: "RecoveryPathFlowTests.swift",
        severity: .warning,
        occurredAt: makeDate("2026-03-02T20:11:00Z")
      )
    )
    _ = try await createAnalyticsEventUseCase.execute(
      event: AnalyticsEvent(
        userID: "user-recovery-1",
        name: "recovery_path_completed",
        source: .ios,
        occurredAt: makeDate("2026-03-02T20:12:00Z"),
        attributes: ["recovered": "true"]
      )
    )

    let crashReports = try await listCrashReportsUseCase.execute(userID: "user-recovery-1")
    let analyticsEvents = try await listAnalyticsEventsUseCase.execute(userID: "user-recovery-1")

    XCTAssertEqual(firstSync.acceptedIDs, [])
    XCTAssertEqual(firstSync.rejected, [OfflineSyncRejectedItem(id: "ios-recovery-queue-1", reason: "processing_failed")])
    XCTAssertEqual(firstSync.idempotency?.key, "ios-recovery-sync:user-recovery-1")
    XCTAssertEqual(firstSync.idempotency?.replayed, false)
    XCTAssertEqual(firstSync.idempotency?.ttlSeconds, 300)
    XCTAssertEqual(pendingAfterFailure.count, 1)

    XCTAssertEqual(secondSync.acceptedIDs, ["ios-recovery-queue-1"])
    XCTAssertTrue(secondSync.rejected.isEmpty)
    XCTAssertEqual(secondSync.idempotency?.key, "ios-recovery-sync:user-recovery-1")
    XCTAssertEqual(secondSync.idempotency?.replayed, true)
    XCTAssertEqual(secondSync.idempotency?.ttlSeconds, 300)
    XCTAssertEqual(pendingAfterRecovery.count, 0)

    XCTAssertEqual(progress.workoutSessionsCount, 1)
    XCTAssertEqual(crashReports.count, 1)
    XCTAssertEqual(analyticsEvents.count, 1)
  }

  private func makeDate(_ raw: String) -> Date {
    let formatter = ISO8601DateFormatter()
    guard let date = formatter.date(from: raw) else {
      XCTFail("Invalid date: \(raw)")
      return Date()
    }
    return date
  }
}
