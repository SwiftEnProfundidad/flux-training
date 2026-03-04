import Foundation
import Observation

public enum RecoveryChannel: String, Sendable, Equatable {
  case email
  case sms
}

@MainActor
@Observable
public final class AuthViewModel {
  public private(set) var authStatus: String = "signed_out"
  public private(set) var currentSession: AuthSession?
  public var currentUserID: String? {
    currentSession?.userID
  }
  private let createAuthSessionUseCase: CreateAuthSessionUseCase

  public init(createAuthSessionUseCase: CreateAuthSessionUseCase) {
    self.createAuthSessionUseCase = createAuthSessionUseCase
  }

  public func signInWithApple() async {
    authStatus = "loading"
    do {
      let session = try await createAuthSessionUseCase.execute(method: .apple)
      currentSession = session
      authStatus = "signed_in:\(session.identity.provider.rawValue)"
    } catch {
      currentSession = nil
      authStatus = resolveStatus(for: error)
    }
  }

  public func signInWithEmail(email: String, password: String) async {
    guard email.isValidEmailAddress, password.count >= 6 else {
      authStatus = "validation_error"
      return
    }

    authStatus = "loading"
    do {
      let session = try await createAuthSessionUseCase.execute(
        method: .email(email: email, password: password)
      )
      currentSession = session
      authStatus = "signed_in:\(session.identity.provider.rawValue)"
    } catch {
      currentSession = nil
      authStatus = resolveStatus(for: error)
    }
  }

  public func requestRecovery(email: String, channel: RecoveryChannel) {
    guard email.isValidEmailAddress else {
      authStatus = "validation_error"
      return
    }
    authStatus = "loading"
    switch channel {
    case .email:
      authStatus = "recovery_sent_email"
    case .sms:
      authStatus = "recovery_sent_sms"
    }
  }

  public func openSupportTicket() {
    authStatus = "open"
  }

  public func markSessionExpired() {
    currentSession = nil
    authStatus = "session_expired"
  }

  public func backToSignInAfterSessionExpired() {
    currentSession = nil
    authStatus = "signed_out"
  }

  public func openOfflineModeAfterSessionExpired() {
    currentSession = nil
    authStatus = "offline"
  }

  public func signOut() {
    currentSession = nil
    authStatus = "signed_out"
  }

  public func verifyOTP(code: String) {
    let normalizedCode = code.trimmingCharacters(in: .whitespacesAndNewlines)
    guard normalizedCode.count == 6, normalizedCode.allSatisfy(\.isNumber) else {
      authStatus = "validation_error"
      return
    }
    authStatus = "loading"
    authStatus = "success"
  }

  public func resendOTP() {
    authStatus = "loading"
    authStatus = "recovery_sent_sms"
  }

  private func resolveStatus(for error: Error) -> String {
    if let urlError = error as? URLError, urlError.code == .notConnectedToInternet {
      return "offline"
    }
    if case FluxBackendClientError.missingAuthorizationBearer = error {
      return "denied"
    }
    if case let FluxBackendClientError.backend(code, _, _, _) = error,
       code == "missing_authorization_bearer" || code == "invalid_authorization_bearer" || code == "permission_denied" {
      return "denied"
    }
    return "auth_error"
  }
}

private extension String {
  var isValidEmailAddress: Bool {
    let trimmed = trimmingCharacters(in: .whitespacesAndNewlines)
    guard trimmed.isEmpty == false else {
      return false
    }
    let pattern = #"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$"#
    return trimmed.range(of: pattern, options: [.regularExpression, .caseInsensitive]) != nil
  }
}
