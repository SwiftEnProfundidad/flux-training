import Foundation

public struct DemoAuthGateway: AuthGateway {
  private let sessionPolicy = AuthSession.Policy(
    maxIdleSeconds: 1800,
    rotationIntervalSeconds: 600,
    absoluteTTLSeconds: 43200
  )

  public init() {}

  public func createSessionWithApple() async throws -> AuthSession {
    let issuedAt = Date()
    return AuthSession(
      userID: "apple-demo-user",
      sessionID: UUID().uuidString,
      token: "apple-demo-token",
      issuedAt: issuedAt,
      expiresAt: issuedAt.addingTimeInterval(TimeInterval(sessionPolicy.maxIdleSeconds)),
      rotationRequiredAt: issuedAt.addingTimeInterval(
        TimeInterval(sessionPolicy.rotationIntervalSeconds)
      ),
      absoluteExpiresAt: issuedAt.addingTimeInterval(
        TimeInterval(sessionPolicy.absoluteTTLSeconds)
      ),
      sessionPolicy: sessionPolicy,
      identity: AuthIdentity(
        provider: .apple,
        providerUserID: "apple-demo-user",
        email: "apple-user@example.com",
        displayName: "Apple Demo User"
      )
    )
  }

  public func createSessionWithEmail(email: String, password: String) async throws -> AuthSession {
    let issuedAt = Date()
    return AuthSession(
      userID: email,
      sessionID: UUID().uuidString,
      token: "email-demo-token-\(password.count)",
      issuedAt: issuedAt,
      expiresAt: issuedAt.addingTimeInterval(TimeInterval(sessionPolicy.maxIdleSeconds)),
      rotationRequiredAt: issuedAt.addingTimeInterval(
        TimeInterval(sessionPolicy.rotationIntervalSeconds)
      ),
      absoluteExpiresAt: issuedAt.addingTimeInterval(
        TimeInterval(sessionPolicy.absoluteTTLSeconds)
      ),
      sessionPolicy: sessionPolicy,
      identity: AuthIdentity(
        provider: .email,
        providerUserID: email,
        email: email,
        displayName: nil
      )
    )
  }
}
