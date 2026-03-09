import Foundation

private struct StoredUserProfile: Codable {
  let id: String
  let displayName: String
  let goal: String
  let age: Int
  let heightCm: Double
  let weightKg: Double
  let createdAt: Date
}

private struct StoredSetLog: Codable {
  let reps: Int
  let loadKg: Double
  let rpe: Double
}

private struct StoredExerciseLog: Codable {
  let exerciseID: String
  let sets: [StoredSetLog]
}

private struct StoredTrainingPlanExercise: Codable {
  let exerciseID: String
  let targetSets: Int
  let targetReps: Int
}

private struct StoredTrainingPlanDay: Codable {
  let dayIndex: Int
  let exercises: [StoredTrainingPlanExercise]
}

private struct StoredNutritionLog: Codable {
  let userID: String
  let date: String
  let calories: Double
  let proteinGrams: Double
  let carbsGrams: Double
  let fatsGrams: Double
}

private struct StoredOfflineSyncQueueItem: Codable {
  let id: String
  let userID: String
  let enqueuedAt: Date
  let actionType: String
  let trainingPlan: StoredQueuedTrainingPlanInput?
  let workoutSession: StoredCreateWorkoutSessionInput?
  let nutritionLog: StoredNutritionLog?
}

private struct StoredUserSettings: Codable {
  let userID: String
  let notificationsEnabled: Bool
  let watchSyncEnabled: Bool
  let calendarSyncEnabled: Bool
  let updatedAt: Date
}

private struct StoredUserLegalConsent: Codable {
  let userID: String
  let privacyPolicyAccepted: Bool
  let termsAccepted: Bool
  let medicalDisclaimerAccepted: Bool
  let updatedAt: Date
}

private struct StoredAccountDeletionRequest: Codable {
  let userID: String
  let reason: String
  let requestedAt: Date
}

private struct StoredQueuedTrainingPlanInput: Codable {
  let id: String
  let userID: String
  let name: String
  let weeks: Int
  let days: [StoredTrainingPlanDay]
}

private struct StoredCreateWorkoutSessionInput: Codable {
  let userID: String
  let planID: String
  let startedAt: Date
  let endedAt: Date
  let exercises: [StoredExerciseLog]
}

public actor PersistentUserProfileRepository: UserProfileRepository {
  private let storageKey: String
  private let defaults: UserDefaults
  private let encoder: JSONEncoder
  private let decoder: JSONDecoder

  public init(
    storageKey: String = "flux.ios.userProfiles",
    defaults: UserDefaults = .standard
  ) {
    self.storageKey = storageKey
    self.defaults = defaults
    let configuredEncoder = JSONEncoder()
    configuredEncoder.dateEncodingStrategy = .iso8601
    self.encoder = configuredEncoder
    let configuredDecoder = JSONDecoder()
    configuredDecoder.dateDecodingStrategy = .iso8601
    self.decoder = configuredDecoder
  }

  public func save(profile: UserProfile) async throws {
    var profiles = try loadProfiles()
    let storedProfile = StoredUserProfile(
      id: profile.id,
      displayName: profile.displayName,
      goal: profile.goal.rawValue,
      age: profile.age,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      createdAt: profile.createdAt
    )
    profiles.removeAll { $0.id == profile.id }
    profiles.append(storedProfile)
    let data = try encoder.encode(profiles)
    defaults.set(data, forKey: storageKey)
  }

  public func load(userID: String) async throws -> UserProfile? {
    let profiles = try loadProfiles()
    guard let storedProfile = profiles.first(where: { $0.id == userID }) else {
      return nil
    }
    return UserProfile(
      id: storedProfile.id,
      displayName: storedProfile.displayName,
      goal: TrainingGoal(rawValue: storedProfile.goal) ?? .recomposition,
      age: storedProfile.age,
      heightCm: storedProfile.heightCm,
      weightKg: storedProfile.weightKg,
      createdAt: storedProfile.createdAt
    )
  }

  private func loadProfiles() throws -> [StoredUserProfile] {
    guard let data = defaults.data(forKey: storageKey) else {
      return []
    }
    return try decoder.decode([StoredUserProfile].self, from: data)
  }
}

public actor PersistentUserSettingsRepository: UserSettingsRepository {
  private let storageKey: String
  private let defaults: UserDefaults
  private let encoder: JSONEncoder
  private let decoder: JSONDecoder

  public init(
    storageKey: String = "flux.ios.userSettings",
    defaults: UserDefaults = .standard
  ) {
    self.storageKey = storageKey
    self.defaults = defaults
    let configuredEncoder = JSONEncoder()
    configuredEncoder.dateEncodingStrategy = .iso8601
    self.encoder = configuredEncoder
    let configuredDecoder = JSONDecoder()
    configuredDecoder.dateDecodingStrategy = .iso8601
    self.decoder = configuredDecoder
  }

  public func save(settings: UserSettings) async throws {
    var allSettings = try loadSettings()
    let storedSettings = StoredUserSettings(
      userID: settings.userID,
      notificationsEnabled: settings.notificationsEnabled,
      watchSyncEnabled: settings.watchSyncEnabled,
      calendarSyncEnabled: settings.calendarSyncEnabled,
      updatedAt: settings.updatedAt
    )
    allSettings.removeAll { $0.userID == settings.userID }
    allSettings.append(storedSettings)
    let data = try encoder.encode(allSettings)
    defaults.set(data, forKey: storageKey)
  }

  public func load(userID: String) async throws -> UserSettings? {
    let allSettings = try loadSettings()
    guard let storedSettings = allSettings.first(where: { $0.userID == userID }) else {
      return nil
    }
    return UserSettings(
      userID: storedSettings.userID,
      notificationsEnabled: storedSettings.notificationsEnabled,
      watchSyncEnabled: storedSettings.watchSyncEnabled,
      calendarSyncEnabled: storedSettings.calendarSyncEnabled,
      updatedAt: storedSettings.updatedAt
    )
  }

  private func loadSettings() throws -> [StoredUserSettings] {
    guard let data = defaults.data(forKey: storageKey) else {
      return []
    }
    return try decoder.decode([StoredUserSettings].self, from: data)
  }
}

public actor PersistentUserLegalConsentRepository: UserLegalConsentRepository {
  private let storageKey: String
  private let defaults: UserDefaults
  private let encoder: JSONEncoder
  private let decoder: JSONDecoder

  public init(
    storageKey: String = "flux.ios.userLegalConsents",
    defaults: UserDefaults = .standard
  ) {
    self.storageKey = storageKey
    self.defaults = defaults
    let configuredEncoder = JSONEncoder()
    configuredEncoder.dateEncodingStrategy = .iso8601
    self.encoder = configuredEncoder
    let configuredDecoder = JSONDecoder()
    configuredDecoder.dateDecodingStrategy = .iso8601
    self.decoder = configuredDecoder
  }

  public func save(consent: UserLegalConsent) async throws {
    var allConsents = try loadConsents()
    let storedConsent = StoredUserLegalConsent(
      userID: consent.userID,
      privacyPolicyAccepted: consent.privacyPolicyAccepted,
      termsAccepted: consent.termsAccepted,
      medicalDisclaimerAccepted: consent.medicalDisclaimerAccepted,
      updatedAt: consent.updatedAt
    )
    allConsents.removeAll { $0.userID == consent.userID }
    allConsents.append(storedConsent)
    let data = try encoder.encode(allConsents)
    defaults.set(data, forKey: storageKey)
  }

  public func load(userID: String) async throws -> UserLegalConsent? {
    let allConsents = try loadConsents()
    guard let storedConsent = allConsents.first(where: { $0.userID == userID }) else {
      return nil
    }
    return UserLegalConsent(
      userID: storedConsent.userID,
      privacyPolicyAccepted: storedConsent.privacyPolicyAccepted,
      termsAccepted: storedConsent.termsAccepted,
      medicalDisclaimerAccepted: storedConsent.medicalDisclaimerAccepted,
      updatedAt: storedConsent.updatedAt
    )
  }

  private func loadConsents() throws -> [StoredUserLegalConsent] {
    guard let data = defaults.data(forKey: storageKey) else {
      return []
    }
    return try decoder.decode([StoredUserLegalConsent].self, from: data)
  }
}

public actor PersistentAccountDeletionRequestRepository: AccountDeletionRequestRepository {
  private let storageKey: String
  private let defaults: UserDefaults
  private let encoder: JSONEncoder
  private let decoder: JSONDecoder

  public init(
    storageKey: String = "flux.ios.accountDeletionRequests",
    defaults: UserDefaults = .standard
  ) {
    self.storageKey = storageKey
    self.defaults = defaults
    let configuredEncoder = JSONEncoder()
    configuredEncoder.dateEncodingStrategy = .iso8601
    self.encoder = configuredEncoder
    let configuredDecoder = JSONDecoder()
    configuredDecoder.dateDecodingStrategy = .iso8601
    self.decoder = configuredDecoder
  }

  public func save(request: AccountDeletionRequest) async throws {
    var allRequests = try loadRequests()
    allRequests.removeAll { $0.userID == request.userID }
    allRequests.append(
      StoredAccountDeletionRequest(
        userID: request.userID,
        reason: request.reason,
        requestedAt: request.requestedAt
      )
    )
    let data = try encoder.encode(allRequests)
    defaults.set(data, forKey: storageKey)
  }

  public func loadLatest(userID: String) async throws -> AccountDeletionRequest? {
    let allRequests = try loadRequests()
    guard let request = allRequests.first(where: { $0.userID == userID }) else {
      return nil
    }
    return AccountDeletionRequest(
      userID: request.userID,
      reason: request.reason,
      requestedAt: request.requestedAt
    )
  }

  private func loadRequests() throws -> [StoredAccountDeletionRequest] {
    guard let data = defaults.data(forKey: storageKey) else {
      return []
    }
    return try decoder.decode([StoredAccountDeletionRequest].self, from: data)
  }
}

public actor PersistentOfflineSyncQueueRepository: OfflineSyncQueueRepository {
  private let storageKey: String
  private let defaults: UserDefaults
  private let encoder: JSONEncoder
  private let decoder: JSONDecoder

  public init(
    storageKey: String = "flux.ios.offlineSyncQueue",
    defaults: UserDefaults = .standard
  ) {
    self.storageKey = storageKey
    self.defaults = defaults
    let configuredEncoder = JSONEncoder()
    configuredEncoder.dateEncodingStrategy = .iso8601
    self.encoder = configuredEncoder
    let configuredDecoder = JSONDecoder()
    configuredDecoder.dateDecodingStrategy = .iso8601
    self.decoder = configuredDecoder
  }

  public func enqueue(item: OfflineSyncQueueItem) async throws {
    var items = try loadItems()
    items.append(mapStoredItem(from: item))
    try saveItems(items)
  }

  public func list(userID: String) async throws -> [OfflineSyncQueueItem] {
    try loadItems()
      .filter { $0.userID == userID }
      .compactMap(mapQueueItem(from:))
  }

  public func remove(ids: [String]) async throws {
    let idSet = Set(ids)
    let filteredItems = try loadItems().filter { idSet.contains($0.id) == false }
    try saveItems(filteredItems)
  }

  private func loadItems() throws -> [StoredOfflineSyncQueueItem] {
    guard let data = defaults.data(forKey: storageKey) else {
      return []
    }
    return try decoder.decode([StoredOfflineSyncQueueItem].self, from: data)
  }

  private func saveItems(_ items: [StoredOfflineSyncQueueItem]) throws {
    let data = try encoder.encode(items)
    defaults.set(data, forKey: storageKey)
  }

  private func mapStoredItem(from item: OfflineSyncQueueItem) -> StoredOfflineSyncQueueItem {
    switch item.action {
    case .createTrainingPlan(let payload):
      return StoredOfflineSyncQueueItem(
        id: item.id,
        userID: item.userID,
        enqueuedAt: item.enqueuedAt,
        actionType: "create_training_plan",
        trainingPlan: StoredQueuedTrainingPlanInput(
          id: payload.id,
          userID: payload.userID,
          name: payload.name,
          weeks: payload.weeks,
          days: payload.days.map { day in
            StoredTrainingPlanDay(
              dayIndex: day.dayIndex,
              exercises: day.exercises.map { exercise in
                StoredTrainingPlanExercise(
                  exerciseID: exercise.exerciseID,
                  targetSets: exercise.targetSets,
                  targetReps: exercise.targetReps
                )
              }
            )
          }
        ),
        workoutSession: nil,
        nutritionLog: nil
      )
    case .createWorkoutSession(let payload):
      return StoredOfflineSyncQueueItem(
        id: item.id,
        userID: item.userID,
        enqueuedAt: item.enqueuedAt,
        actionType: "create_workout_session",
        trainingPlan: nil,
        workoutSession: StoredCreateWorkoutSessionInput(
          userID: payload.userID,
          planID: payload.planID,
          startedAt: payload.startedAt,
          endedAt: payload.endedAt,
          exercises: payload.exercises.map { exercise in
            StoredExerciseLog(
              exerciseID: exercise.exerciseID,
              sets: exercise.sets.map { set in
                StoredSetLog(reps: set.reps, loadKg: set.loadKg, rpe: set.rpe)
              }
            )
          }
        ),
        nutritionLog: nil
      )
    case .createNutritionLog(let payload):
      return StoredOfflineSyncQueueItem(
        id: item.id,
        userID: item.userID,
        enqueuedAt: item.enqueuedAt,
        actionType: "create_nutrition_log",
        trainingPlan: nil,
        workoutSession: nil,
        nutritionLog: StoredNutritionLog(
          userID: payload.userID,
          date: payload.date,
          calories: payload.calories,
          proteinGrams: payload.proteinGrams,
          carbsGrams: payload.carbsGrams,
          fatsGrams: payload.fatsGrams
        )
      )
    }
  }

  private func mapQueueItem(from item: StoredOfflineSyncQueueItem) -> OfflineSyncQueueItem? {
    let action: OfflineSyncAction
    switch item.actionType {
    case "create_training_plan":
      guard let payload = item.trainingPlan else {
        return nil
      }
      action = .createTrainingPlan(
        QueuedTrainingPlanInput(
          id: payload.id,
          userID: payload.userID,
          name: payload.name,
          weeks: payload.weeks,
          days: payload.days.map { day in
            TrainingPlanDay(
              dayIndex: day.dayIndex,
              exercises: day.exercises.map { exercise in
                TrainingPlanExercise(
                  exerciseID: exercise.exerciseID,
                  targetSets: exercise.targetSets,
                  targetReps: exercise.targetReps
                )
              }
            )
          }
        )
      )
    case "create_workout_session":
      guard let payload = item.workoutSession else {
        return nil
      }
      action = .createWorkoutSession(
        CreateWorkoutSessionInput(
          userID: payload.userID,
          planID: payload.planID,
          startedAt: payload.startedAt,
          endedAt: payload.endedAt,
          exercises: payload.exercises.map { exercise in
            ExerciseLog(
              exerciseID: exercise.exerciseID,
              sets: exercise.sets.map { set in
                SetLog(reps: set.reps, loadKg: set.loadKg, rpe: set.rpe)
              }
            )
          }
        )
      )
    case "create_nutrition_log":
      guard let payload = item.nutritionLog else {
        return nil
      }
      action = .createNutritionLog(
        NutritionLog(
          userID: payload.userID,
          date: payload.date,
          calories: payload.calories,
          proteinGrams: payload.proteinGrams,
          carbsGrams: payload.carbsGrams,
          fatsGrams: payload.fatsGrams
        )
      )
    default:
      return nil
    }
    return OfflineSyncQueueItem(
      id: item.id,
      userID: item.userID,
      enqueuedAt: item.enqueuedAt,
      action: action
    )
  }
}
