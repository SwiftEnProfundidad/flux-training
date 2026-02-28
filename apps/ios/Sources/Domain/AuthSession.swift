import Foundation

public enum AuthProvider: String, Sendable, Equatable {
  case apple
  case email
}

public struct AuthIdentity: Sendable, Equatable {
  public let provider: AuthProvider
  public let providerUserID: String
  public let email: String?
  public let displayName: String?

  public init(
    provider: AuthProvider,
    providerUserID: String,
    email: String?,
    displayName: String?
  ) {
    self.provider = provider
    self.providerUserID = providerUserID
    self.email = email
    self.displayName = displayName
  }
}

public struct AuthSession: Sendable, Equatable {
  public let userID: String
  public let token: String
  public let expiresAt: Date
  public let identity: AuthIdentity

  public init(userID: String, token: String, expiresAt: Date, identity: AuthIdentity) {
    self.userID = userID
    self.token = token
    self.expiresAt = expiresAt
    self.identity = identity
  }
}

public protocol AuthGateway: Sendable {
  func createSessionWithApple() async throws -> AuthSession
  func createSessionWithEmail(email: String, password: String) async throws -> AuthSession
}

