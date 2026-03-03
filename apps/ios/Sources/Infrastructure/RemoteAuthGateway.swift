import Foundation

private struct CreateAuthSessionRequest: Encodable {
  let providerToken: String
}

private struct CreateAuthSessionResponse: Decodable {
  struct PayloadSessionPolicy: Decodable {
    let maxIdleSeconds: Int
    let rotationIntervalSeconds: Int
    let absoluteTtlSeconds: Int
  }

  struct PayloadIdentity: Decodable {
    let provider: String
    let providerUserId: String
    let email: String?
    let displayName: String?
  }

  struct PayloadSession: Decodable {
    let userId: String
    let sessionId: String
    let token: String
    let issuedAt: Date
    let expiresAt: Date
    let rotationRequiredAt: Date
    let absoluteExpiresAt: Date
    let sessionPolicy: PayloadSessionPolicy
    let identity: PayloadIdentity
  }

  let session: PayloadSession
}

public struct RemoteAuthGateway: AuthGateway {
  private let client: FluxBackendClient
  private let sessionStore: FluxSessionStore
  private let configuration: FluxBackendConfiguration

  public init(
    client: FluxBackendClient,
    sessionStore: FluxSessionStore,
    configuration: FluxBackendConfiguration
  ) {
    self.client = client
    self.sessionStore = sessionStore
    self.configuration = configuration
  }

  public func createSessionWithApple() async throws -> AuthSession {
    try await createSession(providerToken: configuration.appleProviderToken)
  }

  public func createSessionWithEmail(email: String, password: String) async throws -> AuthSession {
    let tokenPayload = "\(email.trimmingCharacters(in: .whitespacesAndNewlines))"
    return try await createSession(providerToken: tokenPayload)
  }

  private func createSession(providerToken: String) async throws -> AuthSession {
    let payload: CreateAuthSessionResponse = try await client.post(
      path: "createAuthSession",
      body: CreateAuthSessionRequest(providerToken: providerToken),
      requiresAuthorization: false
    )

    let provider = payload.session.identity.provider == "apple" ? AuthProvider.apple : .email
    let session = AuthSession(
      userID: payload.session.userId,
      sessionID: payload.session.sessionId,
      token: payload.session.token,
      issuedAt: payload.session.issuedAt,
      expiresAt: payload.session.expiresAt,
      rotationRequiredAt: payload.session.rotationRequiredAt,
      absoluteExpiresAt: payload.session.absoluteExpiresAt,
      sessionPolicy: AuthSession.Policy(
        maxIdleSeconds: payload.session.sessionPolicy.maxIdleSeconds,
        rotationIntervalSeconds: payload.session.sessionPolicy.rotationIntervalSeconds,
        absoluteTTLSeconds: payload.session.sessionPolicy.absoluteTtlSeconds
      ),
      identity: AuthIdentity(
        provider: provider,
        providerUserID: payload.session.identity.providerUserId,
        email: payload.session.identity.email,
        displayName: payload.session.identity.displayName
      )
    )

    await sessionStore.save(session: session)
    return session
  }
}
