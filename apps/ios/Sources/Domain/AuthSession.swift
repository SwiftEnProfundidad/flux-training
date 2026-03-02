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
  public struct Policy: Sendable, Equatable {
    public let maxIdleSeconds: Int
    public let rotationIntervalSeconds: Int
    public let absoluteTTLSeconds: Int

    public init(
      maxIdleSeconds: Int,
      rotationIntervalSeconds: Int,
      absoluteTTLSeconds: Int
    ) {
      self.maxIdleSeconds = maxIdleSeconds
      self.rotationIntervalSeconds = rotationIntervalSeconds
      self.absoluteTTLSeconds = absoluteTTLSeconds
    }
  }

  public let userID: String
  public let sessionID: String
  public let token: String
  public let issuedAt: Date
  public let expiresAt: Date
  public let rotationRequiredAt: Date
  public let absoluteExpiresAt: Date
  public let sessionPolicy: Policy
  public let identity: AuthIdentity

  public init(
    userID: String,
    sessionID: String,
    token: String,
    issuedAt: Date,
    expiresAt: Date,
    rotationRequiredAt: Date,
    absoluteExpiresAt: Date,
    sessionPolicy: Policy,
    identity: AuthIdentity
  ) {
    self.userID = userID
    self.sessionID = sessionID
    self.token = token
    self.issuedAt = issuedAt
    self.expiresAt = expiresAt
    self.rotationRequiredAt = rotationRequiredAt
    self.absoluteExpiresAt = absoluteExpiresAt
    self.sessionPolicy = sessionPolicy
    self.identity = identity
  }
}

public protocol AuthGateway: Sendable {
  func createSessionWithApple() async throws -> AuthSession
  func createSessionWithEmail(email: String, password: String) async throws -> AuthSession
}
