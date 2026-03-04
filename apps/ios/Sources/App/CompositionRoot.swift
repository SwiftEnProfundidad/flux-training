import Foundation

public enum CompositionRoot {
  @MainActor
  public static func makeProductionProductRoot(
    configuration: FluxTrainingAppConfiguration = .production
  ) -> FluxTrainingProductRootView {
    let dependencies = makeProductionDependencies(configuration: configuration)
    return FluxTrainingProductRootView(
      authViewModel: dependencies.authViewModel,
      onboardingViewModel: dependencies.onboardingViewModel,
      trainingViewModel: dependencies.trainingViewModel,
      nutritionViewModel: dependencies.nutritionViewModel,
      progressViewModel: dependencies.progressViewModel,
      settingsHomeViewModel: dependencies.settingsHomeViewModel,
      accountProfileViewModel: dependencies.accountProfileViewModel,
      notificationsViewModel: dependencies.notificationsViewModel,
      privacyConsentViewModel: dependencies.privacyConsentViewModel,
      exportDataViewModel: dependencies.exportDataViewModel,
      deleteAccountViewModel: dependencies.deleteAccountViewModel,
      userID: configuration.defaultUserID
    )
  }

  @MainActor
  public static func makeProductionExperienceHub(
    configuration: FluxTrainingAppConfiguration = .production
  ) -> ExperienceHubView {
    let dependencies = makeProductionDependencies(configuration: configuration)
    return ExperienceHubView(
      authViewModel: dependencies.authViewModel,
      onboardingViewModel: dependencies.onboardingViewModel,
      trainingViewModel: dependencies.trainingViewModel,
      nutritionViewModel: dependencies.nutritionViewModel,
      progressViewModel: dependencies.progressViewModel,
      settingsHomeViewModel: dependencies.settingsHomeViewModel,
      accountProfileViewModel: dependencies.accountProfileViewModel,
      notificationsViewModel: dependencies.notificationsViewModel,
      privacyConsentViewModel: dependencies.privacyConsentViewModel,
      exportDataViewModel: dependencies.exportDataViewModel,
      deleteAccountViewModel: dependencies.deleteAccountViewModel,
      offlineSyncViewModel: dependencies.offlineSyncViewModel,
      observabilityViewModel: dependencies.observabilityViewModel,
      loadRoleCapabilitiesHandler: dependencies.loadRoleCapabilitiesHandler,
      displayMode: .product,
      userID: configuration.defaultUserID
    )
  }

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
  public static func makeSettingsHomeViewModel() -> SettingsHomeViewModel {
    let repository = PersistentUserSettingsRepository()
    return SettingsHomeViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )
  }

  @MainActor
  public static func makeAccountProfileViewModel() -> AccountProfileViewModel {
    let repository = PersistentUserProfileRepository()
    return AccountProfileViewModel(
      loadUserProfileUseCase: LoadUserProfileUseCase(repository: repository),
      saveUserProfileUseCase: SaveUserProfileUseCase(repository: repository)
    )
  }

  @MainActor
  public static func makeNotificationsViewModel() -> NotificationsViewModel {
    let repository = PersistentUserSettingsRepository()
    return NotificationsViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )
  }

  @MainActor
  public static func makePrivacyConsentViewModel() -> PrivacyConsentViewModel {
    let repository = PersistentUserLegalConsentRepository()
    return PrivacyConsentViewModel(
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(repository: repository),
      saveUserLegalConsentUseCase: SaveUserLegalConsentUseCase(repository: repository)
    )
  }

  @MainActor
  public static func makeExportDataViewModel() -> ExportDataViewModel {
    let profileRepository = PersistentUserProfileRepository()
    let settingsRepository = PersistentUserSettingsRepository()
    let legalConsentRepository = PersistentUserLegalConsentRepository()
    return ExportDataViewModel(
      exportUserDataUseCase: ExportUserDataUseCase(
        userProfileRepository: profileRepository,
        userSettingsRepository: settingsRepository,
        userLegalConsentRepository: legalConsentRepository
      )
    )
  }

  @MainActor
  public static func makeDeleteAccountViewModel() -> DeleteAccountViewModel {
    let requestRepository = PersistentAccountDeletionRequestRepository()
    let consentRepository = PersistentUserLegalConsentRepository()
    return DeleteAccountViewModel(
      loadLatestAccountDeletionRequestUseCase: LoadLatestAccountDeletionRequestUseCase(
        repository: requestRepository
      ),
      requestAccountDeletionUseCase: RequestAccountDeletionUseCase(
        repository: requestRepository
      ),
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(
        repository: consentRepository
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

  private struct ProductionDependencies {
    let authViewModel: AuthViewModel
    let onboardingViewModel: OnboardingViewModel
    let trainingViewModel: TrainingFlowViewModel
    let nutritionViewModel: NutritionViewModel
    let progressViewModel: ProgressViewModel
    let settingsHomeViewModel: SettingsHomeViewModel
    let accountProfileViewModel: AccountProfileViewModel
    let notificationsViewModel: NotificationsViewModel
    let privacyConsentViewModel: PrivacyConsentViewModel
    let exportDataViewModel: ExportDataViewModel
    let deleteAccountViewModel: DeleteAccountViewModel
    let offlineSyncViewModel: OfflineSyncViewModel
    let observabilityViewModel: ObservabilityViewModel
    let loadRoleCapabilitiesHandler: @Sendable (ExperienceRole) async -> Set<ExperienceDomain>?
  }

  @MainActor
  private static func makeProductionDependencies(
    configuration: FluxTrainingAppConfiguration
  ) -> ProductionDependencies {
    let sessionStore = FluxSessionStore()
    let client = FluxBackendClient(
      configuration: configuration.backendConfiguration,
      sessionStore: sessionStore
    )

    let authGateway = RemoteAuthGateway(
      client: client,
      sessionStore: sessionStore,
      configuration: configuration.backendConfiguration
    )
    let roleCapabilitiesGateway = RemoteRoleCapabilitiesGateway(client: client)
    let authViewModel = AuthViewModel(
      createAuthSessionUseCase: CreateAuthSessionUseCase(authGateway: authGateway)
    )

    let userProfileRepository = PersistentUserProfileRepository()
    let onboardingViewModel = OnboardingViewModel(
      completeOnboardingUseCase: CompleteOnboardingUseCase(
        userProfileRepository: userProfileRepository
      )
    )

    let trainingPlanRepository = RemoteTrainingPlanRepository(client: client)
    let workoutSessionRepository = RemoteWorkoutSessionRepository(client: client)
    let exerciseVideoRepository = RemoteExerciseVideoRepository(client: client)
    let trainingViewModel = TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(
        repository: trainingPlanRepository
      ),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(
        repository: trainingPlanRepository
      ),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(
        repository: workoutSessionRepository
      ),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(
        repository: workoutSessionRepository
      ),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(
        repository: exerciseVideoRepository
      )
    )

    let nutritionRepository = RemoteNutritionLogRepository(client: client)
    let nutritionViewModel = NutritionViewModel(
      createNutritionLogUseCase: CreateNutritionLogUseCase(
        repository: nutritionRepository
      ),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(
        repository: nutritionRepository
      )
    )

    let progressViewModel = ProgressViewModel(
      buildProgressSummaryUseCase: BuildProgressSummaryUseCase(
        listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(
          repository: workoutSessionRepository
        ),
        listNutritionLogsUseCase: ListNutritionLogsUseCase(
          repository: nutritionRepository
        )
      )
    )

    let userSettingsRepository = PersistentUserSettingsRepository()
    let settingsHomeViewModel = SettingsHomeViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: userSettingsRepository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: userSettingsRepository)
    )
    let notificationsViewModel = NotificationsViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: userSettingsRepository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: userSettingsRepository)
    )
    let userLegalConsentRepository = PersistentUserLegalConsentRepository()
    let privacyConsentViewModel = PrivacyConsentViewModel(
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(
        repository: userLegalConsentRepository
      ),
      saveUserLegalConsentUseCase: SaveUserLegalConsentUseCase(
        repository: userLegalConsentRepository
      )
    )
    let accountProfileViewModel = AccountProfileViewModel(
      loadUserProfileUseCase: LoadUserProfileUseCase(repository: userProfileRepository),
      saveUserProfileUseCase: SaveUserProfileUseCase(repository: userProfileRepository)
    )
    let exportDataViewModel = ExportDataViewModel(
      exportUserDataUseCase: ExportUserDataUseCase(
        userProfileRepository: userProfileRepository,
        userSettingsRepository: userSettingsRepository,
        userLegalConsentRepository: userLegalConsentRepository
      )
    )
    let accountDeletionRepository = PersistentAccountDeletionRequestRepository()
    let deleteAccountViewModel = DeleteAccountViewModel(
      loadLatestAccountDeletionRequestUseCase: LoadLatestAccountDeletionRequestUseCase(
        repository: accountDeletionRepository
      ),
      requestAccountDeletionUseCase: RequestAccountDeletionUseCase(
        repository: accountDeletionRepository
      ),
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(
        repository: userLegalConsentRepository
      )
    )

    let queueRepository = PersistentOfflineSyncQueueRepository()
    let offlineSyncViewModel = OfflineSyncViewModel(
      queueOfflineActionUseCase: QueueOfflineActionUseCase(
        repository: queueRepository
      ),
      syncOfflineQueueUseCase: SyncOfflineQueueUseCase(
        repository: queueRepository,
        gateway: RemoteOfflineSyncGateway(client: client)
      )
    )

    let analyticsRepository = RemoteAnalyticsEventRepository(client: client)
    let crashReportRepository = RemoteCrashReportRepository(client: client)
    let observabilityViewModel = ObservabilityViewModel(
      createAnalyticsEventUseCase: CreateAnalyticsEventUseCase(
        repository: analyticsRepository
      ),
      listAnalyticsEventsUseCase: ListAnalyticsEventsUseCase(
        repository: analyticsRepository
      ),
      createCrashReportUseCase: CreateCrashReportUseCase(
        repository: crashReportRepository
      ),
      listCrashReportsUseCase: ListCrashReportsUseCase(
        repository: crashReportRepository
      )
    )

    let loadRoleCapabilitiesHandler: @Sendable (ExperienceRole) async -> Set<ExperienceDomain>? = {
      role in
      do {
        let allowedRawValues = try await roleCapabilitiesGateway.listAllowedDomainRawValues(
          roleRawValue: role.rawValue
        )
        let allowedDomains = Set(allowedRawValues.compactMap(ExperienceDomain.init(rawValue:)))
        return allowedDomains
      } catch {
        return nil
      }
    }

    return ProductionDependencies(
      authViewModel: authViewModel,
      onboardingViewModel: onboardingViewModel,
      trainingViewModel: trainingViewModel,
      nutritionViewModel: nutritionViewModel,
      progressViewModel: progressViewModel,
      settingsHomeViewModel: settingsHomeViewModel,
      accountProfileViewModel: accountProfileViewModel,
      notificationsViewModel: notificationsViewModel,
      privacyConsentViewModel: privacyConsentViewModel,
      exportDataViewModel: exportDataViewModel,
      deleteAccountViewModel: deleteAccountViewModel,
      offlineSyncViewModel: offlineSyncViewModel,
      observabilityViewModel: observabilityViewModel,
      loadRoleCapabilitiesHandler: loadRoleCapabilitiesHandler
    )
  }
}
