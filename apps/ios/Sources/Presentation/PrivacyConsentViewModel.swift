import Foundation
import Observation

@MainActor
@Observable
public final class PrivacyConsentViewModel {
  public var privacyPolicyAccepted = false
  public var termsAccepted = false
  public var medicalDisclaimerAccepted = false
  public private(set) var status: String = SettingsLegalScreenStatus.idle.rawValue

  private let loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase
  private let saveUserLegalConsentUseCase: SaveUserLegalConsentUseCase

  public var screenStatus: SettingsLegalScreenStatus {
    SettingsLegalScreenStatus.fromRuntimeStatus(status)
  }

  public init(
    loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase,
    saveUserLegalConsentUseCase: SaveUserLegalConsentUseCase
  ) {
    self.loadUserLegalConsentUseCase = loadUserLegalConsentUseCase
    self.saveUserLegalConsentUseCase = saveUserLegalConsentUseCase
  }

  public func refresh(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      status = SettingsLegalScreenStatus.validationError.rawValue
      return
    }

    status = SettingsLegalScreenStatus.loading.rawValue
    do {
      let consent = try await loadUserLegalConsentUseCase.execute(userID: resolvedUserID)
      guard let consent else {
        status = "empty"
        return
      }
      privacyPolicyAccepted = consent.privacyPolicyAccepted
      termsAccepted = consent.termsAccepted
      medicalDisclaimerAccepted = consent.medicalDisclaimerAccepted
      status = "loaded"
    } catch {
      status = resolveStatus(for: error)
    }
  }

  public func saveConsent(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      status = SettingsLegalScreenStatus.validationError.rawValue
      return
    }

    status = SettingsLegalScreenStatus.loading.rawValue
    do {
      try await saveCurrentConsent(userID: resolvedUserID)
      status = allAccepted
        ? SettingsLegalScreenStatus.saved.rawValue
        : SettingsLegalScreenStatus.consentRequired.rawValue
    } catch {
      status = resolveStatus(for: error)
    }
  }

  public func exportData(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      status = SettingsLegalScreenStatus.validationError.rawValue
      return
    }
    guard allAccepted else {
      status = SettingsLegalScreenStatus.consentRequired.rawValue
      return
    }

    status = SettingsLegalScreenStatus.loading.rawValue
    do {
      try await saveCurrentConsent(userID: resolvedUserID)
      status = SettingsLegalScreenStatus.exported.rawValue
    } catch {
      status = resolveStatus(for: error)
    }
  }

  public func requestDeletion(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      status = SettingsLegalScreenStatus.validationError.rawValue
      return
    }
    guard allAccepted else {
      status = SettingsLegalScreenStatus.consentRequired.rawValue
      return
    }

    status = SettingsLegalScreenStatus.loading.rawValue
    do {
      try await saveCurrentConsent(userID: resolvedUserID)
      status = SettingsLegalScreenStatus.deletionRequested.rawValue
    } catch {
      status = resolveStatus(for: error)
    }
  }

  private var allAccepted: Bool {
    privacyPolicyAccepted && termsAccepted && medicalDisclaimerAccepted
  }

  private func saveCurrentConsent(userID: String) async throws {
    try await saveUserLegalConsentUseCase.execute(
      consent: UserLegalConsent(
        userID: userID,
        privacyPolicyAccepted: privacyPolicyAccepted,
        termsAccepted: termsAccepted,
        medicalDisclaimerAccepted: medicalDisclaimerAccepted,
        updatedAt: Date()
      )
    )
  }

  private func resolveStatus(for error: Error) -> String {
    if error is LoadUserLegalConsentError || error is SaveUserLegalConsentError {
      return SettingsLegalScreenStatus.validationError.rawValue
    }
    if let urlError = error as? URLError, urlError.code == .notConnectedToInternet {
      return SettingsLegalScreenStatus.offline.rawValue
    }
    if case FluxBackendClientError.missingAuthorizationBearer = error {
      return SettingsLegalScreenStatus.denied.rawValue
    }
    if case let FluxBackendClientError.backend(code, _, _, _) = error,
       code == "missing_authorization_bearer" || code == "invalid_authorization_bearer" {
      return SettingsLegalScreenStatus.denied.rawValue
    }
    return SettingsLegalScreenStatus.error.rawValue
  }
}
