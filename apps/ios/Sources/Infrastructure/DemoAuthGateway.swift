import Foundation

public struct DemoAuthGateway: AuthGateway {
  public init() {}

  public func createSessionWithApple() async throws -> AuthSession {
    AuthSession(
      userID: "apple-demo-user",
      token: "apple-demo-token",
      expiresAt: Date().addingTimeInterval(3600),
      identity: AuthIdentity(
        provider: .apple,
        providerUserID: "apple-demo-user",
        email: "apple-user@example.com",
        displayName: "Apple Demo User"
      )
    )
  }

  public func createSessionWithEmail(email: String, password: String) async throws -> AuthSession {
    AuthSession(
      userID: email,
      token: "email-demo-token-\(password.count)",
      expiresAt: Date().addingTimeInterval(3600),
      identity: AuthIdentity(
        provider: .email,
        providerUserID: email,
        email: email,
        displayName: nil
      )
    )
  }
}

