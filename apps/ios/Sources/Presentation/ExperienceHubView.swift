import SwiftUI

public enum ExperienceHubDisplayMode: Sendable, Equatable {
  case catalog
  case product
}

@available(iOS 17, macOS 14, *)
public struct ExperienceHubView: View {
  private static let defaultOnboardingScreenContract = OnboardingScreenContract()
  private static let defaultNutritionProgressAIScreenContract = NutritionProgressAIScreenContract()
  private static let defaultSettingsLegalScreenContract = SettingsLegalScreenContract()

  @State private var authViewModel: AuthViewModel
  @State private var onboardingViewModel: OnboardingViewModel
  @State private var trainingViewModel: TrainingFlowViewModel
  @State private var nutritionViewModel: NutritionViewModel
  @State private var progressViewModel: ProgressViewModel
  @State private var settingsHomeViewModel: SettingsHomeViewModel
  @State private var accountProfileViewModel: AccountProfileViewModel
  @State private var notificationsViewModel: NotificationsViewModel
  @State private var privacyConsentViewModel: PrivacyConsentViewModel
  @State private var exportDataViewModel: ExportDataViewModel
  @State private var deleteAccountViewModel: DeleteAccountViewModel
  @State private var offlineSyncViewModel: OfflineSyncViewModel
  @State private var observabilityViewModel: ObservabilityViewModel
  @State private var recommendations: [AIRecommendation] = []
  @State private var recommendationsStatus: String =
    defaultNutritionProgressAIScreenContract.recommendationsStatus.rawValue
  @State private var legalStatus: String = defaultSettingsLegalScreenContract.legalStatus.rawValue
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


  private let userID: String
  private let generateAIRecommendationsUseCase: GenerateAIRecommendationsUseCase
  private let loadRoleCapabilitiesHandler: @Sendable (ExperienceRole) async -> Set<ExperienceDomain>?
  private let displayMode: ExperienceHubDisplayMode

  public init(
    authViewModel: AuthViewModel,
    onboardingViewModel: OnboardingViewModel,
    trainingViewModel: TrainingFlowViewModel,
    nutritionViewModel: NutritionViewModel,
    progressViewModel: ProgressViewModel,
    settingsHomeViewModel: SettingsHomeViewModel,
    accountProfileViewModel: AccountProfileViewModel,
    notificationsViewModel: NotificationsViewModel,
    privacyConsentViewModel: PrivacyConsentViewModel,
    exportDataViewModel: ExportDataViewModel,
    deleteAccountViewModel: DeleteAccountViewModel,
    offlineSyncViewModel: OfflineSyncViewModel,
    observabilityViewModel: ObservabilityViewModel,
    generateAIRecommendationsUseCase: GenerateAIRecommendationsUseCase =
      GenerateAIRecommendationsUseCase(),
    loadRoleCapabilitiesHandler: @escaping @Sendable (ExperienceRole) async -> Set<ExperienceDomain>? = { _ in nil },
    displayMode: ExperienceHubDisplayMode = .catalog,
    userID: String = "flux-user-local"
  ) {
    _authViewModel = State(initialValue: authViewModel)
    _onboardingViewModel = State(initialValue: onboardingViewModel)
    _trainingViewModel = State(initialValue: trainingViewModel)
    _nutritionViewModel = State(initialValue: nutritionViewModel)
    _progressViewModel = State(initialValue: progressViewModel)
    _settingsHomeViewModel = State(initialValue: settingsHomeViewModel)
    _accountProfileViewModel = State(initialValue: accountProfileViewModel)
    _notificationsViewModel = State(initialValue: notificationsViewModel)
    _privacyConsentViewModel = State(initialValue: privacyConsentViewModel)
    _exportDataViewModel = State(initialValue: exportDataViewModel)
    _deleteAccountViewModel = State(initialValue: deleteAccountViewModel)
    _offlineSyncViewModel = State(initialValue: offlineSyncViewModel)
    _observabilityViewModel = State(initialValue: observabilityViewModel)
    self.generateAIRecommendationsUseCase = generateAIRecommendationsUseCase
    self.loadRoleCapabilitiesHandler = loadRoleCapabilitiesHandler
    self.displayMode = displayMode
    self.userID = userID
  }

  @MainActor
  public static func makeDemo(userID: String = "flux-user-local") -> ExperienceHubView {
    ExperienceHubView(
      authViewModel: CompositionRoot.makeAuthViewModel(),
      onboardingViewModel: CompositionRoot.makeOnboardingViewModel(),
      trainingViewModel: CompositionRoot.makeTrainingFlowViewModel(),
      nutritionViewModel: CompositionRoot.makeNutritionViewModel(),
      progressViewModel: CompositionRoot.makeProgressViewModel(),
      settingsHomeViewModel: CompositionRoot.makeSettingsHomeViewModel(),
      accountProfileViewModel: CompositionRoot.makeAccountProfileViewModel(),
      notificationsViewModel: CompositionRoot.makeNotificationsViewModel(),
      privacyConsentViewModel: CompositionRoot.makePrivacyConsentViewModel(),
      exportDataViewModel: CompositionRoot.makeExportDataViewModel(),
      deleteAccountViewModel: CompositionRoot.makeDeleteAccountViewModel(),
      offlineSyncViewModel: CompositionRoot.makeOfflineSyncViewModel(),
      observabilityViewModel: CompositionRoot.makeObservabilityViewModel(),
      displayMode: .catalog,
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
    return fallbackUserID.isEmpty ? "flux-user-local" : fallbackUserID
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
      notificationsEnabled: settingsHomeViewModel.notificationsEnabled,
      watchSyncEnabled: settingsHomeViewModel.watchSyncEnabled,
      calendarSyncEnabled: settingsHomeViewModel.calendarSyncEnabled,
      privacyPolicyAccepted: privacyPolicyAccepted,
      termsAccepted: termsAccepted,
      medicalDisclaimerAccepted: medicalDisclaimerAccepted,
      settingsStatus: settingsHomeViewModel.screenStatus,
      legalStatus: SettingsLegalScreenStatus.fromRuntimeStatus(legalStatus)
    )
  }

  public var body: some View {
    Group {
      if displayMode == .product {
        FluxTrainingProductRootView(
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
          generateAIRecommendationsUseCase: generateAIRecommendationsUseCase,
          userID: userID
        )
      } else {
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
        .onChange(of: authViewModel.authStatus) { _, newValue in
          guard newValue.hasPrefix("signed_in:") else {
            return
          }
          Task {
            await loadRoleCapabilities(for: activeRole)
            await recoverActiveDomainState()
          }
        }
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
                trainingRoutesSection
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
      NavigationLink {
        AuthWelcomeView(
          viewModel: authViewModel,
          copy: copy,
          readinessScore: readinessSnapshot.score,
          goalLabel: copy.text(goalCopyKey(for: onboardingViewModel.selectedGoal))
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.heroTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.authStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(authViewModel.authStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(AuthRouteContract.welcomeDarkRouteID)

      NavigationLink {
        AuthWelcomeLightView(
          viewModel: authViewModel,
          copy: copy,
          readinessScore: readinessSnapshot.score,
          goalLabel: copy.text(goalCopyKey(for: onboardingViewModel.selectedGoal))
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.heroTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.authStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(authViewModel.authStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(AuthRouteContract.welcomeLightRouteID)

      NavigationLink {
        AuthEmailLoginView(
          viewModel: authViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.signInWithEmail))
            .font(.body.weight(.semibold))
          Text(copy.text(.authStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(authViewModel.authStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(AuthRouteContract.emailLoginDarkRouteID)

      NavigationLink {
        AuthEmailLoginLightView(
          viewModel: authViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.signInWithEmail)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.authStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(authViewModel.authStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(AuthRouteContract.emailLoginLightRouteID)

      NavigationLink {
        AuthAppleHandoffView(
          viewModel: authViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.signInWithApple)) Handoff")
            .font(.body.weight(.semibold))
          Text(copy.text(.authStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(authViewModel.authStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(AuthRouteContract.appleHandoffDarkRouteID)

      NavigationLink {
        AuthAppleHandoffLightView(
          viewModel: authViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.signInWithApple)) Handoff Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.authStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(authViewModel.authStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(AuthRouteContract.appleHandoffLightRouteID)

      NavigationLink {
        AuthOTPVerifyView(
          viewModel: authViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.verifyOTPTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.authStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(authViewModel.authStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(AuthRouteContract.otpVerifyDarkRouteID)

      NavigationLink {
        AuthOTPVerifyLightView(
          viewModel: authViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.verifyOTPTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.authStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(authViewModel.authStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(AuthRouteContract.otpVerifyLightRouteID)

      NavigationLink {
        AuthRecoverAccountView(
          viewModel: authViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.recoverAccountTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.authStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(authViewModel.authStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(AuthRouteContract.recoverAccountDarkRouteID)

      NavigationLink {
        AuthRecoverAccountLightView(
          viewModel: authViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.recoverAccountTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.authStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(authViewModel.authStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(AuthRouteContract.recoverAccountLightRouteID)

      NavigationLink {
        AuthSessionExpiredView(
          viewModel: authViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.sessionExpiredTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.authStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(authViewModel.authStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(AuthRouteContract.sessionExpiredDarkRouteID)

      NavigationLink {
        AuthSessionExpiredLightView(
          viewModel: authViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.sessionExpiredTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.authStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(authViewModel.authStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(AuthRouteContract.sessionExpiredLightRouteID)
    }
    .cardSurface()
  }

  private var onboardingSection: some View {
    return VStack(alignment: .leading, spacing: 12) {
      NavigationLink {
        OnboardingStepOneView(
          viewModel: onboardingViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.onboardingTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.onboardingStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(onboardingViewModel.onboardingStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(OnboardingRouteContract.stepOneDarkRouteID)

      NavigationLink {
        OnboardingStepOneLightView(
          viewModel: onboardingViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.onboardingTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.onboardingStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(onboardingViewModel.onboardingStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(OnboardingRouteContract.stepOneLightRouteID)

      NavigationLink {
        OnboardingGoalSetupView(
          viewModel: onboardingViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.goalLabel))
            .font(.body.weight(.semibold))
          Text(copy.text(.onboardingStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(onboardingViewModel.onboardingStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(OnboardingRouteContract.goalSetupDarkRouteID)

      NavigationLink {
        OnboardingGoalSetupLightView(
          viewModel: onboardingViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.goalLabel)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.onboardingStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(onboardingViewModel.onboardingStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(OnboardingRouteContract.goalSetupLightRouteID)

      NavigationLink {
        OnboardingParQView(
          viewModel: onboardingViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.parQTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.onboardingStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(onboardingViewModel.onboardingStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(OnboardingRouteContract.parQDarkRouteID)

      NavigationLink {
        OnboardingParQLightView(
          viewModel: onboardingViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.parQTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.onboardingStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(onboardingViewModel.onboardingStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(OnboardingRouteContract.parQLightRouteID)

      NavigationLink {
        OnboardingConsentView(
          viewModel: onboardingViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.legalSectionTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.onboardingStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(onboardingViewModel.onboardingStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(OnboardingRouteContract.consentDarkRouteID)

      NavigationLink {
        OnboardingConsentLightView(
          viewModel: onboardingViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.legalSectionTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.onboardingStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(onboardingViewModel.onboardingStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(OnboardingRouteContract.consentLightRouteID)
    }
    .cardSurface()
  }

  private var trainingRoutesSection: some View {
    VStack(alignment: .leading, spacing: 12) {
      NavigationLink {
        TrainingTodayView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.trainingCockpitTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.status))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.todayDarkRouteID)

      NavigationLink {
        TrainingTodayLightView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.trainingCockpitTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.status))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.todayLightRouteID)

      NavigationLink {
        PlanActiveView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.planName))
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.status))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.planActiveDarkRouteID)

      NavigationLink {
        PlanActiveLightView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.planName)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.status))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.planActiveLightRouteID)

      NavigationLink {
        InWorkoutSetupView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.inWorkoutSetupTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.setupStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.status))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.inWorkoutSetupDarkRouteID)

      NavigationLink {
        InWorkoutSetupLightView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.inWorkoutSetupTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.setupStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.status))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.inWorkoutSetupLightRouteID)

      NavigationLink {
        WorkoutActiveView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.sessionStatusLabel))
            .font(.body.weight(.semibold))
          Text(copy.text(.substitutionStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.substitutionStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.workoutActiveDarkRouteID)

      NavigationLink {
        WorkoutActiveLightView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.sessionStatusLabel)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.substitutionStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.substitutionStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.workoutActiveLightRouteID)

      NavigationLink {
        RPERatingView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.rpeRatingTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.setupStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.sessionStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.rpeRatingDarkRouteID)

      NavigationLink {
        RPERatingLightView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.rpeRatingTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.setupStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.sessionStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.rpeRatingLightRouteID)

      NavigationLink {
        ExerciseSubstitutionView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.substitutionTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.substitutionStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.substitutionStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.substitutionDarkRouteID)

      NavigationLink {
        ExerciseSubstitutionLightView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.substitutionTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.substitutionStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.substitutionStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.substitutionLightRouteID)

      NavigationLink {
        ExerciseLibraryView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.exerciseLibraryTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.exerciseLibraryStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.exerciseLibraryStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.exerciseLibraryDarkRouteID)

      NavigationLink {
        ExerciseLibraryLightView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.exerciseLibraryTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.exerciseLibraryStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.exerciseLibraryStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.exerciseLibraryLightRouteID)

      NavigationLink {
        VideoPlayerView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.videoPlayerTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.videoPlayerStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.videoPlayerStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.videoPlayerDarkRouteID)

      NavigationLink {
        VideoPlayerLightView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.videoPlayerTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.videoPlayerStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.videoPlayerStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.videoPlayerLightRouteID)

      NavigationLink {
        SessionSummaryView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.sessionStatusLabel))
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.sessionStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.sessionSummaryDarkRouteID)

      NavigationLink {
        SessionSummaryLightView(
          viewModel: trainingViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.sessionStatusLabel)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(trainingViewModel.sessionStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(TrainingRouteContract.sessionSummaryLightRouteID)
    }
    .cardSurface()
  }

  private var nutritionSection: some View {
    VStack(alignment: .leading, spacing: 12) {
      NavigationLink {
        NutritionHubView(
          viewModel: nutritionViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.nutritionTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.nutritionStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(nutritionProgressAIScreenContract.nutritionStatus.rawValue))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(NutritionRouteContract.nutritionHubDarkRouteID)

      NavigationLink {
        NutritionHubLightView(
          viewModel: nutritionViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.nutritionTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.nutritionStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(nutritionProgressAIScreenContract.nutritionStatus.rawValue))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(NutritionRouteContract.nutritionHubLightRouteID)

      NavigationLink {
        ProgressMetricsView(
          viewModel: progressViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.progressTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(nutritionProgressAIScreenContract.progressStatus.rawValue))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(ProgressRouteContract.metricsDarkRouteID)

      NavigationLink {
        ProgressMetricsLightView(
          viewModel: progressViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.progressTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(nutritionProgressAIScreenContract.progressStatus.rawValue))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(ProgressRouteContract.metricsLightRouteID)

      NavigationLink {
        GoalAdjustView(
          viewModel: onboardingViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.goalLabel))
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(onboardingViewModel.onboardingStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(ProgressRouteContract.goalAdjustDarkRouteID)

      NavigationLink {
        GoalAdjustLightView(
          viewModel: onboardingViewModel,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.goalLabel)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(onboardingViewModel.onboardingStatus))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(ProgressRouteContract.goalAdjustLightRouteID)

      NavigationLink {
        AICoachView(
          recommendations: $recommendations,
          status: $recommendationsStatus,
          copy: copy
        ) {
          await loadRecommendations()
        }
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.recommendationsTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(nutritionProgressAIScreenContract.recommendationsStatus.rawValue))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(ProgressRouteContract.aiCoachDarkRouteID)

      NavigationLink {
        AICoachLightView(
          recommendations: $recommendations,
          status: $recommendationsStatus,
          copy: copy
        ) {
          await loadRecommendations()
        }
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.recommendationsTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(nutritionProgressAIScreenContract.recommendationsStatus.rawValue))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(ProgressRouteContract.aiCoachLightRouteID)

      NavigationLink {
        WeeklyReviewView(
          progressViewModel: progressViewModel,
          trainingViewModel: trainingViewModel,
          nutritionViewModel: nutritionViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.progressNavigationTitle))
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(nutritionProgressAIScreenContract.progressStatus.rawValue))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(ProgressRouteContract.weeklyReviewDarkRouteID)

      NavigationLink {
        WeeklyReviewLightView(
          progressViewModel: progressViewModel,
          trainingViewModel: trainingViewModel,
          nutritionViewModel: nutritionViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.progressNavigationTitle)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.statusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(nutritionProgressAIScreenContract.progressStatus.rawValue))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(ProgressRouteContract.weeklyReviewLightRouteID)

      NavigationLink {
        NutritionLogMealView(
          viewModel: nutritionViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text(copy.text(.saveLog))
            .font(.body.weight(.semibold))
          Text(copy.text(.nutritionStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(nutritionProgressAIScreenContract.nutritionStatus.rawValue))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(NutritionRouteContract.logMealDarkRouteID)

      NavigationLink {
        NutritionLogMealLightView(
          viewModel: nutritionViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        VStack(alignment: .leading, spacing: 4) {
          Text("\(copy.text(.saveLog)) Light")
            .font(.body.weight(.semibold))
          Text(copy.text(.nutritionStatusLabel))
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(copy.humanStatus(nutritionProgressAIScreenContract.nutritionStatus.rawValue))
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(NutritionRouteContract.logMealLightRouteID)
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
    VStack(alignment: .leading, spacing: 10) {
      NavigationLink {
        SettingsHomeView(
          viewModel: settingsHomeViewModel,
          accountProfileViewModel: accountProfileViewModel,
          notificationsViewModel: notificationsViewModel,
          privacyConsentViewModel: privacyConsentViewModel,
          exportDataViewModel: exportDataViewModel,
          deleteAccountViewModel: deleteAccountViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        settingsRouteLabel(
          title: copy.text(.settingsTitle),
          subtitle: copy.text(.settingsStatusLabel),
          status: settingsHomeViewModel.status
        )
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(SettingsRouteContract.darkHomeRouteID)

      NavigationLink {
        SettingsHomeLightView(
          viewModel: settingsHomeViewModel,
          accountProfileViewModel: accountProfileViewModel,
          notificationsViewModel: notificationsViewModel,
          privacyConsentViewModel: privacyConsentViewModel,
          exportDataViewModel: exportDataViewModel,
          deleteAccountViewModel: deleteAccountViewModel,
          userID: activeUserID,
          copy: copy
        )
      } label: {
        settingsRouteLabel(
          title: "\(copy.text(.settingsTitle)) Light",
          subtitle: copy.text(.settingsStatusLabel),
          status: settingsHomeViewModel.status
        )
      }
      .buttonStyle(.plain)
      .accessibilityIdentifier(SettingsRouteContract.lightHomeRouteID)
    }
  }

  private func settingsRouteLabel(title: String, subtitle: String, status: String) -> some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(title)
        .font(.title3.bold())
      Text(subtitle)
        .font(.footnote)
        .foregroundStyle(.secondary)
      Text(copy.humanStatus(status))
        .font(.headline)
        .foregroundStyle(.orange)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
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
    let loadedDomains = await loadRoleCapabilitiesHandler(role)
    if let loadedDomains, loadedDomains.isEmpty == false {
      activeRoleAllowedDomains = loadedDomains
      reconcileRuntimeStateForRole()
      return
    }
    activeRoleAllowedDomains = fallbackDomains
    reconcileRuntimeStateForRole()
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
      onboardingParQResponsesCount: onboardingViewModel.parQResponses.count,
      selectedPlanID: trainingViewModel.selectedPlanID,
      selectedExerciseID: trainingViewModel.selectedExerciseIDForVideos,
      nutritionDate: nutritionViewModel.date,
      calories: nutritionViewModel.calories,
      proteinGrams: nutritionViewModel.proteinGrams,
      carbsGrams: nutritionViewModel.carbsGrams,
      fatsGrams: nutritionViewModel.fatsGrams
    )
  }

  private func goalCopyKey(for goal: TrainingGoal) -> CopyKey {
    switch goal {
    case .fatLoss:
      return .goalFatLoss
    case .recomposition:
      return .goalRecomposition
    case .muscleGain:
      return .goalMuscleGain
    case .habit:
      return .goalHabit
    }
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
