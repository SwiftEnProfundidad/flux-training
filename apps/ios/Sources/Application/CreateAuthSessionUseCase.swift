import Foundation

public enum AuthMethod: Sendable, Equatable {
  case apple
  case email(email: String, password: String)
}

public struct CreateAuthSessionUseCase: Sendable {
  private let authGateway: any AuthGateway

  public init(authGateway: any AuthGateway) {
    self.authGateway = authGateway
  }

  public func execute(method: AuthMethod) async throws -> AuthSession {
    switch method {
    case .apple:
      return try await authGateway.createSessionWithApple()
    case let .email(email, password):
      return try await authGateway.createSessionWithEmail(email: email, password: password)
    }
  }
}

