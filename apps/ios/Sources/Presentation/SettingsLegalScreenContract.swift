import Foundation

public enum SettingsLegalScreenStatus: String, Sendable, Equatable {
  case idle
  case loading
  case loaded
  case empty
  case validationError = "validation_error"
  case consentRequired = "consent_required"
  case saved
  case exported
  case deletionRequested = "deletion_requested"
  case error
  case offline
  case denied

  public static func fromRuntimeStatus(_ rawStatus: String) -> SettingsLegalScreenStatus {
    switch rawStatus.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() {
    case "loading":
      return .loading
    case "loaded":
      return .loaded
    case "empty":
      return .empty
    case "validation_error":
      return .validationError
    case "consent_required":
      return .consentRequired
    case "saved":
      return .saved
    case "exported":
      return .exported
    case "deletion_requested":
      return .deletionRequested
    case "offline":
      return .offline
    case "denied":
      return .denied
    case "error", "auth_error":
      return .error
    default:
      return .idle
    }
  }
}

public struct SettingsLegalScreenContract: Sendable, Equatable {
  public var notificationsEnabled: Bool
  public var watchSyncEnabled: Bool
  public var calendarSyncEnabled: Bool
  public var privacyPolicyAccepted: Bool
  public var termsAccepted: Bool
  public var medicalDisclaimerAccepted: Bool
  public var settingsStatus: SettingsLegalScreenStatus
  public var legalStatus: SettingsLegalScreenStatus

  public init(
    notificationsEnabled: Bool = true,
    watchSyncEnabled: Bool = true,
    calendarSyncEnabled: Bool = false,
    privacyPolicyAccepted: Bool = false,
    termsAccepted: Bool = false,
    medicalDisclaimerAccepted: Bool = false,
    settingsStatus: SettingsLegalScreenStatus = .idle,
    legalStatus: SettingsLegalScreenStatus = .idle
  ) {
    self.notificationsEnabled = notificationsEnabled
    self.watchSyncEnabled = watchSyncEnabled
    self.calendarSyncEnabled = calendarSyncEnabled
    self.privacyPolicyAccepted = privacyPolicyAccepted
    self.termsAccepted = termsAccepted
    self.medicalDisclaimerAccepted = medicalDisclaimerAccepted
    self.settingsStatus = settingsStatus
    self.legalStatus = legalStatus
  }
}
