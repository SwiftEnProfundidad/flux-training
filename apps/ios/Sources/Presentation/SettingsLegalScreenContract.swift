import Foundation

public enum SettingsLegalScreenStatus: String, Sendable, Equatable {
  case idle
  case loading
  case saved
  case exported
  case deletionRequested
  case error
  case offline
  case denied
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
