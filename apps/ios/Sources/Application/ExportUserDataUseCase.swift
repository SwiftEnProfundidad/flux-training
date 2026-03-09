import Foundation

public enum ExportUserDataError: Error, Equatable {
  case invalidUserID
  case encodingFailed
}

public struct UserDataExportSnapshot: Sendable, Equatable {
  public let userID: String
  public let exportedAt: Date
  public let profile: UserProfile?
  public let settings: UserSettings?
  public let legalConsent: UserLegalConsent?

  public init(
    userID: String,
    exportedAt: Date,
    profile: UserProfile?,
    settings: UserSettings?,
    legalConsent: UserLegalConsent?
  ) {
    self.userID = userID
    self.exportedAt = exportedAt
    self.profile = profile
    self.settings = settings
    self.legalConsent = legalConsent
  }
}

public struct UserDataExportPayload: Sendable, Equatable {
  public let snapshot: UserDataExportSnapshot
  public let json: String
  public let bytes: Int

  public init(snapshot: UserDataExportSnapshot, json: String, bytes: Int) {
    self.snapshot = snapshot
    self.json = json
    self.bytes = bytes
  }
}

public struct ExportUserDataUseCase: Sendable {
  private let userProfileRepository: any UserProfileRepository
  private let userSettingsRepository: any UserSettingsRepository
  private let userLegalConsentRepository: any UserLegalConsentRepository

  public init(
    userProfileRepository: any UserProfileRepository,
    userSettingsRepository: any UserSettingsRepository,
    userLegalConsentRepository: any UserLegalConsentRepository
  ) {
    self.userProfileRepository = userProfileRepository
    self.userSettingsRepository = userSettingsRepository
    self.userLegalConsentRepository = userLegalConsentRepository
  }

  public func execute(userID: String) async throws -> UserDataExportPayload {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      throw ExportUserDataError.invalidUserID
    }

    let profile = try await userProfileRepository.load(userID: resolvedUserID)
    let settings = try await userSettingsRepository.load(userID: resolvedUserID)
    let legalConsent = try await userLegalConsentRepository.load(userID: resolvedUserID)

    let snapshot = UserDataExportSnapshot(
      userID: resolvedUserID,
      exportedAt: Date(),
      profile: profile,
      settings: settings,
      legalConsent: legalConsent
    )

    let encodableSnapshot = EncodableUserDataExportSnapshot(from: snapshot)
    let encoder = JSONEncoder()
    encoder.dateEncodingStrategy = .iso8601
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
    let data = try encoder.encode(encodableSnapshot)
    guard let json = String(data: data, encoding: .utf8) else {
      throw ExportUserDataError.encodingFailed
    }
    return UserDataExportPayload(snapshot: snapshot, json: json, bytes: data.count)
  }
}

private struct EncodableUserDataExportSnapshot: Encodable {
  let userID: String
  let exportedAt: Date
  let profile: EncodableUserProfile?
  let settings: EncodableUserSettings?
  let legalConsent: EncodableUserLegalConsent?

  init(from snapshot: UserDataExportSnapshot) {
    userID = snapshot.userID
    exportedAt = snapshot.exportedAt
    profile = snapshot.profile.map(EncodableUserProfile.init)
    settings = snapshot.settings.map(EncodableUserSettings.init)
    legalConsent = snapshot.legalConsent.map(EncodableUserLegalConsent.init)
  }
}

private struct EncodableUserProfile: Encodable {
  let id: String
  let displayName: String
  let goal: String
  let age: Int
  let heightCm: Double
  let weightKg: Double
  let createdAt: Date

  init(_ profile: UserProfile) {
    id = profile.id
    displayName = profile.displayName
    goal = profile.goal.rawValue
    age = profile.age
    heightCm = profile.heightCm
    weightKg = profile.weightKg
    createdAt = profile.createdAt
  }
}

private struct EncodableUserSettings: Encodable {
  let userID: String
  let notificationsEnabled: Bool
  let watchSyncEnabled: Bool
  let calendarSyncEnabled: Bool
  let updatedAt: Date

  init(_ settings: UserSettings) {
    userID = settings.userID
    notificationsEnabled = settings.notificationsEnabled
    watchSyncEnabled = settings.watchSyncEnabled
    calendarSyncEnabled = settings.calendarSyncEnabled
    updatedAt = settings.updatedAt
  }
}

private struct EncodableUserLegalConsent: Encodable {
  let userID: String
  let privacyPolicyAccepted: Bool
  let termsAccepted: Bool
  let medicalDisclaimerAccepted: Bool
  let updatedAt: Date

  init(_ consent: UserLegalConsent) {
    userID = consent.userID
    privacyPolicyAccepted = consent.privacyPolicyAccepted
    termsAccepted = consent.termsAccepted
    medicalDisclaimerAccepted = consent.medicalDisclaimerAccepted
    updatedAt = consent.updatedAt
  }
}
