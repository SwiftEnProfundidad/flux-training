import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ExperienceHubView: View {
  private static let defaultAuthScreenContract = AuthScreenContract()
  private static let defaultOnboardingScreenContract = OnboardingScreenContract()
  private static let defaultNutritionProgressAIScreenContract = NutritionProgressAIScreenContract()
  private static let defaultSettingsLegalScreenContract = SettingsLegalScreenContract()

  @State private var authViewModel: AuthViewModel
  @State private var onboardingViewModel: OnboardingViewModel
  @State private var trainingViewModel: TrainingFlowViewModel
  @State private var nutritionViewModel: NutritionViewModel
  @State private var progressViewModel: ProgressViewModel
  @State private var offlineSyncViewModel: OfflineSyncViewModel
  @State private var observabilityViewModel: ObservabilityViewModel
  @State private var recommendations: [AIRecommendation] = []
  @State private var recommendationsStatus: String =
    defaultNutritionProgressAIScreenContract.recommendationsStatus.rawValue
  @State private var settingsStatus: String = defaultSettingsLegalScreenContract.settingsStatus.rawValue
  @State private var legalStatus: String = defaultSettingsLegalScreenContract.legalStatus.rawValue
  @State private var notificationsEnabled: Bool = defaultSettingsLegalScreenContract.notificationsEnabled
  @State private var watchSyncEnabled: Bool = defaultSettingsLegalScreenContract.watchSyncEnabled
  @State private var calendarSyncEnabled: Bool = defaultSettingsLegalScreenContract.calendarSyncEnabled
  @State private var privacyPolicyAccepted: Bool = defaultOnboardingScreenContract.privacyPolicyAccepted
  @State private var termsAccepted: Bool = defaultOnboardingScreenContract.termsAccepted
  @State private var medicalDisclaimerAccepted: Bool =
    defaultOnboardingScreenContract.medicalDisclaimerAccepted
  @State private var language: SupportedLanguage = .es
  @State private var activeRole: ExperienceRole = .athlete
  @State private var activeRoleAllowedDomains: Set<ExperienceDomain> = [.all]
  @State private var sectionShell = ExperienceSectionShell()
  @State private var runtimeStateStore = ExperienceDomainRuntimeStateStore()
  @State private var runtimeObservabilitySession = RuntimeObservabilitySession()
  @State private var hasHydratedPersistedDomain = false
  @State private var hasHydratedPersistedRole = false
  @State private var hasTrackedInitialDomainChange = false
  @AppStorage("flux_training_dashboard_domain")
  private var persistedDomainRawValue: String = ExperienceDomain.all.rawValue
  @AppStorage("flux_training_dashboard_role")
  private var persistedRoleRawValue: String = ExperienceRole.athlete.rawValue

  @State private var email: String = defaultAuthScreenContract.email
  @State private var password: String = defaultAuthScreenContract.password
  @State private var parQQuestionOne: Bool = defaultOnboardingScreenContract.parQQuestionOne
  @State private var parQQuestionTwo: Bool = defaultOnboardingScreenContract.parQQuestionTwo

  private let userID: String
  private let generateAIRecommendationsUseCase: GenerateAIRecommendationsUseCase

  public init(
    authViewModel: AuthViewModel,
    onboardingViewModel: OnboardingViewModel,
    trainingViewModel: TrainingFlowViewModel,
    nutritionViewModel: NutritionViewModel,
    progressViewModel: ProgressViewModel,
    offlineSyncViewModel: OfflineSyncViewModel,
    observabilityViewModel: ObservabilityViewModel,
    generateAIRecommendationsUseCase: GenerateAIRecommendationsUseCase =
      GenerateAIRecommendationsUseCase(),
    userID: String = "demo-user"
  ) {
    _authViewModel = State(initialValue: authViewModel)
    _onboardingViewModel = State(initialValue: onboardingViewModel)
    _trainingViewModel = State(initialValue: trainingViewModel)
    _nutritionViewModel = State(initialValue: nutritionViewModel)
    _progressViewModel = State(initialValue: progressViewModel)
    _offlineSyncViewModel = State(initialValue: offlineSyncViewModel)
    _observabilityViewModel = State(initialValue: observabilityViewModel)
    self.generateAIRecommendationsUseCase = generateAIRecommendationsUseCase
    self.userID = userID
  }

  @MainActor
  public static func makeDemo(userID: String = "demo-user") -> ExperienceHubView {
    ExperienceHubView(
      authViewModel: CompositionRoot.makeAuthViewModel(),
      onboardingViewModel: CompositionRoot.makeOnboardingViewModel(),
      trainingViewModel: CompositionRoot.makeTrainingFlowViewModel(),
      nutritionViewModel: CompositionRoot.makeNutritionViewModel(),
      progressViewModel: CompositionRoot.makeProgressViewModel(),
      offlineSyncViewModel: CompositionRoot.makeOfflineSyncViewModel(),
      observabilityViewModel: CompositionRoot.makeObservabilityViewModel(),
      userID: userID
    )
  }

  @MainActor
  public static func makeProduction(
    configuration: FluxTrainingAppConfiguration = .production
  ) -> ExperienceHubView {
    CompositionRoot.makeProductionExperienceHub(configuration: configuration)
  }

  private var readinessSnapshot: UXReadinessSnapshot {
    UXReadinessBuilder.make(
      authStatus: authViewModel.authStatus,
      onboardingStatus: onboardingViewModel.onboardingStatus,
      trainingStatus: trainingViewModel.status,
      nutritionStatus: nutritionViewModel.status,
      progressStatus: progressViewModel.status,
      syncStatus: offlineSyncViewModel.syncStatus,
      observabilityStatus: observabilityViewModel.status,
      pendingQueueCount: offlineSyncViewModel.pendingCount
    )
  }

  private var copy: LocalizedCopy {
    LocalizedCopy(language: language)
  }

  private var activeUserID: String {
    let sessionUserID = authViewModel.currentUserID?.trimmingCharacters(in: .whitespacesAndNewlines)
    if let sessionUserID, sessionUserID.isEmpty == false {
      return sessionUserID
    }
    let fallbackUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    return fallbackUserID.isEmpty ? "demo-user" : fallbackUserID
  }

  private var activeDomainRuntimeState: EnterpriseRuntimeState {
    runtimeStateStore.state(for: sectionShell.activeDomain)
  }

  private var nutritionProgressAIScreenContract: NutritionProgressAIScreenContract {
    NutritionProgressAIScreenContract(
      nutritionLogs: nutritionViewModel.logs,
      progressSummary: progressViewModel.summary,
      recommendations: recommendations,
      nutritionStatus: nutritionViewModel.screenStatus,
      progressStatus: progressViewModel.screenStatus,
      recommendationsStatus: NutritionProgressAIScreenStatus.fromRuntimeStatus(recommendationsStatus)
    )
  }

  private var settingsLegalScreenContract: SettingsLegalScreenContract {
    SettingsLegalScreenContract(
      notificationsEnabled: notificationsEnabled,
      watchSyncEnabled: watchSyncEnabled,
      calendarSyncEnabled: calendarSyncEnabled,
      privacyPolicyAccepted: privacyPolicyAccepted,
      termsAccepted: termsAccepted,
      medicalDisclaimerAccepted: medicalDisclaimerAccepted,
      settingsStatus: SettingsLegalScreenStatus.fromRuntimeStatus(settingsStatus),
      legalStatus: SettingsLegalScreenStatus.fromRuntimeStatus(legalStatus)
    )
  }

  public var body: some View {
    TabView {
      todayTab
        .tabItem {
          Label(copy.text(.todayTab), systemImage: "bolt.heart.fill")
        }

      progressTab
        .tabItem {
          Label(copy.text(.progressTab), systemImage: "chart.line.uptrend.xyaxis")
        }

      operationsTab
        .tabItem {
          Label(copy.text(.operationsTab), systemImage: "antenna.radiowaves.left.and.right")
        }
    }
    .tint(.orange)
    .onAppear {
      hydratePersistedPreferencesIfNeeded()
    }
    .onChange(of: sectionShell.activeDomain) { _, newValue in
      persistedDomainRawValue = newValue.rawValue
      if !hasTrackedInitialDomainChange {
        hasTrackedInitialDomainChange = true
        return
      }
      Task {
        await trackDomainChange(newValue)
      }
    }
    .onChange(of: activeRole) { _, newValue in
      persistedRoleRawValue = newValue.rawValue
      activeRoleAllowedDomains = [.all]
      reconcileRuntimeStateForRole()
      Task {
        await loadRoleCapabilities(for: newValue)
        await trackRoleChange(newValue)
      }
    }
  }

  private var todayTab: some View {
    NavigationStack {
      ScrollView {
        LazyVStack(alignment: .leading, spacing: 16) {
          domainFilterSection
          runtimeStateSection
          if activeDomainRuntimeState == .success {
            if hasTodayContent {
              if moduleVisible(.readiness) {
                readinessHero
              }
              if moduleVisible(.auth) {
                authSection
              }
              if moduleVisible(.onboarding) {
                onboardingSection
              }
              if moduleVisible(.training) {
                TrainingFlowView(viewModel: trainingViewModel, userID: activeUserID, copy: copy)
                  .cardSurface()
              }
              if moduleVisible(.nutrition) {
                nutritionSection
              }
            } else {
              noModulesSection
            }
          } else {
            runtimeStateBannerSection
          }
        }
        .padding(16)
      }
      .background(backgroundGradient)
      .navigationTitle(copy.text(.appName))
    }
  }

  private var progressTab: some View {
    NavigationStack {
      ScrollView {
        LazyVStack(spacing: 16) {
          domainFilterSection
          runtimeStateSection
          if activeDomainRuntimeState == .success {
            if moduleVisible(.progress) {
              ProgressSummaryView(viewModel: progressViewModel, userID: activeUserID, copy: copy)
                .cardSurface()
            } else {
              noModulesSection
            }
          } else {
            runtimeStateBannerSection
          }
        }
        .padding(16)
      }
      .background(backgroundGradient)
      .navigationTitle(copy.text(.progressNavigationTitle))
    }
  }

  private var operationsTab: some View {
    NavigationStack {
      ScrollView {
        LazyVStack(spacing: 16) {
          domainFilterSection
          runtimeStateSection
          if activeDomainRuntimeState == .success {
            if hasOperationsContent {
              if moduleVisible(.offlineSync) {
                OfflineSyncView(viewModel: offlineSyncViewModel, userID: activeUserID, copy: copy)
                  .cardSurface()
              }
              if moduleVisible(.observability) {
                ObservabilityView(viewModel: observabilityViewModel, userID: activeUserID, copy: copy)
                  .cardSurface()
              }
              if moduleVisible(.recommendations) {
                aiRecommendationsSection
              }
              if moduleVisible(.settings) {
                settingsSection
              }
              if moduleVisible(.legal) {
                legalSection
              }
              Text("\(copy.text(.overallStatusLabel)): \(copy.readinessLabel(readinessSnapshot.label))")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            } else {
              noModulesSection
            }
          } else {
            runtimeStateBannerSection
          }
        }
        .padding(16)
      }
      .background(backgroundGradient)
      .navigationTitle(copy.text(.operationsNavigationTitle))
    }
  }

  private var readinessHero: some View {
    VStack(alignment: .leading, spacing: 10) {
      Text(copy.text(.heroTitle))
        .font(.title3.bold())
      Text("\(copy.text(.readinessLabel)) \(readinessSnapshot.score)%")
        .font(.largeTitle.bold())
      Picker(copy.text(.languageLabel), selection: $language) {
        Text(copy.text(.languageOptionSpanish)).tag(SupportedLanguage.es)
        Text(copy.text(.languageOptionEnglish)).tag(SupportedLanguage.en)
      }
      .pickerStyle(.segmented)
      Text(copy.readinessLabel(readinessSnapshot.label))
        .font(.headline)
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(readinessColor.opacity(0.15))
        .foregroundStyle(readinessColor)
        .clipShape(.capsule)
      Text(copy.text(.dailyObjective))
        .foregroundStyle(.secondary)
        .font(.subheadline)
    }
    .cardSurface()
  }

  private var domainFilterSection: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.domainFilterLabel))
        .font(.headline)
      ScrollView(.horizontal) {
        HStack(spacing: 8) {
          ForEach(ExperienceDomain.allCases, id: \.self) { domain in
            Button {
              handleDomainSelection(domain)
            } label: {
              Text(domainLabel(domain))
                .font(.subheadline.bold())
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .frame(minWidth: 92)
                .background(domainBackground(domain))
                .foregroundStyle(domainForeground(domain))
                .clipShape(.capsule)
            }
            .buttonStyle(.plain)
          }
        }
        .padding(.horizontal, 2)
      }
      .scrollIndicators(.hidden)
      Picker(copy.text(.roleLabel), selection: $activeRole) {
        Text(copy.text(.roleAthlete)).tag(ExperienceRole.athlete)
        Text(copy.text(.roleCoach)).tag(ExperienceRole.coach)
        Text(copy.text(.roleAdmin)).tag(ExperienceRole.admin)
      }
      .pickerStyle(.segmented)
    }
    .cardSurface()
  }

  private var noModulesSection: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(copy.text(.noModulesForSelectedDomain))
        .font(.subheadline)
        .foregroundStyle(.secondary)
    }
    .cardSurface()
  }

  private var runtimeStateSection: some View {
    VStack(alignment: .leading, spacing: 10) {
      HStack {
        Text(copy.text(.runtimeStateSectionTitle))
          .font(.headline)
        Spacer()
        Text(copy.humanStatus(activeDomainRuntimeState.rawValue))
          .font(.caption.bold())
          .padding(.horizontal, 10)
          .padding(.vertical, 6)
          .background(runtimeStateColor.opacity(0.22))
          .foregroundStyle(runtimeStateColor)
          .clipShape(.capsule)
      }

      if sectionShell.activeDomain == .all {
        Text(copy.text(.runtimeStateHintAllDomains))
          .font(.subheadline)
          .foregroundStyle(.secondary)
      } else {
        Picker(
          copy.text(.runtimeStateModeLabel),
          selection: Binding(
            get: { activeDomainRuntimeState },
            set: { selectedState in
              runtimeStateStore.set(state: selectedState, for: sectionShell.activeDomain)
            }
          )
        ) {
          ForEach(EnterpriseRuntimeState.allCases, id: \.self) { state in
            Text(copy.humanStatus(state.rawValue)).tag(state)
          }
        }
        .pickerStyle(.menu)
        .labelsHidden()

        Button(copy.text(.runtimeStateRecoveryAction)) {
          Task { await recoverActiveDomainState() }
        }
        .buttonStyle(.bordered)
        .disabled(activeDomainRuntimeState == .success)

        Text(runtimeStateDescription(activeDomainRuntimeState))
          .font(.subheadline)
          .foregroundStyle(.secondary)
      }
    }
    .cardSurface()
  }

  private var runtimeStateBannerSection: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.runtimeStateSectionTitle))
        .font(.title3.bold())
      Text(runtimeStateDescription(activeDomainRuntimeState))
        .font(.subheadline)
        .foregroundStyle(.secondary)
      Button(copy.text(.runtimeStateRecoveryAction)) {
        Task { await recoverActiveDomainState() }
      }
      .buttonStyle(.borderedProminent)
      .tint(.orange)
    }
    .cardSurface()
  }

  private var authSection: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.authenticationTitle))
        .font(.title3.bold())
      Button(copy.text(.signInWithApple)) {
        Task { await authViewModel.signInWithApple() }
      }
      .buttonStyle(.borderedProminent)
      .tint(.orange)
      .accessibilityIdentifier("auth.signInApple")
      TextField(copy.text(.emailField), text: $email)
        .fluxEmailFieldBehavior()
        .textContentType(.emailAddress)
        .submitLabel(.next)
        .textFieldStyle(RoundedBorderTextFieldStyle())
        .accessibilityIdentifier("auth.email")
      SecureField(copy.text(.passwordField), text: $password)
        .textContentType(.password)
        .submitLabel(.go)
        .textFieldStyle(RoundedBorderTextFieldStyle())
        .accessibilityIdentifier("auth.password")
      Button(copy.text(.signInWithEmail)) {
        Task { await authViewModel.signInWithEmail(email: email, password: password) }
      }
      .buttonStyle(.bordered)
      .accessibilityIdentifier("auth.signInEmail")
      HStack {
        Button(copy.text(.recoverByEmail)) {
          authViewModel.requestRecovery(email: email, channel: .email)
        }
        .buttonStyle(.bordered)
        .accessibilityIdentifier("auth.recoverEmail")
        Button(copy.text(.recoverBySMS)) {
          authViewModel.requestRecovery(email: email, channel: .sms)
        }
        .buttonStyle(.bordered)
        .accessibilityIdentifier("auth.recoverSMS")
      }
      Text("\(copy.text(.authStatusLabel)): \(copy.humanStatus(authViewModel.authStatus))")
        .foregroundStyle(.secondary)
        .font(.footnote)
        .accessibilityIdentifier("auth.status")
    }
    .cardSurface()
  }

  private var onboardingSection: some View {
    @Bindable var bindableViewModel = onboardingViewModel

    return VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.onboardingTitle))
        .font(.title3.bold())
      TextField(copy.text(.displayName), text: $bindableViewModel.displayName)
        .textContentType(.name)
        .submitLabel(.next)
        .textFieldStyle(RoundedBorderTextFieldStyle())
        .accessibilityIdentifier("onboarding.displayName")
      HStack {
        TextField(
          copy.text(.age),
          value: $bindableViewModel.age,
          format: .number
        )
        .textFieldStyle(RoundedBorderTextFieldStyle())
        .accessibilityIdentifier("onboarding.age")
        TextField(
          copy.text(.days),
          value: $bindableViewModel.availableDaysPerWeek,
          format: .number
        )
        .textFieldStyle(RoundedBorderTextFieldStyle())
        .accessibilityIdentifier("onboarding.days")
      }
      Toggle(copy.text(.chestPainQuestion), isOn: $parQQuestionOne)
        .accessibilityIdentifier("onboarding.parq1")
      Toggle(copy.text(.dizzinessQuestion), isOn: $parQQuestionTwo)
        .accessibilityIdentifier("onboarding.parq2")
      Button(copy.text(.completeOnboarding)) {
        onboardingViewModel.parQResponses = [
          ParQResponse(questionID: "parq-1", answer: parQQuestionOne),
          ParQResponse(questionID: "parq-2", answer: parQQuestionTwo)
        ]
        Task {
          await onboardingViewModel.complete(
            userID: activeUserID,
            consent: OnboardingConsentChecklist(
              privacyPolicyAccepted: privacyPolicyAccepted,
              termsAccepted: termsAccepted,
              medicalDisclaimerAccepted: medicalDisclaimerAccepted
            )
          )
        }
      }
      .buttonStyle(.borderedProminent)
      .tint(.orange)
      .accessibilityIdentifier("onboarding.complete")
      Text("\(copy.text(.onboardingStatusLabel)): \(copy.humanStatus(onboardingViewModel.onboardingStatus))")
        .foregroundStyle(.secondary)
        .font(.footnote)
        .accessibilityIdentifier("onboarding.status")
    }
    .cardSurface()
  }

  private var nutritionSection: some View {
    @Bindable var bindableViewModel = nutritionViewModel

    return VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.nutritionTitle))
        .font(.title3.bold())
      TextField(copy.text(.nutritionDate), text: $bindableViewModel.date)
        .textFieldStyle(RoundedBorderTextFieldStyle())
      HStack {
        TextField(copy.text(.calories), value: $bindableViewModel.calories, format: .number)
          .textFieldStyle(RoundedBorderTextFieldStyle())
        TextField(copy.text(.protein), value: $bindableViewModel.proteinGrams, format: .number)
          .textFieldStyle(RoundedBorderTextFieldStyle())
      }
      HStack {
        TextField(copy.text(.carbs), value: $bindableViewModel.carbsGrams, format: .number)
          .textFieldStyle(RoundedBorderTextFieldStyle())
        TextField(copy.text(.fats), value: $bindableViewModel.fatsGrams, format: .number)
          .textFieldStyle(RoundedBorderTextFieldStyle())
      }
      HStack {
        Button(copy.text(.saveLog)) {
          Task { await nutritionViewModel.saveLog(userID: activeUserID) }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        Button(copy.text(.loadLogs)) {
          Task { await nutritionViewModel.refreshLogs(userID: activeUserID) }
        }
        .buttonStyle(.bordered)
      }
      Text(
        "\(copy.text(.nutritionStatusLabel)): \(copy.humanStatus(nutritionProgressAIScreenContract.nutritionStatus.rawValue))"
      )
      .foregroundStyle(.secondary)
      .font(.footnote)
      .accessibilityIdentifier("nutrition.status")
      Text("\(copy.text(.nutritionLogsLoaded)): \(nutritionProgressAIScreenContract.nutritionLogs.count)")
        .foregroundStyle(.secondary)
        .font(.footnote)
        .accessibilityIdentifier("nutrition.logsCount")
    }
    .cardSurface()
  }

  private var readinessColor: Color {
    switch readinessSnapshot.tone {
    case .positive:
      return .green
    case .warning:
      return .orange
    case .critical:
      return .red
    }
  }

  private var aiRecommendationsSection: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.recommendationsTitle))
        .font(.title3.bold())
      Button(copy.text(.loadRecommendations)) {
        Task { await loadRecommendations() }
      }
      .buttonStyle(.borderedProminent)
      .tint(.orange)
      .accessibilityIdentifier("recommendations.load")
      .disabled(recommendationsStatus == NutritionProgressAIScreenStatus.loading.rawValue)
      Text(
        "\(copy.text(.recommendationsStatusLabel)): \(copy.humanStatus(nutritionProgressAIScreenContract.recommendationsStatus.rawValue))"
      )
        .foregroundStyle(.secondary)
        .font(.footnote)
        .accessibilityIdentifier("recommendations.status")
      if recommendations.isEmpty {
        Text(copy.text(.noRecommendations))
          .foregroundStyle(.secondary)
      } else {
        ForEach(recommendations, id: \.id) { recommendation in
          VStack(alignment: .leading, spacing: 4) {
            HStack {
              Text(recommendation.title)
                .font(.subheadline.bold())
              Spacer()
              Text(copy.humanStatus(recommendation.priority.rawValue).uppercased())
                .font(.caption)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(.orange.opacity(0.2))
                .clipShape(.rect(cornerRadius: 8))
            }
            Text(recommendation.rationale)
              .font(.caption)
              .foregroundStyle(.secondary)
            Text(recommendation.actionLabel)
              .font(.caption.bold())
              .foregroundStyle(.orange)
          }
          .padding(10)
          .background(.ultraThinMaterial)
          .clipShape(.rect(cornerRadius: 12))
        }
      }
    }
    .cardSurface()
  }

  private func loadRecommendations() async {
    let resolvedUserID = activeUserID
    guard resolvedUserID.isEmpty == false else {
      recommendations = []
      recommendationsStatus = NutritionProgressAIScreenStatus.validationError.rawValue
      return
    }

    recommendationsStatus = NutritionProgressAIScreenStatus.loading.rawValue
    let estimatedDaysSinceWorkout = trainingViewModel.sessions.isEmpty ? 3 : 0
    let estimatedCompletionRate: Double = trainingViewModel.plans.isEmpty
      ? 0.4
      : min(1, Double(trainingViewModel.sessions.count) / Double(max(1, trainingViewModel.plans.count * 2)))
    recommendations = await generateAIRecommendationsUseCase.execute(
      userID: resolvedUserID,
      goal: onboardingViewModel.selectedGoal,
      pendingQueueCount: offlineSyncViewModel.pendingCount,
      daysSinceLastWorkout: estimatedDaysSinceWorkout,
      recentCompletionRate: estimatedCompletionRate,
      locale: copy.recommendationLocale
    )
    recommendationsStatus = recommendations.isEmpty
      ? NutritionProgressAIScreenStatus.empty.rawValue
      : NutritionProgressAIScreenStatus.loaded.rawValue
  }

  private var backgroundGradient: some View {
    LinearGradient(
      colors: [Color(red: 0.05, green: 0.06, blue: 0.08), Color(red: 0.08, green: 0.09, blue: 0.12)],
      startPoint: .topLeading,
      endPoint: .bottomTrailing
    )
    .ignoresSafeArea()
  }

  private var hasTodayContent: Bool {
    moduleVisible(.readiness)
      || moduleVisible(.auth)
      || moduleVisible(.onboarding)
      || moduleVisible(.training)
      || moduleVisible(.nutrition)
  }

  private var hasOperationsContent: Bool {
    moduleVisible(.settings)
      || moduleVisible(.legal)
      || moduleVisible(.offlineSync)
      || moduleVisible(.observability)
      || moduleVisible(.recommendations)
  }

  private var settingsSection: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.settingsTitle))
        .font(.title3.bold())
      Toggle(copy.text(.notificationsPreference), isOn: $notificationsEnabled)
        .accessibilityIdentifier("settings.notifications")
      Toggle(copy.text(.watchPreference), isOn: $watchSyncEnabled)
        .accessibilityIdentifier("settings.watchSync")
      Toggle(copy.text(.calendarPreference), isOn: $calendarSyncEnabled)
        .accessibilityIdentifier("settings.calendarSync")
      Button(copy.text(.saveSettings)) {
        saveSettings()
      }
      .buttonStyle(.borderedProminent)
      .tint(.orange)
      .accessibilityIdentifier("settings.save")
      Text(
        "\(copy.text(.settingsStatusLabel)): \(copy.humanStatus(settingsLegalScreenContract.settingsStatus.rawValue))"
      )
        .foregroundStyle(.secondary)
        .font(.footnote)
        .accessibilityIdentifier("settings.status")
    }
    .cardSurface()
  }

  private var legalSection: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.legalSectionTitle))
        .font(.title3.bold())
      Toggle(copy.text(.acceptPrivacyPolicy), isOn: $privacyPolicyAccepted)
        .accessibilityIdentifier("legal.acceptPrivacy")
      Toggle(copy.text(.acceptTerms), isOn: $termsAccepted)
        .accessibilityIdentifier("legal.acceptTerms")
      Toggle(copy.text(.acceptMedicalDisclaimer), isOn: $medicalDisclaimerAccepted)
        .accessibilityIdentifier("legal.acceptMedicalDisclaimer")
      Text(
        "\(copy.text(.legalSummaryLabel)): \(copy.humanStatus(privacyPolicyAccepted && termsAccepted && medicalDisclaimerAccepted ? SettingsLegalScreenStatus.saved.rawValue : SettingsLegalScreenStatus.idle.rawValue))"
      )
      .foregroundStyle(.secondary)
      .font(.footnote)
      .accessibilityIdentifier("legal.summary")
      HStack {
        Button(copy.text(.saveConsent)) {
          saveConsent()
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("legal.saveConsent")
        Button(copy.text(.exportData)) {
          exportLegalData()
        }
        .buttonStyle(.bordered)
        .accessibilityIdentifier("legal.exportData")
        Button(copy.text(.requestDeletion)) {
          requestDeletion()
        }
        .buttonStyle(.bordered)
        .accessibilityIdentifier("legal.requestDeletion")
      }
      Text("\(copy.text(.legalStatusLabel)): \(copy.humanStatus(settingsLegalScreenContract.legalStatus.rawValue))")
        .foregroundStyle(.secondary)
        .font(.footnote)
        .accessibilityIdentifier("legal.status")
    }
    .cardSurface()
  }

  private func saveSettings() {
    settingsStatus = SettingsLegalScreenStatus.loading.rawValue
    settingsStatus = SettingsLegalScreenStatus.saved.rawValue
  }

  private func saveConsent() {
    legalStatus = SettingsLegalScreenStatus.loading.rawValue
    legalStatus = allLegalConsentsAccepted
      ? SettingsLegalScreenStatus.saved.rawValue
      : SettingsLegalScreenStatus.consentRequired.rawValue
  }

  private func exportLegalData() {
    legalStatus = SettingsLegalScreenStatus.loading.rawValue
    legalStatus = (privacyPolicyAccepted && termsAccepted)
      ? SettingsLegalScreenStatus.exported.rawValue
      : SettingsLegalScreenStatus.consentRequired.rawValue
  }

  private func requestDeletion() {
    legalStatus = SettingsLegalScreenStatus.loading.rawValue
    legalStatus = allLegalConsentsAccepted
      ? SettingsLegalScreenStatus.deletionRequested.rawValue
      : SettingsLegalScreenStatus.consentRequired.rawValue
  }

  private var allLegalConsentsAccepted: Bool {
    privacyPolicyAccepted && termsAccepted && medicalDisclaimerAccepted
  }

  private func moduleVisible(_ module: ExperienceModule) -> Bool {
    sectionShell.isModuleVisible(module)
  }

  private func domainLabel(_ domain: ExperienceDomain) -> String {
    switch domain {
    case .all:
      return copy.text(.domainAll)
    case .onboarding:
      return copy.text(.domainOnboarding)
    case .training:
      return copy.text(.domainTraining)
    case .nutrition:
      return copy.text(.domainNutrition)
    case .progress:
      return copy.text(.domainProgress)
    case .operations:
      return copy.text(.domainOperations)
    }
  }

  private func domainBackground(_ domain: ExperienceDomain) -> Color {
    if sectionShell.activeDomain == domain {
      return .orange
    }
    return Color(red: 0.13, green: 0.14, blue: 0.18)
  }

  private func domainForeground(_ domain: ExperienceDomain) -> Color {
    if sectionShell.activeDomain == domain {
      return .black
    }
    return .white
  }

  private func hydratePersistedPreferencesIfNeeded() {
    if hasHydratedPersistedDomain && hasHydratedPersistedRole {
      return
    }
    if !hasHydratedPersistedDomain {
      hasHydratedPersistedDomain = true
      sectionShell = ExperienceSectionShell(persistedDomainRawValue: persistedDomainRawValue)
    }
    if !hasHydratedPersistedRole {
      hasHydratedPersistedRole = true
      activeRole = ExperienceRole(rawValue: persistedRoleRawValue) ?? .athlete
    }
    Task {
      await loadRoleCapabilities(for: activeRole)
      reconcileRuntimeStateForRole()
    }
  }

  private var runtimeStateColor: Color {
    switch activeDomainRuntimeState {
    case .success:
      return .green
    case .loading:
      return .orange
    case .empty:
      return .gray
    case .error, .denied:
      return .red
    case .offline:
      return .yellow
    }
  }

  private func runtimeStateDescription(_ state: EnterpriseRuntimeState) -> String {
    switch state {
    case .success:
      return copy.text(.runtimeStateSuccessDescription)
    case .loading:
      return copy.text(.runtimeStateLoadingDescription)
    case .empty:
      return copy.text(.runtimeStateEmptyDescription)
    case .error:
      return copy.text(.runtimeStateErrorDescription)
    case .offline:
      return copy.text(.runtimeStateOfflineDescription)
    case .denied:
      return copy.text(.runtimeStateDeniedDescription)
    }
  }

  @MainActor
  private func recoverActiveDomainState() async {
    if !canAccessActiveDomain(sectionShell.activeDomain) {
      runtimeStateStore.set(state: .denied, for: sectionShell.activeDomain)
      let correlationID = nextRuntimeCorrelationID(
        domain: sectionShell.activeDomain,
        trigger: "recover"
      )
      await trackDeniedDomainAccess(
        domain: sectionShell.activeDomain,
        trigger: "recover",
        correlationID: correlationID
      )
      await trackBlockedAction(
        domain: sectionShell.activeDomain,
        action: "recover",
        reason: "domain_denied",
        correlationID: correlationID
      )
      return
    }
    runtimeStateStore.reset(for: sectionShell.activeDomain)
    let runtimeUserID = activeUserID
    switch sectionShell.activeDomain {
    case .training:
      do {
        try await trainingViewModel.refreshPlans(userID: runtimeUserID)
        try await trainingViewModel.refreshSessions(userID: runtimeUserID)
      } catch {
        return
      }
    case .nutrition:
      await nutritionViewModel.refreshLogs(userID: runtimeUserID)
    case .progress:
      await progressViewModel.refresh(userID: runtimeUserID)
    case .operations:
      await offlineSyncViewModel.refresh(userID: runtimeUserID)
      await observabilityViewModel.refresh(userID: runtimeUserID)
    case .onboarding, .all:
      return
    }
  }

  private func handleDomainSelection(_ domain: ExperienceDomain) {
    sectionShell.select(domain: domain)
    if domain == .all {
      return
    }
    if !canAccessActiveDomain(domain) {
      runtimeStateStore.set(state: .denied, for: domain)
      Task {
        let correlationID = nextRuntimeCorrelationID(domain: domain, trigger: "domain_select")
        await trackDeniedDomainAccess(
          domain: domain,
          trigger: "domain_select",
          correlationID: correlationID
        )
        await trackBlockedAction(
          domain: domain,
          action: "domain_select",
          reason: "domain_denied",
          correlationID: correlationID
        )
      }
    }
  }

  private func reconcileRuntimeStateForRole() {
    let domain = sectionShell.activeDomain
    if domain == .all {
      return
    }
    let currentState = runtimeStateStore.state(for: domain)
    if canAccessActiveDomain(domain), currentState == .denied {
      runtimeStateStore.reset(for: domain)
    } else if !canAccessActiveDomain(domain), currentState != .denied {
      runtimeStateStore.set(state: .denied, for: domain)
      Task {
        let correlationID = nextRuntimeCorrelationID(
          domain: domain,
          trigger: "role_capabilities_sync"
        )
        await trackDeniedDomainAccess(
          domain: domain,
          trigger: "role_capabilities_sync",
          correlationID: correlationID
        )
        await trackBlockedAction(
          domain: domain,
          action: "role_capabilities_sync",
          reason: "domain_denied",
          correlationID: correlationID
        )
      }
    }
  }

  private func canAccessActiveDomain(_ domain: ExperienceDomain) -> Bool {
    if domain == .all {
      return true
    }
    return activeRoleAllowedDomains.contains(domain)
  }

  @MainActor
  private func loadRoleCapabilities(for role: ExperienceRole) async {
    let fallbackDomains = activeRoleAllowedDomains.isEmpty ? Set([ExperienceDomain.all]) : activeRoleAllowedDomains

    guard let url = URL(
      string: "http://127.0.0.1:8787/api/listRoleCapabilities?role=\(role.rawValue)"
    ) else {
      activeRoleAllowedDomains = fallbackDomains
      reconcileRuntimeStateForRole()
      return
    }

    var request = URLRequest(url: url)
    request.setValue("ios", forHTTPHeaderField: "x-flux-client-platform")
    request.setValue("0.1.0", forHTTPHeaderField: "x-flux-client-version")

    struct RoleCapabilitiesEnvelope: Decodable {
      struct Capabilities: Decodable {
        let role: String
        let allowedDomains: [String]
      }
      let capabilities: Capabilities
    }

    do {
      let (data, response) = try await URLSession.shared.data(for: request)
      guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
        activeRoleAllowedDomains = fallbackDomains
        reconcileRuntimeStateForRole()
        return
      }
      let decoded = try JSONDecoder().decode(RoleCapabilitiesEnvelope.self, from: data)
      let allowed = Set(decoded.capabilities.allowedDomains.compactMap(ExperienceDomain.init(rawValue:)))
      activeRoleAllowedDomains = allowed.isEmpty ? fallbackDomains : allowed
      reconcileRuntimeStateForRole()
    } catch {
      activeRoleAllowedDomains = fallbackDomains
      reconcileRuntimeStateForRole()
    }
  }

  private func trackRoleChange(_ role: ExperienceRole) async {
    let runtimeAttributes = nextEventRuntimeAttributes(domain: sectionShell.activeDomain)
    await observabilityViewModel.trackRuntimeEvent(
      userID: activeUserID,
      name: "dashboard_role_changed",
      attributes: [
        "role": role.rawValue,
        "domain": sectionShell.activeDomain.rawValue,
        "allowed_domain_count": String(activeRoleAllowedDomains.count)
      ]
      .merging(runtimeAttributes) { _, latest in latest }
    )
  }

  private func trackDomainChange(_ domain: ExperienceDomain) async {
    let backendRoute = BlockedActionBackendContract.resolveRoute(for: domain)
    let payloadValidation = BlockedActionBackendContract.resolvePayloadValidation(
      for: domain,
      input: domainPayloadValidationInput
    )
    let runtimeAttributes = nextEventRuntimeAttributes(domain: domain)
    await observabilityViewModel.trackRuntimeEvent(
      userID: activeUserID,
      name: "dashboard_domain_changed",
      attributes: [
        "role": activeRole.rawValue,
        "domain": domain.rawValue,
        "allowed_domain_count": String(activeRoleAllowedDomains.count),
        "backend_route": backendRoute,
        "contract": payloadValidation.contract,
        "payload_validation": payloadValidation.status.rawValue,
        "payload_missing_fields": payloadValidation.missingFields
      ]
      .merging(runtimeAttributes) { _, latest in latest }
    )
  }

  private func trackDeniedDomainAccess(
    domain: ExperienceDomain,
    trigger: String,
    correlationID: String? = nil
  ) async {
    let backendRoute = BlockedActionBackendContract.resolveRoute(for: domain)
    let payloadValidation = BlockedActionBackendContract.resolvePayloadValidation(
      for: domain,
      input: domainPayloadValidationInput
    )
    let runtimeAttributes = nextDeniedRuntimeAttributes(
      domain: domain,
      correlationID: correlationID
    )
    await observabilityViewModel.trackRuntimeEvent(
      userID: activeUserID,
      name: "dashboard_domain_access_denied",
      attributes: [
        "role": activeRole.rawValue,
        "domain": domain.rawValue,
        "trigger": trigger,
        "allowed_domain_count": String(activeRoleAllowedDomains.count),
        "backend_route": backendRoute,
        "contract": payloadValidation.contract,
        "payload_validation": payloadValidation.status.rawValue,
        "payload_missing_fields": payloadValidation.missingFields
      ]
      .merging(runtimeAttributes) { _, latest in latest }
    )
  }

  private func trackBlockedAction(
    domain: ExperienceDomain,
    action: String,
    reason: String,
    correlationID: String? = nil
  ) async {
    let backendRoute = BlockedActionBackendContract.resolveRoute(for: domain)
    let payloadValidation = BlockedActionBackendContract.resolvePayloadValidation(
      for: domain,
      input: domainPayloadValidationInput
    )
    let runtimeAttributes = nextEventRuntimeAttributes(
      domain: domain,
      correlationID: correlationID
    )
    await observabilityViewModel.trackRuntimeEvent(
      userID: activeUserID,
      name: "dashboard_action_blocked",
      attributes: [
        "role": activeRole.rawValue,
        "domain": domain.rawValue,
        "action": action,
        "reason": reason,
        "backend_route": backendRoute,
        "allowed_domain_count": String(activeRoleAllowedDomains.count),
        "contract": payloadValidation.contract,
        "payload_validation": payloadValidation.status.rawValue,
        "payload_missing_fields": payloadValidation.missingFields
      ]
      .merging(runtimeAttributes) { _, latest in latest }
    )
  }

  private func nextRuntimeCorrelationID(domain: ExperienceDomain, trigger: String) -> String {
    var session = runtimeObservabilitySession
    let correlationID = session.nextCorrelationID(domain: domain, trigger: trigger)
    runtimeObservabilitySession = session
    return correlationID
  }

  private func nextEventRuntimeAttributes(
    domain: ExperienceDomain,
    correlationID: String? = nil
  ) -> [String: String] {
    var session = runtimeObservabilitySession
    let attributes = session.nextEventAttributes(
      domain: domain,
      correlationID: correlationID
    )
    runtimeObservabilitySession = session
    return attributes
  }

  private func nextDeniedRuntimeAttributes(
    domain: ExperienceDomain,
    correlationID: String? = nil
  ) -> [String: String] {
    var session = runtimeObservabilitySession
    let attributes = session.nextDeniedEventAttributes(
      domain: domain,
      correlationID: correlationID
    )
    runtimeObservabilitySession = session
    return attributes
  }

  private var domainPayloadValidationInput: DomainPayloadValidationInput {
    DomainPayloadValidationInput(
      userID: activeUserID,
      goal: onboardingViewModel.selectedGoal.rawValue,
      onboardingDisplayName: onboardingViewModel.displayName,
      onboardingAge: onboardingViewModel.age,
      onboardingHeightCm: onboardingViewModel.heightCm,
      onboardingWeightKg: onboardingViewModel.weightKg,
      onboardingAvailableDaysPerWeek: onboardingViewModel.availableDaysPerWeek,
      onboardingParQResponsesCount: [parQQuestionOne, parQQuestionTwo].count,
      selectedPlanID: trainingViewModel.selectedPlanID,
      selectedExerciseID: trainingViewModel.selectedExerciseIDForVideos,
      nutritionDate: nutritionViewModel.date,
      calories: nutritionViewModel.calories,
      proteinGrams: nutritionViewModel.proteinGrams,
      carbsGrams: nutritionViewModel.carbsGrams,
      fatsGrams: nutritionViewModel.fatsGrams
    )
  }
}

@available(iOS 17, macOS 14, *)
private extension View {
  @ViewBuilder
  func fluxEmailFieldBehavior() -> some View {
#if os(iOS)
    self
      .textInputAutocapitalization(.never)
      .autocorrectionDisabled()
#else
    self
#endif
  }

  func cardSurface() -> some View {
    padding(16)
      .background(Color(red: 0.10, green: 0.11, blue: 0.14))
      .clipShape(.rect(cornerRadius: 12))
      .overlay(
        RoundedRectangle(cornerRadius: 12, style: .continuous)
          .stroke(Color(red: 0.22, green: 0.24, blue: 0.30), lineWidth: 1)
      )
  }
}
