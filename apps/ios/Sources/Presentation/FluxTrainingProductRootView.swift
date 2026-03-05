import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct FluxTrainingProductRootView: View {
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
  @State private var recommendations: [AIRecommendation] = []
  @State private var recommendationsStatus: String = NutritionProgressAIScreenStatus.idle.rawValue
  @State private var language: SupportedLanguage = .es
  @State private var onboardingStep: OnboardingStep = .profile
  @State private var selectedTab: ProductTab = .today
  @State private var authScreen: AuthScreen = .welcome
  @State private var isOnboardingCompleted = false
  @State private var selectedTrainingStage: TrainingStage = .today
  @State private var selectedProgressStage: ProgressStage = .metrics
  @State private var selectedNutritionStage: NutritionStage = .hub
  @State private var selectedSettingsStage: SettingsStage = .home

  private let userID: String
  private let generateAIRecommendationsUseCase: GenerateAIRecommendationsUseCase
  private let showStageControls: Bool

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
    generateAIRecommendationsUseCase: GenerateAIRecommendationsUseCase = GenerateAIRecommendationsUseCase(),
    showStageControls: Bool = false,
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
    self.generateAIRecommendationsUseCase = generateAIRecommendationsUseCase
    self.showStageControls = showStageControls
    self.userID = userID
  }

  private var copy: LocalizedCopy {
    LocalizedCopy(language: language)
  }

  private var backgroundGradient: LinearGradient {
    LinearGradient(
      colors: [Color(red: 0.03, green: 0.04, blue: 0.08), Color(red: 0.02, green: 0.05, blue: 0.12)],
      startPoint: .topLeading,
      endPoint: .bottomTrailing
    )
  }

  private var activeUserID: String {
    let candidate = authViewModel.currentUserID?.trimmingCharacters(in: .whitespacesAndNewlines)
    if let candidate, candidate.isEmpty == false {
      return candidate
    }
    let fallback = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    return fallback.isEmpty ? "flux-user-local" : fallback
  }

  private var isAuthenticated: Bool {
    authViewModel.authStatus.hasPrefix("signed_in:")
  }

  public var body: some View {
    Group {
      if isAuthenticated == false {
        authFlow
      } else if isOnboardingCompleted == false {
        onboardingFlow
      } else {
        mainProductFlow
      }
    }
    .animation(.easeInOut, value: isAuthenticated)
    .animation(.easeInOut, value: isOnboardingCompleted)
    .onChange(of: authViewModel.authStatus) { _, newValue in
      if newValue.hasPrefix("signed_in:") {
        authScreen = .welcome
        onboardingStep = .profile
        Task {
          await syncOnboardingStateWithPersistedProfile()
        }
      } else if newValue == "session_expired" {
        authScreen = .sessionExpired
      } else if newValue == "recovery_sent_sms" {
        authScreen = .otp
      } else if newValue == "recovery_sent_email" {
        authScreen = .recover
      } else if newValue == "signed_out" {
        authScreen = .welcome
        isOnboardingCompleted = false
      }
    }
  }

  private var authFlow: some View {
    NavigationStack {
      VStack(spacing: 16) {
        languageSelector
          .padding(.horizontal, 16)

        switch authScreen {
        case .welcome:
          AuthWelcomeView(
            viewModel: authViewModel,
            copy: copy,
            readinessScore: 72,
            goalLabel: selectedGoalLabel,
            onUseEmailLogin: { authScreen = .emailLogin }
          )
        case .emailLogin:
          AuthEmailLoginView(
            viewModel: authViewModel,
            copy: copy,
            onUseAppleHandoff: { authScreen = .appleHandoff },
            onRecoverAccount: { authScreen = .recover }
          )
        case .appleHandoff:
          AuthAppleHandoffView(
            viewModel: authViewModel,
            copy: copy,
            onUseEmailInstead: { authScreen = .emailLogin }
          )
        case .otp:
          AuthOTPVerifyView(viewModel: authViewModel, copy: copy)
        case .recover:
          AuthRecoverAccountView(viewModel: authViewModel, copy: copy)
        case .sessionExpired:
          AuthSessionExpiredView(viewModel: authViewModel, copy: copy)
        }

        if authScreen != .welcome {
          Button(copy.text(.backToSignInAction)) {
            authScreen = .welcome
          }
          .buttonStyle(FluxSecondaryButtonStyle())
          .padding(.horizontal, 16)
        }
      }
      .background(
        LinearGradient(
          colors: [Color(red: 0.03, green: 0.04, blue: 0.08), Color(red: 0.02, green: 0.05, blue: 0.12)],
          startPoint: .topLeading,
          endPoint: .bottomTrailing
        )
      )
    }
  }

  private var onboardingFlow: some View {
    NavigationStack {
      VStack(spacing: 12) {
        languageSelector
          .padding(.horizontal, 16)
          .padding(.top, 8)

        HStack(spacing: 8) {
          ForEach(OnboardingStep.allCases, id: \.rawValue) { step in
            Text(step.title(copy: copy))
              .font(.caption.weight(.semibold))
              .foregroundStyle(step == onboardingStep ? Color.black : Color.secondary)
              .padding(.horizontal, 10)
              .padding(.vertical, 8)
              .background(step == onboardingStep ? Color.orange : Color.gray.opacity(0.2))
              .clipShape(.rect(cornerRadius: 10))
          }
        }
        .padding(.horizontal, 16)

        switch onboardingStep {
        case .profile:
          OnboardingStepOneView(viewModel: onboardingViewModel, copy: copy)
        case .goal:
          OnboardingGoalSetupView(viewModel: onboardingViewModel, copy: copy)
        case .parq:
          OnboardingParQView(viewModel: onboardingViewModel, copy: copy)
        case .consent:
          OnboardingConsentView(viewModel: onboardingViewModel, copy: copy)
        }
      }
      .safeAreaInset(edge: .bottom) {
        HStack(spacing: 12) {
          Button(copy.text(.backToSignInAction)) {
            moveOnboardingBack()
          }
          .buttonStyle(.bordered)
          .disabled(onboardingStep == .profile)

          Button(onboardingStep == .consent ? copy.text(.acceptAndContinue) : copy.text(.continueAction)) {
            Task {
              await moveOnboardingForward()
            }
          }
          .buttonStyle(.borderedProminent)
          .tint(.orange)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(.ultraThinMaterial)
      }
      .background(
        LinearGradient(
          colors: [Color(red: 0.03, green: 0.04, blue: 0.08), Color(red: 0.02, green: 0.05, blue: 0.12)],
          startPoint: .topLeading,
          endPoint: .bottomTrailing
        )
      )
    }
  }

  private var mainProductFlow: some View {
    TabView(selection: $selectedTab) {
      todayTab
        .tabItem {
          Label(copy.text(.todayTab), systemImage: "figure.strengthtraining.traditional")
        }
        .tag(ProductTab.today)

      progressTab
        .tabItem {
          Label(copy.text(.progressTab), systemImage: "chart.line.uptrend.xyaxis")
        }
        .tag(ProductTab.progress)

      nutritionTab
        .tabItem {
          Label(copy.text(.nutritionTitle), systemImage: "fork.knife")
        }
        .tag(ProductTab.nutrition)

      settingsTab
        .tabItem {
          Label(copy.text(.settingsTitle), systemImage: "gearshape")
        }
        .tag(ProductTab.settings)
    }
    .tint(.orange)
  }

  private var todayTab: some View {
    NavigationStack {
      Group {
        if showStageControls {
          VStack(spacing: 8) {
            trainingStageSelector
            selectedTrainingStageView
          }
        } else {
          VStack(spacing: 8) {
            if selectedTrainingStage != .today {
              Button(copy.text(.todayTab)) {
                selectedTrainingStage = .today
              }
              .buttonStyle(FluxSecondaryButtonStyle())
              .padding(.horizontal, 16)
              .padding(.top, 8)
              .accessibilityIdentifier("training.stage.backToToday")
            }
            selectedTrainingStageView
          }
        }
      }
      .background(backgroundGradient)
      .toolbar {
        ToolbarItem(placement: .primaryAction) {
          languageSelector
        }
      }
    }
  }

  private var progressTab: some View {
    NavigationStack {
      Group {
        if showStageControls {
          VStack(spacing: 8) {
            progressStageSelector
            selectedProgressStageView
          }
        } else {
          VStack(spacing: 8) {
            if selectedProgressStage != .metrics {
              Button(copy.text(.progressStageOverview)) {
                selectedProgressStage = .metrics
              }
              .buttonStyle(FluxSecondaryButtonStyle())
              .padding(.horizontal, 16)
              .padding(.top, 8)
              .accessibilityIdentifier("progress.stage.backToOverview")
            }
            selectedProgressStageView
          }
        }
      }
      .background(backgroundGradient)
      .navigationTitle(copy.text(.progressTab))
    }
  }

  private var nutritionTab: some View {
    NavigationStack {
      Group {
        if showStageControls {
          VStack(spacing: 8) {
            nutritionStageSelector
            selectedNutritionStageView
          }
        } else {
          VStack(spacing: 8) {
            if selectedNutritionStage != .hub {
              Button(copy.text(.nutritionStageOverview)) {
                selectedNutritionStage = .hub
              }
              .buttonStyle(FluxSecondaryButtonStyle())
              .padding(.horizontal, 16)
              .padding(.top, 8)
              .accessibilityIdentifier("nutrition.stage.backToHub")
            }
            selectedNutritionStageView
          }
        }
      }
      .background(backgroundGradient)
      .navigationTitle(copy.text(.nutritionTitle))
    }
  }

  private var settingsTab: some View {
    NavigationStack {
      Group {
        if showStageControls {
          VStack(spacing: 8) {
            settingsStageSelector
            selectedSettingsStageView
          }
        } else {
          selectedSettingsStageView
        }
      }
      .background(backgroundGradient)
      .navigationTitle(copy.text(.settingsTitle))
      .toolbar {
        ToolbarItem(placement: .primaryAction) {
          Button(copy.text(.signOutAction)) {
            signOut()
          }
        }
      }
    }
  }

  private var languageSelector: some View {
    Picker(copy.text(.languageLabel), selection: $language) {
      Text(copy.text(.languageOptionSpanish)).tag(SupportedLanguage.es)
      Text(copy.text(.languageOptionEnglish)).tag(SupportedLanguage.en)
    }
    .pickerStyle(.segmented)
    .frame(maxWidth: 180)
    .accessibilityIdentifier("app.language.picker")
  }

  private var trainingStageSelector: some View {
    ScrollView(.horizontal, showsIndicators: false) {
      HStack(spacing: 8) {
        ForEach(TrainingStage.allCases, id: \.self) { stage in
          Button(stage.title(copy: copy)) {
            selectedTrainingStage = stage
          }
          .font(.caption.weight(.semibold))
          .foregroundStyle(stage == selectedTrainingStage ? Color.black : Color.white.opacity(0.85))
          .padding(.horizontal, 12)
          .padding(.vertical, 8)
          .background(stage == selectedTrainingStage ? Color.orange : Color.white.opacity(0.10))
          .clipShape(.rect(cornerRadius: 10))
          .accessibilityIdentifier("training.stage.\(stage.rawValue)")
        }
      }
      .padding(.horizontal, 16)
      .padding(.top, 8)
    }
  }

  private var progressStageSelector: some View {
    ScrollView(.horizontal, showsIndicators: false) {
      HStack(spacing: 8) {
        ForEach(ProgressStage.allCases, id: \.self) { stage in
          Button(stage.title(copy: copy)) {
            selectedProgressStage = stage
          }
          .font(.caption.weight(.semibold))
          .foregroundStyle(stage == selectedProgressStage ? Color.black : Color.white.opacity(0.85))
          .padding(.horizontal, 12)
          .padding(.vertical, 8)
          .background(stage == selectedProgressStage ? Color.orange : Color.white.opacity(0.10))
          .clipShape(.rect(cornerRadius: 10))
          .accessibilityIdentifier("progress.stage.\(stage.rawValue)")
        }
      }
      .padding(.horizontal, 16)
      .padding(.top, 8)
    }
  }

  private var nutritionStageSelector: some View {
    ScrollView(.horizontal, showsIndicators: false) {
      HStack(spacing: 8) {
        ForEach(NutritionStage.allCases, id: \.self) { stage in
          Button(stage.title(copy: copy)) {
            selectedNutritionStage = stage
          }
          .font(.caption.weight(.semibold))
          .foregroundStyle(stage == selectedNutritionStage ? Color.black : Color.white.opacity(0.85))
          .padding(.horizontal, 12)
          .padding(.vertical, 8)
          .background(stage == selectedNutritionStage ? Color.orange : Color.white.opacity(0.10))
          .clipShape(.rect(cornerRadius: 10))
          .accessibilityIdentifier("nutrition.stage.\(stage.rawValue)")
        }
      }
      .padding(.horizontal, 16)
      .padding(.top, 8)
    }
  }

  private var settingsStageSelector: some View {
    ScrollView(.horizontal, showsIndicators: false) {
      HStack(spacing: 8) {
        ForEach(SettingsStage.allCases, id: \.self) { stage in
          Button(stage.title(copy: copy)) {
            selectedSettingsStage = stage
          }
          .font(.caption.weight(.semibold))
          .foregroundStyle(stage == selectedSettingsStage ? Color.black : Color.white.opacity(0.85))
          .padding(.horizontal, 12)
          .padding(.vertical, 8)
          .background(stage == selectedSettingsStage ? Color.orange : Color.white.opacity(0.10))
          .clipShape(.rect(cornerRadius: 10))
          .accessibilityIdentifier("settings.stage.\(stage.rawValue)")
        }
      }
      .padding(.horizontal, 16)
      .padding(.top, 8)
    }
  }

  private var selectedGoalLabel: String {
    switch onboardingViewModel.selectedGoal {
    case .fatLoss:
      copy.text(.goalFatLoss)
    case .recomposition:
      copy.text(.goalRecomposition)
    case .muscleGain:
      copy.text(.goalMuscleGain)
    case .habit:
      copy.text(.goalHabit)
    }
  }

  private func moveOnboardingBack() {
    switch onboardingStep {
    case .profile:
      break
    case .goal:
      onboardingStep = .profile
    case .parq:
      onboardingStep = .goal
    case .consent:
      onboardingStep = .parq
    }
  }

  private func moveOnboardingForward() async {
    switch onboardingStep {
    case .profile:
      onboardingViewModel.saveStepOne()
      if onboardingViewModel.onboardingStatus == "saved" {
        onboardingStep = .goal
      }
    case .goal:
      onboardingViewModel.saveGoalSetup()
      if onboardingViewModel.onboardingStatus == "success" {
        onboardingStep = .parq
      }
    case .parq:
      onboardingViewModel.saveParQ()
      if onboardingViewModel.onboardingStatus == "success" {
        onboardingStep = .consent
      }
    case .consent:
      onboardingViewModel.saveConsentStep()
      guard onboardingViewModel.onboardingStatus == "success" else {
        return
      }
      let consent = OnboardingConsentChecklist(
        privacyPolicyAccepted: onboardingViewModel.onboardingPrivacyPolicyAccepted,
        termsAccepted: onboardingViewModel.onboardingTermsAccepted,
        medicalDisclaimerAccepted: onboardingViewModel.onboardingMedicalDisclaimerAccepted
      )
      await onboardingViewModel.complete(userID: activeUserID, consent: consent)
      if onboardingViewModel.onboardingStatus == "saved" {
        isOnboardingCompleted = true
      }
    }
  }

  private func loadRecommendations() async {
    recommendationsStatus = NutritionProgressAIScreenStatus.loading.rawValue
    let latestWorkoutDate = trainingViewModel.latestSessionEndedAt
    let daysSinceWorkout: Int
    if let latestWorkoutDate {
      daysSinceWorkout = max(Calendar.current.dateComponents([.day], from: latestWorkoutDate, to: Date()).day ?? 0, 0)
    } else {
      daysSinceWorkout = 7
    }

    let completionRate: Double
    if trainingViewModel.plans.isEmpty {
      completionRate = trainingViewModel.sessions.isEmpty ? 0 : 1
    } else {
      completionRate = min(Double(trainingViewModel.sessions.count) / Double(trainingViewModel.plans.count), 1)
    }

    recommendations = await generateAIRecommendationsUseCase.execute(
      userID: activeUserID,
      goal: onboardingViewModel.selectedGoal,
      pendingQueueCount: 0,
      daysSinceLastWorkout: daysSinceWorkout,
      recentCompletionRate: completionRate,
      locale: language.rawValue
    )
    recommendationsStatus = recommendations.isEmpty
      ? NutritionProgressAIScreenStatus.empty.rawValue
      : NutritionProgressAIScreenStatus.loaded.rawValue
  }

  private func signOut() {
    authViewModel.signOut()
    isOnboardingCompleted = false
    onboardingStep = .profile
    selectedTab = .today
    authScreen = .welcome
    selectedTrainingStage = .today
    selectedProgressStage = .metrics
    selectedNutritionStage = .hub
    selectedSettingsStage = .home
  }

  private func syncOnboardingStateWithPersistedProfile() async {
    await accountProfileViewModel.refresh(userID: activeUserID)
    let onboardingCompleted = OnboardingCompletionStateResolver.isOnboardingCompleted(
      profileLoadStatus: accountProfileViewModel.status
    )
    isOnboardingCompleted = onboardingCompleted
    guard onboardingCompleted else {
      onboardingStep = .profile
      return
    }
    onboardingViewModel.displayName = accountProfileViewModel.displayName
    onboardingViewModel.age = accountProfileViewModel.age
    onboardingViewModel.heightCm = accountProfileViewModel.heightCm
    onboardingViewModel.weightKg = accountProfileViewModel.weightKg
    onboardingViewModel.selectedGoal = accountProfileViewModel.goal
  }

  @ViewBuilder
  private var selectedTrainingStageView: some View {
    switch selectedTrainingStage {
    case .today:
      TrainingTodayView(
        viewModel: trainingViewModel,
        userID: activeUserID,
        copy: copy,
        onOpenPlanActive: { selectedTrainingStage = .planActive },
        onOpenSessionSetup: { selectedTrainingStage = .sessionSetup },
        onOpenSessionSummary: { selectedTrainingStage = .summary }
      )
    case .planActive:
      PlanActiveView(viewModel: trainingViewModel, userID: activeUserID, copy: copy)
    case .sessionSetup:
      InWorkoutSetupView(viewModel: trainingViewModel, userID: activeUserID, copy: copy)
    case .workoutActive:
      WorkoutActiveView(viewModel: trainingViewModel, userID: activeUserID, copy: copy)
    case .rpe:
      RPERatingView(viewModel: trainingViewModel, userID: activeUserID, copy: copy)
    case .substitution:
      ExerciseSubstitutionView(viewModel: trainingViewModel, userID: activeUserID, copy: copy)
    case .library:
      ExerciseLibraryView(viewModel: trainingViewModel, userID: activeUserID, copy: copy)
    case .video:
      VideoPlayerView(viewModel: trainingViewModel, userID: activeUserID, copy: copy)
    case .summary:
      SessionSummaryView(viewModel: trainingViewModel, userID: activeUserID, copy: copy)
    }
  }

  @ViewBuilder
  private var selectedProgressStageView: some View {
    switch selectedProgressStage {
    case .metrics:
      ProgressMetricsView(
        viewModel: progressViewModel,
        userID: activeUserID,
        copy: copy,
        onOpenWeeklyReview: { selectedProgressStage = .weeklyReview },
        onOpenGoalAdjust: { selectedProgressStage = .goalAdjust },
        onOpenAICoach: { selectedProgressStage = .aiCoach }
      )
        .productCardSurface()
        .padding(16)
    case .weeklyReview:
      WeeklyReviewView(
        progressViewModel: progressViewModel,
        trainingViewModel: trainingViewModel,
        nutritionViewModel: nutritionViewModel,
        userID: activeUserID,
        copy: copy
      )
      .productCardSurface()
      .padding(16)
    case .goalAdjust:
      GoalAdjustView(viewModel: onboardingViewModel, copy: copy)
        .productCardSurface()
        .padding(16)
    case .aiCoach:
      AICoachView(
        recommendations: $recommendations,
        status: $recommendationsStatus,
        copy: copy
      ) {
        await loadRecommendations()
      }
      .productCardSurface()
      .padding(16)
    }
  }

  @ViewBuilder
  private var selectedNutritionStageView: some View {
    switch selectedNutritionStage {
    case .hub:
      NutritionHubView(
        viewModel: nutritionViewModel,
        userID: activeUserID,
        copy: copy,
        onOpenLogMeal: { selectedNutritionStage = .logMeal }
      )
        .productCardSurface()
        .padding(16)
    case .logMeal:
      NutritionLogMealView(viewModel: nutritionViewModel, userID: activeUserID, copy: copy)
        .productCardSurface()
        .padding(16)
    }
  }

  @ViewBuilder
  private var selectedSettingsStageView: some View {
    switch selectedSettingsStage {
    case .home:
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
      .productCardSurface()
      .padding(16)
    case .accountProfile:
      AccountProfileView(
        viewModel: accountProfileViewModel,
        userID: activeUserID,
        copy: copy
      )
      .productCardSurface()
      .padding(16)
    case .notifications:
      NotificationsView(
        viewModel: notificationsViewModel,
        userID: activeUserID,
        copy: copy
      )
      .productCardSurface()
      .padding(16)
    case .legal:
      PrivacyConsentView(
        viewModel: privacyConsentViewModel,
        userID: activeUserID,
        copy: copy
      )
      .productCardSurface()
      .padding(16)
    case .exportData:
      ExportDataView(
        viewModel: exportDataViewModel,
        userID: activeUserID,
        copy: copy
      )
      .productCardSurface()
      .padding(16)
    case .deleteAccount:
      DeleteAccountView(
        viewModel: deleteAccountViewModel,
        userID: activeUserID,
        copy: copy
      )
      .productCardSurface()
      .padding(16)
    }
  }
}

@available(iOS 17, macOS 14, *)
private enum ProductTab {
  case today
  case progress
  case nutrition
  case settings
}

@available(iOS 17, macOS 14, *)
private enum AuthScreen {
  case welcome
  case emailLogin
  case appleHandoff
  case otp
  case recover
  case sessionExpired
}

@available(iOS 17, macOS 14, *)
private enum TrainingStage: String, CaseIterable {
  case today
  case planActive
  case sessionSetup
  case workoutActive
  case rpe
  case substitution
  case library
  case video
  case summary

  func title(copy: LocalizedCopy) -> String {
    switch self {
    case .today:
      return copy.text(.trainingStageToday)
    case .planActive:
      return copy.text(.trainingStagePlan)
    case .sessionSetup:
      return copy.text(.trainingStageSetup)
    case .workoutActive:
      return copy.text(.trainingStageWorkout)
    case .rpe:
      return copy.text(.trainingStageRPE)
    case .substitution:
      return copy.text(.trainingStageSubstitution)
    case .library:
      return copy.text(.trainingStageLibrary)
    case .video:
      return copy.text(.trainingStageVideo)
    case .summary:
      return copy.text(.trainingStageSummary)
    }
  }
}

@available(iOS 17, macOS 14, *)
private enum ProgressStage: String, CaseIterable {
  case metrics
  case weeklyReview
  case goalAdjust
  case aiCoach

  func title(copy: LocalizedCopy) -> String {
    switch self {
    case .metrics:
      return copy.text(.progressStageOverview)
    case .weeklyReview:
      return copy.text(.progressStageWeeklyReview)
    case .goalAdjust:
      return copy.text(.progressStageGoal)
    case .aiCoach:
      return copy.text(.progressStageCoach)
    }
  }
}

@available(iOS 17, macOS 14, *)
private enum NutritionStage: String, CaseIterable {
  case hub
  case logMeal

  func title(copy: LocalizedCopy) -> String {
    switch self {
    case .hub:
      return copy.text(.nutritionStageOverview)
    case .logMeal:
      return copy.text(.nutritionStageLog)
    }
  }
}

@available(iOS 17, macOS 14, *)
private enum SettingsStage: String, CaseIterable {
  case home
  case accountProfile
  case notifications
  case legal
  case exportData
  case deleteAccount

  func title(copy: LocalizedCopy) -> String {
    switch self {
    case .home:
      return copy.text(.settingsTitle)
    case .accountProfile:
      return copy.text(.accountProfileTitle)
    case .notifications:
      return copy.text(.notificationsTitle)
    case .legal:
      return copy.text(.legalSectionTitle)
    case .exportData:
      return copy.text(.exportDataTitle)
    case .deleteAccount:
      return copy.text(.deleteAccountTitle)
    }
  }
}

@available(iOS 17, macOS 14, *)
private enum OnboardingStep: Int, CaseIterable {
  case profile
  case goal
  case parq
  case consent

  func title(copy: LocalizedCopy) -> String {
    switch self {
    case .profile:
      copy.text(.displayName)
    case .goal:
      copy.text(.goalLabel)
    case .parq:
      copy.text(.parQTitle)
    case .consent:
      copy.text(.legalSectionTitle)
    }
  }
}

@available(iOS 17, macOS 14, *)
private extension View {
  func productCardSurface() -> some View {
    padding(16)
      .background(Color(red: 0.10, green: 0.11, blue: 0.14))
      .clipShape(.rect(cornerRadius: 16))
      .overlay(
        RoundedRectangle(cornerRadius: 16)
          .stroke(Color.white.opacity(0.08), lineWidth: 1)
      )
  }
}
