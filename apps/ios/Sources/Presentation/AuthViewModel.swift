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
  private let createAuthSessionUseCase: CreateAuthSessionUseCase

  public init(createAuthSessionUseCase: CreateAuthSessionUseCase) {
    self.createAuthSessionUseCase = createAuthSessionUseCase
  }

  public func signInWithApple() async {
    authStatus = "loading"
    do {
      let session = try await createAuthSessionUseCase.execute(method: .apple)
      authStatus = "signed_in:\(session.identity.provider.rawValue)"
    } catch {
      authStatus = "auth_error"
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
      authStatus = "signed_in:\(session.identity.provider.rawValue)"
    } catch {
      authStatus = "auth_error"
    }
  }

  public func requestRecovery(email: String, channel: RecoveryChannel) {
    guard email.isValidEmailAddress else {
      authStatus = "validation_error"
      return
    }
    switch channel {
    case .email:
      authStatus = "recovery_sent_email"
    case .sms:
      authStatus = "recovery_sent_sms"
    }
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
