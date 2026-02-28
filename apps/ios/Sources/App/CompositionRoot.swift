import Foundation

public enum CompositionRoot {
  @MainActor
  public static func makeOnboardingViewModel() -> OnboardingViewModel {
    let userProfileRepository = InMemoryUserProfileRepository()
    let useCase = CompleteOnboardingUseCase(userProfileRepository: userProfileRepository)
    return OnboardingViewModel(completeOnboardingUseCase: useCase)
  }

  @MainActor
  public static func makeAuthViewModel() -> AuthViewModel {
    let gateway = DemoAuthGateway()
    let useCase = CreateAuthSessionUseCase(authGateway: gateway)
    return AuthViewModel(createAuthSessionUseCase: useCase)
  }

  @MainActor
  public static func makeTrainingDashboardViewModel() -> TrainingDashboardViewModel {
    let repository = InMemoryWorkoutSessionRepository()
    let useCase = CreateWorkoutSessionUseCase(repository: repository)
    return TrainingDashboardViewModel(createWorkoutSessionUseCase: useCase)
  }

  @MainActor
  public static func makeTrainingFlowViewModel() -> TrainingFlowViewModel {
    let trainingPlanRepository = InMemoryTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let exerciseVideoRepository = InMemoryExerciseVideoRepository()
    return TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(repository: exerciseVideoRepository)
    )
  }

  @MainActor
  public static func makeNutritionViewModel() -> NutritionViewModel {
    let repository = InMemoryNutritionLogRepository()
    return NutritionViewModel(
      createNutritionLogUseCase: CreateNutritionLogUseCase(repository: repository),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(repository: repository)
    )
  }

  @MainActor
  public static func makeProgressViewModel() -> ProgressViewModel {
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let nutritionLogRepository = InMemoryNutritionLogRepository()
    return ProgressViewModel(
      buildProgressSummaryUseCase: BuildProgressSummaryUseCase(
        listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(
          repository: workoutSessionRepository
        ),
        listNutritionLogsUseCase: ListNutritionLogsUseCase(
          repository: nutritionLogRepository
        )
      )
    )
  }

  @MainActor
  public static func makeOfflineSyncViewModel() -> OfflineSyncViewModel {
    let queueRepository = InMemoryOfflineSyncQueueRepository()
    let trainingPlanRepository = InMemoryTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let nutritionLogRepository = InMemoryNutritionLogRepository()
    let queueUseCase = QueueOfflineActionUseCase(repository: queueRepository)
    let gateway = InMemoryOfflineSyncGateway(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      createNutritionLogUseCase: CreateNutritionLogUseCase(repository: nutritionLogRepository)
    )
    let syncUseCase = SyncOfflineQueueUseCase(repository: queueRepository, gateway: gateway)
    return OfflineSyncViewModel(
      queueOfflineActionUseCase: queueUseCase,
      syncOfflineQueueUseCase: syncUseCase
    )
  }

  @MainActor
  public static func makeObservabilityViewModel() -> ObservabilityViewModel {
    let analyticsEventRepository = InMemoryAnalyticsEventRepository()
    let crashReportRepository = InMemoryCrashReportRepository()
    return ObservabilityViewModel(
      createAnalyticsEventUseCase: CreateAnalyticsEventUseCase(
        repository: analyticsEventRepository
      ),
      listAnalyticsEventsUseCase: ListAnalyticsEventsUseCase(
        repository: analyticsEventRepository
      ),
      createCrashReportUseCase: CreateCrashReportUseCase(
        repository: crashReportRepository
      ),
      listCrashReportsUseCase: ListCrashReportsUseCase(
        repository: crashReportRepository
      )
    )
  }
}
