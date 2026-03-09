import Foundation
import Observation

@MainActor
@Observable
public final class DeleteAccountViewModel {
  public var reason = ""
  public private(set) var status: String = SettingsLegalScreenStatus.idle.rawValue
  public private(set) var latestRequestAtISO8601 = "-"

  private let loadLatestAccountDeletionRequestUseCase: LoadLatestAccountDeletionRequestUseCase
  private let requestAccountDeletionUseCase: RequestAccountDeletionUseCase
  private let loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase
  private let iso8601Formatter: ISO8601DateFormatter

  public var screenStatus: SettingsLegalScreenStatus {
    SettingsLegalScreenStatus.fromRuntimeStatus(status)
  }

  public init(
    loadLatestAccountDeletionRequestUseCase: LoadLatestAccountDeletionRequestUseCase,
    requestAccountDeletionUseCase: RequestAccountDeletionUseCase,
    loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase
  ) {
    self.loadLatestAccountDeletionRequestUseCase = loadLatestAccountDeletionRequestUseCase
    self.requestAccountDeletionUseCase = requestAccountDeletionUseCase
    self.loadUserLegalConsentUseCase = loadUserLegalConsentUseCase
    self.iso8601Formatter = ISO8601DateFormatter()
  }

  public func refresh(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      status = SettingsLegalScreenStatus.validationError.rawValue
      return
    }

    status = SettingsLegalScreenStatus.loading.rawValue
    do {
      let request = try await loadLatestAccountDeletionRequestUseCase.execute(userID: resolvedUserID)
      guard let request else {
        status = "empty"
        return
      }
      reason = request.reason
      latestRequestAtISO8601 = iso8601Formatter.string(from: request.requestedAt)
      status = "loaded"
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

    status = SettingsLegalScreenStatus.loading.rawValue
    do {
      let consent = try await loadUserLegalConsentUseCase.execute(userID: resolvedUserID)
      guard consentIsComplete(consent) else {
        status = SettingsLegalScreenStatus.consentRequired.rawValue
        return
      }

      let request = AccountDeletionRequest(
        userID: resolvedUserID,
        reason: reason,
        requestedAt: Date()
      )
      try await requestAccountDeletionUseCase.execute(request: request)
      latestRequestAtISO8601 = iso8601Formatter.string(from: request.requestedAt)
      status = SettingsLegalScreenStatus.deletionRequested.rawValue
    } catch {
      status = resolveStatus(for: error)
    }
  }

  private func consentIsComplete(_ consent: UserLegalConsent?) -> Bool {
    guard let consent else {
      return false
    }
    return consent.privacyPolicyAccepted && consent.termsAccepted && consent.medicalDisclaimerAccepted
  }

  private func resolveStatus(for error: Error) -> String {
    if error is LoadLatestAccountDeletionRequestError
      || error is RequestAccountDeletionError
      || error is LoadUserLegalConsentError {
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
