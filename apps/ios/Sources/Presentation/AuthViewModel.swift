import Foundation
import Observation

@MainActor
@Observable
public final class AuthViewModel {
  public private(set) var authStatus: String = "signed_out"
  private let createAuthSessionUseCase: CreateAuthSessionUseCase

  public init(createAuthSessionUseCase: CreateAuthSessionUseCase) {
    self.createAuthSessionUseCase = createAuthSessionUseCase
  }

  public func signInWithApple() async {
    do {
      let session = try await createAuthSessionUseCase.execute(method: .apple)
      authStatus = "signed_in:\(session.identity.provider.rawValue)"
    } catch {
      authStatus = "auth_error"
    }
  }

  public func signInWithEmail(email: String, password: String) async {
    do {
      let session = try await createAuthSessionUseCase.execute(
        method: .email(email: email, password: password)
      )
      authStatus = "signed_in:\(session.identity.provider.rawValue)"
    } catch {
      authStatus = "auth_error"
    }
  }
}

