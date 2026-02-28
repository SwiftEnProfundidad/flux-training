import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ExperienceHubView: View {
  @State private var authViewModel: AuthViewModel
  @State private var onboardingViewModel: OnboardingViewModel
  @State private var trainingViewModel: TrainingFlowViewModel
  @State private var nutritionViewModel: NutritionViewModel
  @State private var progressViewModel: ProgressViewModel
  @State private var offlineSyncViewModel: OfflineSyncViewModel
  @State private var observabilityViewModel: ObservabilityViewModel
  @State private var recommendations: [AIRecommendation] = []
  @State private var recommendationsStatus: String = "idle"
  @State private var language: SupportedLanguage = .es

  @State private var email: String = "demo@flux.training"
  @State private var password: String = "demo-password"
  @State private var parQQuestionOne: Bool = false
  @State private var parQQuestionTwo: Bool = false

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
  }

  private var todayTab: some View {
    NavigationStack {
      ScrollView {
        VStack(alignment: .leading, spacing: 16) {
          readinessHero
          authSection
          onboardingSection
          TrainingFlowView(viewModel: trainingViewModel, userID: userID, copy: copy)
            .cardSurface()
          nutritionSection
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
        VStack(spacing: 16) {
          ProgressSummaryView(viewModel: progressViewModel, userID: userID)
            .cardSurface()
          OfflineSyncView(viewModel: offlineSyncViewModel, userID: userID)
            .cardSurface()
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
        VStack(spacing: 16) {
          ObservabilityView(viewModel: observabilityViewModel, userID: userID)
            .cardSurface()
          aiRecommendationsSection
          Text("\(copy.text(.overallStatusLabel)): \(copy.readinessLabel(readinessSnapshot.label))")
            .font(.subheadline)
            .foregroundStyle(.secondary)
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
        Text("ES").tag(SupportedLanguage.es)
        Text("EN").tag(SupportedLanguage.en)
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

  private var authSection: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.authenticationTitle))
        .font(.title3.bold())
      Button(copy.text(.signInWithApple)) {
        Task { await authViewModel.signInWithApple() }
      }
      .buttonStyle(.borderedProminent)
      .tint(.orange)
      TextField("Email", text: $email)
        .fluxEmailFieldBehavior()
        .textFieldStyle(RoundedBorderTextFieldStyle())
      SecureField("Password", text: $password)
        .textFieldStyle(RoundedBorderTextFieldStyle())
      Button(copy.text(.signInWithEmail)) {
        Task { await authViewModel.signInWithEmail(email: email, password: password) }
      }
      .buttonStyle(.bordered)
      Text("\(copy.text(.authStatusLabel)): \(copy.humanStatus(authViewModel.authStatus))")
        .foregroundStyle(.secondary)
        .font(.footnote)
    }
    .cardSurface()
  }

  private var onboardingSection: some View {
    @Bindable var bindableViewModel = onboardingViewModel

    return VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.onboardingTitle))
        .font(.title3.bold())
      TextField(copy.text(.displayName), text: $bindableViewModel.displayName)
        .textFieldStyle(RoundedBorderTextFieldStyle())
      HStack {
        TextField(
          copy.text(.age),
          value: $bindableViewModel.age,
          format: .number
        )
        .textFieldStyle(RoundedBorderTextFieldStyle())
        TextField(
          copy.text(.days),
          value: $bindableViewModel.availableDaysPerWeek,
          format: .number
        )
        .textFieldStyle(RoundedBorderTextFieldStyle())
      }
      Toggle(copy.text(.chestPainQuestion), isOn: $parQQuestionOne)
      Toggle(copy.text(.dizzinessQuestion), isOn: $parQQuestionTwo)
      Button(copy.text(.completeOnboarding)) {
        onboardingViewModel.parQResponses = [
          ParQResponse(questionID: "parq-1", answer: parQQuestionOne),
          ParQResponse(questionID: "parq-2", answer: parQQuestionTwo)
        ]
        Task { await onboardingViewModel.complete(userID: userID) }
      }
      .buttonStyle(.borderedProminent)
      .tint(.orange)
      Text("\(copy.text(.onboardingStatusLabel)): \(copy.humanStatus(onboardingViewModel.onboardingStatus))")
        .foregroundStyle(.secondary)
        .font(.footnote)
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
          Task { await nutritionViewModel.saveLog(userID: userID) }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        Button(copy.text(.loadLogs)) {
          Task { await nutritionViewModel.refreshLogs(userID: userID) }
        }
        .buttonStyle(.bordered)
      }
      Text("\(copy.text(.nutritionStatusLabel)): \(copy.humanStatus(nutritionViewModel.status))")
        .foregroundStyle(.secondary)
        .font(.footnote)
      Text("\(copy.text(.nutritionLogsLoaded)): \(nutritionViewModel.logs.count)")
        .foregroundStyle(.secondary)
        .font(.footnote)
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
      Text("\(copy.text(.recommendationsStatusLabel)): \(copy.humanStatus(recommendationsStatus))")
        .foregroundStyle(.secondary)
        .font(.footnote)
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
              Text(recommendation.priority.rawValue)
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
    let estimatedDaysSinceWorkout = trainingViewModel.sessions.isEmpty ? 3 : 0
    let estimatedCompletionRate: Double = trainingViewModel.plans.isEmpty
      ? 0.4
      : min(1, Double(trainingViewModel.sessions.count) / Double(max(1, trainingViewModel.plans.count * 2)))
    recommendations = await generateAIRecommendationsUseCase.execute(
      userID: userID,
      goal: onboardingViewModel.selectedGoal,
      pendingQueueCount: offlineSyncViewModel.pendingCount,
      daysSinceLastWorkout: estimatedDaysSinceWorkout,
      recentCompletionRate: estimatedCompletionRate,
      locale: copy.recommendationLocale
    )
    recommendationsStatus = recommendations.isEmpty ? "idle" : "loaded"
  }

  private var backgroundGradient: some View {
    LinearGradient(
      colors: [Color(red: 0.05, green: 0.06, blue: 0.08), Color(red: 0.08, green: 0.09, blue: 0.12)],
      startPoint: .topLeading,
      endPoint: .bottomTrailing
    )
    .ignoresSafeArea()
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
